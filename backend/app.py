"""
ScamShield LK Flask backend entry point.

Run with:
    flask --app app run --debug
"""
import os
from flask import Flask, jsonify
from flask_cors import CORS

from models.db import db
from routes.classify import classify_bp
from routes.community import community_bp


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
        "DATABASE_URL", "postgresql://scamshield:scamshield@localhost:5432/scamshield"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["REDIS_URL"] = os.environ.get("REDIS_URL", "redis://localhost:6379/0")

    db.init_app(app)

    app.register_blueprint(classify_bp, url_prefix="/api")
    app.register_blueprint(community_bp, url_prefix="/api")

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"})

    with app.app_context():
        db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
