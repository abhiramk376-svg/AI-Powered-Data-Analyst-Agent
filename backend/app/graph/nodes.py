"""
Node implementations for both LangGraph graphs:
  - Ingestion graph: profile -> data cleaner plan -> execute cleaning
  - Analysis graph:  main analyst reasoning loop -> insight synthesizer
"""
import json

from app.config import settings
from app.graph.state import AnalysisState, IngestionState
from app.llm.gemini_client import synthesize_insights
from app.llm.hf_client import call_kimi, extract_json
from app.sandbox.executor import execute_analysis_code
from app.services import cleaning, file_service, profiling

# --------------------------------------------------------------------------
# Ingestion graph nodes
# --------------------------------------------------------------------------

CLEANER_SYSTEM_PROMPT = """You are the Data Cleaner Agent, a data-quality specialist.
You NEVER see the raw dataset — only a compact statistical profile.
Given that profile, decide a minimal, safe cleaning plan.

Respond with ONLY a JSON object of this exact shape:
{
  "summary": "one or two sentence plain-English summary of what you'll do and why",
  "steps": [
    {"action": "drop_duplicates"},
    {"action": "fill_na", "column": "col_name", "strategy": "mean|median|mode|constant|ffill|bfill", "value": null},
    {"action": "drop_column", "column": "col_name"},
    {"action": "cast_dtype", "column": "col_name", "dtype": "datetime|numeric|category|str"},
    {"action": "strip_whitespace", "column": "col_name"},
    {"action": "rename_column", "column": "col_name", "new_name": "new_name"}
  ]
}
Only include steps that are actually justified by the profile's flagged issues.
If the data looks clean, return an empty steps list with a summary saying so.
"""


def node_profile(state: IngestionState) -> IngestionState:
    """Step 1: load + profile with plain pandas. No LLM call."""
    df = file_service.load_dataframe(__import__("pathlib").Path(state["raw_path"]))
    profile = profiling.generate_profile(df)
    return {**state, "profile": profile}


async def node_cleaning_plan(state: IngestionState) -> IngestionState:
    """Step 2: send ONLY the compact profile to the Data Cleaner Agent (Kimi)."""
    messages = [
        {"role": "system", "content": CLEANER_SYSTEM_PROMPT},
        {"role": "user", "content": json.dumps(state["profile"])},
    ]
    raw = await call_kimi(messages, temperature=0.1, max_tokens=2048, response_format_json=True)
    plan = extract_json(raw) or {"summary": "No cleaning changes applied.", "steps": []}
    return {**state, "cleaning_plan": plan}


def node_execute_cleaning(state: IngestionState) -> IngestionState:
    """Step 3: execute the plan with plain pandas, save cleaned Parquet."""
    df = file_service.load_dataframe(__import__("pathlib").Path(state["raw_path"]))
    cleaned_df = cleaning.execute_cleaning_plan(df, state["cleaning_plan"])
    cleaned_path = file_service.save_cleaned(state["session_id"], cleaned_df)
    return {
        **state,
        "cleaned_path": str(cleaned_path),
        "cleaning_summary": state["cleaning_plan"].get("summary", "Cleaning complete."),
    }


# --------------------------------------------------------------------------
# Analysis graph nodes
# --------------------------------------------------------------------------

ANALYST_SYSTEM_PROMPT = """You are the Main Analyst Agent — the brain and orchestrator of a
conversational data analysis system. You NEVER see the raw dataset directly — only its
compact profile — but you CAN write pandas/numpy/matplotlib/seaborn/statsmodels/scikit-learn
code that runs against the real cleaned dataframe (available as `df`) inside a sandbox.

Available in the sandbox namespace: pd, np, plt, sns, sm (statsmodels.api),
linear_model, ensemble, cluster, preprocessing, model_selection, metrics (all from sklearn), and df.
Assign your final computed value to a variable named `result` (a scalar, dict, list, or small
DataFrame/Series). To produce a chart, just create a matplotlib/seaborn figure — do not call plt.show().

You work in a loop. On each turn, respond with ONLY a JSON object of this exact shape:
{
  "thought": "brief reasoning about what to do next",
  "action": "run_code" | "final_answer",
  "code": "python code string, required only if action is run_code",
  "final_answer": "plain-English narrative answer, required only if action is final_answer"
}

Rules:
- Prefer the fewest steps needed to answer well. Stop and give a final_answer once you have enough.
- If a previous step errored, fix your code and try again rather than giving up.
- final_answer should read naturally to a non-technical user (no code, no JSON).
"""


