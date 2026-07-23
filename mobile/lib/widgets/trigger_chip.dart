import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class TriggerChip extends StatelessWidget {
  final String word;
  final bool negative;

  const TriggerChip({super.key, required this.word, this.negative = false});

  @override
  Widget build(BuildContext context) {
    final bg = negative ? AppColors.dangerBg : AppColors.surfaceMuted;
    final fg = negative ? AppColors.danger : AppColors.onSurface;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: negative ? AppColors.danger.withValues(alpha: 0.3) : AppColors.outline),
      ),
      child: Text(word, style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600, color: fg)),
    );
  }
}
