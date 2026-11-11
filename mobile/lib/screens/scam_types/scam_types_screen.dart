import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../constants/guide_content.dart';
import '../../theme/app_theme.dart';

/// "Know the threats": the scam types guide, same content as the web's
/// /scam-types pages.
class ScamTypesScreen extends StatelessWidget {
  const ScamTypesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final types = kScamTypes.where((t) => t.slug != 'other').toList();
    return Scaffold(
      appBar: AppBar(title: const Text('Scam types')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
          children: [
            Text('Know the threats', style: AppFonts.display(fontSize: 26)),
            const SizedBox(height: 6),
            const Text(
              'The scams that circulate most by SMS in Sri Lanka: how each one works, the red flags, and how to stay safe.',
              style: TextStyle(color: AppColors.onSurfaceMuted, fontSize: 13.5, height: 1.45),
            ),
            const SizedBox(height: 18),
            for (final t in types) ...[
              _TypeCard(type: t),
              const SizedBox(height: 10),
            ],
          ],
        ),
      ),
    );
  }
}

class _TypeCard extends StatelessWidget {
  final ScamType type;
  const _TypeCard({required this.type});

  @override
  Widget build(BuildContext context) {
    final tone = type.isSpam ? AppColors.warning : AppColors.danger;
    final bg = type.isSpam ? AppColors.warningBg : AppColors.dangerBg;
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => context.push('/scam-types/${type.slug}'),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12)),
                child: Icon(type.icon, color: tone, size: 21),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(type.name, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15.5)),
                    const SizedBox(height: 4),
                    Text(type.tagline, style: const TextStyle(color: AppColors.onSurfaceMuted, fontSize: 13, height: 1.4)),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right_rounded, color: AppColors.onSurfaceMuted),
            ],
          ),
        ),
      ),
    );
  }
}
