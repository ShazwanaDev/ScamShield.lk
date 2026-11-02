"""Admin sign-in: the passphrase is checked on the server and tokens guard moderation."""
from itsdangerous import URLSafeTimedSerializer

from conftest import ADMIN_PASSWORD
from routes import auth


def test_sign_in_is_off_without_a_configured_password(app, client):
    app.config["ADMIN_PASSWORD"] = ""
    assert client.post("/api/admin/login", json={"passphrase": "anything"}).status_code == 503


def test_wrong_and_malformed_passphrases_are_refused(client):
    assert client.post("/api/admin/login", json={"passphrase": "wrong"}).status_code == 401
    assert client.post("/api/admin/login", json={"passphrase": 123}).status_code == 401
    assert client.post("/api/admin/login", json=["x"]).status_code == 401
    assert client.post("/api/admin/login", data="nope", content_type="text/plain").status_code == 401


def test_right_passphrase_returns_a_token_that_opens_moderation(client):
    body = client.post("/api/admin/login", json={"passphrase": ADMIN_PASSWORD}).get_json()
    assert body["expires_in"] == auth.TOKEN_MAX_AGE
    headers = {"Authorization": f"Bearer {body['token']}"}
    assert client.get("/api/moderate", headers=headers).status_code == 200


def test_moderation_refuses_missing_garbage_and_unprefixed_tokens(client, admin_headers):
    assert client.get("/api/moderate").status_code == 401
    assert client.get("/api/moderate", headers={"Authorization": "Bearer abc.def"}).status_code == 401
    raw_token = admin_headers["Authorization"].split(" ", 1)[1]
    assert client.get("/api/moderate", headers={"Authorization": raw_token}).status_code == 401


def test_forged_and_wrong_role_tokens_are_refused(app, client):
    forged = URLSafeTimedSerializer("another-secret", salt=auth.TOKEN_SALT).dumps({"role": "admin"})
    assert client.get("/api/moderate", headers={"Authorization": f"Bearer {forged}"}).status_code == 401
    user = URLSafeTimedSerializer(app.config["SECRET_KEY"], salt=auth.TOKEN_SALT).dumps({"role": "user"})
    assert client.get("/api/moderate", headers={"Authorization": f"Bearer {user}"}).status_code == 401


def test_expired_token_is_refused(client, admin_headers, monkeypatch):
    monkeypatch.setattr(auth, "TOKEN_MAX_AGE", -1)  # every token now counts as expired
    assert client.get("/api/moderate", headers=admin_headers).status_code == 401


def test_repeated_wrong_guesses_lock_sign_in(client):
    for _ in range(auth.MAX_FAILED_LOGINS):
        client.post("/api/admin/login", json={"passphrase": "guess"})
    assert client.post("/api/admin/login", json={"passphrase": ADMIN_PASSWORD}).status_code == 429
