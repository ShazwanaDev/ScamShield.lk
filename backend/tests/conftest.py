"""
Shared fixtures for the backend tests. Each test gets a fresh Flask app on its
own SQLite file, seeded with the scam categories and a model version, so tests
never touch PostgreSQL or each other's data.
"""
import os
import pathlib
import secrets
import sys

import pytest

BACKEND = pathlib.Path(__file__).resolve().parents[1]
REPO = BACKEND.parent
sys.path.insert(0, str(BACKEND))

# app.py builds an app at import time, so it needs a usable database URL first.
os.environ.setdefault("DATABASE_URL", "sqlite://")

from app import create_app  # noqa: E402
from models.db import db, ModelVersion, ScamCategory  # noqa: E402
from routes import auth  # noqa: E402
from scripts.seed import CATEGORIES, DEFAULT_MODEL_VERSION  # noqa: E402

ADMIN_PASSWORD = secrets.token_urlsafe(16)  # throwaway, made fresh for every test run
MODELS_DIR = REPO / "ml" / "models"
DATASET_CSV = REPO / "ml" / "data" / "processed" / "dataset.csv"


@pytest.fixture
def app(tmp_path, monkeypatch):
    monkeypatch.setenv("DATABASE_URL", f"sqlite:///{(tmp_path / 'test.db').as_posix()}")
    monkeypatch.setenv("ADMIN_PASSWORD", ADMIN_PASSWORD)
    monkeypatch.setenv("SECRET_KEY", "test-secret")
    flask_app = create_app()
    with flask_app.app_context():
        db.create_all()
        for name, description in CATEGORIES:
            db.session.add(ScamCategory(name=name, description=description))
        db.session.add(ModelVersion(**DEFAULT_MODEL_VERSION))
        db.session.commit()
    auth._failed_logins.clear()
    yield flask_app
    with flask_app.app_context():
        db.session.remove()
        db.engine.dispose()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def admin_headers(client):
    token = client.post("/api/admin/login", json={"passphrase": ADMIN_PASSWORD}).get_json()["token"]
    return {"Authorization": f"Bearer {token}"}


requires_model = pytest.mark.skipif(
    not (MODELS_DIR / "logreg_model.pkl").exists(),
    reason="trained model not found; run the ml/ pipeline first",
)
requires_dataset = pytest.mark.skipif(
    not DATASET_CSV.exists(),
    reason="private dataset not found; it only exists on the project owner's machine",
)
