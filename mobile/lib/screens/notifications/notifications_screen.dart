import 'package:flutter/material.dart';

import '../../constants/content.dart';
import '../../theme/app_theme.dart';

({IconData icon, Color fg, Color bg}) _style(String type) {
  switch (type) {
    case 'alert':
      return (icon: Icons.campaign_rounded, fg: AppColors.scam, bg: AppColors.scamBg);
    case 'report':
      return (icon: Icons.flag_rounded, fg: AppColors.brand, bg: AppColors.brandBg);
    case 'feedback':
      return (icon: Icons.thumb_up_rounded, fg: AppColors.legit, bg: AppColors.legitBg);
    case 'awareness':
      return (icon: Icons.menu_book_rounded, fg: AppColors.info, bg: AppColors.infoBg);
    default:
      return (icon: Icons.settings_rounded, fg: AppColors.onSurfaceMuted, bg: AppColors.surfaceMuted);
  }
}

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Notifications')),
      body: SafeArea(
        child: kNotifications.isEmpty
            ? const Center(child: Text("You're all caught up", style: TextStyle(color: AppColors.onSurfaceMuted)))
            : ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: kNotifications.length,
                separatorBuilder: (_, __) => const SizedBox(height: 10),
                itemBuilder: (context, index) {
                  final n = kNotifications[index];
                  final s = _style(n.type);
                  return Card(
                    child: Padding(
                      padding: const EdgeInsets.all(14),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            height: 42,
                            width: 42,
                            decoration: BoxDecoration(color: s.bg, borderRadius: BorderRadius.circular(11)),
                            child: Icon(s.icon, color: s.fg, size: 20),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Expanded(
                                      child: Text(n.title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.onSurface)),
                                    ),
                                    if (!n.read)
                                      Container(
                                        height: 8,
                                        width: 8,
                                        decoration: const BoxDecoration(color: AppColors.brand, shape: BoxShape.circle),
                                      ),
                                  ],
                                ),
                                const SizedBox(height: 3),
                                Text(n.body, style: const TextStyle(fontSize: 13, color: AppColors.onSurfaceMuted, height: 1.4)),
                                const SizedBox(height: 5),
                                Text(n.time, style: const TextStyle(fontSize: 11.5, color: AppColors.onSurfaceMuted)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
      ),
    );
  }
}
