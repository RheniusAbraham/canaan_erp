// Basic smoke test for the Canaan ERP driver app.

import 'package:flutter_test/flutter_test.dart';

import 'package:canaan_erp_app/app.dart';

void main() {
  testWidgets('Driver home renders attendance and trip status', (WidgetTester tester) async {
    await tester.pumpWidget(const CanaanErpApp());

    expect(find.text('Attendance'), findsOneWidget);
    expect(find.text('Mark Attendance'), findsOneWidget);
  });
}
