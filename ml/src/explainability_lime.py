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

Outputs, split by whether they quote message text:
  ml/data/processed/ (gitignored)  real-message explanations and their figures
  ml/models/figures/ (tracked)     synthetic-message explanations, and the
                                   words the model weighs most overall
"""
import json
import os

import joblib
import matplotlib

matplotlib.use("Agg")  # file output only; no display needed
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from lime.lime_text import LimeTextExplainer

from preprocessing import DATASET_PATH, PROCESSED_DIR
from text_cleaning import tokenize

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
PUBLIC_FIGURES_DIR = os.path.join(MODELS_DIR, "figures")
PRIVATE_FIGURES_DIR = os.path.join(PROCESSED_DIR, "figures")
TARGET_CLASS = "scam"
PLACEHOLDER_LABELS = {"__url__": "[link]", "__phone__": "[phone number]"}

# Nirmala UI (Windows) and the Noto fonts cover Sinhala and Tamil script; the
# first one installed is used, so figures render on Windows and on Colab.
plt.rcParams["font.family"] = ["Nirmala UI", "Iskoola Pota", "Noto Sans Sinhala", "Noto Sans Tamil", "DejaVu Sans"]


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


def readable(feature):
    for token, label in PLACEHOLDER_LABELS.items():
        feature = feature.replace(token, label)
    return feature


def plot_weights(pairs, title, path):
    """Horizontal bars, red for words pushing towards scam and green for away."""
    words = [readable(w) for w, _ in pairs][::-1]
    weights = [float(w) for _, w in pairs][::-1]
    fig, ax = plt.subplots(figsize=(7, 0.42 * len(pairs) + 1.4))
    ax.barh(words, weights, color=["#D92D20" if w > 0 else "#079455" for w in weights])
    ax.axvline(0, color="#667085", linewidth=0.8)
    ax.set_xlabel("Weight towards scam (red) or away from scam (green)")
    ax.set_title(title, fontsize=11)
    fig.tight_layout()
    fig.savefig(path, dpi=150)
    plt.close(fig)


def explain_rows(rows, vectorizer, model, figure_dir, prefix):
    scam_idx = list(model.classes_).index(TARGET_CLASS)
    outputs = []
    for n, (_, row) in enumerate(rows.iterrows(), start=1):
        msg = row["clean_message"]
        proba = model.predict_proba(vectorizer.transform([msg]))[0]
        fast_exp = tfidf_feature_importance(msg, vectorizer, model)
        lime_exp = lime_explanation(msg, vectorizer, model)
        outputs.append({
            "id": row["id"],
            "label": row["label"],
            "predicted": str(model.classes_[int(np.argmax(proba))]),
            "message": msg,
            "scam_probability": float(proba[scam_idx]),
            "tfidf_feature_importance": fast_exp,
            "lime_explanation": lime_exp,
        })
        title = f"{prefix} {n} (labelled {row['label']}): LIME, scam probability {proba[scam_idx]:.2f}"
        plot_weights(lime_exp, title, os.path.join(figure_dir, f"lime_{prefix.lower().replace(' ', '_')}_{n}.png"))
        print(f"[{row['id']}] {row['label']}, scam probability {proba[scam_idx]:.2f}: {lime_exp}")
    return outputs


def plot_top_features(vectorizer, model, path, top_n=15):
    """The words the model weighs most, in either direction, across all messages."""
    names = np.array(vectorizer.get_feature_names_out())
    coefs = class_coefficients(model)
    order = np.argsort(coefs)
    pairs = [(names[i], coefs[i]) for i in order[::-1][:top_n]] + [(names[i], coefs[i]) for i in order[:top_n][::-1]]
    plot_weights(pairs, "Words the model weighs most towards and away from scam", path)


def main():
    vectorizer = joblib.load(os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl"))
    logreg = joblib.load(os.path.join(MODELS_DIR, "logreg_model.pkl"))
    df = pd.read_csv(DATASET_PATH)
    os.makedirs(PUBLIC_FIGURES_DIR, exist_ok=True)
    os.makedirs(PRIVATE_FIGURES_DIR, exist_ok=True)

    # Real scams: these quote real messages, so everything stays in the gitignored folder.
    real = df[(df["split"] == "real_eval") & (df["label"] == "scam")].head(5)
    real_out = explain_rows(real, vectorizer, logreg, PRIVATE_FIGURES_DIR, "Real example")
    with open(os.path.join(PROCESSED_DIR, "sample_explanations.json"), "w", encoding="utf-8") as f:
        json.dump(real_out, f, indent=2, ensure_ascii=False)

    # One synthetic test message per label: safe to publish in the repo and the report.
    synth = df[df["split"] == "synth_test"]
    picks = pd.concat([synth[synth["label"] == lbl].head(1) for lbl in ("scam", "spam", "legitimate")])
    synth_out = explain_rows(picks, vectorizer, logreg, PUBLIC_FIGURES_DIR, "Synthetic example")
    with open(os.path.join(PUBLIC_FIGURES_DIR, "sample_explanations_synthetic.json"), "w", encoding="utf-8") as f:
        json.dump(synth_out, f, indent=2, ensure_ascii=False)

    plot_top_features(vectorizer, logreg, os.path.join(PUBLIC_FIGURES_DIR, "top_scam_features.png"))

    print(f"\nReal-message explanations and figures (private): {os.path.normpath(PROCESSED_DIR)}")
    print(f"Synthetic examples and the top-words chart: {os.path.normpath(PUBLIC_FIGURES_DIR)}")


if __name__ == "__main__":
    main()
