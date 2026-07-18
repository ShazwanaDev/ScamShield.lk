import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

enum FeedbackStatus { idle, sending, sent, error }

class FeedbackButtons extends StatefulWidget {
  final Future<void> Function(bool correct) onSubmit;

  const FeedbackButtons({super.key, required this.onSubmit});

  @override
  State<FeedbackButtons> createState() => _FeedbackButtonsState();
}

class _FeedbackButtonsState extends State<FeedbackButtons> {
  FeedbackStatus _status = FeedbackStatus.idle;
  bool? _choice;

  Future<void> _submit(bool correct) async {
    if (_status == FeedbackStatus.sending || _status == FeedbackStatus.sent) return;
    setState(() {
      _choice = correct;
      _status = FeedbackStatus.sending;
    });
    try {
      await widget.onSubmit(correct);
      if (!mounted) return;
      setState(() => _status = FeedbackStatus.sent);
    } catch (_) {
      if (!mounted) return;
      setState(() => _status = FeedbackStatus.error);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_status == FeedbackStatus.sent) {
      return const Text(
        'Thanks for your feedback.',
        style: TextStyle(color: AppColors.success, fontWeight: FontWeight.w600),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Was this correct?', style: TextStyle(fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        Row(
          children: [
            OutlinedButton.icon(
              onPressed: _status == FeedbackStatus.sending ? null : () => _submit(true),
              icon: const Icon(Icons.thumb_up_alt_outlined, size: 18),
              label: const Text('Correct'),
              style: OutlinedButton.styleFrom(
                foregroundColor: _choice == true ? AppColors.success : null,
                side: BorderSide(color: _choice == true ? AppColors.success : AppColors.outline),
              ),
            ),
            const SizedBox(width: 8),
            OutlinedButton.icon(
              onPressed: _status == FeedbackStatus.sending ? null : () => _submit(false),
              icon: const Icon(Icons.thumb_down_alt_outlined, size: 18),
              label: const Text('Incorrect'),
              style: OutlinedButton.styleFrom(
                foregroundColor: _choice == false ? AppColors.danger : null,
                side: BorderSide(color: _choice == false ? AppColors.danger : AppColors.outline),
              ),
            ),
          ],
        ),
        if (_status == FeedbackStatus.error)
          const Padding(
            padding: EdgeInsets.only(top: 6),
            child: Text("Couldn't save that — try again.", style: TextStyle(color: AppColors.danger, fontSize: 12)),
          ),
      ],
    );
  }
}
