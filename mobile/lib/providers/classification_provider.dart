import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/api_service.dart';
import '../services/history_service.dart';

class ClassificationResult {
  final String label;
  final double confidence;
  final List<Map<String, dynamic>> triggerWords;
  final bool isOffline;
  final int? classificationId;

  ClassificationResult({
    required this.label,
    required this.confidence,
    required this.triggerWords,
    this.isOffline = false,
    this.classificationId,
  });
}

class ClassificationNotifier extends StateNotifier<AsyncValue<ClassificationResult?>> {
  ClassificationNotifier() : super(const AsyncValue.data(null));

  Future<void> classify(String message) async {
    state = const AsyncValue.loading();
    try {
      // Try the online Flask API first; fall back to the bundled TFLite
      // model if there's no connectivity (see api_service.dart).
      final result = await ApiService.classify(message);
      await HistoryService.save(message, result);
      state = AsyncValue.data(result);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> sendFeedback(bool correct) async {
    final result = state.value;
    if (result?.classificationId == null) return;
    await ApiService.sendFeedback(result!.classificationId!, correct);
  }

  void clear() {
    state = const AsyncValue.data(null);
  }
}

final classificationProvider =
    StateNotifierProvider<ClassificationNotifier, AsyncValue<ClassificationResult?>>(
  (ref) => ClassificationNotifier(),
);
