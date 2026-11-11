import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../constants/guide_content.dart';
import '../../providers/classification_provider.dart';
import '../../providers/my_reports_provider.dart';
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

  /// Switch to the Report tab with [message] filled in.
  void _report(String message) {
    ref.read(reportDraftProvider.notifier).state = message;
    context.go('/report');
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
              // Hero card: red-to-black wash around the checker, as in the mobile mockups.
              Container(
                padding: const EdgeInsets.fromLTRB(18, 18, 18, 18),
                decoration: BoxDecoration(
                  gradient: AppColors.heroGradient,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.white.withValues(alpha: 0.07)),
                  boxShadow: [BoxShadow(color: AppColors.brand.withValues(alpha: 0.16), blurRadius: 40, offset: const Offset(0, 18))],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Row(
                      children: [
                        Spacer(),
                        ConnectivityBadge(),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Text('Is this message', style: AppFonts.display(fontSize: 30, fontWeight: FontWeight.w700)),
                    Text('a scam?', style: AppFonts.display(fontSize: 30, fontWeight: FontWeight.w700, color: AppColors.onSurfaceMuted)),
                    const SizedBox(height: 8),
                    const Text(
                      'Paste a suspicious SMS in Sinhala, Tamil, English, or a mix, and get an instant scam check.',
                      style: TextStyle(color: AppColors.onSurface, fontSize: 13.5, height: 1.4),
                    ),
                    const SizedBox(height: 16),
                    AppTextArea(
                      controller: _controller,
                      label: 'Message text',
                      hint: 'Paste the message here…',
                    ),
                    const SizedBox(height: 10),
                    // Try an example, as on the website's checker.
                    SizedBox(
                      height: 34,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: kSampleMessages.length.clamp(0, 6),
                        separatorBuilder: (_, __) => const SizedBox(width: 6),
                        itemBuilder: (context, i) {
                          final s = kSampleMessages[i];
                          return ActionChip(
                            visualDensity: VisualDensity.compact,
                            label: Text('${s.langLabel} · ${s.label}', style: const TextStyle(fontSize: 12)),
                            onPressed: resultState.isLoading ? null : () => setState(() => _controller.text = s.text),
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 14),
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
                        OutlinedButton.icon(
                          onPressed: () => _report(_controller.text.trim()),
                          icon: const Icon(Icons.flag_outlined, size: 18),
                          label: const Text('Report'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              resultState.when(
                data: (result) => result == null
                    ? const SizedBox.shrink()
                    : ResultCard(
                        message: _checkedMessage,
                        result: result,
                        onReport: () => _report(_checkedMessage),
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
