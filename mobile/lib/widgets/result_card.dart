import 'package:flutter/material.dart';
import '../providers/classification_provider.dart';
import '../theme/app_theme.dart';
import 'feedback_buttons.dart';
import 'trigger_chip.dart';

class ResultCard extends StatelessWidget {
  final ClassificationResult result;
  final Future<void> Function(bool correct)? onFeedback;

  const ResultCard({super.key, required this.result, this.onFeedback});

  @override
  Widget build(BuildContext context) {
    final isScam = result.label == 'scam';
    final tone = isScam ? AppColors.danger : AppColors.success;
    final bg = isScam ? AppColors.dangerBg : AppColors.successBg;
    final pct = (result.confidence * 100).toStringAsFixed(1);

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
          Row(
            children: [
              CircleAvatar(
                radius: 20,
                backgroundColor: tone.withValues(alpha: 0.15),
                child: Icon(isScam ? Icons.warning_amber_rounded : Icons.check_circle_outline, color: tone),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    isScam ? 'Likely SCAM' : 'Looks legitimate',
                    style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: tone),
                  ),
                  Text('Confidence: $pct%', style: const TextStyle(color: Colors.black54, fontSize: 13)),
                ],
              ),
            ],
          ),
          if (result.isOffline) ...[
            const SizedBox(height: 10),
            Row(
              children: [
                Icon(Icons.wifi_off_rounded, size: 14, color: AppColors.warning),
                const SizedBox(width: 6),
                const Expanded(
                  child: Text(
                    'Offline mode — basic on-device check, less reliable than the full model.',
                    style: TextStyle(fontStyle: FontStyle.italic, fontSize: 12, color: AppColors.warning),
                  ),
                ),
              ],
            ),
          ],
          if (result.triggerWords.isNotEmpty) ...[
            const SizedBox(height: 12),
            const Text(
              'WORDS THAT DROVE THIS RESULT',
              style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, letterSpacing: 0.6, color: Colors.black54),
            ),
            const SizedBox(height: 6),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: result.triggerWords
                  .map((w) => TriggerChip(word: w['word'].toString(), negative: isScam))
                  .toList(),
            ),
          ],
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
