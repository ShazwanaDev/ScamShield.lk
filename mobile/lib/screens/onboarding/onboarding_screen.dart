import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';

import '../../services/settings_service.dart';
import '../../theme/app_theme.dart';
import '../../widgets/onboarding_page.dart';

const _pages = [
  OnboardingPageData(
    icon: Icons.translate_rounded,
    title: 'Built for Sri Lanka\'s SMS reality',
    description:
        'Detects scams written in Sinhala, Tamil, English, or mixed "Singlish" — not just clean English text.',
  ),
  OnboardingPageData(
    icon: Icons.visibility_rounded,
    title: 'See why, not just what',
    description:
        'Every result highlights the exact words that drove the decision, so a verdict is never a black box.',
  ),
  OnboardingPageData(
    icon: Icons.groups_rounded,
    title: 'Report scams the community can act on',
    description:
        'Flag a suspicious message and a moderator reviews it — helping build a public, up-to-date picture of what\'s circulating.',
  ),
];

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _controller = PageController();
  int _index = 0;

  bool get _isLast => _index == _pages.length - 1;

  Future<void> _finish() async {
    HapticFeedback.mediumImpact();
    await SettingsService.setOnboardingSeen();
    if (!mounted) return;
    context.go('/login');
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            Align(
              alignment: Alignment.topRight,
              child: Padding(
                padding: const EdgeInsets.all(8),
                child: TextButton(
                  onPressed: _isLast ? null : _finish,
                  child: Text(
                    'Skip',
                    style: TextStyle(color: _isLast ? Colors.transparent : AppColors.onSurfaceMuted),
                  ),
                ),
              ),
            ),
            Expanded(
              child: PageView.builder(
                controller: _controller,
                itemCount: _pages.length,
                onPageChanged: (i) => setState(() => _index = i),
                itemBuilder: (context, i) => OnboardingPage(data: _pages[i]),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                _pages.length,
                (i) => AnimatedContainer(
                  duration: const Duration(milliseconds: 250),
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  height: 8,
                  width: i == _index ? 22 : 8,
                  decoration: BoxDecoration(
                    color: i == _index ? AppColors.brand : AppColors.outline,
                    borderRadius: BorderRadius.circular(999),
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(24),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    if (_isLast) {
                      _finish();
                    } else {
                      HapticFeedback.selectionClick();
                      _controller.nextPage(duration: const Duration(milliseconds: 320), curve: Curves.easeOut);
                    }
                  },
                  child: Text(_isLast ? 'Get Started' : 'Next'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
