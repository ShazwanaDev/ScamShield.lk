import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../constants/content.dart';
import '../../theme/app_theme.dart';

const _langLabel = {'en': 'English', 'si': 'Sinhala', 'ta': 'Tamil', 'mixed': 'Singlish'};
const _options = [
  ('scam', 'Scam', AppColors.scam, AppColors.scamBg),
  ('spam', 'Spam', AppColors.spam, AppColors.spamBg),
  ('legitimate', 'Legit', AppColors.legit, AppColors.legitBg),
];

class QuizScreen extends StatefulWidget {
  const QuizScreen({super.key});

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  int _index = 0;
  int _score = 0;
  String? _picked;
  bool _done = false;

  void _choose(String value) {
    if (_picked != null) return;
    setState(() {
      _picked = value;
      if (value == kQuiz[_index].answer) _score++;
    });
  }

  void _next() {
    if (_index + 1 >= kQuiz.length) {
      setState(() => _done = true);
    } else {
      setState(() {
        _index++;
        _picked = null;
      });
    }
  }

  void _restart() => setState(() {
        _index = 0;
        _score = 0;
        _picked = null;
        _done = false;
      });

  @override
  Widget build(BuildContext context) {
    if (_done) return _buildResult();

    final q = kQuiz[_index];
    final answered = _picked != null;
    final correct = _picked == q.answer;

    return Scaffold(
      appBar: AppBar(title: const Text('Spot the scam')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Question ${_index + 1} of ${kQuiz.length}', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.onSurfaceMuted)),
                Text('Score: $_score', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.onSurface)),
              ],
            ),
            const SizedBox(height: 10),
            ClipRRect(
              borderRadius: BorderRadius.circular(999),
              child: LinearProgressIndicator(
                value: (_index + (answered ? 1 : 0)) / kQuiz.length,
                minHeight: 8,
                backgroundColor: AppColors.surfaceMuted,
                valueColor: const AlwaysStoppedAnimation(AppColors.brand),
              ),
            ),
            const SizedBox(height: 18),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(color: AppColors.surfaceMuted, borderRadius: BorderRadius.circular(999)),
                          child: Text(_langLabel[q.lang] ?? q.lang, style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.w600, color: AppColors.onSurfaceMuted)),
                        ),
                        const SizedBox(width: 8),
                        const Text('Is this a scam?', style: TextStyle(fontSize: 12, color: AppColors.onSurfaceMuted)),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(color: AppColors.surfaceMuted, borderRadius: BorderRadius.circular(12)),
                      child: Text(q.text, style: AppFonts.message(fontSize: 14.5, height: 1.5)),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        for (final o in _options) ...[
                          Expanded(child: _optionButton(o, answered, q.answer)),
                          if (o != _options.last) const SizedBox(width: 10),
                        ],
                      ],
                    ),
                    if (answered) ...[
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: correct ? AppColors.legitBg : AppColors.scamBg,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(correct ? Icons.check_circle_rounded : Icons.cancel_rounded, size: 18, color: correct ? AppColors.legit : AppColors.scam),
                                const SizedBox(width: 6),
                                Text(correct ? 'Correct!' : 'Not quite.', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: correct ? AppColors.legit : AppColors.scam)),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Text(q.explanation, style: const TextStyle(fontSize: 13, color: AppColors.onSurface, height: 1.45)),
                            const SizedBox(height: 12),
                            FilledButton(
                              onPressed: _next,
                              style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(44)),
                              child: Text(_index + 1 >= kQuiz.length ? 'See result' : 'Next question'),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _optionButton((String, String, Color, Color) o, bool answered, String answer) {
    final isPicked = _picked == o.$1;
    final isAnswer = answer == o.$1;
    Color border = AppColors.outline;
    Color fg = AppColors.onSurface;
    Color? bg;
    if (answered) {
      if (isAnswer) {
        border = AppColors.legit;
        fg = AppColors.legit;
        bg = AppColors.legitBg;
      } else if (isPicked) {
        border = AppColors.scam;
        fg = AppColors.scam;
        bg = AppColors.scamBg;
      }
    }
    return GestureDetector(
      onTap: () => _choose(o.$1),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: bg,
          border: Border.all(color: border, width: 2),
          borderRadius: BorderRadius.circular(12),
        ),
        alignment: Alignment.center,
        child: Text(o.$2, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: fg)),
      ),
    );
  }

  Widget _buildResult() {
    final pct = ((_score / kQuiz.length) * 100).round();
    final msg = pct >= 80 ? 'Scam-spotting pro!' : pct >= 50 ? 'Good instincts' : 'Worth brushing up';
    return Scaffold(
      appBar: AppBar(title: const Text('Quiz complete')),
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  height: 96,
                  width: 96,
                  decoration: const BoxDecoration(color: AppColors.brandBg, shape: BoxShape.circle),
                  alignment: Alignment.center,
                  child: Text('$pct%', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: AppColors.brand)),
                ),
                const SizedBox(height: 18),
                Text(msg, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.onSurface)),
                const SizedBox(height: 6),
                Text('You got $_score of ${kQuiz.length} right.', style: const TextStyle(fontSize: 14, color: AppColors.onSurfaceMuted)),
                const SizedBox(height: 24),
                FilledButton.icon(
                  onPressed: _restart,
                  icon: const Icon(Icons.refresh_rounded, size: 18),
                  label: const Text('Try again'),
                  style: FilledButton.styleFrom(minimumSize: const Size(220, 48)),
                ),
                const SizedBox(height: 10),
                OutlinedButton(
                  onPressed: () => context.push('/awareness'),
                  style: OutlinedButton.styleFrom(minimumSize: const Size(220, 48)),
                  child: const Text('Learn more'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
