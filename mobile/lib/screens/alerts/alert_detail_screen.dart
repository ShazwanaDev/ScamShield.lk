import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../constants/content.dart';
import '../../theme/app_theme.dart';
import 'alerts_screen.dart' show severityStyle;

class AlertDetailScreen extends StatelessWidget {
  final String alertId;
  const AlertDetailScreen({super.key, required this.alertId});

  @override
  Widget build(BuildContext context) {
    final alert = kAlerts.where((a) => a.id == alertId).firstOrNull;
    if (alert == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Alert')),
        body: const Center(child: Text('Alert not found', style: TextStyle(color: AppColors.onSurfaceMuted))),
      );
    }
    final sev = severityStyle(alert.severity);

    return Scaffold(
      appBar: AppBar(title: Text(alert.id)),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: sev.bg, borderRadius: BorderRadius.circular(999)),
                  child: Text('${sev.label} severity', style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700, color: sev.fg)),
                ),
                const SizedBox(width: 8),
                Text('${alert.reports} reports · ${alert.date}', style: const TextStyle(fontSize: 12, color: AppColors.onSurfaceMuted)),
              ],
            ),
            const SizedBox(height: 14),
            Text(alert.title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.onSurface, height: 1.25)),
            const SizedBox(height: 8),
            Text(alert.summary, style: const TextStyle(fontSize: 14, color: AppColors.onSurfaceMuted, height: 1.5)),
            const SizedBox(height: 20),
            const _SectionTitle('What\'s happening'),
            const SizedBox(height: 8),
            ...alert.details.map((d) => _Bullet(d)),
            const SizedBox(height: 20),
            const _SectionTitle('Example of the message'),
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.scamBg,
                borderRadius: BorderRadius.circular(14),
                border: const Border(left: BorderSide(color: AppColors.scam, width: 3)),
              ),
              child: Text(alert.example, style: AppFonts.message(fontSize: 14, height: 1.5)),
            ),
            const SizedBox(height: 20),
            const Row(
              children: [
                Icon(Icons.verified_user_outlined, size: 18, color: AppColors.success),
                SizedBox(width: 6),
                Text('How to protect yourself', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.onSurface)),
              ],
            ),
            const SizedBox(height: 10),
            ...alert.advice.map((a) => _CheckItem(a)),
            const SizedBox(height: 24),
            OutlinedButton.icon(
              onPressed: () => context.go('/report'),
              icon: const Icon(Icons.flag_outlined, size: 18),
              label: const Text('Report a scam like this'),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.scam,
                side: const BorderSide(color: AppColors.scam),
                minimumSize: const Size.fromHeight(48),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String text;
  const _SectionTitle(this.text);
  @override
  Widget build(BuildContext context) =>
      Text(text, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.onSurface));
}

class _Bullet extends StatelessWidget {
  final String text;
  const _Bullet(this.text);
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(bottom: 10),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Padding(
              padding: EdgeInsets.only(top: 5, right: 10),
              child: Icon(Icons.chevron_right_rounded, size: 18, color: AppColors.onSurfaceMuted),
            ),
            Expanded(child: Text(text, style: const TextStyle(fontSize: 14, color: AppColors.onSurfaceMuted, height: 1.5))),
          ],
        ),
      );
}

class _CheckItem extends StatelessWidget {
  final String text;
  const _CheckItem(this.text);
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(bottom: 10),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Padding(
              padding: EdgeInsets.only(top: 2, right: 10),
              child: Icon(Icons.check_circle_outline_rounded, size: 18, color: AppColors.success),
            ),
            Expanded(child: Text(text, style: const TextStyle(fontSize: 14, color: AppColors.onSurfaceMuted, height: 1.5))),
          ],
        ),
      );
}
