"""
Client for calling Gemini (replaces original Kimi K2.6 / HF implementation).
Used for:
  - Main Analyst Agent (orchestration + reasoning loop)
  - Data Cleaner Agent (cleaning-plan decisions)
  - Code generation (pandas/numpy/etc analysis code)

Original HF-based implementation is commented out below for reference.
"""
# =============================================================================
# ORIGINAL HF / KIMI CLIENT (kept for reference)
# =============================================================================
# """
# Client for calling Kimi K2.6 through the HuggingFace Inference API
# (OpenAI-compatible chat-completions router). Used for:
#   - Main Analyst Agent (orchestration + reasoning loop)
#   - Data Cleaner Agent (cleaning-plan decisions)
#   - Code generation (pandas/numpy/etc analysis code)
# """
# import json
# from typing import Any, Optional
#
# import httpx
#
# from app.config import settings
#
#
# class HFClientError(RuntimeError):
#     pass
#
#
# async def call_kimi(
#     messages: list[dict[str, str]],
#     temperature: float = 0.2,
#     max_tokens: int = 1500,
#     response_format_json: bool = False,
# ) -> str:
#     """Send a chat completion request to Kimi K2.6 via the HF router and
#     return the assistant's raw text content."""
#     if not settings.hf_api_token:
#         raise HFClientError("HF_API_TOKEN is not set")
#
#     payload: dict[str, Any] = {
#         "model": settings.hf_model_id,
#         "messages": messages,
#         "temperature": temperature,
#         "max_tokens": max_tokens,
#     }
#     if response_format_json:
#         payload["response_format"] = {"type": "json_object"}
#
#     headers = {
#         "Authorization": f"Bearer {settings.hf_api_token}",
#         "Content-Type": "application/json",
#     }
#
#     async with httpx.AsyncClient(timeout=60.0) as client:
#         resp = await client.post(settings.hf_api_base, json=payload, headers=headers)
#         if resp.status_code >= 400:
#             raise HFClientError(f"HF API error {resp.status_code}: {resp.text}")
#         data = resp.json()
#
#     try:
#         return data["choices"][0]["message"]["content"]
#     except (KeyError, IndexError) as exc:
#         raise HFClientError(f"Unexpected HF response shape: {data}") from exc
#
#
# def extract_json(text: str) -> Optional[dict[str, Any]]:
#     """Best-effort extraction of a JSON object from an LLM text response,
#     tolerating markdown code fences."""
#     cleaned = text.strip()
#     if cleaned.startswith("```"):
#         cleaned = cleaned.strip("`")
#         if cleaned.lower().startswith("json"):
#             cleaned = cleaned[4:]
#     cleaned = cleaned.strip()
#
#     try:
#         return json.loads(cleaned)
#     except json.JSONDecodeError:
#         pass
#
#     # Fall back to locating the first {...} block
#     start = cleaned.find("{")
#     end = cleaned.rfind("}")
#     if start != -1 and end != -1 and end > start:
#         try:
#             return json.loads(cleaned[start : end + 1])
#         except json.JSONDecodeError:
#             return None
#     return None

# =============================================================================
# REPLACEMENT: GEMINI-BASED CLIENT
# =============================================================================
import asyncio
import json
import random
from typing import Any, Optional

from google import genai

from app.config import settings

_client: genai.Client | None = None


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        if not settings.gemini_api_key:
            raise RuntimeError("GEMINI_API_KEY is not set")
        _client = genai.Client(api_key=settings.gemini_api_key)
    return _client


class HFClientError(RuntimeError):
    """Kept for compatibility — same exception type, raised on API errors."""
    pass


async def call_kimi(
    messages: list[dict[str, str]],
    temperature: float = 0.2,
    max_tokens: int = 1500,
    response_format_json: bool = False,
) -> str:
    """Replacement: calls Gemini instead of Kimi K2.6.

    Accepts the same OpenAI-style message list and returns the assistant's
    raw text content.  Supports ``response_format_json`` via Gemini's
    ``response_mime_type="application/json"``.
    """
    if not settings.gemini_api_key:
        raise HFClientError("GEMINI_API_KEY is not set")

    # Separate system instruction from the rest
    system_prompt = None
    user_parts = []
    for msg in messages:
        if msg["role"] == "system":
            system_prompt = msg["content"]
        else:
            user_parts.append(f"{msg['role']}: {msg['content']}")
    user_content = "\n".join(user_parts)

    client = _get_client()

    config: dict[str, Any] = {
        "temperature": temperature,
        "max_output_tokens": max_tokens,
    }
    if system_prompt:
        config["system_instruction"] = system_prompt
    if response_format_json:
        config["response_mime_type"] = "application/json"

    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = await client.aio.models.generate_content(
                model=settings.gemini_analyst_model,
                contents=user_content,
                config=config,
            )
            return response.text.strip()
        except Exception as exc:
            err_str = str(exc)
            is_retryable = any(
                code in err_str
                for code in ["503", "429", "500", "UNAVAILABLE", "RESOURCE_EXHAUSTED", "INTERNAL"]
            )
            if is_retryable and attempt < max_retries - 1:
                wait = 2 ** attempt + random.uniform(0, 1)
                await asyncio.sleep(wait)
                continue
            raise HFClientError(f"Gemini API error: {exc}") from exc


def extract_json(text: str) -> Optional[dict[str, Any]]:
    """Best-effort extraction of a JSON object from an LLM text response,
    tolerating markdown code fences."""
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:]
    cleaned = cleaned.strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Fall back to locating the first {...} block
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start != -1 and end != -1 and end > start:
        try:
            return json.loads(cleaned[start : end + 1])
        except json.JSONDecodeError:
            return None
    return None
