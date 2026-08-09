"""
Step 3 of the smart preprocessing pipeline: execute the Data Cleaner
Agent's plan with plain pandas. The LLM only decided *what* to do (from a
compact profile); no LLM involvement here.
"""
from typing import Any

import pandas as pd


def execute_cleaning_plan(df: pd.DataFrame, plan: dict[str, Any]) -> pd.DataFrame:
    df = df.copy()

    for step in plan.get("steps", []):
        action = step.get("action")
        try:
            if action == "drop_duplicates":
                df = df.drop_duplicates()

            elif action == "drop_column" and step.get("column") in df.columns:
                df = df.drop(columns=[step["column"]])

            elif action == "fill_na" and step.get("column") in df.columns:
                col = step["column"]
                strategy = step.get("strategy", "mean")
                if strategy == "mean" and pd.api.types.is_numeric_dtype(df[col]):
                    df[col] = df[col].fillna(df[col].mean())
                elif strategy == "median" and pd.api.types.is_numeric_dtype(df[col]):
                    df[col] = df[col].fillna(df[col].median())
                elif strategy == "mode":
                    mode_val = df[col].mode(dropna=True)
                    df[col] = df[col].fillna(mode_val.iloc[0] if not mode_val.empty else None)
                elif strategy == "constant":
                    df[col] = df[col].fillna(step.get("value"))
                elif strategy == "ffill":
                    df[col] = df[col].ffill()
                elif strategy == "bfill":
                    df[col] = df[col].bfill()

            elif action == "cast_dtype" and step.get("column") in df.columns:
                col, dtype = step["column"], step.get("dtype")
                if dtype == "datetime":
                    df[col] = pd.to_datetime(df[col], errors="coerce")
                elif dtype == "numeric":
                    df[col] = pd.to_numeric(df[col], errors="coerce")
                elif dtype == "category":
                    df[col] = df[col].astype("category")
                elif dtype == "str":
                    df[col] = df[col].astype(str)

            elif action == "strip_whitespace" and step.get("column") in df.columns:
                col = step["column"]
                if df[col].dtype == object:
                    df[col] = df[col].str.strip()

            elif action == "rename_column" and step.get("column") in df.columns:
                df = df.rename(columns={step["column"]: step.get("new_name", step["column"])})

        except Exception:
            # A single bad step should never abort the whole cleaning pass
            continue

    return df
