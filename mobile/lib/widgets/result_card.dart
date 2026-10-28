import 'package:flutter/material.dart';
import '../models/classification_result.dart';
import '../theme/app_theme.dart';
import 'feedback_buttons.dart';
import 'highlighted_message.dart';
import 'scam_badge.dart';

class ResultCard extends StatelessWidget {
  final String message;
  final ClassificationResult result;
  final Future<void> Function(bool correct)? onFeedback;

  const ResultCard({super.key, required this.message, required this.result, this.onFeedback});

  @override
  Widget build(BuildContext context) {
    final isScam = result.isScam;
    final (:tone, :bg) = verdictColors(result.label);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: tone.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ScamBadge(label: result.label, confidence: result.confidence, large: true),
          if (result.isOffline) ...[
            const SizedBox(height: 10),
            const Row(
              children: [
                Icon(Icons.wifi_off_rounded, size: 14, color: AppColors.warning),
                SizedBox(width: 6),
                Expanded(
                  child: Text(
                    'Offline mode — basic on-device check, less reliable than the full model.',
                    style: TextStyle(fontStyle: FontStyle.italic, fontSize: 12, color: AppColors.warning),
                  ),
                ),
              ],
            ),
          ],
          const SizedBox(height: 14),
          const Text(
            'ORIGINAL MESSAGE',
            style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, letterSpacing: 0.6, color: AppColors.onSurfaceMuted),
          ),
          const SizedBox(height: 6),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.outline),
            ),
            child: HighlightedMessage(
              message: message,
              triggerWords: result.triggerWordStrings,
              negative: isScam,
            ),
          ),
          if (onFeedback != null && result.classificationId != null) ...[
            const SizedBox(height: 14),
            const Divider(),
            const SizedBox(height: 10),
            FeedbackButtons(onSubmit: onFeedback!),
          ],
        ],
      ),
    );
  }
}
