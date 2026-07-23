import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/connectivity_provider.dart';
import '../theme/app_theme.dart';

/// Always-visible online/offline indicator — offline-first UX means the
/// user should never have to guess which model classified their message.
class ConnectivityBadge extends ConsumerWidget {
  const ConnectivityBadge({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final connectivity = ref.watch(connectivityProvider);

    return connectivity.when(
      loading: () => _badge(icon: Icons.sync_rounded, label: 'Checking…', tone: AppColors.onSurfaceMuted, bg: AppColors.surfaceMuted),
      error: (_, __) => _badge(icon: Icons.wifi_off_rounded, label: 'Offline', tone: AppColors.warning, bg: AppColors.warningBg),
      data: (isOnline) => isOnline
          ? _badge(icon: Icons.cloud_done_outlined, label: 'Using live model', tone: AppColors.success, bg: AppColors.successBg)
          : _badge(icon: Icons.wifi_off_rounded, label: 'Using offline model', tone: AppColors.warning, bg: AppColors.warningBg),
    );
  }

  Widget _badge({required IconData icon, required String label, required Color tone, required Color bg}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: tone.withValues(alpha: 0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: tone),
          const SizedBox(width: 5),
          Text(label, style: TextStyle(color: tone, fontWeight: FontWeight.w700, fontSize: 11.5)),
        ],
      ),
    );
  }
}
