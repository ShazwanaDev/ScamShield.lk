import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/history_entry.dart';
import '../services/history_service.dart';

enum HistoryFilter { all, scam, legitimate }

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

  Future<void> deleteById(String id) async {
    final previous = state.value ?? [];
    state = AsyncValue.data(previous.where((e) => e.id != id).toList());
    await HistoryService.deleteById(id);
  }

  Future<void> setFeedback(String id, String feedback) async {
    await HistoryService.setFeedback(id, feedback);
    final previous = state.value ?? [];
    state = AsyncValue.data([
      for (final e in previous) e.id == id ? e.copyWith(userFeedback: feedback) : e,
    ]);
  }

  Future<void> clearAll() async {
    await HistoryService.clear();
    state = const AsyncValue.data([]);
  }
}

final historyProvider = StateNotifierProvider<HistoryNotifier, AsyncValue<List<HistoryEntry>>>(
  (ref) => HistoryNotifier(),
);

final historySearchProvider = StateProvider<String>((ref) => '');
final historyFilterProvider = StateProvider<HistoryFilter>((ref) => HistoryFilter.all);

/// Derived, filtered+searched view the History screen renders from.
final filteredHistoryProvider = Provider<AsyncValue<List<HistoryEntry>>>((ref) {
  final history = ref.watch(historyProvider);
  final query = ref.watch(historySearchProvider).trim().toLowerCase();
  final filter = ref.watch(historyFilterProvider);

  return history.whenData((entries) {
    return entries.where((e) {
      final matchesFilter = switch (filter) {
        HistoryFilter.all => true,
        HistoryFilter.scam => e.isScam,
        HistoryFilter.legitimate => e.label == 'legitimate',
      };
      final matchesQuery = query.isEmpty || e.message.toLowerCase().contains(query);
      return matchesFilter && matchesQuery;
    }).toList();
  });
});
