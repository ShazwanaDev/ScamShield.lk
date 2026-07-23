import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/api_service.dart';

final statsProvider = FutureProvider.autoDispose<Map<String, dynamic>>((ref) {
  return ApiService.fetchStats();
});

/// The category with the highest weekly count, for the dashboard's plain-text
/// summary line ("Most common scam this week: Lottery"). Null while loading,
/// on error, or if there's no approved-report data yet.
final topWeeklyCategoryProvider = Provider.autoDispose<String?>((ref) {
  final stats = ref.watch(statsProvider).valueOrNull;
  if (stats == null) return null;

  final breakdown = List<Map<String, dynamic>>.from(
    stats['weekly_category_breakdown'] as List? ?? const [],
  );
  if (breakdown.isEmpty) return null;

  breakdown.sort((a, b) => (b['count'] as int).compareTo(a['count'] as int));
  return breakdown.first['category'] as String?;
});
