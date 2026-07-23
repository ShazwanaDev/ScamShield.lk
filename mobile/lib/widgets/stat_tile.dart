import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class StatTile extends StatelessWidget {
  final String label;
  final String value;
  final String? hint;
  final IconData? icon;

  const StatTile({super.key, required this.label, required this.value, this.hint, this.icon});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label, style: const TextStyle(fontSize: 12.5, color: AppColors.onSurfaceMuted, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 4),
                  Text(value, style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: AppColors.onSurface)),
                  if (hint != null) ...[
                    const SizedBox(height: 2),
                    Text(hint!, style: const TextStyle(fontSize: 11, color: AppColors.onSurfaceMuted)),
                  ],
                ],
              ),
            ),
            if (icon != null)
              CircleAvatar(
                radius: 18,
                backgroundColor: AppColors.brand.withValues(alpha: 0.1),
                child: Icon(icon, size: 18, color: AppColors.brand2),
              ),
          ],
        ),
      ),
    );
  }
}
