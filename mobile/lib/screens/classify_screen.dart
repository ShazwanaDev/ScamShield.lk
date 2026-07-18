import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/classification_provider.dart';
import '../providers/tab_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/app_text_area.dart';
import '../widgets/result_card.dart';

class ClassifyScreen extends ConsumerStatefulWidget {
  const ClassifyScreen({super.key});

  @override
  ConsumerState<ClassifyScreen> createState() => _ClassifyScreenState();
}

class _ClassifyScreenState extends ConsumerState<ClassifyScreen> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final resultState = ref.watch(classificationProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Check a message')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Paste a suspicious SMS — Sinhala, Tamil, English, or mixed — and get an instant scam check.',
                style: TextStyle(color: Colors.black54, fontSize: 13),
              ),
              const SizedBox(height: 14),
              AppTextArea(
                controller: _controller,
                label: 'Message text',
                hint: 'Paste the message here…',
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: resultState.isLoading
                          ? null
                          : () {
                              final text = _controller.text.trim();
                              if (text.isNotEmpty) {
                                ref.read(classificationProvider.notifier).classify(text);
                              }
                            },
                      child: resultState.isLoading
                          ? const SizedBox(
                              height: 18,
                              width: 18,
                              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                            )
                          : const Text('Check message'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  TextButton.icon(
                    onPressed: () => ref.read(selectedTabProvider.notifier).state = 1,
                    icon: const Icon(Icons.flag_outlined, size: 18),
                    label: const Text('Report'),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              resultState.when(
                data: (result) => result == null
                    ? const SizedBox.shrink()
                    : ResultCard(
                        result: result,
                        onFeedback: (correct) =>
                            ref.read(classificationProvider.notifier).sendFeedback(correct),
                      ),
                loading: () => const SizedBox.shrink(),
                error: (e, _) => Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppColors.dangerBg,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.danger.withValues(alpha: 0.3)),
                  ),
                  child: Text('Something went wrong: $e', style: const TextStyle(color: AppColors.danger)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
