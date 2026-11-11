import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../services/my_reports_service.dart';
import 'auth_provider.dart';

/// The reports this device has sent, newest first. Reloads when a different
/// account signs in (the demo account seeds its reports at login).
final myReportsProvider = FutureProvider.autoDispose<List<MyReport>>((ref) {
  ref.watch(authProvider.select((s) => s.user?.email));
  return MyReportsService.load();
});

/// Text to prefill on the Report tab, e.g. from a result's "Report this" button.
final reportDraftProvider = StateProvider<String?>((ref) => null);
