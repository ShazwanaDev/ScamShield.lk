"""
keyword_baseline.py
Simple rule-based keyword blocklist classifier — the baseline the ML models
must beat to justify the ML approach, per the research question.

It only answers "scam or not", so it is scored on the scam vs not-scam task,
on the same real and synthetic test sets as the ML models.

Usage:
    python src/keyword_baseline.py
"""
import json
import os
import re

import pandas as pd

from metrics import bootstrap_ci, scam_metrics
from preprocessing import DATASET_PATH

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")

# Seed keyword list — expand this as you review more real scam messages.
# Keep Sinhala/Tamil script entries alongside Singlish/English ones.
SCAM_KEYWORDS = [
    "otp", "click here", "verify account", "suspended", "won", "winner",
    "lottery", "prize", "urgent", "act now", "bank transfer", "refund",
    "ජය ගත්තා", "ගිණුම අවහිර", "click karanna", "link eka",
    "account blocked", "reward", "free gift", "confirm your", "limited time",
]

_ASCII = re.compile(r"^[\x00-\x7f]+$")
# Latin keywords match whole words only ("won" must not fire on "won't" or
# "wonderful"). Sinhala/Tamil keywords use plain substring matching, because
# \b is unreliable around Sinhala/Tamil vowel signs.
_PATTERNS = [
    re.compile(r"\b" + re.escape(kw) + r"\b", re.IGNORECASE) if _ASCII.match(kw) else re.compile(re.escape(kw))
    for kw in SCAM_KEYWORDS
]


def keyword_score(message: str) -> int:
    text = str(message)
    return sum(1 for p in _PATTERNS if p.search(text))


def predict(message: str) -> str:
    return "scam" if keyword_score(message) >= 1 else "not_scam"


def score_split(df: pd.DataFrame) -> dict:
    scores = df["clean_message"].map(keyword_score)
    y_true = df["label"].eq("scam")
    y_pred = scores >= 1
    result = scam_metrics(y_true, y_pred, y_score=scores)
    result["ci95"] = bootstrap_ci(y_true, y_pred, scores)
    return result


def main():
    df = pd.read_csv(DATASET_PATH)
    results = {
        "model": "keyword_baseline",
        "task": "scam_vs_not_scam",
        "real_eval": score_split(df[df["split"] == "real_eval"]),
        "synth_test": score_split(df[df["split"] == "synth_test"]),
    }
    print(json.dumps(results, indent=2))

    os.makedirs(MODELS_DIR, exist_ok=True)
    out_path = os.path.join(MODELS_DIR, "keyword_baseline_results.json")
    with open(out_path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"Saved results to {out_path}")


if __name__ == "__main__":
    main()
