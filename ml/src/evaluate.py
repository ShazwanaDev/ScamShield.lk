"""
evaluate.py
Final evaluation, following the protocol in DATASET_README.md:

  A. Synthetic -> real (primary result). The models from tfidf_baseline.py,
     trained only on synthetic data, are tested on every verbatim real
     message. Scored as scam vs not-scam, because real messages only carry
     scam/legitimate labels (promotions are labelled legitimate there but spam
     in the synthetic set). 95% bootstrap intervals are reported because the
     real set is small.
  B. Synthetic + real (repeated cross-validation). 5 folds x 5 repeats over the
     real messages, grouped so near-duplicate campaigns stay in one fold: each
     fold trains on synthetic train + the other real folds (+ reconstructed
     rows) and tests on the held-out real fold. Shows how much a small amount
     of real training data helps.
  C. Synthetic test split, 3-way (legitimate / scam / spam), split by template.

The keyword baseline is scored on exactly the same sets. Reconstructed rows are
reported separately and never counted as real-world evidence.

Usage:
    python src/evaluate.py
Metrics/plots go to ml/models/ (no message text). Misclassified real messages
go to ml/data/processed/real_errors.csv (gitignored).
"""
import json
import os

import joblib
import matplotlib

matplotlib.use("Agg")  # file output only; no display needed
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.base import clone
from sklearn.metrics import (
    RocCurveDisplay,
    classification_report,
    confusion_matrix,
    f1_score,
)
from sklearn.model_selection import StratifiedGroupKFold

import keyword_baseline
from metrics import bootstrap_ci, scam_metrics
from preprocessing import DATASET_PATH, LABELS, PROCESSED_DIR, SEED
from tfidf_baseline import build_models, build_vectorizer

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
MODEL_NAMES = ("logreg", "svm")
CV_FOLDS = 5
CV_REPEATS = 5


def scam_proba(model, X):
    return model.predict_proba(X)[:, list(model.classes_).index("scam")]


def save_confusion(cm, labels, title, path):
    plt.figure(figsize=(4.5, 4))
    sns.heatmap(cm, annot=True, fmt="d", xticklabels=labels, yticklabels=labels, cmap="Blues")
    plt.title(title)
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.tight_layout()
    plt.savefig(path)
    plt.close()


def experiment_a(models, vectorizer, real):
    """Synthetic-trained models on verbatim real messages (scam vs not-scam)."""
    X = vectorizer.transform(real["clean_message"].astype(str))
    y_true = real["label"].eq("scam").to_numpy()
    results, errors = {}, []

    for name, model in models.items():
        pred = model.predict(X)
        proba = scam_proba(model, X)
        y_pred = pred == "scam"
        m = scam_metrics(y_true, y_pred, proba)
        m["ci95"] = bootstrap_ci(y_true, y_pred, proba)
        # How the 3-way predictions spread over the real labels, for example
        # real "legitimate" promotions being predicted as spam.
        m["real_label_vs_predicted"] = (
            pd.crosstab(real["label"], pd.Series(pred, index=real.index, name="predicted"))
            .reindex(columns=list(LABELS), fill_value=0)
            .to_dict(orient="index")
        )
        results[name] = m

        cm = confusion_matrix(y_true, y_pred, labels=[False, True])
        save_confusion(cm, ["not_scam", "scam"], f"Real messages - {name}",
                       os.path.join(MODELS_DIR, f"confusion_matrix_{name}_real.png"))
        RocCurveDisplay.from_predictions(y_true, proba)
        plt.title(f"ROC (real messages) - {name}")
        plt.savefig(os.path.join(MODELS_DIR, f"roc_curve_{name}_real.png"))
        plt.close()

        wrong = real[y_true != y_pred]
        for idx, row in wrong.iterrows():
            errors.append({
                "model": name, "id": row["id"], "label": row["label"],
                "predicted": pred[real.index.get_loc(idx)],
                "scam_probability": round(float(proba[real.index.get_loc(idx)]), 3),
                "category": row["category"], "message": row["message"],
            })

    kw_scores = real["clean_message"].map(keyword_baseline.keyword_score)
    kw = scam_metrics(y_true, kw_scores >= 1, kw_scores)
    kw["ci95"] = bootstrap_ci(y_true, kw_scores >= 1, kw_scores)
    results["keyword_baseline"] = kw
    return results, errors


