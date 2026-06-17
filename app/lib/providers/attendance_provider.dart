import 'package:flutter/foundation.dart';

import '../data/mock_data.dart';
import '../models/attendance_record.dart';
import '../services/location_service.dart';

class AttendanceProvider extends ChangeNotifier {
  final List<AttendanceRecord> _records = buildMockAttendance();
  AttendanceRecord? _today;
  bool _isCapturing = false;

  List<AttendanceRecord> get history => List.unmodifiable(_records);
  AttendanceRecord? get today => _today;
  bool get isCapturing => _isCapturing;
  bool get isMarkedToday => _today != null;

  Future<void> markAttendance() async {
    _isCapturing = true;
    notifyListeners();

    final position = await LocationService.getCurrentPosition();
    final now = DateTime.now();
    _today = AttendanceRecord(
      date: DateTime(now.year, now.month, now.day),
      markedAt: now,
      latitude: position?.latitude,
      longitude: position?.longitude,
    );

    _isCapturing = false;
    notifyListeners();
  }
}
