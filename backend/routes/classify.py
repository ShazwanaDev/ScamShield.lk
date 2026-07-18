"""
/api/predict — classifies an SMS message as scam or legitimate, with
confidence score and word-level explanation.
"""
import os
import joblib
import numpy as np
from flask import Blueprint, request, jsonify

from models.db import db, ClassifiedMessage

classify_bp = Blueprint("classify", __name__)

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "ml", "models")

_vectorizer = None
_model = None


def _load_models():
    global _vectorizer, _model
    if _vectorizer is None:
        _vectorizer = joblib.load(os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl"))
        _model = joblib.load(os.path.join(MODELS_DIR, "logreg_model.pkl"))
    return _vectorizer, _model


def _top_features(message_vec, vectorizer, model, top_n=5):
    feature_names = np.array(vectorizer.get_feature_names_out())
    nonzero_idx = message_vec.nonzero()[1]
    coefs = model.coef_[0]
    scores = message_vec[0, nonzero_idx].toarray().flatten() * coefs[nonzero_idx]
    ranked = sorted(zip(feature_names[nonzero_idx], scores), key=lambda x: -abs(x[1]))
    return [{"word": w, "weight": float(s)} for w, s in ranked[:top_n]]


@classify_bp.post("/predict")
def predict():
    payload = request.get_json(force=True)
    message = payload.get("message", "").strip()
    user_device_id = payload.get("device_id")

    if not message:
        return jsonify({"error": "message field is required"}), 400

    vectorizer, model = _load_models()
    X = vectorizer.transform([message])

    pred_label = model.predict(X)[0]
    proba = model.predict_proba(X)[0]
    class_idx = list(model.classes_).index(pred_label)
    confidence = float(proba[class_idx])

    triggers = _top_features(X, vectorizer, model)

    record = ClassifiedMessage(
        message_text=message,
        message_length=len(message),
        predicted_label=pred_label,
        confidence_score=confidence,
    )
    db.session.add(record)
    db.session.commit()

    return jsonify({
        "label": pred_label,
        "confidence": round(confidence, 4),
        "trigger_words": triggers,
        "classification_id": record.id,
    })


@classify_bp.post("/feedback/<int:classification_id>")
def feedback(classification_id):
    payload = request.get_json(force=True)
    is_correct = payload.get("correct")

    record = ClassifiedMessage.query.get_or_404(classification_id)
    record.user_feedback = "correct" if is_correct else "incorrect"
    db.session.commit()

    return jsonify({"status": "recorded"})
