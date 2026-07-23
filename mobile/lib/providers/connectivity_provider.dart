import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/report_queue_service.dart';

/// True while the device has some network path (wifi/mobile/ethernet) —
/// this is a link-layer check, not proof the Flask API itself is reachable.
/// ApiService still has its own timeout+fallback for that; this provider
/// drives the UI's online/offline indicator and the report-queue flush.
final connectivityProvider = StreamProvider<bool>((ref) async* {
  final connectivity = Connectivity();

  final initial = await connectivity.checkConnectivity();
  yield !initial.contains(ConnectivityResult.none);

  yield* connectivity.onConnectivityChanged.map(
    (results) => !results.contains(ConnectivityResult.none),
  );
});

/// Watches connectivity transitions and flushes any queued offline reports
/// the moment the device comes back online. Read (not watch) this provider
/// once near the app root to activate the listener for the app's lifetime.
final reportQueueFlushProvider = Provider<void>((ref) {
  bool? wasOnline;
  ref.listen<AsyncValue<bool>>(connectivityProvider, (previous, next) {
    final isOnlineNow = next.valueOrNull;
    if (isOnlineNow == null) return;
    if (wasOnline == false && isOnlineNow == true) {
      ReportQueueService.flush();
    }
    wasOnline = isOnlineNow;
  });
});
