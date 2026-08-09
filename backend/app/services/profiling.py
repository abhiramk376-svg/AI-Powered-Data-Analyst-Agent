"""
Step 1 of the smart preprocessing pipeline: load + profile a dataset with
plain pandas — no LLM calls. The resulting compact profile is the ONLY
representation of the data ever sent to an LLM; the raw dataset itself
never leaves the server process.
"""
from typing import Any

import numpy as np
import pandas as pd

MAX_COLUMNS_PROFILED = 40
SAMPLE_ROWS = 3


def _col_profile(series: pd.Series) -> dict[str, Any]:
    n = len(series)
    null_count = int(series.isna().sum())
    entry: dict[str, Any] = {
        "dtype": str(series.dtype),
        "null_count": null_count,
        "null_pct": round(null_count / n * 100, 2) if n else 0.0,
        "n_unique": int(series.nunique(dropna=True)),
    }

    if pd.api.types.is_numeric_dtype(series):
        desc = series.describe()
        entry.update(
            {
                "min": _safe_float(desc.get("min")),
                "max": _safe_float(desc.get("max")),
                "mean": _safe_float(desc.get("mean")),
                "std": _safe_float(desc.get("std")),
            }
        )
    else:
        top_values = series.dropna().value_counts().head(3)
        entry["top_values"] = {str(k): int(v) for k, v in top_values.items()}

    return entry


def _safe_float(value) -> float | None:
    if value is None or (isinstance(value, float) and np.isnan(value)):
        return None
    return round(float(value), 4)


def generate_profile(df: pd.DataFrame) -> dict[str, Any]:
    """Build a compact, LLM-friendly profile of the dataframe."""
    columns = list(df.columns)[:MAX_COLUMNS_PROFILED]

    profile: dict[str, Any] = {
        "n_rows": int(df.shape[0]),
        "n_columns": int(df.shape[1]),
        "columns_profiled": len(columns),
        "columns_truncated": df.shape[1] > MAX_COLUMNS_PROFILED,
        "duplicate_rows": int(df.duplicated().sum()),
        "sample_rows": df.head(SAMPLE_ROWS).astype(str).to_dict(orient="records"),
        "columns": {col: _col_profile(df[col]) for col in columns},
    }

    # Flag likely data-quality issues to help the cleaner agent reason quickly
    issues = []
    for col, stats in profile["columns"].items():
        if stats["null_pct"] > 30:
            issues.append(f"'{col}' has {stats['null_pct']}% missing values")
    if profile["duplicate_rows"] > 0:
        issues.append(f"{profile['duplicate_rows']} duplicate rows detected")
    profile["flagged_issues"] = issues

    return profile
