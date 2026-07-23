import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Counts up from 0 to [value] whenever [value] changes — used for the
/// dashboard's public scam counter so a refresh reads as "live", not static.
class AnimatedCounter extends StatelessWidget {
  final int value;
  final TextStyle? style;

  const AnimatedCounter({super.key, required this.value, this.style});

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0, end: value.toDouble()),
      duration: const Duration(milliseconds: 900),
      curve: Curves.easeOutCubic,
      builder: (context, animatedValue, _) => Text(
        animatedValue.round().toString(),
        style: style ??
            const TextStyle(fontSize: 40, fontWeight: FontWeight.w900, color: AppColors.onSurface),
      ),
    );
  }
}
