import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../constants/guide_content.dart';
import '../../theme/app_theme.dart';
import '../../widgets/section_label.dart';

/// How it works, FAQ and privacy in one place: the app's version of the web's
/// /how-it-works, /faq and /privacy pages.
class HelpScreen extends StatelessWidget {
  const HelpScreen({super.key});

  static const _steps = [
    (Icons.content_paste_rounded, 'Paste the message', 'Copy any suspicious SMS and paste it on the Home tab, in any language or a mix.'),
    (Icons.translate_rounded, 'We read the language', 'Sinhala, Tamil, English, Singlish and code-mixed text are all handled.'),
    (Icons.memory_rounded, 'The model weighs it', 'A text classifier looks at wording, links and pressure tactics to decide scam, spam or legitimate.'),
    (Icons.auto_fix_high_rounded, 'You see why', 'The risky words are highlighted, with a confidence score and what to do next.'),
  ];

  @override
  Widget build(BuildContext context) {
    final groups = <String, List<FaqItem>>{};
    for (final f in kFaq) {
      groups.putIfAbsent(f.group, () => []).add(f);
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Help and FAQ')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 4, 16, 28),
          children: [
            const SectionLabel('How it works'),
            for (var i = 0; i < _steps.length; i++)
              Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 38,
                          height: 38,
                          decoration: BoxDecoration(color: AppColors.brandBg, borderRadius: BorderRadius.circular(11)),
                          child: Icon(_steps[i].$1, color: AppColors.brandSoft, size: 19),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('${i + 1}. ${_steps[i].$2}', style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14.5)),
                              const SizedBox(height: 3),
                              Text(_steps[i].$3, style: const TextStyle(fontSize: 13, color: AppColors.onSurfaceMuted, height: 1.45)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            const SizedBox(height: 14),
            for (final entry in groups.entries) ...[
              SectionLabel(entry.key),
              Card(
                clipBehavior: Clip.antiAlias,
                child: Column(
                  children: [
                    for (var i = 0; i < entry.value.length; i++) ...[
                      if (i > 0) const Divider(height: 1),
                      Theme(
                        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                        child: ExpansionTile(
                          title: Text(entry.value[i].question, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                          iconColor: AppColors.onSurfaceMuted,
                          collapsedIconColor: AppColors.onSurfaceMuted,
                          childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 14),
                          expandedAlignment: Alignment.centerLeft,
                          children: [
                            Text(entry.value[i].answer, style: const TextStyle(fontSize: 13.5, color: AppColors.onSurfaceMuted, height: 1.5)),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 16),
            ],
            const SectionLabel('More'),
            Card(
              clipBehavior: Clip.antiAlias,
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.category_outlined),
                    title: const Text('Scam types guide'),
                    trailing: const Icon(Icons.chevron_right_rounded),
                    onTap: () => context.push('/scam-types'),
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.menu_book_outlined),
                    title: const Text('Awareness hub'),
                    trailing: const Icon(Icons.chevron_right_rounded),
                    onTap: () => context.push('/awareness'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'ScamShield LK is an independent final year research project. It is not linked to any bank, telecom or government agency.',
              style: TextStyle(fontSize: 12, color: AppColors.onSurfaceMuted, height: 1.45),
            ),
          ],
        ),
      ),
    );
  }
}
