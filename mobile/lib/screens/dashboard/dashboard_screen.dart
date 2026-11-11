import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../models/history_entry.dart';
import '../../providers/history_provider.dart';
import '../../providers/stats_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/animated_counter.dart';
import '../../widgets/cell_bar_chart.dart';
import '../../widgets/section_label.dart';

/// Two halves, like the web dashboards:
/// - Your activity: built from this device's history, so it always works,
///   even with no connection.
/// - Community: approved reports from the API. If the server can't be reached
///   this section says so on its own instead of blanking the whole screen.
class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final history = ref.watch(historyProvider);

    Future<void> refresh() async {
      ref.invalidate(statsProvider);
      await ref.read(historyProvider.notifier).refresh();
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Dashboard')),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: refresh,
          child: ListView(
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 28),
            children: [
              const SectionLabel('Your activity'),
              history.when(
                loading: () => const _LoadingCard(height: 180),
                error: (e, _) => _InlineError(message: "Couldn't read your history on this device.", onRetry: refresh),
                data: (entries) => entries.isEmpty ? const _NoChecksYet() : _YourActivity(entries: entries),
              ),
              const SizedBox(height: 24),
              const SectionLabel('Community'),
              const _CommunitySection(),
              const SizedBox(height: 24),
              const SectionLabel('Learn and report'),
              _QuickLink(
                icon: Icons.category_outlined,
                fg: AppColors.brandSoft,
                bg: AppColors.brandBg,
                title: 'Scam types guide',
                subtitle: 'How each scam works and the red flags',
                onTap: () => context.push('/scam-types'),
              ),
              _QuickLink(
                icon: Icons.campaign_rounded,
                fg: AppColors.scam,
                bg: AppColors.scamBg,
                title: 'Community alerts',
                subtitle: 'Scams circulating right now',
                onTap: () => context.push('/alerts'),
              ),
              _QuickLink(
                icon: Icons.flag_outlined,
                fg: AppColors.warning,
                bg: AppColors.warningBg,
                title: 'My reports',
                subtitle: 'Follow the moderator review',
                onTap: () => context.push('/my-reports'),
              ),
              _QuickLink(
                icon: Icons.menu_book_rounded,
                fg: AppColors.info,
                bg: AppColors.infoBg,
                title: 'Awareness hub',
                subtitle: 'Guides to spotting scams',
                onTap: () => context.push('/awareness'),
              ),
              _QuickLink(
                icon: Icons.quiz_rounded,
                fg: AppColors.success,
                bg: AppColors.successBg,
                title: 'Spot the scam quiz',
                subtitle: 'Test your instincts',
                onTap: () => context.push('/quiz'),
              ),
              _QuickLink(
                icon: Icons.help_outline_rounded,
                fg: AppColors.onSurface,
                bg: AppColors.surfaceMuted,
                title: 'Help and FAQ',
                subtitle: 'How it works and your privacy',
                onTap: () => context.push('/help'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/* ── Your activity ─────────────────────────────────────────────── */

class _YourActivity extends StatelessWidget {
  final List<HistoryEntry> entries;
  const _YourActivity({required this.entries});

  // Below this the app shows the result as uncertain, matching the web app.
  static const _floor = 0.6;

  @override
  Widget build(BuildContext context) {
    int count(bool Function(HistoryEntry) test) => entries.where(test).length;
    final total = entries.length;
    final scam = count((e) => e.label == 'scam' && e.confidence >= _floor);
    final spam = count((e) => e.label == 'spam' && e.confidence >= _floor);
    final legit = count((e) => e.label == 'legitimate' && e.confidence >= _floor);
    final unsure = total - scam - spam - legit;
    String pct(int n) => total == 0 ? '0%' : '${(n * 100 / total).round()}%';

    // Checks per day over the last 14 days.
    final today = DateTime.now();
    final start = DateTime(today.year, today.month, today.day).subtract(const Duration(days: 13));
    final perDay = List<int>.filled(14, 0);
    for (final e in entries) {
      final d = DateTime(e.timestamp.year, e.timestamp.month, e.timestamp.day);
      final i = d.difference(start).inDays;
      if (i >= 0 && i < 14) perDay[i]++;
    }
    final lastWeek = perDay.sublist(0, 7).fold<int>(0, (a, b) => a + b);
    final thisWeek = perDay.sublist(7).fold<int>(0, (a, b) => a + b);

    return Column(
      children: [
        // KPI grid with hairline dividers
        Container(
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: Colors.white.withValues(alpha: 0.06)),
          ),
          child: Column(
            children: [
              IntrinsicHeight(
                child: Row(children: [
                  _Kpi(icon: Icons.chat_bubble_outline_rounded, color: AppColors.onSurfaceMuted, label: 'Messages checked', value: '$total', caption: 'on this device'),
                  const VerticalDivider(width: 1),
                  _Kpi(icon: Icons.gpp_maybe_outlined, color: AppColors.danger, label: 'Scams caught', value: '$scam', caption: '${pct(scam)} of checks'),
                ]),
              ),
              const Divider(height: 1),
              IntrinsicHeight(
                child: Row(children: [
                  _Kpi(icon: Icons.campaign_outlined, color: AppColors.warning, label: 'Spam flagged', value: '$spam', caption: 'promotions and bulk'),
                  const VerticalDivider(width: 1),
                  _Kpi(icon: Icons.verified_outlined, color: AppColors.success, label: 'Looked legitimate', value: '$legit', caption: unsure > 0 ? '$unsure uncertain' : 'no strong signals'),
                ]),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        // Checks per day
        _Panel(
          title: 'Your checks per day',
          meta: 'last 14 days',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CellBarChart(
                rows: 8,
                unit: 'checks',
                initialSelected: 13,
                bars: [
                  for (var i = 0; i < 14; i++) CellBar(label: '${start.add(Duration(days: i)).day}', value: perDay[i]),
                ],
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(child: _PeriodSummary(color: AppColors.cellDeep, label: 'Previous week', value: lastWeek)),
                  const SizedBox(width: 12),
                  Expanded(child: _PeriodSummary(color: AppColors.brand, label: 'This week', value: thisWeek)),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        // Verdict mix
        _Panel(
          title: 'Your verdict mix',
          meta: '$total checks',
          child: Column(
            children: [
              _MixBar(segments: [
                (scam, AppColors.brand),
                (spam, AppColors.warning),
                (legit, const Color(0xFFD4D4D8)),
                (unsure, const Color(0xFF4A4A52)),
              ]),
              const SizedBox(height: 12),
              _MixRow(color: AppColors.brand, label: 'Scam', value: scam, pct: pct(scam)),
              _MixRow(color: AppColors.warning, label: 'Spam', value: spam, pct: pct(spam)),
              _MixRow(color: const Color(0xFFD4D4D8), label: 'Legitimate', value: legit, pct: pct(legit)),
              _MixRow(color: const Color(0xFF4A4A52), label: 'Uncertain', value: unsure, pct: pct(unsure)),
            ],
          ),
        ),
      ],
    );
  }
}

class _Kpi extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String label;
  final String value;
  final String caption;
  const _Kpi({required this.icon, required this.color, required this.label, required this.value, required this.caption});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, size: 18, color: color),
            const SizedBox(height: 12),
            Text(label, style: const TextStyle(fontSize: 12.5, color: AppColors.onSurfaceMuted)),
            const SizedBox(height: 4),
            Text(value, style: AppFonts.display(fontSize: 28, fontWeight: FontWeight.w600)),
            const SizedBox(height: 4),
            Text(caption, style: const TextStyle(fontSize: 11.5, color: AppColors.onSurfaceMuted)),
          ],
        ),
      ),
    );
  }
}

class _Panel extends StatelessWidget {
  final String title;
  final String? meta;
  final Widget child;
  const _Panel({required this.title, this.meta, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Colors.white.withValues(alpha: 0.06)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(child: Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15))),
              if (meta != null) Text(meta!, style: const TextStyle(fontSize: 12, color: AppColors.onSurfaceMuted)),
            ],
          ),
          const SizedBox(height: 14),
          child,
        ],
      ),
    );
  }
}

