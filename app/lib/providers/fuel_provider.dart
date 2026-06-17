import 'package:flutter/foundation.dart';

import '../data/mock_data.dart';
import '../models/fuel_log.dart';

class FuelProvider extends ChangeNotifier {
  final List<FuelLogEntry> _entries = buildMockFuelEntries();

  /// Most recent fill-ups first.
  List<FuelLogEntry> get entries =>
      List.unmodifiable(_entries.toList()..sort((a, b) => b.date.compareTo(a.date)));

  double get totalAmount => _entries.fold(0, (sum, e) => sum + e.amount);

  double get totalLitres => _entries.fold(0, (sum, e) => sum + e.litres);

  /// Average mileage (km/L) for the assigned truck, derived from the
  /// distance covered between fuel log entries and the litres consumed
  /// over that distance. Returns null until at least two entries exist
  /// (a single reading has no distance to compare against).
  ///
  /// The earliest entry's litres are excluded from the total since that
  /// fill-up powered the distance travelled *before* it was logged.
  double? get averageMileage {
    if (_entries.length < 2) return null;

    final sorted = _entries.toList()..sort((a, b) => a.date.compareTo(b.date));
    final distance = sorted.last.odometer - sorted.first.odometer;
    if (distance <= 0) return null;

    final litresConsumed = sorted.skip(1).fold(0.0, (sum, e) => sum + e.litres);
    if (litresConsumed <= 0) return null;

    return distance / litresConsumed;
  }

  void addEntry({
    required double amount,
    required double litres,
    required double odometer,
    String? photoPath,
  }) {
    _entries.add(
      FuelLogEntry(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        date: DateTime.now(),
        amount: amount,
        litres: litres,
        odometer: odometer,
        photoPath: photoPath,
      ),
    );
    notifyListeners();
  }
}
