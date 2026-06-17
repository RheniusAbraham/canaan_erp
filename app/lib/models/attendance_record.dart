class AttendanceRecord {
  final DateTime date;
  final DateTime markedAt;
  final double? latitude;
  final double? longitude;

  const AttendanceRecord({
    required this.date,
    required this.markedAt,
    this.latitude,
    this.longitude,
  });

  bool get hasLocation => latitude != null && longitude != null;
}