class _PeriodSummary extends StatelessWidget {
  final Color color;
  final String label;
  final int value;
  const _PeriodSummary({required this.color, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(height: 2, decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(2))),
        const SizedBox(height: 8),
        Text(label, style: const TextStyle(fontSize: 12, color: AppColors.onSurfaceMuted)),
        const SizedBox(height: 2),
        Row(
          crossAxisAlignment: CrossAxisAlignment.baseline,
          textBaseline: TextBaseline.alphabetic,
          children: [
            Text('$value', style: AppFonts.display(fontSize: 22, fontWeight: FontWeight.w600)),
            const SizedBox(width: 5),
            const Text('checks', style: TextStyle(fontSize: 12, color: AppColors.onSurfaceMuted)),
          ],
        ),
      ],
    );
  }
}

class _MixBar extends StatelessWidget {
  final List<(int, Color)> segments;
  const _MixBar({required this.segments});

  @override
  Widget build(BuildContext context) {
    final shown = segments.where((s) => s.$1 > 0).toList();
    return SizedBox(
      height: 8,
      child: Row(
        children: [
          for (var i = 0; i < shown.length; i++) ...[
            if (i > 0) const SizedBox(width: 4),
            Expanded(
              flex: shown[i].$1,
              child: Container(decoration: BoxDecoration(color: shown[i].$2, borderRadius: BorderRadius.circular(99))),
            ),
          ],
        ],
      ),
    );
  }
}

class _MixRow extends StatelessWidget {
  final Color color;
  final String label;
  final int value;
  final String pct;
  const _MixRow({required this.color, required this.label, required this.value, required this.pct});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        children: [
          Container(width: 10, height: 10, decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(2.5))),
          const SizedBox(width: 10),
          Expanded(child: Text(label, style: const TextStyle(fontSize: 13.5))),
          Text('$value', style: AppFonts.mono(fontSize: 13, color: AppColors.onSurface)),
          SizedBox(width: 48, child: Text(pct, textAlign: TextAlign.right, style: AppFonts.mono(fontSize: 12.5))),
        ],
      ),
    );
  }
}

