"""Community reports: submission checks, the moderation queue and the public stats."""
import time

import pytest

from models.db import db, ScamReport


def submit(client, message, category=None):
    body = {"message": message, **({"category": category} if category else {})}
    response = client.post("/api/submit-sms", json=body)
    assert response.status_code == 201
    return response.get_json()["report_id"]


@pytest.mark.parametrize("kwargs", [
    dict(json=["x"]),
    dict(data="hello", content_type="text/plain"),
    dict(json={"message": 5}),
    dict(json={"message": "   "}),
    dict(json={"message": "a" * 2001}),
    dict(json={"message": "hi", "category": 7}),
])
def test_bad_reports_get_a_400_with_a_json_error(client, kwargs):
    response = client.post("/api/submit-sms", **kwargs)
    assert response.status_code == 400
    assert "error" in response.get_json()


def test_categories_resolve_and_unknown_ones_are_kept_without_one(client, admin_headers):
    job = submit(client, "Overseas job, pay the registration fee", "job_scam")
    unknown = submit(client, "From an older app version", "not_a_category")
    rows = {r["id"]: r for r in client.get("/api/moderate", headers=admin_headers).get_json()}
    assert rows[job]["category"] == "job_scam"
    assert rows[unknown]["category"] is None


def test_queue_is_oldest_first_and_decided_lists_are_newest_first(client, admin_headers):
    ids = []
    for text in ("first", "second", "third"):
        ids.append(submit(client, text))
        time.sleep(0.01)
    assert [r["id"] for r in client.get("/api/moderate", headers=admin_headers).get_json()] == ids

    client.post(f"/api/moderate/{ids[0]}", json={"decision": "approve"}, headers=admin_headers)
    time.sleep(0.01)
    client.post(f"/api/moderate/{ids[2]}", json={"decision": "approve"}, headers=admin_headers)
    approved = client.get("/api/moderate?status=approved", headers=admin_headers).get_json()
    assert [r["id"] for r in approved] == [ids[2], ids[0]]
    assert approved[0]["reviewed_at"].endswith("Z")  # UTC, so browsers show local time correctly


def test_a_decision_is_final(client, admin_headers):
    report = submit(client, "Share your OTP")
    assert client.post(f"/api/moderate/{report}", json={"decision": "approve"}, headers=admin_headers).status_code == 200
    second = client.post(f"/api/moderate/{report}", json={"decision": "reject"}, headers=admin_headers)
    assert second.status_code == 409
    assert second.get_json()["status"] == "approved"


def test_bad_moderation_requests(client, admin_headers):
    report = submit(client, "x")
    assert client.get("/api/moderate?status=bogus", headers=admin_headers).status_code == 400
    assert client.post(f"/api/moderate/{report}", json={"decision": "maybe"}, headers=admin_headers).status_code == 400
    assert client.post("/api/moderate/99999", json={"decision": "approve"}, headers=admin_headers).status_code == 404


def test_decisions_need_the_admin_token(app, client):
    report = submit(client, "x")
    assert client.post(f"/api/moderate/{report}", json={"decision": "approve"}).status_code == 401
    with app.app_context():
        assert db.session.get(ScamReport, report).status == "pending"


def test_public_stats_count_only_approved_reports(client, admin_headers):
    approved = submit(client, "OTP scam", "otp_fraud")
    rejected = submit(client, "not really", "otp_fraud")
    submit(client, "still pending", "otp_fraud")
    client.post(f"/api/moderate/{approved}", json={"decision": "approve"}, headers=admin_headers)
    client.post(f"/api/moderate/{rejected}", json={"decision": "reject"}, headers=admin_headers)

    stats = client.get("/api/stats").get_json()  # public: no token
    assert stats["total_community_approved_reports"] == 1
    assert stats["weekly_category_breakdown"] == [{"category": "otp_fraud", "count": 1}]
