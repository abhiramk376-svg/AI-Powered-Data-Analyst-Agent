from typing import Any, Optional
from pydantic import BaseModel


class UploadResponse(BaseModel):
    session_id: str
    filename: str
    profile_summary: dict[str, Any]
    cleaning_summary: str
    message: str


class ChatRequest(BaseModel):
    session_id: str
    message: str


class ChatResponse(BaseModel):
    session_id: str
    answer: str
    charts: list[str] = []
    iterations: int = 0


class HistoryMessage(BaseModel):
    role: str
    content: str


class HistoryResponse(BaseModel):
    session_id: str
    messages: list[HistoryMessage]
