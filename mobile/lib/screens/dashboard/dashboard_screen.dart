import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../providers/stats_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/animated_counter.dart';
import '../../widgets/empty_state.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statsAsync = ref.watch(statsProvider);
    final topCategory = ref.watch(topWeeklyCategoryProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Dashboard')),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () => ref.refresh(statsProvider.future),
          child: statsAsync.when(
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (e, _) => ListView(
              padding: const EdgeInsets.all(16),
              children: [
                const SizedBox(height: 60),
                const Icon(Icons.error_outline, color: AppColors.danger, size: 32),
                const SizedBox(height: 10),
                const Center(child: Text("Couldn't load the latest stats.", style: TextStyle(color: AppColors.onSurface))),
                const SizedBox(height: 14),
                Center(
                  child: OutlinedButton(
                    onPressed: () => ref.invalidate(statsProvider),
                    child: const Text('Retry'),
                  ),
                ),
              ],
            ),
            data: (stats) {
              final breakdown = List<Map<String, dynamic>>.from(
                stats['weekly_category_breakdown'] as List? ?? const [],
              );
              final total = stats['total_community_approved_reports'] as int? ?? 0;

              return ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'COMMUNITY-APPROVED REPORTS',
                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.onSurfaceMuted, letterSpacing: 0.5),
                          ),
                          const SizedBox(height: 6),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              AnimatedCounter(value: total),
                              const Padding(
                                padding: EdgeInsets.only(left: 8, bottom: 6),
                                child: Icon(Icons.shield_rounded, color: AppColors.brand, size: 22),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          const Text('All time, moderator-approved', style: TextStyle(fontSize: 11.5, color: AppColors.onSurfaceMuted)),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  if (topCategory != null)
                    Container(
                      width: double.infinity,
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
                            child: Text.rich(
                              TextSpan(
                                style: const TextStyle(fontSize: 13, color: AppColors.onSurface),
                                children: [
                                  const TextSpan(text: 'Most common scam this week: '),
                                  TextSpan(
                                    text: _prettyCategory(topCategory),
                                    style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.brand),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  if (topCategory != null) const SizedBox(height: 16),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "THIS WEEK'S CATEGORIES",
                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.onSurfaceMuted, letterSpacing: 0.5),
                          ),
                          const SizedBox(height: 16),
                          if (breakdown.isEmpty)
                            const EmptyState(
                              icon: Icons.insights_outlined,
                              title: 'No approved reports yet this week',
                              description: 'This is expected while the community dataset is still growing.',
                            )
                          else
                            _WeeklyBarChart(breakdown: breakdown),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    'COMMUNITY & LEARN',
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.onSurfaceMuted, letterSpacing: 0.5),
                  ),
                  const SizedBox(height: 10),
                  _QuickLink(
                    icon: Icons.campaign_rounded,
                    fg: AppColors.scam,
                    bg: AppColors.scamBg,
                    title: 'Community alerts',
                    subtitle: 'Scams circulating right now',
                    onTap: () => context.push('/alerts'),
                  ),
                  const SizedBox(height: 10),
                  _QuickLink(
                    icon: Icons.menu_book_rounded,
                    fg: AppColors.brand,
                    bg: AppColors.brandBg,
                    title: 'Awareness hub',
                    subtitle: 'Guides to spotting scams',
                    onTap: () => context.push('/awareness'),
                  ),
                  const SizedBox(height: 10),
                  _QuickLink(
                    icon: Icons.quiz_rounded,
                    fg: AppColors.success,
                    bg: AppColors.successBg,
                    title: 'Spot the scam quiz',
                    subtitle: 'Test your instincts',
                    onTap: () => context.push('/quiz'),
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }

  String _prettyCategory(String? name) {
    if (name == null || name.isEmpty) return 'Uncategorized';
    return name
        .split('_')
        .map((w) => w.isEmpty ? w : '${w[0].toUpperCase()}${w.substring(1)}')
        .join(' ');
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
    return Card(
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              Container(
                height: 44,
                width: 44,
                decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12)),
                child: Icon(icon, color: fg, size: 22),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontSize: 14.5, fontWeight: FontWeight.w700, color: AppColors.onSurface)),
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
    );
  }
}

class _WeeklyBarChart extends StatelessWidget {
  final List<Map<String, dynamic>> breakdown;
  const _WeeklyBarChart({required this.breakdown});

  @override
  Widget build(BuildContext context) {
    final sorted = [...breakdown]..sort((a, b) => (b['count'] as int).compareTo(a['count'] as int));
    final maxCount = sorted.fold<int>(1, (m, c) => (c['count'] as int) > m ? c['count'] as int : m);

    return SizedBox(
      height: 220,
      child: BarChart(
        BarChartData(
          maxY: (maxCount * 1.25),
          alignment: BarChartAlignment.spaceAround,
          gridData: const FlGridData(show: false),
          borderData: FlBorderData(show: false),
          barTouchData: BarTouchData(
            touchTooltipData: BarTouchTooltipData(
              getTooltipColor: (_) => AppColors.surfaceMuted,
              getTooltipItem: (group, groupIndex, rod, rodIndex) => BarTooltipItem(
                rod.toY.round().toString(),
                const TextStyle(color: AppColors.onSurface, fontWeight: FontWeight.w700, fontSize: 12),
              ),
            ),
          ),
          titlesData: FlTitlesData(
            leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
            topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
            rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
            bottomTitles: AxisTitles(
              sideTitles: SideTitles(
                showTitles: true,
                reservedSize: 42,
                getTitlesWidget: (value, meta) {
                  final i = value.toInt();
                  if (i < 0 || i >= sorted.length) return const SizedBox.shrink();
                  final label = _shortLabel(sorted[i]['category'] as String?);
                  return Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: Text(
                      label,
                      style: const TextStyle(fontSize: 10, color: AppColors.onSurfaceMuted),
                      textAlign: TextAlign.center,
                    ),
                  );
                },
              ),
            ),
          ),
          barGroups: [
            for (var i = 0; i < sorted.length; i++)
              BarChartGroupData(
                x: i,
                barRods: [
                  BarChartRodData(
                    toY: (sorted[i]['count'] as int).toDouble(),
                    color: AppColors.brand,
                    width: 22,
                    borderRadius: BorderRadius.circular(6),
                    backDrawRodData: BackgroundBarChartRodData(
                      show: true,
                      toY: maxCount * 1.25,
                      color: AppColors.surfaceMuted,
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }

  String _shortLabel(String? name) {
    if (name == null || name.isEmpty) return '—';
    final pretty = name.split('_').map((w) => w.isEmpty ? w : w[0].toUpperCase() + w.substring(1)).join(' ');
    return pretty.length > 10 ? '${pretty.substring(0, 9)}…' : pretty;
  }
}
