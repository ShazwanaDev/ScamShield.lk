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

MODERATION_STATUSES = ("pending", "approved", "rejected")
# Enough for a moderator's screen; a queue longer than this needs paging first.
LIST_LIMIT = 200


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
def list_reports():
    """
    Admin: list reports with one moderation status, pending by default
    (?status=pending|approved|rejected). The queue is oldest first so nothing
    waits forever; decided reports are newest decision first.
    """
    status = request.args.get("status", "pending")
    if status not in MODERATION_STATUSES:
        return jsonify({"error": "status must be pending, approved or rejected"}), 400

    order = ScamReport.submitted_at.asc() if status == "pending" else ScamReport.reviewed_at.desc()
    reports = ScamReport.query.filter_by(status=status).order_by(order).limit(LIST_LIMIT).all()
    return jsonify([_report_json(r) for r in reports])


def _utc_iso(moment):
    # Times are stored as naive UTC (datetime.utcnow). The trailing Z tells
    # browsers it is UTC, otherwise they read it as local time.
    return moment.isoformat() + "Z" if moment else None


def _report_json(report):
    return {
        "id": report.id,
        "message": report.message_text,
        "category": report.category.name if report.category else None,
        "status": report.status,
        "submitted_at": _utc_iso(report.submitted_at),
        "reviewed_at": _utc_iso(report.reviewed_at),
    }


@community_bp.post("/moderate/<int:report_id>")
def moderate_report(report_id):
    """
    Admin approve/reject decision branch — this is the piece that was missing
    from the community reporting flowchart; make sure the diagram gets the
    same approve/reject branch added before submission.
    """
    payload = request.get_json(force=True, silent=True)
    decision = payload.get("decision") if isinstance(payload, dict) else None  # "approve" or "reject"

    if decision not in ("approve", "reject"):
        return jsonify({"error": "decision must be 'approve' or 'reject'"}), 400

    report = db.session.get(ScamReport, report_id)
    if report is None:
        return jsonify({"error": "report not found"}), 404
    # A decision is final, so a second click or a second moderator can't
    # silently flip an approved report back out of the public stats.
    if report.status != "pending":
        return jsonify({"error": f"report was already {report.status}", "status": report.status}), 409

    report.status = "approved" if decision == "approve" else "rejected"
    report.reviewed_at = datetime.utcnow()
    db.session.commit()

    # NOTE: on approval, a separate offline/batch job should append this message
    # (labeled source_type=real, source_note="community-approved report") to the
    # training dataset CSVs — do not auto-retrain synchronously in the request path.

    return jsonify(_report_json(report))


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
