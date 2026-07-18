import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'home_shell.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 900), () {
      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const HomeShell()),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.brand,
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              height: 88,
              width: 88,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(24),
              ),
              child: const Icon(Icons.shield_rounded, color: AppColors.accent, size: 44),
            ),
            const SizedBox(height: 18),
            RichText(
              text: const TextSpan(
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white),
                children: [
                  TextSpan(text: 'ScamShield '),
                  TextSpan(text: 'LK', style: TextStyle(color: AppColors.accent)),
                ],
              ),
            ),
            const SizedBox(height: 6),
            Text(
              'Scam SMS detection for Sri Lanka',
              style: TextStyle(color: Colors.white.withValues(alpha: 0.7), fontSize: 13),
            ),
          ],
        ),
      ),
    );
  }
}
