import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../providers/auth_provider.dart';
import '../screens/alerts/alert_detail_screen.dart';
import '../screens/alerts/alerts_screen.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/register_screen.dart';
import '../screens/awareness/article_detail_screen.dart';
import '../screens/awareness/awareness_screen.dart';
import '../screens/dashboard/dashboard_screen.dart';
import '../screens/history/history_detail_screen.dart';
import '../screens/history/history_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/notifications/notifications_screen.dart';
import '../screens/onboarding/onboarding_screen.dart';
import '../screens/help/help_screen.dart';
import '../screens/reports/my_report_detail_screen.dart';
import '../screens/reports/my_reports_screen.dart';
import '../screens/scam_types/scam_type_detail_screen.dart';
import '../screens/scam_types/scam_types_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/quiz/quiz_screen.dart';
import '../screens/report/report_screen.dart';
import '../screens/settings/settings_screen.dart';
import '../screens/shell/app_shell.dart';
import '../screens/splash/splash_screen.dart';

/// Bridges a Riverpod [StateNotifierProvider] to go_router's
/// [Listenable]-based `refreshListenable`, so route `redirect` re-runs
/// whenever auth state changes (login, logout, guest, restore).
class _AuthRefreshNotifier extends ChangeNotifier {
  _AuthRefreshNotifier(Ref ref) {
    ref.listen(authProvider, (previous, next) {
      if (previous?.status != next.status) notifyListeners();
    });
  }
}

final appRouterProvider = Provider<GoRouter>((ref) {
  final refresh = _AuthRefreshNotifier(ref);

  return GoRouter(
    initialLocation: '/splash',
    refreshListenable: refresh,
    redirect: (context, state) {
      final auth = ref.read(authProvider);
      final location = state.matchedLocation;

      // Splash owns its own navigation (it awaits onboarding/session state
      // before deciding); never redirect away from or through it.
      if (location == '/splash') return null;

      // Auth status hasn't resolved yet (shouldn't normally happen post-splash,
      // but guards against a cold deep link) — send back to splash to decide.
      if (auth.status == AuthStatus.unknown) return '/splash';

      final isAuthRoute = location == '/login' || location == '/register' || location == '/onboarding';

      if (auth.status == AuthStatus.unauthenticated) {
        return isAuthRoute ? null : '/login';
      }

      // authenticated (or guest)
      if (isAuthRoute) return '/home';
      return null;
    },
    routes: [
      GoRoute(path: '/splash', builder: (context, state) => const SplashScreen()),
      GoRoute(path: '/onboarding', builder: (context, state) => const OnboardingScreen()),
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      GoRoute(path: '/register', builder: (context, state) => const RegisterScreen()),
      GoRoute(path: '/profile', builder: (context, state) => const ProfileScreen()),
      GoRoute(path: '/settings', builder: (context, state) => const SettingsScreen()),
      GoRoute(path: '/notifications', builder: (context, state) => const NotificationsScreen()),
      GoRoute(path: '/alerts', builder: (context, state) => const AlertsScreen()),
      GoRoute(
        path: '/alerts/:id',
        builder: (context, state) => AlertDetailScreen(alertId: state.pathParameters['id']!),
      ),
      GoRoute(path: '/awareness', builder: (context, state) => const AwarenessScreen()),
      GoRoute(
        path: '/awareness/:slug',
        builder: (context, state) => ArticleDetailScreen(slug: state.pathParameters['slug']!),
      ),
      GoRoute(path: '/quiz', builder: (context, state) => const QuizScreen()),
      GoRoute(path: '/help', builder: (context, state) => const HelpScreen()),
      GoRoute(path: '/scam-types', builder: (context, state) => const ScamTypesScreen()),
      GoRoute(
        path: '/scam-types/:slug',
        builder: (context, state) => ScamTypeDetailScreen(slug: state.pathParameters['slug']!),
      ),
      GoRoute(path: '/my-reports', builder: (context, state) => const MyReportsScreen()),
      GoRoute(
        path: '/my-reports/:id',
        builder: (context, state) => MyReportDetailScreen(reportId: state.pathParameters['id']!),
      ),
      GoRoute(
        path: '/history/:id',
        builder: (context, state) => HistoryDetailScreen(entryId: state.pathParameters['id']!),
      ),
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) => AppShell(navigationShell: navigationShell),
        branches: [
          StatefulShellBranch(routes: [
            GoRoute(path: '/home', builder: (context, state) => const HomeScreen()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(path: '/history', builder: (context, state) => const HistoryScreen()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(path: '/report', builder: (context, state) => const ReportScreen()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(path: '/dashboard', builder: (context, state) => const DashboardScreen()),
          ]),
        ],
      ),
    ],
  );
});