def _build_analyst_context(state: AnalysisState) -> str:
    parts = [
        f"DATASET PROFILE:\n{json.dumps(state['profile'])}",
    ]
    if state.get("history"):
        convo = "\n".join(f"{m['role']}: {m['content']}" for m in state["history"][-6:])
        parts.append(f"RECENT CONVERSATION:\n{convo}")
    if state.get("steps"):
        trace = "\n".join(
            f"- code: {s.get('code', '')[:300]}\n  result: {str(s.get('result'))[:300]}\n  error: {s.get('error')}"
            for s in state["steps"]
        )
        parts.append(f"STEPS TAKEN THIS TURN:\n{trace}")
    parts.append(f"USER QUERY: {state['user_query']}")
    return "\n\n".join(parts)


async def node_main_analyst(state: AnalysisState) -> AnalysisState:
    messages = [
        {"role": "system", "content": ANALYST_SYSTEM_PROMPT},
        {"role": "user", "content": _build_analyst_context(state)},
    ]
    try:
        raw = await call_kimi(messages, temperature=0.2, max_tokens=4096, response_format_json=True)
    except Exception:
        # Graceful fallback — preserve any charts/steps already collected
        if state.get("steps"):
            msg = (
                "I completed part of the analysis but the AI model became "
                "temporarily unavailable. The charts generated so far should "
                "help answer your question."
            )
        else:
            msg = (
                "I'm unable to process this request right now due to high "
                "demand on the AI model. Please try again in a moment."
            )
        return {
            **state,
            "action": "final_answer",
            "draft_answer": msg,
            "iteration": state.get("iteration", 0) + 1,
        }

    decision = extract_json(raw) or {"action": "final_answer", "final_answer": raw}
    action = decision.get("action", "final_answer")
    updates: AnalysisState = {**state, "action": action, "iteration": state.get("iteration", 0) + 1}

    if action == "run_code":
        updates["_pending_code"] = decision.get("code", "")  # type: ignore[typeddict-item]
    else:
        updates["draft_answer"] = decision.get("final_answer", "")

    return updates


async def node_tool_executor(state: AnalysisState) -> AnalysisState:
    code = state.get("_pending_code", "")  # type: ignore[typeddict-item]
    exec_result = await execute_analysis_code(
        df_path=state["cleaned_path"],
        code=code,
        charts_dir=settings.charts_dir,
        chart_prefix=state["session_id"],
    )
    steps = state.get("steps", []) + [
        {
            "code": code,
            "result": exec_result.get("result"),
            "charts": exec_result.get("charts", []),
            "error": exec_result.get("error"),
        }
    ]
    charts = state.get("charts", []) + exec_result.get("charts", [])
    return {**state, "steps": steps, "charts": charts}


def route_after_analyst(state: AnalysisState) -> str:
    if state.get("action") == "run_code" and state.get("iteration", 0) < state.get(
        "max_iterations", settings.max_analyst_iterations
    ):
        return "tool_executor"
    return "insight_synthesizer"


SYNTHESIZER_PROMPT_TEMPLATE = """You are the Insight Synthesizer Agent, a report writer.
Turn the analysis below into a clear, well-structured narrative for a business user:
use short paragraphs or bullet points, plain language, and end with 1-3 concrete,
actionable recommendations. Do not invent numbers that aren't supported by the data below.

USER QUESTION:
{query}

MAIN ANALYST'S DRAFT ANSWER:
{draft}

RAW STEP RESULTS (for grounding, not for verbatim repetition):
{steps}
"""


async def node_insight_synthesizer(state: AnalysisState) -> AnalysisState:
    steps_summary = json.dumps(
        [{"result": s.get("result"), "error": s.get("error")} for s in state.get("steps", [])]
    )[:4000]
    prompt = SYNTHESIZER_PROMPT_TEMPLATE.format(
        query=state["user_query"],
        draft=state.get("draft_answer", ""),
        steps=steps_summary,
    )
    try:
        final = await synthesize_insights(prompt)
    except Exception:
        # Fall back to the analyst's own draft if Gemini is unavailable
        final = state.get("draft_answer") or "I wasn't able to synthesize a final report."
    return {**state, "final_answer": final}
