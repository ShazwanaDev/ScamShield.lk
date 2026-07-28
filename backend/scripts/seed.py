"""
Seeds reference data that the app assumes exists but nothing creates automatically:

- scam_categories: /api/submit-sms looks up a category by name and silently
  drops the association if no row matches, so this table must be populated
  before category-tagged reports can work.
- model_versions: /api/predict only stamps a classification with a
  model_version_id if an active row exists; without one, every classification
  is recorded with a null model version.

Run after migrations are applied:
    flask --app app shell -c "from scripts.seed import run; run()"
or:
    python -m scripts.seed
"""
from app import app
from models.db import db, ScamCategory, ModelVersion

# Mirrors web/src/data/scamCategories.js — `name` here is the slug used as the
# wire-format `category` value in /api/submit-sms (see web/src/lib/api.js
# REPORT_CATEGORIES) and web/src/data/scamCategories.js SCAM_CATEGORIES.
CATEGORIES = [
    ("otp_fraud", "OTP fraud — tricking someone into sharing a one-time password or PIN."),
    ("lottery_scam", "Lottery / prize — a fake win that asks for a fee or bank details to 'release' it."),
    ("bank_transfer_scam", "Banking / bank transfer — impersonating a bank to redirect or extract funds."),
    ("delivery_scam", "Delivery / courier — a fake parcel/customs fee or tracking link."),
    ("loan_scam", "Loan scam — upfront 'processing fees' for a loan that never arrives."),
    ("job_scam", "Job / foreign employment — fake job offers that charge fees or harvest documents."),
    ("police_impersonation", "Police / government — impersonating law enforcement or officials to intimidate victims."),
    ("subscription_scam", "Subscription / reload — unauthorised recurring charges or fake reload offers."),
    ("other", "Other / uncategorised — reports that don't fit an existing category."),
]

DEFAULT_MODEL_VERSION = dict(
    version_name="baseline-v1",
    algorithm="tfidf_logreg",
    is_active=True,
)


def run():
    with app.app_context():
        for name, description in CATEGORIES:
            if not ScamCategory.query.filter_by(name=name).first():
                db.session.add(ScamCategory(name=name, description=description))

        if not ModelVersion.query.filter_by(is_active=True).first():
            db.session.add(ModelVersion(**DEFAULT_MODEL_VERSION))

        db.session.commit()
        print(f"Seeded {ScamCategory.query.count()} scam categories.")
        print(f"Active model version: {ModelVersion.query.filter_by(is_active=True).first().version_name}")


if __name__ == "__main__":
    run()
