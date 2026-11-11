import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../providers/auth_provider.dart';
import '../../providers/history_provider.dart';
import '../../providers/report_provider.dart';
import '../../providers/settings_provider.dart';
import '../../services/report_queue_service.dart';
import '../../services/settings_service.dart';
import '../../theme/app_theme.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  bool _syncing = false;

  Future<void> _syncNow() async {
    setState(() => _syncing = true);
    final flushed = await ReportQueueService.flush();
    ref.invalidate(pendingReportCountProvider);
    if (!mounted) return;
    setState(() => _syncing = false);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(flushed > 0 ? 'Synced $flushed queued report(s).' : 'Nothing to sync. All caught up.')),
    );
  }

  void _confirmClearHistory() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Clear local history?'),
        content: const Text('This permanently removes every saved check from this device.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(
            onPressed: () {
              ref.read(historyProvider.notifier).clearAll();
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('History cleared.')));
            },
            child: const Text('Clear', style: TextStyle(color: AppColors.danger)),
          ),
        ],
      ),
    );
  }

  Future<void> _logout() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Log out?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Log out', style: TextStyle(color: AppColors.danger)),
          ),
        ],
      ),
    );
    if (confirmed != true) return;
    HapticFeedback.mediumImpact();
    await ref.read(authProvider.notifier).logout();
    if (mounted) context.go('/login');
  }

  @override
  Widget build(BuildContext context) {
    final settings = ref.watch(settingsProvider);
    final pendingCount = ref.watch(pendingReportCountProvider);
    final auth = ref.watch(authProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const _SectionLabel('OFFLINE & MODEL'),
            Card(
              child: SwitchListTile(
                value: settings.preferOffline,
                onChanged: (v) => ref.read(settingsProvider.notifier).setPreferOffline(v),
                title: const Text('Prefer offline mode'),
                subtitle: const Text(
                  'Always use the on-device model, even when connected.',
                  style: TextStyle(fontSize: 12),
                ),
              ),
            ),
            const SizedBox(height: 20),
            const _SectionLabel('LANGUAGE'),
            Card(
              child: RadioGroup<AppLanguage>(
                groupValue: settings.language,
                onChanged: (v) {
                  if (v != null) ref.read(settingsProvider.notifier).setLanguage(v);
                },
                child: Column(
                  children: AppLanguage.values
                      .map((lang) => RadioListTile<AppLanguage>(value: lang, title: Text(lang.label)))
                      .toList(),
                ),
              ),
            ),
            const SizedBox(height: 20),
            const _SectionLabel('SYNC'),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            pendingCount.when(
                              data: (n) => n == 0 ? 'All caught up' : '$n report(s) waiting to sync',
                              loading: () => 'Checking…',
                              error: (_, __) => 'Sync status unavailable',
                            ),
                            style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5),
                          ),
                          const SizedBox(height: 3),
                          const Text(
                            'Reports made while offline are queued on this device.',
                            style: TextStyle(fontSize: 11.5, color: AppColors.onSurfaceMuted),
                          ),
                        ],
                      ),
                    ),
                    OutlinedButton(
                      onPressed: _syncing ? null : _syncNow,
                      child: _syncing
                          ? const SizedBox(height: 16, width: 16, child: CircularProgressIndicator(strokeWidth: 2))
                          : const Text('Sync now'),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            const _SectionLabel('DATA'),
            Card(
              child: ListTile(
                leading: const Icon(Icons.delete_sweep_outlined, color: AppColors.danger),
                title: const Text('Clear local history'),
                onTap: _confirmClearHistory,
              ),
            ),
            const SizedBox(height: 20),
            const _SectionLabel('ACCOUNT'),
            Card(
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.person_outline_rounded),
                    title: Text(auth.user?.isGuest == true ? 'Guest' : (auth.user?.email ?? 'Account')),
                    subtitle: const Text('View profile'),
                    onTap: () => context.push('/profile'),
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.logout_rounded, color: AppColors.danger),
                    title: const Text('Log out', style: TextStyle(color: AppColors.danger)),
                    onTap: _logout,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Center(
              child: Column(
                children: [
                  Icon(Icons.shield_rounded, color: AppColors.brand, size: 22),
                  SizedBox(height: 6),
                  Text('ScamShield LK', style: TextStyle(fontWeight: FontWeight.w700, color: AppColors.onSurface)),
                  SizedBox(height: 2),
                  Text('Version 0.1.0', style: TextStyle(fontSize: 11.5, color: AppColors.onSurfaceMuted)),
                ],
              ),
            ),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  final String label;
  const _SectionLabel(this.label);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8, left: 4),
      child: Text(
        label,
        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 0.5, color: AppColors.onSurfaceMuted),
      ),
    );
  }
}
