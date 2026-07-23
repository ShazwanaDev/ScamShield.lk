import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class OnboardingPageData {
  final IconData icon;
  final String title;
  final String description;

  const OnboardingPageData({required this.icon, required this.title, required this.description});
}

class OnboardingPage extends StatelessWidget {
  final OnboardingPageData data;

  const OnboardingPage({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            height: 140,
            width: 140,
            decoration: BoxDecoration(
              color: AppColors.brand.withValues(alpha: 0.12),
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.brand.withValues(alpha: 0.25)),
            ),
            child: Icon(data.icon, color: AppColors.brand, size: 62),
          ),
          const SizedBox(height: 40),
          Text(
            data.title,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.onSurface),
          ),
          const SizedBox(height: 12),
          Text(
            data.description,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 14.5, color: AppColors.onSurfaceMuted, height: 1.5),
          ),
        ],
      ),
    );
  }
}
