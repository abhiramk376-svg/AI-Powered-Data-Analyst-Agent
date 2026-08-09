import uuid
from pathlib import Path

import pandas as pd
from fastapi import UploadFile

from app.config import settings


def new_session_id() -> str:
    return uuid.uuid4().hex[:12]


async def save_upload(session_id: str, file: UploadFile) -> Path:
    """Persist the raw uploaded file to disk under data/raw/{session_id}/."""
    session_dir = Path(settings.raw_dir) / session_id
    session_dir.mkdir(parents=True, exist_ok=True)
    dest = session_dir / file.filename
    contents = await file.read()
    dest.write_bytes(contents)
    return dest


def load_dataframe(path: Path) -> pd.DataFrame:
    suffix = path.suffix.lower()
    if suffix == ".csv":
        return pd.read_csv(path)
    if suffix in (".xlsx", ".xls"):
        return pd.read_excel(path)
    if suffix == ".parquet":
        return pd.read_parquet(path)
    raise ValueError(f"Unsupported file type: {suffix}")


def cleaned_parquet_path(session_id: str) -> Path:
    return Path(settings.cleaned_dir) / f"{session_id}.parquet"


def save_cleaned(session_id: str, df: pd.DataFrame) -> Path:
    path = cleaned_parquet_path(session_id)
    path.parent.mkdir(parents=True, exist_ok=True)
    df.to_parquet(path, index=False)
    return path.resolve()
