import 'package:flutter/material.dart';
import '../models/history_entry.dart';
import '../theme/app_theme.dart';
import 'scam_badge.dart';

class HistoryTile extends StatelessWidget {
  final HistoryEntry entry;
  final VoidCallback onTap;

  const HistoryTile({super.key, required this.entry, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: onTap,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        ScamBadge(label: entry.label, confidence: entry.confidence),
                        const SizedBox(width: 8),
                        if (entry.isOffline)
                          const Icon(Icons.wifi_off_rounded, size: 13, color: AppColors.onSurfaceMuted),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      entry.message,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: AppFonts.message(fontSize: 13.5, color: AppColors.onSurface),
                    ),
                    const SizedBox(height: 6),
                    Text(_relativeTime(entry.timestamp),
                        style: const TextStyle(fontSize: 11.5, color: AppColors.onSurfaceMuted)),
                  ],
                ),
              ),
              const SizedBox(width: 6),
              const Icon(Icons.chevron_right_rounded, color: AppColors.onSurfaceMuted),
            ],
          ),
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
