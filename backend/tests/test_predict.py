"""/api/predict: input checks, the trained model, and agreement with the ML pipeline."""
import joblib
import pandas as pd
import pytest

import routes.classify as classify
from conftest import DATASET_CSV, MODELS_DIR, requires_dataset, requires_model
from models.db import db, ClassifiedMessage


@pytest.mark.parametrize("kwargs", [
    dict(data="", content_type="application/json"),
    dict(data="hello", content_type="text/plain"),
    dict(json=["a"]),
    dict(json={"message": 42}),
    dict(json={"message": "   "}),
    dict(json={"message": "a" * 2001}),
])
def test_bad_input_gets_a_400_not_a_crash(client, kwargs):
    response = client.post("/api/predict", **kwargs)
    assert response.status_code == 400
    assert "error" in response.get_json()


def test_missing_model_files_give_a_503(client, tmp_path, monkeypatch):
    monkeypatch.setattr(classify, "MODELS_DIR", str(tmp_path / "no-models"))
    monkeypatch.setattr(classify, "_vectorizer", None)
    monkeypatch.setattr(classify, "_model", None)
    assert client.post("/api/predict", json={"message": "test"}).status_code == 503


def test_placeholders_are_shown_in_readable_form():
    assert classify._readable("__url__ now") == "[link] now"
    assert classify._readable("call __phone__") == "call [phone number]"


@requires_model
def test_prediction_returns_a_label_and_is_stored(app, client):
    body = client.post("/api/predict", json={"message": "URGENT: your account is blocked, verify at cutt.ly/x"}).get_json()
    assert body["label"] in ("legitimate", "scam", "spam")
    assert 0 < body["confidence"] <= 1
    assert all("__" not in t["word"] for t in body["trigger_words"])
    with app.app_context():
        record = db.session.get(ClassifiedMessage, body["classification_id"])
        assert "__url__" in record.clean_message  # cleaned the same way as the training data
        assert record.processing_time_ms is not None and record.model_version_id is not None


@requires_model
def test_feedback_is_recorded(client):
    cid = client.post("/api/predict", json={"message": "hello"}).get_json()["classification_id"]
    assert client.post(f"/api/feedback/{cid}", json={"correct": True}).status_code == 200


@requires_model
@requires_dataset
def test_api_matches_the_evaluated_pipeline_on_real_messages(client):
    """The served model must give the same answers the evaluation measured."""
    vectorizer = joblib.load(MODELS_DIR / "tfidf_vectorizer.pkl")
    model = joblib.load(MODELS_DIR / "logreg_model.pkl")
    real = pd.read_csv(DATASET_CSV)
    real = real[real["split"] == "real_eval"]
    mismatches = []
    for _, row in real.iterrows():
        api = client.post("/api/predict", json={"message": row["message"]}).get_json()["label"]
        expected = model.predict(vectorizer.transform([row["clean_message"]]))[0]
        if api != expected:
            mismatches.append(row["id"])
    assert mismatches == []
