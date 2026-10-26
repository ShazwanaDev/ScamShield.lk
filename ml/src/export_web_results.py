"""
export_web_results.py
Copies the evaluation results the web app displays into
web/src/data/modelResults.json, so the research and admin pages show the
numbers evaluate.py actually measured rather than hand-typed ones.

Only aggregate metrics and counts are exported, never message text, so the
output is safe to commit.

Usage (after evaluate.py):
    python src/export_web_results.py
"""
import json
import os

import pandas as pd

from preprocessing import DATASET_PATH

ML_DIR = os.path.join(os.path.dirname(__file__), "..")
MODELS_DIR = os.path.join(ML_DIR, "models")
OUT_PATH = os.path.join(ML_DIR, "..", "web", "src", "data", "modelResults.json")

# Primary dataset target from the project plan (500 to 1,000 real messages).
REAL_TARGET = 500

MODEL_INFO = {
    "keyword_baseline": ("keyword", "Keyword baseline", "Rule-based", "baseline"),
    "logreg": ("logreg", "TF-IDF + Logistic Regression", "Machine learning", "serving"),
    "svm": ("svm", "TF-IDF + Linear SVM", "Machine learning", "candidate"),
}


def rounded(value, digits=3):
    return None if value is None else round(float(value), digits)


def real_metrics(m):
    return {
        "precision": rounded(m["precision"]),
        "recall": rounded(m["recall"]),
        "f1": rounded(m["f1"]),
        "accuracy": rounded(m["accuracy"]),
        "auc": rounded(m.get("auc_roc")),
        "f1Ci95": [rounded(x) for x in m["ci95"]["f1"]],
    }


def main():
    with open(os.path.join(MODELS_DIR, "final_evaluation_results.json")) as f:
        results = json.load(f)
    with open(os.path.join(MODELS_DIR, "cv_summary.json")) as f:
        training = json.load(f)
    breakdown = pd.read_csv(os.path.join(MODELS_DIR, "per_language_breakdown.csv"))
    df = pd.read_csv(DATASET_PATH, usecols=["split", "label", "source_type", "group_id"])

    real_a = results["A_synthetic_to_real_scam_vs_not"]
    real_cv = results["B_synthetic_plus_real_repeated_cv"]
    synth = results["C_synthetic_test_3way"]

    models = []
    for key, (model_id, name, kind, status) in MODEL_INFO.items():
        entry = {"id": model_id, "name": name, "type": kind, "status": status,
                 "real": real_metrics(real_a[key])}
        if key in synth and "macro_f1" in synth[key]:
            entry["synthetic"] = {"macroF1": rounded(synth[key]["macro_f1"]),
                                  "accuracy": rounded(synth[key]["accuracy"])}
        if key in real_cv:
            entry["realCv"] = {"f1Mean": rounded(real_cv[key]["f1"]["mean"]),
                               "f1Std": rounded(real_cv[key]["f1"]["std"]),
                               "aucMean": rounded(real_cv[key]["auc_roc"]["mean"])}
        if key in real_a and "real_label_vs_predicted" in real_a[key]:
            entry["realLabelVsPredicted"] = real_a[key]["real_label_vs_predicted"]
        models.append(entry)
    models.append({"id": "mbert", "name": "mBERT (multilingual)", "type": "Transformer",
                   "status": "not_trained"})

    syn = df[df["source_type"] == "synthetic_augmentation"]
    counts = df["split"].value_counts()
    export = {
        "evaluatedOn": training["trained_at"][:10],
        "scikitLearnVersion": training["scikit_learn_version"],
        "task": "Real messages are scored as scam vs not-scam; spam and legitimate both count as not-scam.",
        "dataset": {
            "realTest": int(counts.get("real_eval", 0)),
            "realTestScam": int(((df["split"] == "real_eval") & (df["label"] == "scam")).sum()),
            "reconstructed": int(counts.get("real_reconstructed", 0)),
            "synthetic": int(len(syn)),
            "syntheticTemplates": int(syn["group_id"].nunique()),
            "syntheticTrain": int(counts.get("synth_train", 0)),
            "syntheticVal": int(counts.get("synth_val", 0)),
            "syntheticTest": int(counts.get("synth_test", 0)),
            "realTarget": REAL_TARGET,
        },
        "models": models,
        "perLanguage": [
            {
                "set": "real" if row["set"] == "real_eval" else "synthetic",
                "language": row["language"],
                "n": int(row["n"]),
                "nScam": int(row["n_scam"]),
                "scamRecall": rounded(row["scam_recall"]),
                "scamF1": rounded(row["scam_f1"]),
                "macroF1": None if pd.isna(row.get("macro_f1_3way")) else rounded(row["macro_f1_3way"]),
            }
            for _, row in breakdown.iterrows()
        ],
        "reconstructedDetected": {k: rounded(v) for k, v in results["reconstructed_scam_detection_rate"].items()},
    }

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(export, f, indent=2)
        f.write("\n")
    print(f"Wrote {os.path.normpath(OUT_PATH)}")


if __name__ == "__main__":
    main()
