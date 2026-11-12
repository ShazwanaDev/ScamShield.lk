"""Feedback validation and the JSON answer for an unknown classification."""
import pytest

from conftest import requires_model
from models.db import db, ClassifiedMessage


def _stored_check(app):
    """A stored classification, created directly so these tests don't need the model files."""
    with app.app_context():
        record = ClassifiedMessage(message_text="hello", clean_message="hello", predicted_label="legitimate",
                                   confidence_score=0.7)
        db.session.add(record)
        db.session.commit()
        return record.id


def _feedback(app, cid):
    with app.app_context():
        return db.session.get(ClassifiedMessage, cid).user_feedback


def test_feedback_records_true_and_false(app, client):
    cid = _stored_check(app)
    assert client.post(f"/api/feedback/{cid}", json={"correct": False}).status_code == 200
    assert _feedback(app, cid) == "incorrect"
    assert client.post(f"/api/feedback/{cid}", json={"correct": True}).status_code == 200
    assert _feedback(app, cid) == "correct"


@pytest.mark.parametrize("body", [{"correct": "yes"}, {"right": True}, [True], None])
def test_feedback_rejects_a_body_without_a_boolean(app, client, body):
    cid = _stored_check(app)
    response = client.post(f"/api/feedback/{cid}", json=body)
    assert response.status_code == 400
    assert "error" in response.get_json()
    assert _feedback(app, cid) is None  # nothing was recorded


def test_feedback_rejects_malformed_json(app, client):
    cid = _stored_check(app)
    response = client.post(f"/api/feedback/{cid}", data="not json", content_type="application/json")
    assert response.status_code == 400
    assert response.get_json()["error"]


def test_unknown_classification_is_a_json_404(client):
    response = client.post("/api/feedback/999999", json={"correct": True})
    assert response.status_code == 404
    assert response.get_json() == {"error": "classification not found"}


@requires_model
def test_feedback_after_a_real_prediction(client):
    cid = client.post("/api/predict", json={"message": "hello"}).get_json()["classification_id"]
    assert client.post(f"/api/feedback/{cid}", json={"correct": True}).get_json() == {"status": "recorded"}
