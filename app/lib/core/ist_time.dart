import 'package:intl/intl.dart';

/// Formats a [DateTime] as Indian Standard Time (UTC+5:30), regardless of
/// the device's local timezone.
String formatIst(DateTime time) {
  final ist = time.toUtc().add(const Duration(hours: 5, minutes: 30));
  return '${DateFormat('h:mm a').format(ist)} IST';
}
