import asyncio
import json
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any

from app.config import settings

RUNNER_PATH = Path(__file__).parent / "runner_template.py"


def _run_sandbox(job_path: str, timeout: int) -> dict[str, Any]:
    """Run the sandboxed subprocess synchronously (in a thread)."""
    try:
        result = subprocess.run(
            [sys.executable, str(RUNNER_PATH), job_path],
            capture_output=True,
            text=True,
            timeout=timeout,
        )
    except subprocess.TimeoutExpired:
        return {
            "result": None, "charts": [], "stdout": "",
            "error": f"Execution timed out after {timeout}s",
        }

    text = result.stdout.strip()
    if result.returncode != 0 or not text:
        return {
            "result": None, "charts": [], "stdout": text,
            "error": (result.stderr or "")[-2000:],
        }

    last_line = text.splitlines()[-1]
    return json.loads(last_line)


async def execute_analysis_code(
    df_path: str, code: str, charts_dir: str, chart_prefix: str
) -> dict[str, Any]:
    """Run analyst-generated code in an isolated subprocess and return
    {"result", "charts", "stdout", "error"}."""
    job = {
        "df_path": df_path,
        "code": code,
        "charts_dir": charts_dir,
        "chart_prefix": chart_prefix,
    }

    with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as tf:
        json.dump(job, tf)
        job_path = tf.name

    try:
        return await asyncio.to_thread(
            _run_sandbox, job_path, settings.sandbox_timeout_seconds
        )
    finally:
        Path(job_path).unlink(missing_ok=True)
