import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../models/history_entry.dart';
import '../../providers/history_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/highlighted_message.dart';
import '../../widgets/scam_badge.dart';

class HistoryDetailScreen extends ConsumerWidget {
  final String entryId;

  const HistoryDetailScreen({super.key, required this.entryId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final history = ref.watch(historyProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Check detail'),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_outline_rounded),
            tooltip: 'Delete',
            onPressed: () => _confirmDelete(context, ref),
          ),
        ],
      ),
      body: SafeArea(
        child: history.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (e, _) => Center(child: Text("Couldn't load this entry: $e")),
          data: (entries) {
            final entry = entries.where((e) => e.id == entryId).firstOrNull;
            if (entry == null) {
              return const Center(child: Text('This entry was deleted.'));
            }
            return _DetailBody(entry: entry);
          },
        ),
      ),
    );
  }

  void _confirmDelete(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete this check?'),
        content: const Text('This removes it from your local history.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(
            onPressed: () {
              ref.read(historyProvider.notifier).deleteById(entryId);
              Navigator.pop(ctx);
              context.pop();
            },
            child: const Text('Delete', style: TextStyle(color: AppColors.danger)),
          ),
        ],
      ),
    );
  }
}

class _DetailBody extends ConsumerWidget {
  final HistoryEntry entry;
  const _DetailBody({required this.entry});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tone = verdictColors(entry.label).tone;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              ScamBadge(label: entry.label, confidence: entry.confidence, large: true),
              const Spacer(),
              if (entry.isOffline)
                const Icon(Icons.wifi_off_rounded, size: 18, color: AppColors.onSurfaceMuted),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            _formatTimestamp(entry.timestamp),
            style: const TextStyle(color: AppColors.onSurfaceMuted, fontSize: 12.5),
          ),
          const SizedBox(height: 18),
          const Text(
            'MESSAGE',
            style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, letterSpacing: 0.6, color: AppColors.onSurfaceMuted),
          ),
          const SizedBox(height: 6),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.outline),
            ),
            child: HighlightedMessage(
              message: entry.message,
              triggerWords: entry.triggerWordStrings,
              negative: entry.isScam,
              fontSize: 15,
            ),
          ),
          if (entry.triggerWords.isNotEmpty) ...[
            const SizedBox(height: 18),
            const Text(
              'WORDS THAT DROVE THIS RESULT',
              style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, letterSpacing: 0.6, color: AppColors.onSurfaceMuted),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: entry.triggerWordStrings
                  .map((w) => Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: tone.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(999),
                          border: Border.all(color: tone.withValues(alpha: 0.3)),
                        ),
                        child: Text(w, style: TextStyle(color: tone, fontWeight: FontWeight.w700, fontSize: 12.5)),
                      ))
                  .toList(),
            ),
          ],
          const SizedBox(height: 24),
          if (entry.userFeedback != null)
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.surfaceMuted,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Icon(
                    entry.userFeedback == 'incorrect' ? Icons.flag_rounded : Icons.check_circle_outline,
                    size: 16,
                    color: AppColors.onSurfaceMuted,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    entry.userFeedback == 'incorrect' ? 'You marked this as incorrect' : 'You confirmed this was correct',
                    style: const TextStyle(color: AppColors.onSurfaceMuted, fontSize: 12.5),
                  ),
                ],
              ),
            )
          else
            OutlinedButton.icon(
              onPressed: () {
                HapticFeedback.mediumImpact();
                ref.read(historyProvider.notifier).setFeedback(entry.id, 'incorrect');
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Thanks — flagged as incorrect.')),
                );
              },
              icon: const Icon(Icons.flag_outlined, size: 18),
              label: const Text('Mark as incorrect'),
            ),
        ],
      ),
    );
  }

  String _formatTimestamp(DateTime t) {
    final d = t.day.toString().padLeft(2, '0');
    final m = t.month.toString().padLeft(2, '0');
    final hh = t.hour.toString().padLeft(2, '0');
    final mm = t.minute.toString().padLeft(2, '0');
    return '$d/$m/${t.year} at $hh:$mm';
  }
}

extension<T> on Iterable<T> {
  T? get firstOrNull => isEmpty ? null : first;
}
