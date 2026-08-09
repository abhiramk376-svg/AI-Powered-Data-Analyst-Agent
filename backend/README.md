# Data Analyst Agent — Backend

FastAPI + LangGraph backend for the conversational Data Analyst Agent.
No auth — only the core functional endpoints the frontend needs.

## Architecture

```
User uploads dataset
        │
        ▼
POST /api/upload  ──▶  save raw file
        │
        ▼
 Ingestion LangGraph
   1. profile()            no LLM — pandas only, compact stats profile
   2. cleaning_plan()      Kimi K2.6 (HF API) sees ONLY the profile, returns a JSON cleaning plan
   3. execute_cleaning()   no LLM — pandas executes the plan, saves cleaned Parquet
        │
        ▼
 session state saved in Redis (profile + cleaned parquet path)

POST /api/chat  ──▶  Analysis LangGraph (per message)
   main_analyst  ⇄  tool_executor      Kimi K2.6 loop: writes pandas/numpy/matplotlib/
                                       seaborn/statsmodels/scikit-learn code, executed in
                                       an isolated subprocess sandbox against the REAL
                                       cleaned dataframe. Loops until it has enough to answer
                                       (bounded by MAX_ANALYST_ITERATIONS).
        │
        ▼
   insight_synthesizer                Gemini turns the analyst's draft + step results into
                                       a polished narrative + recommendations
        │
        ▼
   answer + chart URLs returned to frontend, chat history appended in Redis
```

Key design point: **the raw/cleaned dataset is never sent to an LLM.** Only a compact
statistical profile (row/col counts, dtypes, null %, min/max/mean, top values, a
few sample rows) is ever sent as text. All heavy computation happens in pandas/numpy/etc,
executed as code the LLM writes, run against the real dataframe inside the sandbox.

## Agents

| Agent | Model | Activates | Responsibility |
|---|---|---|---|
| Main Analyst (Supervisor) | Kimi K2.6 via HF Inference API | every user message | plans, writes analysis code, coordinates, drafts answer |
| Data Cleaner | Kimi K2.6 via HF Inference API | on upload | decides a cleaning plan from the profile only |
| Insight Synthesizer | Gemini API | end of each analysis turn | turns results into a narrative + recommendations |

## Setup

```bash
cd backend
uv sync                      # installs deps from pyproject.toml into .venv
cp .env.example .env         # fill in HF_API_TOKEN, GEMINI_API_KEY, REDIS_URL
```

### Redis Cloud setup

Session memory (profile, cleaned-parquet path, chat history) lives in Redis. This project
uses [Redis Cloud](https://redis.io/cloud/) directly — no local Redis/Docker needed.

1. Create a free/fixed database at https://cloud.redis.io.
2. On the database's **Configuration** tab, copy the **Public endpoint** (`host:port`).
3. On **Security**, copy the default user's password.
4. Set `REDIS_URL` in `.env` as:
   ```
   REDIS_URL=rediss://default:<password>@<host>:<port>
   ```
   Note the double-`s` scheme (`rediss://`) — Redis Cloud endpoints require TLS, and
   `redis-py`'s `from_url()` handles the TLS handshake automatically for this scheme;
   no extra `ssl_*` config is needed.
5. Start the API (below) and hit `GET /api/health` — it pings Redis Cloud and reports
   `{"status": "ok", "redis_connected": true}`. The app also pings Redis once at startup
   and logs a clear warning if the credentials/URL are wrong, instead of failing silently
   on the first upload.

Run the API:

```bash
uv run uvicorn app.main:app --reload --port 8000
```

Docs: `http://localhost:8000/docs`

## API

- `POST /api/upload` — multipart file upload (`.csv`/`.xlsx`/`.xls`). Returns `session_id`,
  the profile summary, and a cleaning summary/greeting message.
- `POST /api/chat` — `{ "session_id": "...", "message": "..." }`. Returns `{ answer, charts, iterations }`
  where `charts` is a list of `/api/charts/{session_id}/{filename}` URLs.
- `GET /api/charts/{session_id}/{filename}` — serves a generated chart PNG.
- `GET /api/session/{session_id}/history` — chat history for the session (used for the
  frontend's "History" nav item).
- `DELETE /api/session/{session_id}` — clears a session (used for "New Analysis").

## Wiring into the given frontend

The provided `ChatbotPage.jsx` doesn't yet track a `session_id`. Minimal changes needed:

1. In `handleFileUpload`, `POST` the file to `/api/upload` (FormData) instead of just
   reading `file.name`; store the returned `session_id` in state; show `message` from
   the response as the agent's greeting.
2. In `handleSendMessage`, `POST` `{ session_id, message: text }` to `/api/chat`; use the
   returned `answer` as the agent bubble content, and map `charts` (already full URLs,
   just prefix with your API base) into `ChartCard` entries, one per chart.
3. "New Analysis" button → `DELETE /api/session/{session_id}` then reset local state.

## Sandbox notes

Analyst-generated code runs in a **separate subprocess** (not in-process `exec`), with a
restricted builtins list and a timeout (`SANDBOX_TIMEOUT_SECONDS`). This bounds runaway
loops/hangs and keeps the executed code out of the main FastAPI process's memory space.
It is **not** a hard security boundary (the interpreter still has `__import__` and,
transitively, filesystem/OS access) — for a production deployment handling untrusted
users, run the subprocess inside a stronger isolation layer (e.g. gVisor, nsjail, or a
locked-down container with no network egress and a read-only filesystem outside a scratch
directory).

## Project layout

```
app/
  main.py              FastAPI app + routes
  config.py            pydantic-settings config (.env)
  schemas.py            request/response models
  redis_client.py       session state + chat history helpers
  services/
    file_service.py     upload handling, dataframe load/save
    profiling.py         Step 1 — compact profile, no LLM
    cleaning.py          Step 3 — execute cleaning plan, no LLM
  llm/
    hf_client.py          Kimi K2.6 chat-completions via HF router
    gemini_client.py       Gemini via google-genai SDK
  sandbox/
    runner_template.py     subprocess entrypoint that runs analyst code
    executor.py             async subprocess wrapper + timeout
  graph/
    state.py                LangGraph state TypedDicts
    nodes.py                 node implementations (profile/clean/analyst/tools/synth)
    build_graph.py           StateGraph wiring for both graphs
```
