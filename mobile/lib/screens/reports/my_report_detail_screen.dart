import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../providers/my_reports_provider.dart';
import '../../services/my_reports_service.dart';
import '../../theme/app_theme.dart';
import '../../widgets/empty_state.dart';
import '../../widgets/section_label.dart';

/// One report with its review timeline, like the web's /app/reports/:id.
class MyReportDetailScreen extends ConsumerWidget {
  final String reportId;
  const MyReportDetailScreen({super.key, required this.reportId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final reports = ref.watch(myReportsProvider);
    return Scaffold(
      appBar: AppBar(title: Text(reportId.startsWith('SR-') ? reportId : 'Report')),
      body: SafeArea(
        child: reports.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (e, _) => EmptyState(icon: Icons.error_outline, title: "Couldn't load this report", description: '$e'),
          data: (all) {
            MyReport? report;
            for (final r in all) {
              if (r.id == reportId) report = r;
            }
            if (report == null) {
              return const EmptyState(icon: Icons.search_off_rounded, title: 'Report not found');
            }
            return _Body(report: report);
          },
        ),
      ),
    );
  }
}

class _Body extends StatelessWidget {
  final MyReport report;
  const _Body({required this.report});

  @override
  Widget build(BuildContext context) {
    final status = report.status;
    final decided = status == 'approved' || status == 'rejected';
    final steps = [
      (title: 'Submitted', done: status != 'queued', detail: status == 'queued' ? 'Waiting for a connection' : _when(report.submittedAt)),
      (title: 'Under review', done: status != 'queued', detail: decided ? 'Reviewed by a moderator' : 'A moderator will check it'),
      (
        title: status == 'rejected' ? 'Not added' : 'Added to community stats',
        done: decided,
        detail: decided ? report.note : 'Pending',
      ),
    ];

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 28),
      children: [
        Row(
          children: [
            StatusPill(status),
            const SizedBox(width: 10),
            Expanded(child: Text(categoryLabel(report.category), style: const TextStyle(color: AppColors.onSurfaceMuted, fontSize: 13))),
          ],
        ),
        const SizedBox(height: 16),
        const SectionLabel('Reported message'),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.black.withValues(alpha: 0.3),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: Colors.white.withValues(alpha: 0.06)),
          ),
          child: SelectableText(report.message, style: AppFonts.message(fontSize: 14.5, height: 1.5)),
        ),
        const SizedBox(height: 22),
        const SectionLabel('Review progress'),
        for (var i = 0; i < steps.length; i++)
          _TimelineStep(
            title: steps[i].title,
            detail: steps[i].detail,
            done: steps[i].done,
            rejected: status == 'rejected' && i == steps.length - 1,
            last: i == steps.length - 1,
          ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(14)),
          child: const Text(
            'Approved reports feed the community stats and alerts. Reports are never added to the training data automatically.',
            style: TextStyle(fontSize: 12.5, color: AppColors.onSurfaceMuted, height: 1.45),
          ),
        ),
      ],
    );
  }

  static String _when(DateTime d) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    final hh = d.hour.toString().padLeft(2, '0');
    final mm = d.minute.toString().padLeft(2, '0');
    return '${d.day} ${months[d.month - 1]} ${d.year}, $hh:$mm';
  }
}

class _TimelineStep extends StatelessWidget {
  final String title;
  final String detail;
  final bool done;
  final bool rejected;
  final bool last;

  const _TimelineStep({required this.title, required this.detail, required this.done, required this.rejected, required this.last});

  @override
  Widget build(BuildContext context) {
    final color = rejected ? AppColors.danger : (done ? AppColors.success : AppColors.onSurfaceMuted);
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Column(
            children: [
              Container(
                width: 22,
                height: 22,
                decoration: BoxDecoration(
                  color: done ? color.withValues(alpha: 0.18) : Colors.transparent,
                  shape: BoxShape.circle,
                  border: Border.all(color: color, width: 1.5),
                ),
                child: done ? Icon(rejected ? Icons.close_rounded : Icons.check_rounded, size: 13, color: color) : null,
              ),
              if (!last) Expanded(child: Container(width: 1.5, color: done ? color.withValues(alpha: 0.5) : AppColors.outline)),
            ],
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: TextStyle(fontWeight: FontWeight.w600, color: done ? AppColors.onSurface : AppColors.onSurfaceMuted)),
                  const SizedBox(height: 3),
                  Text(detail, style: const TextStyle(fontSize: 12.5, color: AppColors.onSurfaceMuted, height: 1.4)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
