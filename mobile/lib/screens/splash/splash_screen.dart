import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../providers/auth_provider.dart';
import '../../providers/settings_provider.dart';
import '../../services/offline_model_service.dart';
import '../../theme/app_theme.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _scale;
  late final Animation<double> _opacity;
  String _status = 'Starting…';

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 700));
    _scale = CurvedAnimation(parent: _controller, curve: Curves.easeOutBack);
    _opacity = CurvedAnimation(parent: _controller, curve: const Interval(0, 0.6, curve: Curves.easeOut));
    _controller.forward();
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    final started = DateTime.now();

    setState(() => _status = 'Checking connectivity…');
    final connectivity = await Connectivity().checkConnectivity();
    final isOnline = !connectivity.contains(ConnectivityResult.none);

    setState(() => _status = isOnline ? 'Online — using live model' : 'Offline — loading on-device model…');
    if (!isOnline) {
      await OfflineModelService.warmUp();
    }

    setState(() => _status = 'Preparing your session…');
    final results = await Future.wait([
      ref.read(authProvider.notifier).ready,
      ref.read(onboardingSeenProvider.future),
    ]);
    final seenOnboarding = results[1] as bool;

    // Keep the splash on screen briefly even on a fast/cached start so the
    // brand moment (and the connectivity/model status) is actually visible.
    final elapsed = DateTime.now().difference(started);
    const minDuration = Duration(milliseconds: 1100);
    if (elapsed < minDuration) {
      await Future.delayed(minDuration - elapsed);
    }

    if (!mounted) return;

    final authStatus = ref.read(authProvider).status;
    if (authStatus == AuthStatus.authenticated) {
      context.go('/home');
    } else if (!seenOnboarding) {
      context.go('/onboarding');
    } else {
      context.go('/login');
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ScaleTransition(
              scale: _scale,
              child: FadeTransition(
                opacity: _opacity,
                child: Container(
                  height: 96,
                  width: 96,
                  decoration: BoxDecoration(
                    color: AppColors.brand.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(26),
                    border: Border.all(color: AppColors.brand.withValues(alpha: 0.3)),
                  ),
                  child: const Icon(Icons.shield_rounded, color: AppColors.brand, size: 48),
                ),
              ),
            ),
            const SizedBox(height: 20),
            FadeTransition(
              opacity: _opacity,
              child: RichText(
                text: const TextSpan(
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: AppColors.onSurface),
                  children: [
                    TextSpan(text: 'ScamShield '),
                    TextSpan(text: 'LK', style: TextStyle(color: AppColors.brand)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 6),
            FadeTransition(
              opacity: _opacity,
              child: Text(
                'Scam SMS detection for Sri Lanka',
                style: TextStyle(color: AppColors.onSurfaceMuted.withValues(alpha: 0.9), fontSize: 13),
              ),
            ),
            const SizedBox(height: 40),
            SizedBox(
              height: 16,
              width: 16,
              child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.brand.withValues(alpha: 0.8)),
            ),
            const SizedBox(height: 14),
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 250),
              child: Text(
                _status,
                key: ValueKey(_status),
                style: const TextStyle(color: AppColors.onSurfaceMuted, fontSize: 12.5),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
