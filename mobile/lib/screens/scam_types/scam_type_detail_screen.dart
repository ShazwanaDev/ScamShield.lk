import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../constants/guide_content.dart';
import '../../theme/app_theme.dart';
import '../../widgets/empty_state.dart';
import '../../widgets/section_label.dart';

class ScamTypeDetailScreen extends StatelessWidget {
  final String slug;
  const ScamTypeDetailScreen({super.key, required this.slug});

  @override
  Widget build(BuildContext context) {
    final type = scamTypeBySlug(slug);
    if (type == null) {
      return Scaffold(
        appBar: AppBar(),
        body: const EmptyState(icon: Icons.search_off_rounded, title: 'Scam type not found'),
      );
    }
    final tone = type.isSpam ? AppColors.warning : AppColors.danger;

    return Scaffold(
      appBar: AppBar(title: Text(type.name)),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 4, 16, 28),
          children: [
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: AppColors.heroGradient,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white.withValues(alpha: 0.07)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(type.icon, color: AppColors.brandSoft, size: 28),
                  const SizedBox(height: 12),
                  Text(type.name, style: AppFonts.display(fontSize: 26)),
                  const SizedBox(height: 8),
                  Text(type.summary, style: const TextStyle(fontSize: 14, height: 1.5)),
                ],
              ),
            ),
            const SizedBox(height: 22),
            const SectionLabel('How it works'),
            for (var i = 0; i < type.howItWorks.length; i++) _Step(number: i + 1, text: type.howItWorks[i]),
            const SizedBox(height: 18),
            const SectionLabel('Red flags'),
            for (final f in type.redFlags) _Bullet(icon: Icons.flag_rounded, color: tone, text: f),
            if (type.exampleText.isNotEmpty) ...[
              const SizedBox(height: 18),
              const SectionLabel('Example message'),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(14),
                  border: Border(left: BorderSide(color: tone, width: 3)),
                ),
                child: Text(type.exampleText, style: AppFonts.message(fontSize: 14, height: 1.5)),
              ),
              const SizedBox(height: 6),
              const Text(
                'Contact details and links are replaced with safe placeholders.',
                style: TextStyle(fontSize: 11.5, color: AppColors.onSurfaceMuted),
              ),
            ],
            const SizedBox(height: 18),
            const SectionLabel('How to stay safe'),
            for (final t in type.safetyTips) _Bullet(icon: Icons.check_circle_outline_rounded, color: AppColors.success, text: t),
            const SizedBox(height: 22),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => context.go('/home'),
                    child: const Text('Check a message'),
                  ),
                ),
                const SizedBox(width: 10),
                OutlinedButton.icon(
                  onPressed: () => context.go('/report'),
                  icon: const Icon(Icons.flag_outlined, size: 18),
                  label: const Text('Report one'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _Step extends StatelessWidget {
  final int number;
  final String text;
  const _Step({required this.number, required this.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 26,
            height: 26,
            alignment: Alignment.center,
            decoration: BoxDecoration(color: AppColors.brandBg, borderRadius: BorderRadius.circular(8)),
            child: Text('$number', style: AppFonts.mono(fontSize: 12, color: AppColors.brandSoft, fontWeight: FontWeight.w600)),
          ),
          const SizedBox(width: 12),
          Expanded(child: Text(text, style: const TextStyle(fontSize: 14, height: 1.5))),
        ],
      ),
    );
  }
}

class _Bullet extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String text;
  const _Bullet({required this.icon, required this.color, required this.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(padding: const EdgeInsets.only(top: 2), child: Icon(icon, size: 17, color: color)),
          const SizedBox(width: 10),
          Expanded(child: Text(text, style: const TextStyle(fontSize: 14, height: 1.5, color: AppColors.onSurface))),
        ],
      ),
    );
  }
}
