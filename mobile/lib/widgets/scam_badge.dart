import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Compact SCAM/Legitimate verdict badge with confidence, reused on Home's
/// result card, History tiles, and the History detail screen.
class ScamBadge extends StatelessWidget {
  final bool isScam;
  final double confidence;
  final bool large;

  const ScamBadge({super.key, required this.isScam, required this.confidence, this.large = false});

  @override
  Widget build(BuildContext context) {
    final tone = isScam ? AppColors.danger : AppColors.success;
    final bg = isScam ? AppColors.dangerBg : AppColors.successBg;
    final pct = (confidence * 100).toStringAsFixed(large ? 1 : 0);

    return Container(
      padding: EdgeInsets.symmetric(horizontal: large ? 14 : 10, vertical: large ? 8 : 5),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: tone.withValues(alpha: 0.35)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            isScam ? Icons.warning_amber_rounded : Icons.check_circle_outline,
            color: tone,
            size: large ? 20 : 14,
          ),
          SizedBox(width: large ? 8 : 5),
          Text(
            '${isScam ? "SCAM" : "Legitimate"} · $pct%',
            style: TextStyle(color: tone, fontWeight: FontWeight.w800, fontSize: large ? 15 : 12),
          ),
        ],
      ),
    );
  }
}
