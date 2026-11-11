"""
Optional demo data for presentations: approved community reports, so the
dashboards' community stats (GET /api/stats) have something to show.

NOT run automatically (entrypoint.sh only runs scripts.seed). Run it yourself:

    python -m scripts.seed_demo_reports            # add once (skips if already present)
    python -m scripts.seed_demo_reports --remove   # delete exactly these demo rows

Inside Docker (rebuild once first so the image contains this script):
    docker compose up -d --build
    docker compose exec backend python -m scripts.seed_demo_reports

These are community reports only. They are never added to the training data
(approved reports aren't auto-appended to the ML datasets, see community.py).
Phone numbers and links are safe placeholders.
"""
import sys
from datetime import datetime, timedelta

from app import app
from models.db import db, ScamCategory, ScamReport

DEMO_MESSAGES = {
    "otp_fraud": [
        "Your account will be suspended within 2 hours. Verify now by sharing the 6-digit OTP sent to your phone.",
        "ඔබගේ ගිණුම තහවුරු කිරීමට ලැබුණු OTP අංකය අපට එවන්න. නැතිනම් ගිණුම අද අවහිර වේ.",
        "Machan, oyage SIM eka ada block wenawa. OTP eka mata ewanna, mama fix karala dennam.",
    ],
    "lottery_scam": [
        "සුභ පැතුම්! ඔබගේ අංකයට රු. 2,000,000ක ත්‍යාගයක් දිනා ඇත. ලබා ගැනීමට රු. 5,000ක reload එකක් [PHONE REDACTED] වෙත එවන්න.",
        "Congratulations! You won an iPhone 15 in our anniversary draw. Claim within 1 hour: hxxps://claim-prize.example",
    ],
    "bank_transfer_scam": [
        "உங்கள் வங்கி கணக்கு இன்று முடக்கப்படும். KYC புதுப்பிக்க இந்த இணைப்பை கிளிக் செய்யவும்: hxxps://kyc-update.example",
        "Unga bank account la problem iruku. Udane intha link la login pannunga: hxxps://secure-login.example",
    ],
    "delivery_scam": [
        "Your parcel is held at customs. Pay Rs. 250 clearance fee within 24 hours to avoid return: hxxps://parcel-release.example",
    ],
    "job_scam": [
        "Overseas job offer in Dubai, salary Rs. 450,000 a month. Pay Rs. 15,000 registration fee today to confirm your visa slot.",
    ],
    "police_impersonation": [
        "This is the Police Cyber Unit. A case has been filed against your NIC. Pay the fine today to avoid arrest. Call [PHONE REDACTED].",
    ],
    "loan_scam": [
        "Instant loan approved! Rs. 300,000 with no documents. Pay Rs. 3,500 processing fee to release the funds.",
    ],
    "subscription_scam": [
        "You are now subscribed to a premium content service at Rs. 30 a day. Reply STOP within 1 hour or the charge continues.",
    ],
}

# Approved reports in the last 7 days per category (drives the weekly chart),
# plus a few older ones so the all-time total is larger than the week.
THIS_WEEK = {
    "otp_fraud": 9,
    "lottery_scam": 6,
    "bank_transfer_scam": 5,
    "delivery_scam": 4,
    "job_scam": 3,
    "police_impersonation": 2,
    "loan_scam": 2,
    "subscription_scam": 1,
}
OLDER = {"otp_fraud": 4, "lottery_scam": 3, "bank_transfer_scam": 2, "delivery_scam": 2, "job_scam": 1}

ALL_TEXTS = {text for texts in DEMO_MESSAGES.values() for text in texts}


def _demo_query():
    return ScamReport.query.filter(
        ScamReport.message_text.in_(ALL_TEXTS),
        ScamReport.status == "approved",
        ScamReport.user_id.is_(None),
    )


def remove():
    with app.app_context():
        deleted = _demo_query().delete(synchronize_session=False)
        db.session.commit()
        print(f"Removed {deleted} demo reports.")


def run():
    with app.app_context():
        existing = _demo_query().count()
        if existing:
            print(f"Demo reports already present ({existing}). Nothing added. Use --remove first to recreate them.")
            return

        categories = {c.name: c for c in ScamCategory.query.all()}
        missing = [name for name in DEMO_MESSAGES if name not in categories]
        if missing:
            print(f"Missing scam categories {missing}. Run `python -m scripts.seed` first.")
            sys.exit(1)

        now = datetime.utcnow()
        added = 0
        for slot, (counts, min_days, span_days) in enumerate([(THIS_WEEK, 0, 6), (OLDER, 9, 30)]):
            for name, count in counts.items():
                texts = DEMO_MESSAGES[name]
                for i in range(count):
                    # Spread deterministically across the window, at varied hours.
                    days = min_days + ((i * 5 + slot * 3 + len(name)) % (span_days + 1))
                    submitted = now - timedelta(days=days, hours=(i * 7 + len(name)) % 20 + 1)
                    db.session.add(
                        ScamReport(
                            message_text=texts[i % len(texts)],
                            category_id=categories[name].id,
                            predicted_label="scam",
                            confirmed_label="scam",
                            status="approved",
                            submitted_at=submitted,
                            reviewed_at=min(submitted + timedelta(hours=3), now),
                        )
                    )
                    added += 1
        db.session.commit()
        print(f"Added {added} approved demo reports ({sum(THIS_WEEK.values())} in the last 7 days).")


if __name__ == "__main__":
    remove() if "--remove" in sys.argv[1:] else run()
