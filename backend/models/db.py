"""
Database models — mirrors the ERD (Chen notation): Users, ClassifiedMessages,
ScamReports, ModelVersions, ScamCategories.
"""
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.String(128), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    messages = db.relationship("ClassifiedMessage", backref="user", lazy=True)
    reports = db.relationship("ScamReport", backref="user", lazy=True)


class ScamCategory(db.Model):
    __tablename__ = "scam_categories"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, nullable=False)
    description = db.Column(db.Text)


class ModelVersion(db.Model):
    __tablename__ = "model_versions"
    id = db.Column(db.Integer, primary_key=True)
    version_name = db.Column(db.String(64), nullable=False)
    model_type = db.Column(db.String(32))  # tfidf_logreg / tfidf_svm / mbert
    dataset_size = db.Column(db.Integer)  # derived attribute
    f1_score = db.Column(db.Float)
    auc_roc = db.Column(db.Float)
    trained_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=False)


class ClassifiedMessage(db.Model):
    __tablename__ = "classified_messages"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    message_text = db.Column(db.Text, nullable=False)
    message_length = db.Column(db.Integer)  # derived attribute
    predicted_label = db.Column(db.String(16))
    confidence_score = db.Column(db.Float)
    model_version_id = db.Column(db.Integer, db.ForeignKey("model_versions.id"))
    user_feedback = db.Column(db.String(16), nullable=True)  # correct/incorrect
    classified_at = db.Column(db.DateTime, default=datetime.utcnow)


class ScamReport(db.Model):
    __tablename__ = "scam_reports"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    message_text = db.Column(db.Text, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("scam_categories.id"), nullable=True)
    status = db.Column(db.String(16), default="pending")  # pending/approved/rejected
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_at = db.Column(db.DateTime, nullable=True)
