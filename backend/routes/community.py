"""
/api/submit-sms   — user submits a suspected scam message into the moderation queue
/api/moderate      — admin approves/rejects queued reports
/api/stats         — public counters + weekly category breakdown for the dashboard
"""
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from sqlalchemy import func

from models.db import db, ScamReport, ScamCategory

community_bp = Blueprint("community", __name__)


@community_bp.post("/submit-sms")
def submit_sms():
    payload = request.get_json(force=True)
    message = payload.get("message", "").strip()
    category_name = payload.get("category")

    if not message:
        return jsonify({"error": "message field is required"}), 400

    category = None
    if category_name:
        category = ScamCategory.query.filter_by(name=category_name).first()

    report = ScamReport(
        message_text=message,
        category_id=category.id if category else None,
        status="pending",
    )
    db.session.add(report)
    db.session.commit()

    return jsonify({"status": "submitted", "report_id": report.id}), 201


@community_bp.get("/moderate")
def list_pending():
    """Admin: list the moderation queue."""
    pending = ScamReport.query.filter_by(status="pending").order_by(ScamReport.submitted_at).all()
    return jsonify([
        {"id": r.id, "message": r.message_text, "submitted_at": r.submitted_at.isoformat()}
        for r in pending
    ])


@community_bp.post("/moderate/<int:report_id>")
def moderate_report(report_id):
    """
    Admin approve/reject decision branch — this is the piece that was missing
    from the community reporting flowchart; make sure the diagram gets the
    same approve/reject branch added before submission.
    """
    payload = request.get_json(force=True)
    decision = payload.get("decision")  # "approve" or "reject"

    if decision not in ("approve", "reject"):
        return jsonify({"error": "decision must be 'approve' or 'reject'"}), 400

    report = ScamReport.query.get_or_404(report_id)
    report.status = "approved" if decision == "approve" else "rejected"
    report.reviewed_at = datetime.utcnow()
    db.session.commit()

    # NOTE: on approval, a separate offline/batch job should append this message
    # (labeled source_type=real, source_note="community-approved report") to the
    # training dataset CSVs — do not auto-retrain synchronously in the request path.

    return jsonify({"status": report.status})


@community_bp.get("/stats")
def stats():
    total_reports = ScamReport.query.filter_by(status="approved").count()

    week_ago = datetime.utcnow() - timedelta(days=7)
    weekly_by_category = (
        db.session.query(ScamCategory.name, func.count(ScamReport.id))
        .join(ScamReport, ScamReport.category_id == ScamCategory.id)
        .filter(ScamReport.status == "approved", ScamReport.submitted_at >= week_ago)
        .group_by(ScamCategory.name)
        .all()
    )

    return jsonify({
        "total_community_approved_reports": total_reports,
        "weekly_category_breakdown": [{"category": c, "count": n} for c, n in weekly_by_category],
    })
