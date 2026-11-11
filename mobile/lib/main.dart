import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'providers/connectivity_provider.dart';
import 'router/app_router.dart';
import 'theme/app_theme.dart';

void main() {
  runApp(const ProviderScope(child: ScamShieldApp()));
}

class ScamShieldApp extends ConsumerWidget {
  const ScamShieldApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Activates the offline-report-queue flush listener for the app's lifetime.
    ref.watch(reportQueueFlushProvider);

    final router = ref.watch(appRouterProvider);

    return MaterialApp.router(
      title: 'ScamShield LK',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.dark,
      themeMode: ThemeMode.dark,
      routerConfig: router,
    );
  }
}
