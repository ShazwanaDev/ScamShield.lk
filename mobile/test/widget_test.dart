import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:scamshield_lk/main.dart';

void main() {
  testWidgets('App boots to the splash screen', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: ScamShieldApp()));

    // The brand wordmark is a single RichText (two TextSpans), which
    // find.text only matches with findRichText: true — assert on that
    // plus the plain-Text tagline and shield icon instead.
    expect(find.textContaining('ScamShield', findRichText: true), findsOneWidget);
    expect(find.text('Scam SMS detection for Sri Lanka'), findsOneWidget);
    expect(find.byIcon(Icons.shield_rounded), findsOneWidget);
  });
}
