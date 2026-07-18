"""
tfidf_baseline.py
Primary model: TF-IDF (unigram+bigram) with Logistic Regression and SVM,
5-fold cross-validation, saved as pickles for the Flask backend and as
a quantization-ready artifact for TFLite conversion.

Usage:
    python src/tfidf_baseline.py
"""
import os
import json
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import classification_report

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
os.makedirs(MODELS_DIR, exist_ok=True)


def main():
    train = pd.read_csv(os.path.join(DATA_DIR, "train.csv"))
    val = pd.read_csv(os.path.join(DATA_DIR, "val.csv"))

    X_train_text = train["clean_message"].astype(str)
    y_train = train["label"]
    X_val_text = val["clean_message"].astype(str)
    y_val = val["label"]

    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        min_df=1,
        sublinear_tf=True,
        analyzer="word",
        token_pattern=r"(?u)\b\w+\b",  # keeps Sinhala/Tamil unicode word chars
    )
    X_train = vectorizer.fit_transform(X_train_text)
    X_val = vectorizer.transform(X_val_text)

    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    # Logistic Regression
    logreg = LogisticRegression(max_iter=1000, class_weight="balanced")
    logreg_cv_scores = cross_val_score(logreg, X_train, y_train, cv=skf, scoring="f1_macro")
    logreg.fit(X_train, y_train)

    # SVM — wrap LinearSVC with a calibrated classifier so we get predict_proba
    # for AUC-ROC and for the confidence score shown in the app.
    svm_base = LinearSVC(class_weight="balanced", max_iter=5000)
    svm = CalibratedClassifierCV(svm_base, cv=skf)
    svm_cv_scores = cross_val_score(svm, X_train, y_train, cv=skf, scoring="f1_macro")
    svm.fit(X_train, y_train)

    print("=== Logistic Regression (5-fold CV, macro-F1) ===")
    print(f"  mean: {logreg_cv_scores.mean():.4f}  std: {logreg_cv_scores.std():.4f}")
    print(classification_report(y_val, logreg.predict(X_val)))

    print("=== SVM / LinearSVC (5-fold CV, macro-F1) ===")
    print(f"  mean: {svm_cv_scores.mean():.4f}  std: {svm_cv_scores.std():.4f}")
    print(classification_report(y_val, svm.predict(X_val)))

    joblib.dump(vectorizer, os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl"))
    joblib.dump(logreg, os.path.join(MODELS_DIR, "logreg_model.pkl"))
    joblib.dump(svm, os.path.join(MODELS_DIR, "svm_model.pkl"))

    cv_summary = {
        "logreg_cv_f1_macro_mean": logreg_cv_scores.mean(),
        "logreg_cv_f1_macro_std": logreg_cv_scores.std(),
        "svm_cv_f1_macro_mean": svm_cv_scores.mean(),
        "svm_cv_f1_macro_std": svm_cv_scores.std(),
    }
    with open(os.path.join(MODELS_DIR, "cv_summary.json"), "w") as f:
        json.dump(cv_summary, f, indent=2)

    print(f"\nSaved vectorizer + models to {MODELS_DIR}")
    print("Next: run evaluate.py against test.csv for final held-out metrics.")


if __name__ == "__main__":
    main()
