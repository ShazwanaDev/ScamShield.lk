import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Renders [message] as rich text with every occurrence of a word in
/// [triggerWords] highlighted — this is what makes a result explainable
/// in-place rather than only as a separate list of chips.
class HighlightedMessage extends StatelessWidget {
  final String message;
  final List<String> triggerWords;
  final bool negative;
  final double fontSize;

  const HighlightedMessage({
    super.key,
    required this.message,
    required this.triggerWords,
    this.negative = false,
    this.fontSize = 14.5,
  });

  @override
  Widget build(BuildContext context) {
    final tone = negative ? AppColors.danger : AppColors.success;
    final baseStyle = AppFonts.message(fontSize: fontSize, height: 1.5);

    final words = triggerWords.where((w) => w.trim().isNotEmpty).toList();
    if (words.isEmpty) {
      return Text(message, style: baseStyle);
    }

    final pattern = RegExp(words.map(RegExp.escape).join('|'), caseSensitive: false);

    final spans = <TextSpan>[];
    var lastEnd = 0;
    for (final match in pattern.allMatches(message)) {
      if (match.start > lastEnd) {
        spans.add(TextSpan(text: message.substring(lastEnd, match.start)));
      }
      spans.add(TextSpan(
        text: message.substring(match.start, match.end),
        style: TextStyle(
          color: tone,
          fontWeight: FontWeight.w800,
          backgroundColor: tone.withValues(alpha: 0.16),
        ),
      ));
      lastEnd = match.end;
    }
    if (lastEnd < message.length) {
      spans.add(TextSpan(text: message.substring(lastEnd)));
    }

    return RichText(text: TextSpan(style: baseStyle, children: spans));
  }
}
