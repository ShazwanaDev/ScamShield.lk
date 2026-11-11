import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../providers/my_reports_provider.dart';
import '../../services/my_reports_service.dart';
import '../../theme/app_theme.dart';
import '../../widgets/empty_state.dart';
import '../../widgets/section_label.dart';

/// The reports this device has sent, like the web's /app/reports.
class MyReportsScreen extends ConsumerStatefulWidget {
  const MyReportsScreen({super.key});

  @override
  ConsumerState<MyReportsScreen> createState() => _MyReportsScreenState();
}

class _MyReportsScreenState extends ConsumerState<MyReportsScreen> {
  String _filter = 'all';

  static const _filters = [
    ('all', 'All'),
    ('pending', 'Pending'),
    ('approved', 'Approved'),
    ('rejected', 'Rejected'),
  ];

  @override
  Widget build(BuildContext context) {
    final reportsAsync = ref.watch(myReportsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('My reports')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.go('/report'),
        backgroundColor: AppColors.brandFill,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add_rounded),
        label: const Text('New report'),
      ),
      body: SafeArea(
        child: reportsAsync.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (e, _) => EmptyState(icon: Icons.error_outline, title: "Couldn't load your reports", description: '$e'),
          data: (reports) {
            if (reports.isEmpty) {
              return const EmptyState(
                icon: Icons.flag_outlined,
                title: 'No reports yet',
                description: 'Scams you report appear here so you can follow the moderator review.',
              );
            }
            final shown = reports.where((r) => _matches(r, _filter)).toList();
            final count = {for (final f in _filters) f.$1: reports.where((r) => _matches(r, f.$1)).length};
            return RefreshIndicator(
              onRefresh: () => ref.refresh(myReportsProvider.future),
              child: ListView(
                padding: const EdgeInsets.fromLTRB(16, 4, 16, 96),
                children: [
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        for (final f in _filters) ...[
                          ChoiceChip(
                            label: Text('${f.$2}  ${count[f.$1]}'),
                            selected: _filter == f.$1,
                            onSelected: (_) => setState(() => _filter = f.$1),
                          ),
                          const SizedBox(width: 8),
                        ],
                      ],
                    ),
                  ),
                  const SizedBox(height: 14),
                  if (shown.isEmpty)
                    const Padding(
                      padding: EdgeInsets.only(top: 40),
                      child: EmptyState(icon: Icons.filter_list_off_rounded, title: 'Nothing in this filter'),
                    ),
                  for (final r in shown) ...[
                    _ReportTile(report: r),
                    const SizedBox(height: 10),
                  ],
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  // "Pending" also covers reports still waiting to be sent.
  static bool _matches(MyReport r, String filter) => switch (filter) {
        'all' => true,
        'pending' => r.status == 'pending' || r.status == 'queued',
        _ => r.status == filter,
      };
}

class _ReportTile extends StatelessWidget {
  final MyReport report;
  const _ReportTile({required this.report});

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => context.push('/my-reports/${Uri.encodeComponent(report.id)}'),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  StatusPill(report.status),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      categoryLabel(report.category),
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontSize: 12, color: AppColors.onSurfaceMuted),
                    ),
                  ),
                  Text(_shortDate(report.submittedAt), style: AppFonts.mono(fontSize: 10.5)),
                ],
              ),
              const SizedBox(height: 10),
              Text(report.message, maxLines: 2, overflow: TextOverflow.ellipsis, style: AppFonts.message(fontSize: 14, height: 1.45)),
            ],
          ),
        ),
      ),
    );
  }
}

String _shortDate(DateTime d) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return '${d.day} ${months[d.month - 1]}';
}
