import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/api_service.dart';

enum ReportStatus { idle, submitting, done, error }

class ReportState {
  final ReportStatus status;
  final String? error;

  const ReportState({this.status = ReportStatus.idle, this.error});

  ReportState copyWith({ReportStatus? status, String? error}) =>
      ReportState(status: status ?? this.status, error: error);
}

class ReportNotifier extends StateNotifier<ReportState> {
  ReportNotifier() : super(const ReportState());

  Future<void> submit(String message, String? category) async {
    state = state.copyWith(status: ReportStatus.submitting, error: null);
    try {
      await ApiService.submitReport(message, category);
      state = state.copyWith(status: ReportStatus.done);
    } catch (e) {
      state = state.copyWith(status: ReportStatus.error, error: 'Something went wrong. Try again.');
    }
  }

  void reset() => state = const ReportState();
}

final reportProvider = StateNotifierProvider.autoDispose<ReportNotifier, ReportState>(
  (ref) => ReportNotifier(),
);
