import 'package:flutter_test/flutter_test.dart';

import 'package:scamshield_lk/main.dart';

void main() {
  testWidgets('App boots to the splash screen', (WidgetTester tester) async {
    await tester.pumpWidget(const ScamShieldApp());

    expect(find.text('ScamShield '), findsOneWidget);
    expect(find.text('LK'), findsOneWidget);
  });
}
