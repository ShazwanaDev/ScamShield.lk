"""
keyword_baseline.py
Simple rule-based keyword blocklist classifier — the baseline the ML models
must beat to justify the ML approach, per the research question.

Usage:
    python src/keyword_baseline.py
"""
import os
import json
import pandas as pd
from sklearn.metrics import precision_recall_fscore_support, roc_auc_score, accuracy_score

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")

# Seed keyword list — expand this as you review more real scam messages.
# Keep Sinhala/Tamil script entries alongside Singlish/English ones.
SCAM_KEYWORDS = [
    "otp", "click here", "verify account", "suspended", "won", "winner",
    "lottery", "prize", "urgent", "act now", "bank transfer", "refund",
    "ජය ගත්තා", "ගිණුම අවහිර", "click karanna", "link eka",
    "account blocked", "reward", "free gift", "confirm your", "limited time",
]


def keyword_score(message: str) -> int:
    text = str(message).lower()
    return sum(1 for kw in SCAM_KEYWORDS if kw.lower() in text)


def predict(message: str) -> str:
    return "scam" if keyword_score(message) >= 1 else "legitimate"


def main():
    test = pd.read_csv(os.path.join(DATA_DIR, "test.csv"))
    test["predicted"] = test["clean_message"].apply(predict)
    test["score"] = test["clean_message"].apply(keyword_score)

    y_true = test["label"]
    y_pred = test["predicted"]
    # crude confidence proxy for AUC — presence of any keyword hit
    y_score = (test["score"] > 0).astype(int)
    y_true_bin = (y_true == "scam").astype(int)

    precision, recall, f1, _ = precision_recall_fscore_support(
        y_true, y_pred, average="binary", pos_label="scam", zero_division=0
    )
    acc = accuracy_score(y_true, y_pred)
    try:
        auc = roc_auc_score(y_true_bin, y_score)
    except ValueError:
        auc = float("nan")

    results = {
        "model": "keyword_baseline",
        "accuracy": acc,
        "precision": precision,
        "recall": recall,
        "f1": f1,
        "auc_roc": auc,
        "n_test": len(test),
    }
    print(json.dumps(results, indent=2))

    out_path = os.path.join(os.path.dirname(__file__), "..", "models", "keyword_baseline_results.json")
    with open(out_path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"Saved results to {out_path}")


if __name__ == "__main__":
    main()
