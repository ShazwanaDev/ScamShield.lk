import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class CategoryBarRow extends StatelessWidget {
  final String label;
  final int count;
  final int max;

  const CategoryBarRow({super.key, required this.label, required this.count, required this.max});

  @override
  Widget build(BuildContext context) {
    final pct = max > 0 ? (count / max).clamp(0.04, 1.0) : 0.0;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          SizedBox(
            width: 120,
            child: Text(label, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 13)),
          ),
          Expanded(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(999),
              child: LinearProgressIndicator(
                value: pct,
                minHeight: 9,
                backgroundColor: AppColors.surfaceMuted,
                valueColor: const AlwaysStoppedAnimation(AppColors.brand2),
              ),
            ),
          ),
          const SizedBox(width: 10),
          SizedBox(
            width: 28,
            child: Text('$count', textAlign: TextAlign.right, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
          ),
        ],
      ),
    );
  }
}
