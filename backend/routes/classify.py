"""
/api/predict: classifies an SMS message as legitimate, scam or spam, with a
confidence score and a word-level explanation of what pushed it towards scam.
"""
import os
import sys
import time

import joblib
import numpy as np
from flask import Blueprint, request, jsonify

from models.db import db, ClassifiedMessage, ModelVersion

classify_bp = Blueprint("classify", __name__)

ML_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "ml")
MODELS_DIR = os.path.join(ML_DIR, "models")

# The model was trained on text cleaned by ml/src/text_cleaning.py (links and
# phone numbers masked, Sinhala/Tamil normalised). A message has to go through
# exactly the same cleaning before prediction, otherwise the model sees words
# it never saw in training, so import it from there instead of keeping a copy.
sys.path.insert(0, os.path.join(ML_DIR, "src"))
from text_cleaning import clean_text  # noqa: E402

MAX_MESSAGE_LENGTH = 2000
EXPLAINED_CLASS = "scam"
# The masking placeholders, in a form people can read. The brackets also stop
# the web client from highlighting an unrelated word like "link" in the message.
PLACEHOLDER_LABELS = {"__url__": "[link]", "__phone__": "[phone number]"}

_vectorizer = None
_model = None


class ModelUnavailable(Exception):
    pass


def _load_models():
    global _vectorizer, _model
    if _vectorizer is None:
        try:
            vectorizer = joblib.load(os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl"))
            model = joblib.load(os.path.join(MODELS_DIR, "logreg_model.pkl"))
        except FileNotFoundError as exc:
            raise ModelUnavailable(str(exc)) from exc
        _vectorizer, _model = vectorizer, model
    return _vectorizer, _model


def _class_coefficients(model, target=EXPLAINED_CLASS):
    """Per-feature weights for one class: positive pushes towards it, negative away."""
    classes = list(model.classes_)
    if model.coef_.shape[0] == 1:
        # A two-class model stores a single row, which belongs to classes_[1].
        return model.coef_[0] if classes[1] == target else -model.coef_[0]
    return model.coef_[classes.index(target)]


def _readable(feature):
    for token, label in PLACEHOLDER_LABELS.items():
        feature = feature.replace(token, label)
    return feature


def _top_features(message_vec, vectorizer, model, top_n=5):
    feature_names = np.array(vectorizer.get_feature_names_out())
    nonzero_idx = message_vec.nonzero()[1]
    coefs = _class_coefficients(model)
    scores = message_vec[0, nonzero_idx].toarray().flatten() * coefs[nonzero_idx]
    ranked = sorted(zip(feature_names[nonzero_idx], scores), key=lambda x: -abs(x[1]))
    return [{"word": _readable(w), "weight": float(s)} for w, s in ranked[:top_n]]


@classify_bp.post("/predict")
def predict():
    payload = request.get_json(force=True, silent=True)
    if not isinstance(payload, dict) or not isinstance(payload.get("message"), str):
        return jsonify({"error": "send a JSON object with a 'message' string"}), 400

    message = payload["message"].strip()
    if not message:
        return jsonify({"error": "message field is required"}), 400
    if len(message) > MAX_MESSAGE_LENGTH:
        return jsonify({"error": f"message must be {MAX_MESSAGE_LENGTH} characters or fewer"}), 400

    try:
        vectorizer, model = _load_models()
    except ModelUnavailable:
        return jsonify({"error": "the classification model is not available yet"}), 503

    started = time.perf_counter()
    clean = clean_text(message)
    X = vectorizer.transform([clean])

    pred_label = str(model.predict(X)[0])
    proba = model.predict_proba(X)[0]
    class_idx = list(model.classes_).index(pred_label)
    confidence = float(proba[class_idx])

    triggers = _top_features(X, vectorizer, model)
    elapsed_ms = int((time.perf_counter() - started) * 1000)
    active_version = ModelVersion.query.filter_by(is_active=True).first()

    record = ClassifiedMessage(
        message_text=message,
        clean_message=clean,
        message_length=len(message),
        predicted_label=pred_label,
        confidence_score=confidence,
        processing_time_ms=elapsed_ms,
        model_version_id=active_version.id if active_version else None,
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
