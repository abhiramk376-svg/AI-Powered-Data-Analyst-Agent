"""
Client for calling Gemini (Insight Synthesizer / Report Writer agent).
Activates only at the end of an analysis run to turn raw results into a
clear narrative + recommendations. Uses the current `google-genai` SDK.
"""
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


async def synthesize_insights(prompt: str) -> str:
    """Call Gemini once with a fully-formed prompt and return the text."""
    client = _get_client()
    response = await client.aio.models.generate_content(
        model=settings.gemini_model,
        contents=prompt,
    )
    return response.text.strip()