class _NoChecksYet extends StatelessWidget {
  const _NoChecksYet();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: AppColors.heroGradient,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Colors.white.withValues(alpha: 0.07)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('No checks yet', style: AppFonts.display(fontSize: 22)),
          const SizedBox(height: 6),
          const Text(
            'Each message you check adds to your charts here, so you can see how often scams reach you.',
            style: TextStyle(fontSize: 13.5, height: 1.45),
          ),
          const SizedBox(height: 14),
          ElevatedButton(onPressed: () => context.go('/home'), child: const Text('Check your first message')),
        ],
      ),
    );
  }
}

/* ── Community ──────────────────────────────────────────────────── */

class _CommunitySection extends ConsumerWidget {
  const _CommunitySection();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stats = ref.watch(statsProvider);
    final topCategory = ref.watch(topWeeklyCategoryProvider);

    return stats.when(
      loading: () => const _LoadingCard(height: 120),
      error: (e, _) => _InlineError(
        message: "Community stats are offline right now. Your own activity above still works.",
        detail: 'Check your connection, or that the ScamShield server is running.',
        onRetry: () async => ref.invalidate(statsProvider),
      ),
      data: (data) {
        final breakdown = List<Map<String, dynamic>>.from(data['weekly_category_breakdown'] as List? ?? const []);
        final total = data['total_community_approved_reports'] as int? ?? 0;
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: AppColors.heroGradient,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: Colors.white.withValues(alpha: 0.07)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Community approved reports', style: TextStyle(fontSize: 12.5, color: AppColors.onSurface)),
                  const SizedBox(height: 6),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      AnimatedCounter(value: total, style: AppFonts.display(fontSize: 46)),
                      const Padding(
                        padding: EdgeInsets.only(left: 8, bottom: 8),
                        child: Icon(Icons.shield_rounded, color: AppColors.brand, size: 20),
                      ),
                    ],
                  ),
                  const Text('All time, reviewed by moderators', style: TextStyle(fontSize: 11.5, color: AppColors.onSurfaceMuted)),
                ],
              ),
            ),
            if (topCategory != null) ...[
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.brandBg,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.brand.withValues(alpha: 0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.trending_up_rounded, color: AppColors.brand, size: 18),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text.rich(TextSpan(
                        style: const TextStyle(fontSize: 13, color: AppColors.onSurface),
                        children: [
                          const TextSpan(text: 'Most reported this week: '),
                          TextSpan(text: categoryLabel(topCategory), style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.brandSoft)),
                        ],
                      )),
                    ),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 10),
            _Panel(
              title: "This week's reports by type",
              child: breakdown.isEmpty
                  ? const Text(
                      'No approved reports in the last 7 days yet.',
                      style: TextStyle(fontSize: 13, color: AppColors.onSurfaceMuted),
                    )
                  : CellBarChart(
                      rows: 10,
                      unit: 'reports',
                      bars: [
                        for (final c in ([...breakdown]..sort((a, b) => (b['count'] as int).compareTo(a['count'] as int))))
                          CellBar(label: _short(categoryLabel(c['category'] as String?)), value: c['count'] as int),
                      ],
                    ),
            ),
          ],
        );
      },
    );
  }

  static String _short(String s) => s.length > 10 ? '${s.substring(0, 9)}…' : s;
}

/* ── Shared bits ────────────────────────────────────────────────── */

class _LoadingCard extends StatelessWidget {
  final double height;
  const _LoadingCard({required this.height});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(18)),
      alignment: Alignment.center,
      child: const SizedBox(width: 22, height: 22, child: CircularProgressIndicator(strokeWidth: 2)),
    );
  }
}

class _InlineError extends StatelessWidget {
  final String message;
  final String? detail;
  final Future<void> Function() onRetry;
  const _InlineError({required this.message, this.detail, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.warning.withValues(alpha: 0.25)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.cloud_off_rounded, color: AppColors.warning, size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(message, style: const TextStyle(fontSize: 13.5, height: 1.4)),
                if (detail != null) ...[
                  const SizedBox(height: 4),
                  Text(detail!, style: const TextStyle(fontSize: 12, color: AppColors.onSurfaceMuted, height: 1.4)),
                ],
                const SizedBox(height: 10),
                OutlinedButton(onPressed: onRetry, child: const Text('Retry')),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _QuickLink extends StatelessWidget {
  final IconData icon;
  final Color fg;
  final Color bg;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _QuickLink({
    required this.icon,
    required this.fg,
    required this.bg,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Card(
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12)),
                  child: Icon(icon, color: fg, size: 20),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14.5)),
                      const SizedBox(height: 2),
                      Text(subtitle, style: const TextStyle(fontSize: 12.5, color: AppColors.onSurfaceMuted)),
                    ],
                  ),
                ),
                const Icon(Icons.chevron_right_rounded, color: AppColors.onSurfaceMuted, size: 22),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
