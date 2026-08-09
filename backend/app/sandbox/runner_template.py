"""
Executed as an isolated subprocess. Reads a JSON job spec from argv[1]
(a path to a JSON file containing {"df_path": ..., "code": ..., "charts_dir": ...,
"chart_prefix": ...}), runs the analyst-generated code against the cleaned
dataframe, captures any matplotlib figures as PNGs, and prints a single
JSON result line to stdout.

Only stdlib + the approved data-science stack is available inside `code`.
No filesystem/network/os access is exposed to the executed code's globals.
"""
import io
import json
import sys
import traceback
import uuid
from contextlib import redirect_stdout

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402
import seaborn as sns  # noqa: E402
import statsmodels.api as sm  # noqa: E402
from sklearn import cluster, ensemble, linear_model, metrics, model_selection, preprocessing  # noqa: E402


def main() -> None:
    job_path = sys.argv[1]
    with open(job_path, "r") as fh:
        job = json.load(fh)

    df = pd.read_parquet(job["df_path"])
    charts_dir = job["charts_dir"]
    chart_prefix = job["chart_prefix"]
    code = job["code"]

    plt.close("all")

    safe_globals = {
        "__builtins__": {
            "len": len, "range": range, "list": list, "dict": dict, "set": set,
            "str": str, "int": int, "float": float, "bool": bool, "sum": sum,
            "min": min, "max": max, "sorted": sorted, "enumerate": enumerate,
            "zip": zip, "round": round, "abs": abs, "print": print,
            "isinstance": isinstance, "Exception": Exception, "ValueError": ValueError,
            "KeyError": KeyError, "TypeError": TypeError, "__import__": __import__,
        },
        "pd": pd, "np": np, "plt": plt, "sns": sns, "sm": sm,
        "linear_model": linear_model, "ensemble": ensemble, "cluster": cluster,
        "preprocessing": preprocessing, "model_selection": model_selection, "metrics": metrics,
        "df": df,
    }
    local_ns: dict = {}

    stdout_buf = io.StringIO()
    output = {"result": None, "charts": [], "stdout": "", "error": None}

    try:
        with redirect_stdout(stdout_buf):
            exec(code, safe_globals, local_ns)

        # Capture any figures the code created
        fig_nums = plt.get_fignums()
        for num in fig_nums:
            fig = plt.figure(num)
            fname = f"{chart_prefix}_{uuid.uuid4().hex[:8]}.png"
            fig.savefig(f"{charts_dir}/{fname}", bbox_inches="tight", dpi=130)
            output["charts"].append(fname)
        plt.close("all")

        if "result" in local_ns:
            output["result"] = _jsonify(local_ns["result"])

    except Exception:  # noqa: BLE001
        output["error"] = traceback.format_exc(limit=6)
    finally:
        output["stdout"] = stdout_buf.getvalue()[-4000:]

    print(json.dumps(output, default=str))


def _jsonify(value):
    if isinstance(value, pd.DataFrame):
        return value.head(50).to_dict(orient="records")
    if isinstance(value, pd.Series):
        return value.head(50).to_dict()
    if isinstance(value, (np.generic,)):
        return value.item()
    try:
        json.dumps(value)
        return value
    except TypeError:
        return str(value)


if __name__ == "__main__":
    main()