def experiment_b(df, real):
    """Repeated stratified CV over real messages, training on synthetic + real folds."""
    syn_train = df[df["split"] == "synth_train"]
    reconstructed = df[df["split"] == "real_reconstructed"]
    fold_scores = {name: [] for name in MODEL_NAMES}

    # scikit-learn has no repeated grouped splitter, so reshuffle per repeat.
    splits = [
        split
        for repeat in range(CV_REPEATS)
        for split in StratifiedGroupKFold(n_splits=CV_FOLDS, shuffle=True, random_state=SEED + repeat)
        .split(real, real["label"], groups=real["group_id"])
    ]
    for train_idx, test_idx in splits:
        test = real.iloc[test_idx]
        # A reconstructed row grouped with a test message would leak it into training.
        safe_reconstructed = reconstructed[~reconstructed["group_id"].isin(test["group_id"])]
        train = pd.concat([syn_train, safe_reconstructed, real.iloc[train_idx]])
        vec = build_vectorizer()
        X_train = vec.fit_transform(train["clean_message"].astype(str))
        X_test = vec.transform(test["clean_message"].astype(str))
        y_true = test["label"].eq("scam").to_numpy()
        for name, template in build_models().items():
            model = clone(template).fit(X_train, train["label"])
            fold_scores[name].append(scam_metrics(y_true, model.predict(X_test) == "scam", scam_proba(model, X_test)))

    summary = {}
    for name, folds in fold_scores.items():
        summary[name] = {"n_folds": len(folds)}
        for key in ("accuracy", "precision", "recall", "f1", "auc_roc"):
            values = [f[key] for f in folds if key in f]
            summary[name][key] = {"mean": float(np.mean(values)), "std": float(np.std(values))}
    return summary


def experiment_c(models, vectorizer, synth_test):
    """3-way results on the template-grouped synthetic test split."""
    X = vectorizer.transform(synth_test["clean_message"].astype(str))
    y = synth_test["label"]
    results = {}
    for name, model in models.items():
        pred = model.predict(X)
        report = classification_report(y, pred, labels=list(LABELS), output_dict=True, zero_division=0)
        proba = scam_proba(model, X)
        results[name] = {
            "macro_f1": float(report["macro avg"]["f1-score"]),
            "accuracy": float(report["accuracy"]),
            "per_class": {lbl: {k: float(report[lbl][k]) for k in ("precision", "recall", "f1-score", "support")}
                          for lbl in LABELS},
            "scam_vs_not": scam_metrics(y.eq("scam"), pred == "scam", proba),
        }
        save_confusion(confusion_matrix(y, pred, labels=list(LABELS)), list(LABELS),
                       f"Synthetic test - {name}", os.path.join(MODELS_DIR, f"confusion_matrix_{name}_synth.png"))

    kw_scores = synth_test["clean_message"].map(keyword_baseline.keyword_score)
    results["keyword_baseline"] = {"scam_vs_not": scam_metrics(y.eq("scam"), kw_scores >= 1, kw_scores)}
    return results


def per_language_breakdown(model, vectorizer, df):
    rows = []
    for split in ("synth_test", "real_eval"):
        for lang, group in df[df["split"] == split].groupby("language"):
            if len(group) < 5:
                continue  # too few samples to report meaningfully
            pred = model.predict(vectorizer.transform(group["clean_message"].astype(str)))
            y_true = group["label"].eq("scam")
            m = scam_metrics(y_true, pred == "scam")
            row = {"set": split, "language": lang, "n": len(group), "n_scam": int(y_true.sum()),
                   "scam_f1": m["f1"], "scam_recall": m["recall"]}
            if split == "synth_test":
                row["macro_f1_3way"] = float(f1_score(group["label"], pred, average="macro", labels=list(LABELS), zero_division=0))
            rows.append(row)
    return pd.DataFrame(rows)


