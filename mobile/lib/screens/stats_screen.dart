import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/stats_provider.dart';
import '../providers/tab_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/category_bar_row.dart';
import '../widgets/empty_state.dart';
import '../widgets/stat_tile.dart';

class StatsScreen extends ConsumerWidget {
  const StatsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statsAsync = ref.watch(statsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Scam trends')),
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
                const Center(child: Text("Couldn't load the latest stats.")),
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
              final maxCount = breakdown.fold<int>(0, (m, c) => (c['count'] as int) > m ? c['count'] as int : m);

              return ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  StatTile(
                    label: 'Community-approved reports',
                    value: '${stats['total_community_approved_reports']}',
                    hint: 'All time, moderator-approved',
                    icon: Icons.flag_outlined,
                  ),
                  const SizedBox(height: 16),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "THIS WEEK'S CATEGORIES",
                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Colors.black54),
                          ),
                          const SizedBox(height: 12),
                          if (breakdown.isEmpty)
                            EmptyState(
                              icon: Icons.insights_outlined,
                              title: 'No approved reports yet this week',
                              description: 'This is expected while the community dataset is still growing.',
                              action: OutlinedButton(
                                onPressed: () => ref.read(selectedTabProvider.notifier).state = 1,
                                child: const Text('Report a scam'),
                              ),
                            )
                          else
                            ...breakdown.map(
                              (c) => CategoryBarRow(
                                label: _prettyCategory(c['category'] as String?),
                                count: c['count'] as int,
                                max: maxCount,
                              ),
                            ),
                        ],
                      ),
                    ),
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
