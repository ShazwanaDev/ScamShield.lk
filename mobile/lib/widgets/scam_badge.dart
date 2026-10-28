import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Tone and background colour for a verdict label ('scam', 'spam' or
/// 'legitimate'), shared by the badge, the result card and the history screens.
({Color tone, Color bg}) verdictColors(String label) => switch (label) {
      'scam' => (tone: AppColors.danger, bg: AppColors.dangerBg),
      'spam' => (tone: AppColors.spam, bg: AppColors.spamBg),
      _ => (tone: AppColors.success, bg: AppColors.successBg),
    };

/// Compact SCAM / SPAM / Legitimate verdict badge with confidence, reused on
/// Home's result card, History tiles, and the History detail screen.
class ScamBadge extends StatelessWidget {
  final String label;
  final double confidence;
  final bool large;

  const ScamBadge({super.key, required this.label, required this.confidence, this.large = false});

  @override
  Widget build(BuildContext context) {
    final colors = verdictColors(label);
    final (icon, text) = switch (label) {
      'scam' => (Icons.warning_amber_rounded, 'SCAM'),
      'spam' => (Icons.campaign_outlined, 'SPAM'),
      _ => (Icons.check_circle_outline, 'Legitimate'),
    };
    final pct = (confidence * 100).toStringAsFixed(large ? 1 : 0);

    return Container(
      padding: EdgeInsets.symmetric(horizontal: large ? 14 : 10, vertical: large ? 8 : 5),
      decoration: BoxDecoration(
        color: colors.bg,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: colors.tone.withValues(alpha: 0.35)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: colors.tone, size: large ? 20 : 14),
          SizedBox(width: large ? 8 : 5),
          Text(
            '$text · $pct%',
            style: TextStyle(color: colors.tone, fontWeight: FontWeight.w800, fontSize: large ? 15 : 12),
          ),
        ],
      ),
    );
  }
}
