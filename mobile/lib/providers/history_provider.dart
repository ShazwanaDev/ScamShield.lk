import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/history_service.dart';

class HistoryNotifier extends StateNotifier<AsyncValue<List<HistoryEntry>>> {
  HistoryNotifier() : super(const AsyncValue.loading()) {
    refresh();
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    try {
      final entries = await HistoryService.load();
      state = AsyncValue.data(entries);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> deleteAt(int index) async {
    await HistoryService.deleteAt(index);
    await refresh();
  }

  Future<void> clearAll() async {
    await HistoryService.clear();
    state = const AsyncValue.data([]);
  }
}

final historyProvider = StateNotifierProvider<HistoryNotifier, AsyncValue<List<HistoryEntry>>>(
  (ref) => HistoryNotifier(),
);
