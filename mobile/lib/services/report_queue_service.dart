import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/pending_report.dart';
import 'api_service.dart';

/// Holds community reports submitted while the device has no connectivity
/// (see providers/connectivity_provider.dart) so they aren't lost — they're
/// flushed to POST /api/submit-sms as soon as connectivity returns.
class ReportQueueService {
  static const _key = 'scamshield_pending_reports';

  static Future<void> enqueue(PendingReport report) async {
    final prefs = await SharedPreferences.getInstance();
    final existing = prefs.getStringList(_key) ?? [];
    existing.add(jsonEncode(report.toJson()));
    await prefs.setStringList(_key, existing);
  }

  static Future<List<PendingReport>> loadAll() async {
    final prefs = await SharedPreferences.getInstance();
    final existing = prefs.getStringList(_key) ?? [];
    return existing.map((e) => PendingReport.fromJson(jsonDecode(e) as Map<String, dynamic>)).toList();
  }

  static Future<int> count() async => (await loadAll()).length;

  /// Attempts to submit every queued report; leaves failures queued for the
  /// next retry rather than dropping them.
  static Future<int> flush() async {
    final pending = await loadAll();
    if (pending.isEmpty) return 0;

    final stillPending = <PendingReport>[];
    var flushed = 0;
    for (final report in pending) {
      try {
        await ApiService.submitReport(report.message, report.category);
        flushed++;
      } catch (_) {
        stillPending.add(report);
      }
    }

    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList(_key, stillPending.map((r) => jsonEncode(r.toJson())).toList());
    return flushed;
  }
}
