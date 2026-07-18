import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/api_service.dart';

final statsProvider = FutureProvider.autoDispose<Map<String, dynamic>>((ref) {
  return ApiService.fetchStats();
});
