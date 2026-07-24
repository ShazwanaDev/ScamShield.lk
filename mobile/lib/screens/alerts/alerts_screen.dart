import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../constants/content.dart';
import '../../theme/app_theme.dart';

({Color fg, Color bg, String label}) severityStyle(String s) {
  switch (s) {
    case 'high':
      return (fg: AppColors.scam, bg: AppColors.scamBg, label: 'High');
    case 'medium':
      return (fg: AppColors.spam, bg: AppColors.spamBg, label: 'Medium');
    default:
      return (fg: AppColors.brand, bg: AppColors.brandBg, label: 'Low');
  }
}

class AlertsScreen extends StatelessWidget {
  const AlertsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Community alerts')),
      body: SafeArea(
        child: ListView.separated(
          padding: const EdgeInsets.all(16),
          itemCount: kAlerts.length + 1,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            if (index == 0) {
              return const Padding(
                padding: EdgeInsets.only(bottom: 4),
                child: Text(
                  'Verified warnings about scams circulating right now in Sri Lanka.',
                  style: TextStyle(fontSize: 13.5, color: AppColors.onSurfaceMuted),
                ),
              );
            }
            final a = kAlerts[index - 1];
            final sev = severityStyle(a.severity);
            return Card(
              child: InkWell(
                borderRadius: BorderRadius.circular(16),
                onTap: () => context.push('/alerts/${a.id}'),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          _Pill(text: sev.label, fg: sev.fg, bg: sev.bg),
                          const SizedBox(width: 8),
                          const Icon(Icons.place_outlined, size: 14, color: AppColors.onSurfaceMuted),
                          const SizedBox(width: 2),
                          Text(a.region, style: const TextStyle(fontSize: 12, color: AppColors.onSurfaceMuted)),
                          const Spacer(),
                          Text('${a.reports} reports', style: const TextStyle(fontSize: 11.5, color: AppColors.onSurfaceMuted)),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Text(a.title, style: const TextStyle(fontSize: 15.5, fontWeight: FontWeight.w700, color: AppColors.onSurface)),
                      const SizedBox(height: 4),
                      Text(a.summary, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 13, color: AppColors.onSurfaceMuted, height: 1.4)),
                      const SizedBox(height: 10),
                      const Row(
                        children: [
                          Text('Read details', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.brand)),
                          Icon(Icons.arrow_forward_rounded, size: 15, color: AppColors.brand),
                        ],
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

class _Pill extends StatelessWidget {
  final String text;
  final Color fg;
  final Color bg;
  const _Pill({required this.text, required this.fg, required this.bg});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(999)),
      child: Text(text, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: fg)),
    );
  }
}
