import json
import traceback
from pathlib import Path

from fastapi import FastAPI, HTTPException, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse

from app.config import settings
from app.graph.build_graph import analysis_graph, ingestion_graph
from app.redis_client import (
    append_message,
    delete_session,
    get_history,
    get_session_state,
    save_session_state,
)
from app.schemas import (
    ChatRequest,
    ChatResponse,
    HistoryMessage,
    HistoryResponse,
    UploadResponse,
)
from app.redis_client import get_redis
from app.services.file_service import new_session_id, save_upload
from app.stream import stream_analysis

app = FastAPI(title="Data Analyst Agent API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def check_redis_connection():
    """Fail fast and loud if REDIS_URL / Redis Cloud credentials are wrong,
    rather than surfacing a confusing error on the first upload/chat call."""
    try:
        await get_redis().ping()
        print("[startup] Redis connection OK")
    except Exception as exc:  # noqa: BLE001
        print(f"[startup] WARNING: could not connect to Redis at startup: {exc}")


@app.get("/api/health")
async def health():
    try:
        await get_redis().ping()
        redis_ok = True
    except Exception:  # noqa: BLE001
        redis_ok = False
    return {"status": "ok", "redis_connected": redis_ok}


@app.post("/api/upload", response_model=UploadResponse)
async def upload_dataset(file: UploadFile = File(...)):
    """User uploads dataset -> FastAPI saves file -> profile -> Data Cleaner
    Agent (Kimi, profile-only) -> pandas cleaning -> cleaned Parquet saved."""
    if not file.filename.lower().endswith((".csv", ".xlsx", ".xls")):
        raise HTTPException(400, "Only .csv, .xlsx, or .xls files are supported")

    session_id = new_session_id()
    raw_path = await save_upload(session_id, file)

    try:
        result = await ingestion_graph.ainvoke(
            {"session_id": session_id, "raw_path": str(raw_path)}
        )
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(500, f"Failed to process dataset: {exc}") from exc

    await save_session_state(
        session_id,
        {
            "profile": result["profile"],
            "cleaned_path": result["cleaned_path"],
            "filename": file.filename,
        },
    )
    await append_message(session_id, "user", f"Uploaded dataset: {file.filename}")
    greeting = (
        f"Loaded **{file.filename}**. {result['cleaning_summary']} "
        "What would you like to explore?"
    )
    await append_message(session_id, "agent", greeting)

    return UploadResponse(
        session_id=session_id,
        filename=file.filename,
        profile_summary=result["profile"],
        cleaning_summary=result["cleaning_summary"],
        message=greeting,
    )


@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """Main Analyst reasoning loop for a single user turn, followed by the
    Insight Synthesizer's final narrative."""
    session = await get_session_state(req.session_id)
    if session is None:
        raise HTTPException(404, "Unknown or expired session_id. Please upload a dataset first.")

    history = await get_history(req.session_id, limit=20)
    await append_message(req.session_id, "user", req.message)

    initial_state = {
        "session_id": req.session_id,
        "user_query": req.message,
        "profile": session["profile"],
        "cleaned_path": session["cleaned_path"],
        "history": history,
        "steps": [],
        "charts": [],
        "iteration": 0,
        "max_iterations": settings.max_analyst_iterations,
    }

    try:
        result = await analysis_graph.ainvoke(initial_state)
    except Exception as exc:  # noqa: BLE001
        traceback.print_exc()
        raise HTTPException(500, f"Analysis failed: {exc}") from exc

    answer = result.get("final_answer") or result.get("draft_answer") or "I couldn't produce an answer."
    await append_message(req.session_id, "agent", answer)

    chart_urls = result.get("charts", [])

    return ChatResponse(
        session_id=req.session_id,
        answer=answer,
        charts=chart_urls,
        iterations=result.get("iteration", 0),
    )


@app.get("/api/chat/stream")
async def chat_stream(session_id: str = Query(...), message: str = Query(...)):
    """SSE endpoint that streams analysis progress events."""
    session = await get_session_state(session_id)
    if session is None:
        raise HTTPException(404, "Unknown or expired session_id. Please upload a dataset first.")

    history = await get_history(session_id, limit=20)
    await append_message(session_id, "user", message)

    async def event_generator():
        try:
            async for event in stream_analysis(
                session_id=session_id,
                user_query=message,
                profile=session["profile"],
                cleaned_path=session["cleaned_path"],
                history=history,
            ):
                yield f"event: {event['event']}\ndata: {json.dumps(event)}\n\n"
                if event["event"] == "done":
                    await append_message(session_id, "agent", event.get("answer", ""))
        except Exception as exc:
            traceback.print_exc()
            error_data = json.dumps({"event": "error", "message": str(exc)})
            yield f"event: error\ndata: {error_data}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.get("/api/charts/{session_id}/{filename}")
async def get_chart(session_id: str, filename: str):
    path = Path(settings.charts_dir) / filename
    if not path.exists() or not filename.startswith(session_id):
        raise HTTPException(404, "Chart not found")
    return FileResponse(path, media_type="image/png")


@app.get("/api/session/{session_id}/history", response_model=HistoryResponse)
async def session_history(session_id: str):
    session = await get_session_state(session_id)
    if session is None:
        raise HTTPException(404, "Unknown or expired session_id")
    history = await get_history(session_id, limit=100)
    return HistoryResponse(
        session_id=session_id,
        messages=[HistoryMessage(**m) for m in history],
    )


@app.delete("/api/session/{session_id}")
async def reset_session(session_id: str):
    """Used by the frontend's 'New Analysis' button."""
    await delete_session(session_id)
    return {"message": "Session cleared"}
