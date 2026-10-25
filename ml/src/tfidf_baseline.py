"""
tfidf_baseline.py
Primary models: TF-IDF (word unigram+bigram) with Logistic Regression and a
calibrated LinearSVC, trained 3-way (legitimate / scam / spam) on the
synthetic training split only. Real messages are never seen here, because
they are the held-out real-world test set used by evaluate.py.

Cross-validation is grouped by template (StratifiedGroupKFold), so augmented
variants of one template never sit on both sides of a fold.

Usage:
    python src/tfidf_baseline.py
"""
import hashlib
import json
import os
from datetime import datetime, timezone

import joblib
import pandas as pd
import sklearn
from sklearn.calibration import CalibratedClassifierCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import StratifiedGroupKFold, cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.svm import LinearSVC

from preprocessing import DATASET_PATH, SEED
from text_cleaning import TOKEN_PATTERN

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
TRAIN_SPLITS = ("synth_train",)


def build_vectorizer() -> TfidfVectorizer:
    return TfidfVectorizer(
        ngram_range=(1, 2),
        min_df=2,              # ignore one-off tokens (mostly injected typos)
        sublinear_tf=True,
        analyzer="word",
        token_pattern=TOKEN_PATTERN,  # keeps Sinhala/Tamil words whole
    )


def build_models() -> dict:
    return {
        "logreg": LogisticRegression(max_iter=2000, class_weight="balanced"),
        # LinearSVC has no predict_proba; calibration gives the confidence
        # score shown in the app and the probabilities needed for AUC-ROC.
        "svm": CalibratedClassifierCV(LinearSVC(class_weight="balanced"), cv=5),
    }


def file_sha256(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 16), b""):
            h.update(chunk)
    return h.hexdigest()


def main():
    df = pd.read_csv(DATASET_PATH)
    train = df[df["split"].isin(TRAIN_SPLITS)]
    val = df[df["split"] == "synth_val"]
    if train["source_type"].ne("synthetic_augmentation").any():
        raise AssertionError("Primary models must train on synthetic rows only; real rows are the test set")

    X_train_text = train["clean_message"].astype(str)
    y_train = train["label"]
    groups = train["group_id"]

    os.makedirs(MODELS_DIR, exist_ok=True)
    cv = StratifiedGroupKFold(n_splits=5, shuffle=True, random_state=SEED)
    vectorizer = build_vectorizer()
    X_train = vectorizer.fit_transform(X_train_text)
    X_val = vectorizer.transform(val["clean_message"].astype(str))

    cv_summary = {}
    for name, model in build_models().items():
        # Fresh vectorizer per fold so IDF weights don't see the held-out fold.
        scores = cross_val_score(
            make_pipeline(build_vectorizer(), model),
            X_train_text, y_train, groups=groups, cv=cv, scoring="f1_macro",
        )
        model.fit(X_train, y_train)
        joblib.dump(model, os.path.join(MODELS_DIR, f"{name}_model.pkl"))
        cv_summary[f"{name}_cv_f1_macro_mean"] = float(scores.mean())
        cv_summary[f"{name}_cv_f1_macro_std"] = float(scores.std())

        print(f"=== {name} (grouped 5-fold CV on synthetic train, macro-F1) ===")
        print(f"  mean: {scores.mean():.4f}  std: {scores.std():.4f}")
        print(classification_report(val["label"], model.predict(X_val), digits=3))

    joblib.dump(vectorizer, os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl"))

    manifest = {
        "trained_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "labels": sorted(y_train.unique()),
        "train_splits": list(TRAIN_SPLITS),
        "n_train": int(len(train)),
        "n_features": int(len(vectorizer.vocabulary_)),
        "dataset_sha256": file_sha256(DATASET_PATH),
        "scikit_learn_version": sklearn.__version__,
        **cv_summary,
    }
    with open(os.path.join(MODELS_DIR, "cv_summary.json"), "w") as f:
        json.dump(manifest, f, indent=2)

    print(f"\nSaved vectorizer + models to {MODELS_DIR}")
    print("Next: run evaluate.py for held-out real-message and synthetic test results.")


if __name__ == "__main__":
    main()
