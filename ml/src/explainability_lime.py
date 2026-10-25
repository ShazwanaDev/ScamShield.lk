"""
explainability_lime.py
Generates word-level explanations for "why is this a scam?" using LIME, plus a
simpler TF-IDF-feature-importance highlighter (the fast in-app explanation,
with LIME reserved for the research evaluation / report figures since it's
slower).

The models are 3-way (legitimate / scam / spam); both methods explain the
scam class.

Usage:
    python src/explainability_lime.py
Output contains real message text, so it is written to ml/data/processed/
(gitignored), not ml/models/.
"""
import json
import os

import joblib
import numpy as np
import pandas as pd
from lime.lime_text import LimeTextExplainer

from preprocessing import DATASET_PATH, PROCESSED_DIR
from text_cleaning import tokenize

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
TARGET_CLASS = "scam"


def class_coefficients(model, target=TARGET_CLASS):
    """Per-feature weights for one class, for LogReg or the calibrated SVM wrapper."""
    classes = list(model.classes_)
    if hasattr(model, "coef_"):
        coefs = model.coef_
    else:
        # calibrated SVM: average the base LinearSVC weights across calibration folds
        coefs = np.mean([c.estimator.coef_ for c in model.calibrated_classifiers_], axis=0)
    return coefs[classes.index(target)]


def tfidf_feature_importance(message: str, vectorizer, model, top_n=5):
    """
    Fast explanation used by the live app: ranks the words actually present in
    the message by their TF-IDF weight times the model's coefficient for the
    scam class (positive = pushes towards scam).
    """
    X = vectorizer.transform([message])
    feature_names = np.array(vectorizer.get_feature_names_out())
    nonzero_idx = X.nonzero()[1]
    coefs = class_coefficients(model)
    scores = X[0, nonzero_idx].toarray().flatten() * coefs[nonzero_idx]
    ranked = sorted(zip(feature_names[nonzero_idx], scores), key=lambda x: -abs(x[1]))
    return [(word, float(score)) for word, score in ranked[:top_n]]


def lime_explanation(message: str, vectorizer, model, num_features=6):
    classes = list(model.classes_)
    target_idx = classes.index(TARGET_CLASS)
    # LIME's default r"\W+" splitter breaks Sinhala/Tamil words at vowel signs;
    # a callable returning tokens makes it perturb the same whole words the
    # vectorizer sees.
    explainer = LimeTextExplainer(class_names=classes, split_expression=tokenize, bow=True,
                                  random_state=42)

    def predict_proba(texts):
        return model.predict_proba(vectorizer.transform(texts))

    exp = explainer.explain_instance(message, predict_proba, num_features=num_features,
                                     labels=(target_idx,))
    return exp.as_list(label=target_idx)


def main():
    vectorizer = joblib.load(os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl"))
    logreg = joblib.load(os.path.join(MODELS_DIR, "logreg_model.pkl"))

    df = pd.read_csv(DATASET_PATH)
    sample = df[(df["split"] == "real_eval") & (df["label"] == "scam")].head(5)

    outputs = []
    for _, row in sample.iterrows():
        msg = row["clean_message"]
        fast_exp = tfidf_feature_importance(msg, vectorizer, logreg)
        lime_exp = lime_explanation(msg, vectorizer, logreg)
        outputs.append({
            "id": row["id"],
            "message": msg,
            "scam_probability": float(logreg.predict_proba(vectorizer.transform([msg]))[0][list(logreg.classes_).index(TARGET_CLASS)]),
            "tfidf_feature_importance": fast_exp,
            "lime_explanation": lime_exp,
        })
        print(f"\n[{row['id']}] scam probability {outputs[-1]['scam_probability']:.2f}")
        print(f"  TF-IDF top features: {fast_exp}")
        print(f"  LIME explanation:    {lime_exp}")

    os.makedirs(PROCESSED_DIR, exist_ok=True)
    out_path = os.path.join(PROCESSED_DIR, "sample_explanations.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(outputs, f, indent=2, ensure_ascii=False)
    print(f"\nSaved sample explanations to {out_path}")


if __name__ == "__main__":
    main()
