from langgraph.graph import END, StateGraph

from app.graph.nodes import (
    node_cleaning_plan,
    node_execute_cleaning,
    node_insight_synthesizer,
    node_main_analyst,
    node_profile,
    node_tool_executor,
    route_after_analyst,
)
from app.graph.state import AnalysisState, IngestionState

# --------------------------------------------------------------------------
# Ingestion graph: upload -> profile (no LLM) -> cleaning plan (Kimi) ->
# execute cleaning (pandas)
# --------------------------------------------------------------------------

def build_ingestion_graph():
    graph = StateGraph(IngestionState)
    graph.add_node("profile", node_profile)
    graph.add_node("cleaning_plan", node_cleaning_plan)
    graph.add_node("execute_cleaning", node_execute_cleaning)

    graph.set_entry_point("profile")
    graph.add_edge("profile", "cleaning_plan")
    graph.add_edge("cleaning_plan", "execute_cleaning")
    graph.add_edge("execute_cleaning", END)

    return graph.compile()


# --------------------------------------------------------------------------
# Analysis graph: main analyst reasoning loop (Kimi, tool-calling via
# generated code) -> insight synthesizer (Gemini)
# --------------------------------------------------------------------------

def build_analysis_graph():
    graph = StateGraph(AnalysisState)
    graph.add_node("main_analyst", node_main_analyst)
    graph.add_node("tool_executor", node_tool_executor)
    graph.add_node("insight_synthesizer", node_insight_synthesizer)

    graph.set_entry_point("main_analyst")
    graph.add_conditional_edges(
        "main_analyst",
        route_after_analyst,
        {"tool_executor": "tool_executor", "insight_synthesizer": "insight_synthesizer"},
    )
    graph.add_edge("tool_executor", "main_analyst")
    graph.add_edge("insight_synthesizer", END)

    return graph.compile()


ingestion_graph = build_ingestion_graph()
analysis_graph = build_analysis_graph()
