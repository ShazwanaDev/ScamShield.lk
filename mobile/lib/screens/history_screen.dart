import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/history_provider.dart';
import '../providers/tab_provider.dart';
import '../services/history_service.dart';
import '../theme/app_theme.dart';
import '../widgets/empty_state.dart';
import '../widgets/trigger_chip.dart';

class HistoryScreen extends ConsumerWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.listen(selectedTabProvider, (previous, next) {
      if (next == 2) ref.read(historyProvider.notifier).refresh();
    });

    final historyState = ref.watch(historyProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('History'),
        actions: [
          historyState.maybeWhen(
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
        child: historyState.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (e, _) => Center(child: Text('Couldn\'t load history: $e')),
          data: (entries) {
            if (entries.isEmpty) {
              return const EmptyState(
                icon: Icons.history_rounded,
                title: 'No messages checked yet',
                description: 'Messages you check will show up here.',
              );
            }
            return ListView.separated(
              padding: const EdgeInsets.all(12),
              itemCount: entries.length,
              separatorBuilder: (_, __) => const SizedBox(height: 8),
              itemBuilder: (context, index) {
                final entry = entries[index];
                return Dismissible(
                  key: ValueKey('${entry.timestamp.toIso8601String()}-$index'),
                  direction: DismissDirection.endToStart,
                  onDismissed: (_) => ref.read(historyProvider.notifier).deleteAt(index),
                  background: Container(
                    alignment: Alignment.centerRight,
                    padding: const EdgeInsets.only(right: 20),
                    decoration: BoxDecoration(color: AppColors.dangerBg, borderRadius: BorderRadius.circular(14)),
                    child: const Icon(Icons.delete_outline, color: AppColors.danger),
                  ),
                  child: _HistoryRow(entry: entry),
                );
              },
            );
          },
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

class _HistoryRow extends StatelessWidget {
  final HistoryEntry entry;
  const _HistoryRow({required this.entry});

  @override
  Widget build(BuildContext context) {
    final isScam = entry.label == 'scam';
    final tone = isScam ? AppColors.danger : AppColors.success;

    return InkWell(
      borderRadius: BorderRadius.circular(14),
      onTap: () => _showDetail(context),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              CircleAvatar(
                radius: 16,
                backgroundColor: tone.withValues(alpha: 0.15),
                child: Icon(
                  isScam ? Icons.warning_amber_rounded : Icons.check_circle_outline,
                  color: tone,
                  size: 18,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${isScam ? "SCAM" : "Legit"} · ${(entry.confidence * 100).toStringAsFixed(0)}% · ${_relativeTime(entry.timestamp)}',
                      style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12.5, color: tone),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      entry.message,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontSize: 13.5),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right, color: Colors.black26),
            ],
          ),
        ),
      ),
    );
  }

  void _showDetail(BuildContext context) {
    final isScam = entry.label == 'scam';
    final tone = isScam ? AppColors.danger : AppColors.success;
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              isScam ? 'Likely SCAM' : 'Looks legitimate',
              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18, color: tone),
            ),
            const SizedBox(height: 4),
            Text('Confidence: ${(entry.confidence * 100).toStringAsFixed(1)}%',
                style: const TextStyle(color: Colors.black54)),
            const SizedBox(height: 12),
            Text(entry.message),
            if (entry.triggerWords.isNotEmpty) ...[
              const SizedBox(height: 14),
              const Text('WORDS THAT DROVE THIS RESULT',
                  style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, color: Colors.black54)),
              const SizedBox(height: 6),
              Wrap(
                spacing: 6,
                runSpacing: 6,
                children: entry.triggerWords
                    .map((w) => TriggerChip(word: w['word'].toString(), negative: isScam))
                    .toList(),
              ),
            ],
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  String _relativeTime(DateTime timestamp) {
    final diff = DateTime.now().difference(timestamp);
    if (diff.inMinutes < 1) return 'just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    return '${diff.inDays}d ago';
  }
}
