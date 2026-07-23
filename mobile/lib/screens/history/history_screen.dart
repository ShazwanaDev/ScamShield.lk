import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../providers/history_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/empty_state.dart';
import '../../widgets/history_tile.dart';

class HistoryScreen extends ConsumerStatefulWidget {
  const HistoryScreen({super.key});

  @override
  ConsumerState<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends ConsumerState<HistoryScreen> {
  final _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final filtered = ref.watch(filteredHistoryProvider);
    final rawHistory = ref.watch(historyProvider);
    final currentFilter = ref.watch(historyFilterProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('History'),
        actions: [
          rawHistory.maybeWhen(
            data: (entries) => entries.isEmpty
                ? const SizedBox.shrink()
                : IconButton(
                    icon: const Icon(Icons.delete_sweep_outlined),
                    tooltip: 'Clear history',
                    onPressed: () => _confirmClear(context, ref),
                  ),
            orElse: () => const SizedBox.shrink(),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
              child: TextField(
                controller: _searchController,
                onChanged: (v) => ref.read(historySearchProvider.notifier).state = v,
                decoration: InputDecoration(
                  hintText: 'Search history…',
                  prefixIcon: const Icon(Icons.search_rounded, size: 20),
                  suffixIcon: _searchController.text.isEmpty
                      ? null
                      : IconButton(
                          icon: const Icon(Icons.close_rounded, size: 18),
                          onPressed: () {
                            _searchController.clear();
                            ref.read(historySearchProvider.notifier).state = '';
                          },
                        ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  _FilterChip(
                    label: 'All',
                    selected: currentFilter == HistoryFilter.all,
                    onTap: () => ref.read(historyFilterProvider.notifier).state = HistoryFilter.all,
                  ),
                  const SizedBox(width: 8),
                  _FilterChip(
                    label: 'Scam',
                    selected: currentFilter == HistoryFilter.scam,
                    onTap: () => ref.read(historyFilterProvider.notifier).state = HistoryFilter.scam,
                  ),
                  const SizedBox(width: 8),
                  _FilterChip(
                    label: 'Legitimate',
                    selected: currentFilter == HistoryFilter.legitimate,
                    onTap: () => ref.read(historyFilterProvider.notifier).state = HistoryFilter.legitimate,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
            Expanded(
              child: filtered.when(
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (e, _) => Center(child: Text("Couldn't load history: $e")),
                data: (entries) {
                  if (entries.isEmpty) {
                    final hasAnyHistory = (rawHistory.valueOrNull ?? []).isNotEmpty;
                    return EmptyState(
                      icon: hasAnyHistory ? Icons.search_off_rounded : Icons.history_rounded,
                      title: hasAnyHistory ? 'No matches' : 'No history yet',
                      description: hasAnyHistory
                          ? 'Try a different search term or filter.'
                          : 'Messages you check on the Home tab will show up here.',
                    );
                  }
                  return ListView.separated(
                    padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
                    itemCount: entries.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 8),
                    itemBuilder: (context, index) {
                      final entry = entries[index];
                      return Dismissible(
                        key: ValueKey(entry.id),
                        direction: DismissDirection.endToStart,
                        onDismissed: (_) {
                          HapticFeedback.mediumImpact();
                          ref.read(historyProvider.notifier).deleteById(entry.id);
                        },
                        background: Container(
                          alignment: Alignment.centerRight,
                          padding: const EdgeInsets.only(right: 20),
                          decoration: BoxDecoration(color: AppColors.dangerBg, borderRadius: BorderRadius.circular(16)),
                          child: const Icon(Icons.delete_outline, color: AppColors.danger),
                        ),
                        child: HistoryTile(entry: entry, onTap: () => context.push('/history/${entry.id}')),
                      );
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _confirmClear(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Clear history?'),
        content: const Text('This removes all locally saved checks from this device.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(
            onPressed: () {
              ref.read(historyProvider.notifier).clearAll();
              Navigator.pop(ctx);
            },
            child: const Text('Clear', style: TextStyle(color: AppColors.danger)),
          ),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _FilterChip({required this.label, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return ChoiceChip(
      label: Text(label),
      selected: selected,
      onSelected: (_) => onTap(),
      selectedColor: AppColors.brand.withValues(alpha: 0.18),
      labelStyle: TextStyle(
        color: selected ? AppColors.brand : AppColors.onSurfaceMuted,
        fontWeight: FontWeight.w700,
        fontSize: 12.5,
      ),
      side: BorderSide(color: selected ? AppColors.brand.withValues(alpha: 0.4) : AppColors.outline),
    );
  }
}
