import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../providers/connectivity_provider.dart';
import '../../providers/my_reports_provider.dart';
import '../../providers/report_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/app_text_area.dart';
import '../../widgets/category_select.dart';
import '../../widgets/empty_state.dart';

class ReportScreen extends ConsumerStatefulWidget {
  const ReportScreen({super.key});

  @override
  ConsumerState<ReportScreen> createState() => _ReportScreenState();
}

class _ReportScreenState extends ConsumerState<ReportScreen> {
  final _controller = TextEditingController();
  String? _category;

  @override
  void initState() {
    super.initState();
    // Opened from a result's "Report this": start with that message.
    _applyDraft(ref.read(reportDraftProvider));
  }

  void _applyDraft(String? draft) {
    if (draft == null || draft.isEmpty) return;
    _controller.text = draft;
    Future.microtask(() {
      if (!mounted) return;
      ref.read(reportDraftProvider.notifier).state = null;
      ref.read(reportProvider.notifier).reset();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final reportState = ref.watch(reportProvider);
    final isOnline = ref.watch(connectivityProvider).valueOrNull ?? true;
    final submitting = reportState.status == ReportStatus.submitting;
    // The tab stays alive between visits, so also pick up drafts sent later.
    ref.listen<String?>(reportDraftProvider, (_, next) => _applyDraft(next));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Report a scam'),
        actions: [
          TextButton.icon(
            onPressed: () => context.push('/my-reports'),
            icon: const Icon(Icons.inventory_2_outlined, size: 18),
            label: const Text('My reports'),
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: _buildBody(reportState, isOnline, submitting),
        ),
      ),
    );
  }

  Widget _buildBody(ReportState reportState, bool isOnline, bool submitting) {
    switch (reportState.status) {
      case ReportStatus.done:
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 36),
          child: Column(
            children: [
              TweenAnimationBuilder<double>(
                tween: Tween(begin: 0, end: 1),
                duration: const Duration(milliseconds: 500),
                curve: Curves.elasticOut,
                builder: (context, value, child) => Transform.scale(scale: value, child: child),
                child: const CircleAvatar(
                  radius: 32,
                  backgroundColor: AppColors.successBg,
                  child: Icon(Icons.check_rounded, color: AppColors.success, size: 34),
                ),
              ),
              const SizedBox(height: 16),
              const Text('Report submitted', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17, color: AppColors.onSurface)),
              const SizedBox(height: 6),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 24),
                child: Text(
                  "Thanks. A moderator will review this before it's counted toward public stats.",
                  textAlign: TextAlign.center,
                  style: TextStyle(color: AppColors.onSurfaceMuted, fontSize: 13),
                ),
              ),
              const SizedBox(height: 16),
              _reportAnotherButton(),
            ],
          ),
        );
      case ReportStatus.queued:
        return EmptyState(
          icon: Icons.cloud_upload_outlined,
          title: 'Saved. It will submit when you are back online',
          description: "You're offline right now, so this report is queued on your device and will send "
              'automatically once you reconnect.',
          action: _reportAnotherButton(),
        );
      default:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              "Seen a scam SMS that didn't come to you directly? Share it so a moderator can review it and warn others.",
              style: TextStyle(color: AppColors.onSurfaceMuted, fontSize: 13),
            ),
            if (!isOnline) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.warningBg,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.warning.withValues(alpha: 0.3)),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.wifi_off_rounded, size: 16, color: AppColors.warning),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        "You're offline. This will be queued and submitted when you are back online.",
                        style: TextStyle(color: AppColors.warning, fontSize: 12.5),
                      ),
                    ),
                  ],
                ),
              ),
            ],
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
              onPressed: submitting ? null : _submit,
              child: submitting
                  ? const SizedBox(
                      height: 18,
                      width: 18,
                      child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.onBrand),
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
        );
    }
  }

  Widget _reportAnotherButton() {
    return OutlinedButton(
      onPressed: () {
        _controller.clear();
        setState(() => _category = null);
        ref.read(reportProvider.notifier).reset();
      },
      child: const Text('Report another message'),
    );
  }

  Future<void> _submit() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    HapticFeedback.mediumImpact();
    await ref.read(reportProvider.notifier).submit(text, _category);
  }
}
