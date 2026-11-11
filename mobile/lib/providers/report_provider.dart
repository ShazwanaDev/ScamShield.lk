import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/pending_report.dart';
import '../services/api_service.dart';
import '../services/my_reports_service.dart';
import '../services/report_queue_service.dart';
import 'my_reports_provider.dart';
import 'connectivity_provider.dart';

enum ReportStatus { idle, submitting, done, queued, error }

class ReportState {
  final ReportStatus status;
  final String? error;

  const ReportState({this.status = ReportStatus.idle, this.error});

  ReportState copyWith({ReportStatus? status, String? error}) =>
      ReportState(status: status ?? this.status, error: error);
}

class ReportNotifier extends StateNotifier<ReportState> {
  final Ref ref;
  ReportNotifier(this.ref) : super(const ReportState());

  Future<void> submit(String message, String? category) async {
    state = state.copyWith(status: ReportStatus.submitting, error: null);

    final isOnline = ref.read(connectivityProvider).valueOrNull ?? true;
    if (!isOnline) {
      await _queue(message, category);
      return;
    }

    try {
      await ApiService.submitReport(message, category);
      await MyReportsService.add(MyReport(
        id: '${DateTime.now().microsecondsSinceEpoch}',
        message: message,
        category: category,
        status: 'pending',
        submittedAt: DateTime.now(),
        note: MyReportsService.pendingNote,
      ));
      ref.invalidate(myReportsProvider);
      state = state.copyWith(status: ReportStatus.done);
    } catch (_) {
      // Network call failed even though the link-layer check said "online"
      // (e.g. API unreachable): queue it rather than losing the report.
      await _queue(message, category);
    }
  }

  Future<void> _queue(String message, String? category) async {
    final pending = PendingReport.create(message, category);
    await ReportQueueService.enqueue(pending);
    await MyReportsService.add(MyReport(
      id: pending.id,
      message: message,
      category: category,
      status: 'queued',
      submittedAt: pending.queuedAt,
      note: MyReportsService.queuedNote,
    ));
    ref.invalidate(myReportsProvider);
    state = state.copyWith(status: ReportStatus.queued);
  }

  void reset() => state = const ReportState();
}

final reportProvider = StateNotifierProvider.autoDispose<ReportNotifier, ReportState>(
  (ref) => ReportNotifier(ref),
);

final pendingReportCountProvider = FutureProvider<int>((ref) => ReportQueueService.count());
