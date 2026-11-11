import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../constants/content.dart';
import '../../theme/app_theme.dart';

class ArticleDetailScreen extends StatelessWidget {
  final String slug;
  const ArticleDetailScreen({super.key, required this.slug});

  @override
  Widget build(BuildContext context) {
    final article = kArticles.where((a) => a.slug == slug).firstOrNull;
    if (article == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Article')),
        body: const Center(child: Text('Article not found', style: TextStyle(color: AppColors.onSurfaceMuted))),
      );
    }

    return Scaffold(
      appBar: AppBar(title: Text(article.category)),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text(article.title, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.onSurface, height: 1.25)),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.schedule_rounded, size: 15, color: AppColors.onSurfaceMuted),
                const SizedBox(width: 4),
                Text('${article.readMins} min read', style: const TextStyle(fontSize: 12.5, color: AppColors.onSurfaceMuted)),
              ],
            ),
            const SizedBox(height: 8),
            Text(article.excerpt, style: const TextStyle(fontSize: 15, color: AppColors.onSurfaceMuted, height: 1.5, fontStyle: FontStyle.italic)),
            const SizedBox(height: 20),
            for (final s in article.sections) ...[
              Text(s.heading, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: AppColors.onSurface)),
              const SizedBox(height: 8),
              for (final p in s.body) ...[
                Text(p, style: const TextStyle(fontSize: 14.5, color: AppColors.onSurface, height: 1.6)),
                const SizedBox(height: 10),
              ],
              for (final b in s.bullets)
                Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Padding(
                        padding: EdgeInsets.only(top: 2, right: 10),
                        child: Icon(Icons.check_rounded, size: 17, color: AppColors.brand),
                      ),
                      Expanded(child: Text(b, style: const TextStyle(fontSize: 14.5, color: AppColors.onSurface, height: 1.5))),
                    ],
                  ),
                ),
              const SizedBox(height: 14),
            ],
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [AppColors.navy, AppColors.navyDeep]),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Got a message you\'re unsure about?', style: TextStyle(fontSize: 15.5, fontWeight: FontWeight.w800, color: Colors.white)),
                  const SizedBox(height: 4),
                  Text('Check it in seconds. It is free, and never shared.', style: TextStyle(fontSize: 13, color: Colors.white.withValues(alpha: 0.7))),
                  const SizedBox(height: 14),
                  FilledButton.icon(
                    onPressed: () => context.go('/home'),
                    icon: const Icon(Icons.shield_rounded, size: 18),
                    label: const Text('Check a message'),
                    style: FilledButton.styleFrom(backgroundColor: AppColors.brandFill, foregroundColor: Colors.white),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
