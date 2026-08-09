from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Redis
    redis_url: str = "redis://localhost:6379/0"
    session_ttl_seconds: int = 86400

    # HuggingFace (Kimi K2.6) — Main Analyst + Data Cleaner + code generation
    hf_api_token: str = ""
    hf_model_id: str = "moonshotai/Kimi-K2.6"
    hf_api_base: str = "https://router.huggingface.co/v1/chat/completions"

    # Gemini — Insight Synthesizer
    gemini_api_key: str = ""
    gemini_model: str = "gemini-3.5-flash"

    # Gemini — Main Analyst + Data Cleaner (replaces HF model)
    gemini_analyst_model: str = "gemini-3.5-flash"

    # Storage
    data_dir: str = "./data"
    raw_dir: str = "./data/raw"
    cleaned_dir: str = "./data/cleaned"
    charts_dir: str = "./data/charts"

    # Sandbox / graph
    sandbox_timeout_seconds: int = 25
    max_analyst_iterations: int = 6


settings = Settings()

for _dir in (settings.raw_dir, settings.cleaned_dir, settings.charts_dir):
    Path(_dir).mkdir(parents=True, exist_ok=True)
