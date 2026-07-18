import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/report_provider.dart';
import '../widgets/app_text_area.dart';
import '../widgets/category_select.dart';
import '../widgets/empty_state.dart';
import '../theme/app_theme.dart';

class ReportScreen extends ConsumerStatefulWidget {
  const ReportScreen({super.key});

  @override
  ConsumerState<ReportScreen> createState() => _ReportScreenState();
}

class _ReportScreenState extends ConsumerState<ReportScreen> {
  final _controller = TextEditingController();
  String? _category;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final reportState = ref.watch(reportProvider);
    final submitting = reportState.status == ReportStatus.submitting;

    return Scaffold(
      appBar: AppBar(title: const Text('Report a scam')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: reportState.status == ReportStatus.done
              ? EmptyState(
                  icon: Icons.check_circle_outline,
                  title: 'Report submitted',
                  description:
                      "Thanks — a moderator will review this before it's counted toward public stats.",
                  action: OutlinedButton(
                    onPressed: () {
                      _controller.clear();
                      setState(() => _category = null);
                      ref.read(reportProvider.notifier).reset();
                    },
                    child: const Text('Report another message'),
                  ),
                )
              : Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Text(
                      "Seen a scam SMS that didn't come to you directly? Share it so a moderator can review it and warn others.",
                      style: TextStyle(color: Colors.black54, fontSize: 13),
                    ),
                    const SizedBox(height: 14),
                    AppTextArea(
                      controller: _controller,
                      label: 'Message text',
                      hint: 'Paste the scam message here…',
                    ),
                    const SizedBox(height: 12),
                    CategorySelect(value: _category, onChanged: (v) => setState(() => _category = v)),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: submitting
                          ? null
                          : () {
                              final text = _controller.text.trim();
                              if (text.isNotEmpty) {
                                ref.read(reportProvider.notifier).submit(text, _category);
                              }
                            },
                      child: submitting
                          ? const SizedBox(
                              height: 18,
                              width: 18,
                              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                            )
                          : const Text('Submit report'),
                    ),
                    if (reportState.status == ReportStatus.error) ...[
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: AppColors.dangerBg,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: AppColors.danger.withValues(alpha: 0.3)),
                        ),
                        child: Text(
                          reportState.error ?? 'Something went wrong.',
                          style: const TextStyle(color: AppColors.danger),
                        ),
                      ),
                    ],
                  ],
                ),
        ),
      ),
    );
  }
}