def main():
    df = pd.read_csv(DATASET_PATH)
    real = df[df["split"] == "real_eval"].reset_index(drop=True)
    reconstructed = df[df["split"] == "real_reconstructed"]
    synth_test = df[df["split"] == "synth_test"]

    vectorizer = joblib.load(os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl"))
    models = {name: joblib.load(os.path.join(MODELS_DIR, f"{name}_model.pkl")) for name in MODEL_NAMES}

    a_results, errors = experiment_a(models, vectorizer, real)
    print(f"Running experiment B ({CV_FOLDS} folds x {CV_REPEATS} repeats)...")
    b_results = experiment_b(df, real)
    c_results = experiment_c(models, vectorizer, synth_test)

    reconstructed_recall = {}
    if len(reconstructed):
        X_rec = vectorizer.transform(reconstructed["clean_message"].astype(str))
        reconstructed_recall = {name: float(np.mean(m.predict(X_rec) == "scam")) for name, m in models.items()}

    results = {
        "protocol": "see ml/data/DATASET_README.md - Evaluation protocol",
        "n_real_eval": int(len(real)),
        "n_real_scam": int(real["label"].eq("scam").sum()),
        "A_synthetic_to_real_scam_vs_not": a_results,
        "B_synthetic_plus_real_repeated_cv": b_results,
        "C_synthetic_test_3way": c_results,
        "reconstructed_scam_detection_rate": reconstructed_recall,
    }
    with open(os.path.join(MODELS_DIR, "final_evaluation_results.json"), "w") as f:
        json.dump(results, f, indent=2)

    breakdown = per_language_breakdown(models["logreg"], vectorizer, df)
    breakdown.to_csv(os.path.join(MODELS_DIR, "per_language_breakdown.csv"), index=False)

    os.makedirs(PROCESSED_DIR, exist_ok=True)
    pd.DataFrame(errors).to_csv(os.path.join(PROCESSED_DIR, "real_errors.csv"), index=False, encoding="utf-8-sig")

    print("\n=== A. Synthetic-trained -> real messages (scam vs not-scam) ===")
    for name, m in a_results.items():
        ci = m["ci95"]["f1"]
        print(f"  {name:17s} F1 {m['f1']:.3f} [{ci[0]:.2f}-{ci[1]:.2f}]  precision {m['precision']:.3f}  "
              f"recall {m['recall']:.3f}  AUC {m.get('auc_roc', float('nan')):.3f}")
    print(f"\n=== B. Synthetic + real, {CV_FOLDS}x{CV_REPEATS} grouped CV on real messages (scam vs not-scam) ===")
    for name, m in b_results.items():
        print(f"  {name:17s} F1 {m['f1']['mean']:.3f} +/- {m['f1']['std']:.3f}  "
              f"recall {m['recall']['mean']:.3f}  AUC {m['auc_roc']['mean']:.3f}")
    print("\n=== C. Synthetic test split (3-way) ===")
    for name in MODEL_NAMES:
        print(f"  {name:17s} macro-F1 {c_results[name]['macro_f1']:.3f}  accuracy {c_results[name]['accuracy']:.3f}")
    print(f"  keyword_baseline  scam F1 {c_results['keyword_baseline']['scam_vs_not']['f1']:.3f}")
    print(f"\nReconstructed scams detected: {reconstructed_recall}")
    print("\n=== Per-language breakdown (Logistic Regression) ===")
    print(breakdown.to_string(index=False))
    print(f"\nResults, plots and breakdowns saved to {MODELS_DIR}")
    print(f"Misclassified real messages (private) saved to {PROCESSED_DIR}")


if __name__ == "__main__":
    main()
