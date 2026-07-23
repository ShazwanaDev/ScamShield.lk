import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../providers/auth_provider.dart';
import '../../theme/app_theme.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  Future<void> _editName(BuildContext context, WidgetRef ref, String? current) async {
    final controller = TextEditingController(text: current);
    final name = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Edit name'),
        content: TextField(
          controller: controller,
          autofocus: true,
          decoration: const InputDecoration(labelText: 'Display name'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(ctx, controller.text.trim()), child: const Text('Save')),
        ],
      ),
    );
    if (name != null && name.isNotEmpty) {
      await ref.read(authProvider.notifier).updateDisplayName(name);
    }
  }

  Future<void> _logout(BuildContext context, WidgetRef ref) async {
    HapticFeedback.mediumImpact();
    await ref.read(authProvider.notifier).logout();
    if (context.mounted) context.go('/login');
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authProvider);
    final user = auth.user;
    final isGuest = user?.isGuest ?? true;

    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Center(
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: AppColors.brand.withValues(alpha: 0.14),
                    child: Icon(
                      isGuest ? Icons.person_outline_rounded : Icons.person_rounded,
                      color: AppColors.brand,
                      size: 40,
                    ),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    isGuest ? 'Guest' : (user?.displayName ?? user?.email ?? '—'),
                    style: const TextStyle(fontSize: 19, fontWeight: FontWeight.w800, color: AppColors.onSurface),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    isGuest ? 'Local-only mode — not signed in' : (user?.email ?? ''),
                    style: const TextStyle(fontSize: 13, color: AppColors.onSurfaceMuted),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 28),
            if (isGuest)
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.warningBg,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.warning.withValues(alpha: 0.3)),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.info_outline_rounded, color: AppColors.warning, size: 18),
                    SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        "You're in guest mode. Register to sync your history and reports across devices.",
                        style: TextStyle(color: AppColors.warning, fontSize: 12.5),
                      ),
                    ),
                  ],
                ),
              )
            else
              Card(
                child: ListTile(
                  leading: const Icon(Icons.edit_outlined),
                  title: const Text('Edit name'),
                  onTap: () => _editName(context, ref, user?.displayName),
                ),
              ),
            const SizedBox(height: 16),
            Card(
              child: ListTile(
                leading: const Icon(Icons.settings_outlined),
                title: const Text('Settings'),
                trailing: const Icon(Icons.chevron_right_rounded),
                onTap: () => context.push('/settings'),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: ListTile(
                leading: const Icon(Icons.logout_rounded, color: AppColors.danger),
                title: const Text('Log out', style: TextStyle(color: AppColors.danger)),
                onTap: () => _logout(context, ref),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
