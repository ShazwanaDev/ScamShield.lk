"""
/api/admin/login: exchanges the admin passphrase for a signed, short-lived
token. Moderation routes require that token in an "Authorization: Bearer"
header.

The passphrase only exists on the server (the ADMIN_PASSWORD setting), so
nothing secret ships inside the web app's JavaScript.
"""
import hmac
import time
from collections import defaultdict, deque
from functools import wraps

from flask import Blueprint, current_app, jsonify, request
from itsdangerous import BadSignature, URLSafeTimedSerializer

auth_bp = Blueprint("auth", __name__)

TOKEN_MAX_AGE = 8 * 60 * 60  # an admin session lasts a working day
TOKEN_SALT = "admin-session"
MAX_FAILED_LOGINS = 5
FAILED_LOGIN_WINDOW = 15 * 60

# Recent failed attempts per client address. This lives in memory, so it is
# per process and resets on restart, which is enough to slow down guessing on
# one small server but is not a substitute for a proper rate limiter.
_failed_logins = defaultdict(deque)


def _serializer():
    return URLSafeTimedSerializer(current_app.config["SECRET_KEY"], salt=TOKEN_SALT)


def _too_many_failures(client):
    attempts = _failed_logins[client]
    cutoff = time.time() - FAILED_LOGIN_WINDOW
    while attempts and attempts[0] < cutoff:
        attempts.popleft()
    return len(attempts) >= MAX_FAILED_LOGINS


@auth_bp.post("/admin/login")
def admin_login():
    configured = current_app.config.get("ADMIN_PASSWORD")
    if not configured:
        return jsonify({"error": "admin access is not configured on this server (set ADMIN_PASSWORD)"}), 503

    client = request.remote_addr or "unknown"
    if _too_many_failures(client):
        return jsonify({"error": "too many failed attempts, try again in 15 minutes"}), 429

    payload = request.get_json(force=True, silent=True)
    passphrase = payload.get("passphrase") if isinstance(payload, dict) else None
    # compare_digest takes the same time however many characters match, so the
    # response time doesn't leak how close a guess was.
    if not isinstance(passphrase, str) or not hmac.compare_digest(passphrase.encode(), configured.encode()):
        _failed_logins[client].append(time.time())
        return jsonify({"error": "incorrect passphrase"}), 401

    _failed_logins.pop(client, None)
    token = _serializer().dumps({"role": "admin"})
    return jsonify({"token": token, "expires_in": TOKEN_MAX_AGE})


def require_admin(view):
    """Answer 401 unless the request carries a valid, unexpired admin token."""
    @wraps(view)
    def wrapped(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        token = header[len("Bearer "):] if header.startswith("Bearer ") else ""
        try:
            data = _serializer().loads(token, max_age=TOKEN_MAX_AGE) if token else None
        except BadSignature:  # also covers an expired token
            data = None
        if not isinstance(data, dict) or data.get("role") != "admin":
            return jsonify({"error": "admin sign-in required"}), 401
        return view(*args, **kwargs)
    return wrapped
