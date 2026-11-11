import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

/// One report the user sent, as they see it in "My reports".
///
/// The backend's ScamReport rows aren't linked to a user yet (see
/// backend/models/db.py), so, like the web app's lib/myReports.js, the app keeps
/// its own record of what this device submitted.
class MyReport {
  final String id;
  final String message;
  final String? category;

  /// 'queued' (waiting for a connection), 'pending', 'approved' or 'rejected'.
  final String status;
  final DateTime submittedAt;
  final String note;

  const MyReport({
    required this.id,
    required this.message,
    required this.category,
    required this.status,
    required this.submittedAt,
    required this.note,
  });

  MyReport copyWith({String? status, String? note}) => MyReport(
        id: id,
        message: message,
        category: category,
        status: status ?? this.status,
        submittedAt: submittedAt,
        note: note ?? this.note,
      );

  factory MyReport.fromJson(Map<String, dynamic> json) => MyReport(
        id: json['id'] as String,
        message: json['message'] as String,
        category: json['category'] as String?,
        status: json['status'] as String? ?? 'pending',
        submittedAt: DateTime.parse(json['submitted_at'] as String),
        note: json['note'] as String? ?? '',
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'message': message,
        'category': category,
        'status': status,
        'submitted_at': submittedAt.toIso8601String(),
        'note': note,
      };
}

class MyReportsService {
  static const _key = 'scamshield_my_reports';

  static const pendingNote = 'Awaiting moderator review.';
  static const queuedNote = 'Saved on this device. It will be sent when you are back online.';

  static Future<List<MyReport>> load() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getStringList(_key) ?? [];
    final reports = raw.map((e) => MyReport.fromJson(jsonDecode(e) as Map<String, dynamic>)).toList();
    reports.sort((a, b) => b.submittedAt.compareTo(a.submittedAt));
    return reports;
  }

  static Future<void> _save(List<MyReport> reports) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList(_key, reports.map((r) => jsonEncode(r.toJson())).toList());
  }

  static Future<void> add(MyReport report) async {
    final reports = await load();
    reports.add(report);
    await _save(reports);
  }

  /// Adds reports whose id isn't stored yet (used by the demo account).
  static Future<void> importAll(List<MyReport> incoming) async {
    final reports = await load();
    final ids = reports.map((r) => r.id).toSet();
    reports.addAll(incoming.where((r) => !ids.contains(r.id)));
    await _save(reports);
  }

  /// A queued report reached the server: it now waits for a moderator.
  static Future<void> markSent(String id) async {
    final reports = await load();
    await _save([
      for (final r in reports) r.id == id && r.status == 'queued' ? r.copyWith(status: 'pending', note: pendingNote) : r,
    ]);
  }

  static Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_key);
  }
}
