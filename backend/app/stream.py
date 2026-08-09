from typing import Any, AsyncGenerator

from app.config import settings
from app.graph.nodes import (
    node_insight_synthesizer,
    node_main_analyst,
    node_tool_executor,
)
from app.graph.state import AnalysisState


async def stream_analysis(
    session_id: str,
    user_query: str,
    profile: dict[str, Any],
    cleaned_path: str,
    history: list[dict[str, str]],
) -> AsyncGenerator[dict[str, Any], None]:
    state: AnalysisState = {
        "session_id": session_id,
        "user_query": user_query,
        "profile": profile,
        "cleaned_path": cleaned_path,
        "history": history,
        "steps": [],
        "charts": [],
        "iteration": 0,
        "max_iterations": settings.max_analyst_iterations,
    }

    while state["iteration"] < state["max_iterations"]:
        iteration = state["iteration"] + 1
        yield {"event": "step", "type": "analyst_started", "iteration": iteration}

        state = await node_main_analyst(state)

        if state.get("action") == "final_answer":
            break

        code = state.get("_pending_code", "")
        yield {"event": "step", "type": "code_generated", "code": code, "iteration": iteration}

        yield {"event": "step", "type": "code_executing", "iteration": iteration}

        state = await node_tool_executor(state)

        last_step = state["steps"][-1] if state["steps"] else {}
        yield {
            "event": "step",
            "type": "code_result",
            "result": last_step.get("result"),
            "error": last_step.get("error"),
            "iteration": iteration,
        }

        for chart in state.get("charts", []):
            yield {"event": "chart", "filename": chart}

    yield {"event": "step", "type": "synthesizer_started"}

    state = await node_insight_synthesizer(state)

    final_answer = state.get("final_answer") or state.get("draft_answer") or "I couldn't produce an answer."

    yield {
        "event": "done",
        "answer": final_answer,
        "charts": state.get("charts", []),
        "iterations": state.get("iteration", 0),
    }
