import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../constants/content.dart';
import '../../theme/app_theme.dart';

class AwarenessScreen extends StatelessWidget {
  const AwarenessScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Awareness hub')),
      body: SafeArea(
        child: ListView.separated(
          padding: const EdgeInsets.all(16),
          itemCount: kArticles.length + 1,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            if (index == 0) {
              return const Padding(
                padding: EdgeInsets.only(bottom: 4),
                child: Text(
                  'Practical guides to recognising scams and protecting yourself and your family.',
                  style: TextStyle(fontSize: 13.5, color: AppColors.onSurfaceMuted),
                ),
              );
            }
            final a = kArticles[index - 1];
            return Card(
              child: InkWell(
                borderRadius: BorderRadius.circular(16),
                onTap: () => context.push('/awareness/${a.slug}'),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Container(
                        height: 48,
                        width: 48,
                        decoration: BoxDecoration(color: AppColors.brandBg, borderRadius: BorderRadius.circular(12)),
                        child: const Icon(Icons.menu_book_rounded, color: AppColors.brand, size: 24),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  decoration: BoxDecoration(color: AppColors.surfaceMuted, borderRadius: BorderRadius.circular(999)),
                                  child: Text(a.category, style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.w600, color: AppColors.onSurfaceMuted)),
                                ),
                                const SizedBox(width: 6),
                                Text('${a.readMins} min', style: const TextStyle(fontSize: 11, color: AppColors.onSurfaceMuted)),
                              ],
                            ),
                            const SizedBox(height: 5),
                            Text(a.title, style: const TextStyle(fontSize: 14.5, fontWeight: FontWeight.w700, color: AppColors.onSurface, height: 1.3)),
                            const SizedBox(height: 3),
                            Text(a.excerpt, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12.5, color: AppColors.onSurfaceMuted, height: 1.35)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
