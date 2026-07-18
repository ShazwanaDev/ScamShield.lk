"""
evaluate.py
Final held-out evaluation: precision, recall, F1, AUC-ROC, confusion matrix,
and a per-language-type breakdown (Sinhala-only, Tamil-only, code-mixed) so
the report can show where the model succeeds and struggles, per the proposal.

Usage:
    python src/evaluate.py
"""
import os
import json
import joblib
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    precision_recall_fscore_support,
    roc_auc_score,
    accuracy_score,
    confusion_matrix,
    RocCurveDisplay,
)

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")


def evaluate_model(name, model, X_test, y_test, labels=("legitimate", "scam")):
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, list(model.classes_).index("scam")]
    y_true_bin = (y_test == "scam").astype(int)

    precision, recall, f1, _ = precision_recall_fscore_support(
        y_test, y_pred, average="binary", pos_label="scam", zero_division=0
    )
    acc = accuracy_score(y_test, y_pred)
    auc = roc_auc_score(y_true_bin, y_proba)

    cm = confusion_matrix(y_test, y_pred, labels=labels)

    plt.figure(figsize=(4, 4))
    sns.heatmap(cm, annot=True, fmt="d", xticklabels=labels, yticklabels=labels, cmap="Blues")
    plt.title(f"Confusion Matrix — {name}")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.tight_layout()
    cm_path = os.path.join(MODELS_DIR, f"confusion_matrix_{name}.png")
    plt.savefig(cm_path)
    plt.close()

    RocCurveDisplay.from_predictions(y_true_bin, y_proba)
    plt.title(f"ROC Curve — {name}")
    roc_path = os.path.join(MODELS_DIR, f"roc_curve_{name}.png")
    plt.savefig(roc_path)
    plt.close()

    return {
        "model": name,
        "accuracy": acc,
        "precision": precision,
        "recall": recall,
        "f1": f1,
        "auc_roc": auc,
        "n_test": len(y_test),
        "confusion_matrix_path": cm_path,
        "roc_curve_path": roc_path,
    }


def per_language_breakdown(model, test_df, vectorizer):
    rows = []
    for lang, group in test_df.groupby("language"):
        if len(group) < 3:
            continue  # too few samples to report meaningfully
        X = vectorizer.transform(group["clean_message"].astype(str))
        y = group["label"]
        y_pred = model.predict(X)
        precision, recall, f1, _ = precision_recall_fscore_support(
            y, y_pred, average="binary", pos_label="scam", zero_division=0
        )
        rows.append({"language": lang, "n": len(group), "precision": precision, "recall": recall, "f1": f1})
    return pd.DataFrame(rows)


def main():
    test = pd.read_csv(os.path.join(DATA_DIR, "test.csv"))
    vectorizer = joblib.load(os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl"))
    logreg = joblib.load(os.path.join(MODELS_DIR, "logreg_model.pkl"))
    svm = joblib.load(os.path.join(MODELS_DIR, "svm_model.pkl"))

    X_test = vectorizer.transform(test["clean_message"].astype(str))
    y_test = test["label"]

    all_results = []
    all_results.append(evaluate_model("logreg", logreg, X_test, y_test))
    all_results.append(evaluate_model("svm", svm, X_test, y_test))

    # keyword baseline comparison, if it was run first
    kw_path = os.path.join(MODELS_DIR, "keyword_baseline_results.json")
    if os.path.exists(kw_path):
        with open(kw_path) as f:
            all_results.append(json.load(f))

    print(json.dumps(all_results, indent=2, default=str))

    with open(os.path.join(MODELS_DIR, "final_evaluation_results.json"), "w") as f:
        json.dump(all_results, f, indent=2, default=str)

    print("\n=== Per-language breakdown (Logistic Regression) ===")
    breakdown = per_language_breakdown(logreg, test, vectorizer)
    print(breakdown.to_string(index=False))
    breakdown.to_csv(os.path.join(MODELS_DIR, "per_language_breakdown.csv"), index=False)

    print(f"\nAll results, plots, and breakdowns saved to {MODELS_DIR}")


if __name__ == "__main__":
    main()
