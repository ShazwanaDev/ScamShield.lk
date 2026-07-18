"""
explainability_lime.py
Generates word-level explanations for predictions using LIME, plus a simpler
TF-IDF-feature-importance highlighter (used as the fast in-app explanation,
with LIME reserved for the research evaluation / report figures since it's
slower).

Usage:
    python src/explainability_lime.py
"""
import os
import json
import joblib
import numpy as np
import pandas as pd
from lime.lime_text import LimeTextExplainer

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")


def tfidf_feature_importance(message: str, vectorizer, model, top_n=5):
    """
    Fast explanation used by the live app: ranks the words actually present
    in the message by their TF-IDF weight times the model's coefficient for
    the 'scam' class.
    """
    X = vectorizer.transform([message])
    feature_names = np.array(vectorizer.get_feature_names_out())
    nonzero_idx = X.nonzero()[1]

    if hasattr(model, "coef_"):
        coefs = model.coef_[0]
    else:
        # calibrated SVM wrapper — fall back to the base estimator's coefficients
        coefs = model.calibrated_classifiers_[0].estimator.coef_[0]

    scores = X[0, nonzero_idx].toarray().flatten() * coefs[nonzero_idx]
    ranked = sorted(zip(feature_names[nonzero_idx], scores), key=lambda x: -abs(x[1]))
    return ranked[:top_n]


def lime_explanation(message: str, vectorizer, model, class_names=("legitimate", "scam"), num_features=6):
    explainer = LimeTextExplainer(class_names=list(class_names))

    def predict_proba(texts):
        X = vectorizer.transform(texts)
        return model.predict_proba(X)

    exp = explainer.explain_instance(message, predict_proba, num_features=num_features)
    return exp.as_list()


def main():
    vectorizer = joblib.load(os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl"))
    logreg = joblib.load(os.path.join(MODELS_DIR, "logreg_model.pkl"))

    test = pd.read_csv(os.path.join(DATA_DIR, "test.csv"))
    sample = test[test["label"] == "scam"].head(5)

    outputs = []
    for _, row in sample.iterrows():
        msg = row["clean_message"]
        fast_exp = tfidf_feature_importance(msg, vectorizer, logreg)
        lime_exp = lime_explanation(msg, vectorizer, logreg)
        outputs.append({
            "message": msg,
            "tfidf_feature_importance": fast_exp,
            "lime_explanation": lime_exp,
        })
        print(f"\nMessage: {msg}")
        print(f"  TF-IDF top features: {fast_exp}")
        print(f"  LIME explanation:    {lime_exp}")

    with open(os.path.join(MODELS_DIR, "sample_explanations.json"), "w") as f:
        json.dump(outputs, f, indent=2, default=str, ensure_ascii=False)

    print(f"\nSaved sample explanations to {MODELS_DIR}/sample_explanations.json")


if __name__ == "__main__":
    main()
