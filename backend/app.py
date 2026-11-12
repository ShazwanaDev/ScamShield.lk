"""
ScamShield LK Flask backend entry point.

Run with:
    flask --app app run --debug
"""
import logging
import os
import secrets

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from werkzeug.exceptions import HTTPException

from models.db import db
from routes.auth import auth_bp
from routes.classify import classify_bp
from routes.community import community_bp

migrate = Migrate()
log = logging.getLogger("scamshield.api")


def register_error_handlers(app):
    """Every error leaves the API as JSON, the same shape the routes use."""

    @app.errorhandler(HTTPException)
    def http_error(err):
        return jsonify({"error": err.description}), err.code

    @app.errorhandler(Exception)
    def unexpected_error(err):
        # Undo any half-finished database work, record the details for the
        # developer, and give the client a short message without internals.
        db.session.rollback()
        log.exception("unhandled error on %s %s", request.method, request.path)
        return jsonify({"error": "the server could not complete the request"}), 500


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
        "DATABASE_URL", "postgresql://scamshield:scamshield@localhost:5432/scamshield"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["REDIS_URL"] = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
    # Signs admin session tokens. Set it in any shared deployment: the random
    # fallback signs everyone out on every restart, and differs between workers.
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY") or secrets.token_hex(32)
    # Checked on the server only. Left empty, admin sign-in is switched off.
    app.config["ADMIN_PASSWORD"] = os.environ.get("ADMIN_PASSWORD", "")

    db.init_app(app)
    migrate.init_app(app, db)

    register_error_handlers(app)

    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(classify_bp, url_prefix="/api")
    app.register_blueprint(community_bp, url_prefix="/api")

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"})

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
