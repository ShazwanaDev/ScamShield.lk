import 'package:flutter/material.dart';

import '../constants/report_categories.dart';
import '../theme/app_theme.dart';

/// Small mono section label, e.g. "YOUR ACTIVITY", used across the app's
/// dashboard-style screens.
class SectionLabel extends StatelessWidget {
  final String text;
  final Widget? trailing;

  const SectionLabel(this.text, {super.key, this.trailing});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Expanded(
            child: Text(
              text.toUpperCase(),
              style: AppFonts.mono(fontSize: 10.5).copyWith(letterSpacing: 1.4),
            ),
          ),
          if (trailing != null) trailing!,
        ],
      ),
    );
  }
}

/// Human label for a report category slug ("otp_fraud" -> "OTP fraud").
String categoryLabel(String? slug) {
  if (slug == null || slug.isEmpty) return 'Uncategorised';
  for (final c in kReportCategories) {
    if (c.value == slug) return c.label;
  }
  return slug.split('_').map((w) => w.isEmpty ? w : '${w[0].toUpperCase()}${w.substring(1)}').join(' ');
}

/// Colour and label for a report status.
({Color color, Color bg, String label}) reportStatusStyle(String status) => switch (status) {
      'approved' => (color: AppColors.success, bg: AppColors.successBg, label: 'Approved'),
      'rejected' => (color: AppColors.danger, bg: AppColors.dangerBg, label: 'Rejected'),
      'queued' => (color: AppColors.info, bg: AppColors.infoBg, label: 'Waiting to send'),
      _ => (color: AppColors.warning, bg: AppColors.warningBg, label: 'Pending review'),
    };

/// Rounded status pill.
class StatusPill extends StatelessWidget {
  final String status;
  const StatusPill(this.status, {super.key});

  @override
  Widget build(BuildContext context) {
    final s = reportStatusStyle(status);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: s.bg,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: s.color.withValues(alpha: 0.3)),
      ),
      child: Text(s.label, style: TextStyle(color: s.color, fontSize: 11.5, fontWeight: FontWeight.w600)),
    );
  }
}
