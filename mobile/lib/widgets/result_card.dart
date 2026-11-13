import 'package:flutter/material.dart';
import '../models/classification_result.dart';
import '../theme/app_theme.dart';
import 'cell_bar_chart.dart';
import 'feedback_buttons.dart';
import 'highlighted_message.dart';
import 'scam_badge.dart';
import 'section_label.dart';

/// Below this confidence the result is treated as uncertain (same floor as the web app).
const double kConfidenceFloor = 0.6;

/// What to do next for each verdict, matching the web result view.
List<String> recommendedActions(String label, double confidence) {
  final actions = switch (label) {
    'legitimate' => [
        'No strong scam signals, but stay alert.',
        'If it involves money or codes, verify through an official channel first.',
      ],
    'spam' => [
        "Don't reply or dial any codes in the message.",
        "Block the sender and unsubscribe via your telecom's official app.",
      ],
    _ => [
        'Do not click any links or call the numbers in the message.',
        'Never share OTPs, PINs, passwords, or your NIC.',
        'Verify directly with the real organisation using a number you trust.',
        'Report it so others in the community are warned.',
      ],
  };
  if (confidence < kConfidenceFloor) {
    return ["The model isn't sure about this one. Treat it with caution and verify through official channels.", ...actions];
  }
  return actions;
}

class ResultCard extends StatelessWidget {
  final String message;
  final ClassificationResult result;
  final Future<void> Function(bool correct)? onFeedback;

  /// Opens the Report tab with this message filled in. Hidden for legitimate results.
  final VoidCallback? onReport;

  const ResultCard({super.key, required this.message, required this.result, this.onFeedback, this.onReport});

  @override
  Widget build(BuildContext context) {
    final (:tone, :bg) = verdictColors(result.label);
    final risky = result.label != 'legitimate';
    final flagged = risky ? result.triggerWordStrings : const <String>[];

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
          const SizedBox(height: 16),
          // Big score and a cell meter, matching the web result panel.
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text('${(result.confidence * 100).round()}', style: AppFonts.display(fontSize: 56)),
              const SizedBox(width: 4),
              Text('/100', style: AppFonts.display(fontSize: 20, fontWeight: FontWeight.w500, color: AppColors.onSurfaceMuted)),
              const Spacer(),
              Text(result.confidence < kConfidenceFloor ? 'uncertain' : 'confidence', style: AppFonts.mono(fontSize: 11)),
            ],
          ),
          const SizedBox(height: 10),
          CellMeter(value: result.confidence * 100, max: 100, cells: 24, color: tone, semanticsLabel: 'Model confidence'),
          const SizedBox(height: 8),
          // Usability testing: two of ten participants read Confidence as how dangerous a message is.
          const Text(
            'Confidence shows how sure ScamShield is about this result. It is not a measure of how dangerous '
            'the message is, and the result can still be wrong.',
            style: TextStyle(fontSize: 12, height: 1.4, color: AppColors.onSurfaceMuted),
          ),
          if (result.isOffline) ...[
            const SizedBox(height: 10),
            const Row(
              children: [
                Icon(Icons.wifi_off_rounded, size: 14, color: AppColors.warning),
                SizedBox(width: 6),
                Expanded(
                  child: Text(
                    'Offline mode: a basic on-device check, less reliable than the full model.',
                    style: TextStyle(fontStyle: FontStyle.italic, fontSize: 12, color: AppColors.warning),
                  ),
                ),
              ],
            ),
          ],
          const SizedBox(height: 16),
          const SectionLabel('Original message'),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.black.withValues(alpha: 0.3),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white.withValues(alpha: 0.06)),
            ),
            child: HighlightedMessage(message: message, triggerWords: flagged, negative: true),
          ),
          if (flagged.isNotEmpty) ...[
            const SizedBox(height: 14),
            const SectionLabel('Why this was flagged'),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: [
                for (final w in flagged)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: tone.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: tone.withValues(alpha: 0.35)),
                    ),
                    child: Text('“$w”', style: TextStyle(color: tone, fontSize: 12.5, fontWeight: FontWeight.w600)),
                  ),
              ],
            ),
          ],
          const SizedBox(height: 16),
          const SectionLabel('What you should do'),
          for (final a in recommendedActions(result.label, result.confidence))
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(top: 2),
                    child: Icon(Icons.check_circle_outline_rounded, size: 16, color: tone),
                  ),
                  const SizedBox(width: 8),
                  Expanded(child: Text(a, style: const TextStyle(fontSize: 13.5, height: 1.45))),
                ],
              ),
            ),
          if (risky && onReport != null) ...[
            const SizedBox(height: 6),
            OutlinedButton.icon(
              onPressed: onReport,
              icon: const Icon(Icons.flag_outlined, size: 18),
              label: const Text('Report this message'),
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
