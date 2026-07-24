import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../providers/classification_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/app_text_area.dart';
import '../../widgets/connectivity_badge.dart';
import '../../widgets/result_card.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  final _controller = TextEditingController();
  String _checkedMessage = '';

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _check() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    HapticFeedback.mediumImpact();
    _checkedMessage = text;
    await ref.read(classificationProvider.notifier).classify(text);
  }

  @override
  Widget build(BuildContext context) {
    final resultState = ref.watch(classificationProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            Icon(Icons.shield_rounded, color: AppColors.brand, size: 22),
            SizedBox(width: 8),
            Text('ScamShield LK'),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none_rounded),
            tooltip: 'Notifications',
            onPressed: () => context.push('/notifications'),
          ),
          IconButton(
            icon: const Icon(Icons.person_outline_rounded),
            tooltip: 'Profile & settings',
            onPressed: () => context.push('/profile'),
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Row(
                children: [
                  Expanded(
                    child: Text(
                      'Paste a suspicious SMS — Sinhala, Tamil, English, or mixed — and get an instant scam check.',
                      style: TextStyle(color: AppColors.onSurfaceMuted, fontSize: 13),
                    ),
                  ),
                  SizedBox(width: 10),
                  ConnectivityBadge(),
                ],
              ),
              const SizedBox(height: 16),
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
                      onPressed: resultState.isLoading ? null : _check,
                      child: resultState.isLoading
                          ? const SizedBox(
                              height: 18,
                              width: 18,
                              child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.onBrand),
                            )
                          : const Text('Check message'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  TextButton.icon(
                    onPressed: () => context.push('/report'),
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
                        message: _checkedMessage,
                        result: result,
                        onFeedback: (correct) async {
                          HapticFeedback.selectionClick();
                          await ref.read(classificationProvider.notifier).sendFeedback(correct);
                        },
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
