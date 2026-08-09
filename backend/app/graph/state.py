from typing import Any, Optional, TypedDict


class IngestionState(TypedDict, total=False):
    """State for the one-time upload -> profile -> clean pipeline."""
    session_id: str
    raw_path: str
    profile: dict[str, Any]
    cleaning_plan: dict[str, Any]
    cleaned_path: str
    cleaning_summary: str


class AnalysisStep(TypedDict, total=False):
    code: str
    result: Any
    charts: list[str]
    error: Optional[str]


class AnalysisState(TypedDict, total=False):
    """State for the per-message analysis reasoning loop."""
    session_id: str
    user_query: str
    profile: dict[str, Any]
    cleaned_path: str
    history: list[dict[str, str]]          # prior chat turns
    steps: list[AnalysisStep]              # tool-execution trace this turn
    charts: list[str]                      # accumulated chart filenames this turn
    iteration: int
    max_iterations: int
    action: str                            # "run_code" | "final_answer"
    _pending_code: str                     # code proposed by analyst, consumed by executor
    draft_answer: str
    final_answer: str
