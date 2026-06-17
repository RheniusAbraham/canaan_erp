import 'trip_stage.dart';

enum TripStatus { assigned, inProgress, completed, cancelled }

extension TripStatusX on TripStatus {
  String get label {
    switch (this) {
      case TripStatus.assigned:
        return 'Assigned';
      case TripStatus.inProgress:
        return 'In Progress';
      case TripStatus.completed:
        return 'Completed';
      case TripStatus.cancelled:
        return 'Cancelled';
    }
  }
}

class Trip {
  final String id;
  final String tripId;
  final String customerName;
  final String origin;
  final String destination;
  final DateTime scheduledDate;
  final String cargoDescription;
  final TripStatus status;

  /// Cargo weight in tons, captured when the trip is assigned.
  final double? cargoWeightTons;

  /// Checkpoints logged so far, in order (Start Trip, Loaded, In Transit,
  /// Reached, Unloaded, End Trip). Each entry's index corresponds to the
  /// matching [TripStage.values] index.
  final List<TripStageEntry> stageLog;

  const Trip({
    required this.id,
    required this.tripId,
    required this.customerName,
    required this.origin,
    required this.destination,
    required this.scheduledDate,
    required this.cargoDescription,
    required this.status,
    this.cargoWeightTons,
    this.stageLog = const [],
  });

  /// The next checkpoint the driver needs to log, or null once all
  /// checkpoints (including End Trip) are complete.
  TripStage? get nextStage {
    if (stageLog.length >= TripStage.values.length) return null;
    return TripStage.values[stageLog.length];
  }

  bool get hasStartedJourney => stageLog.isNotEmpty;
  bool get isJourneyComplete => stageLog.length == TripStage.values.length;

  /// Odometer reading (km) captured when the driver tapped "Start Trip".
  double? get startOdometer => stageLog
      .where((e) => e.stage == TripStage.startTrip)
      .map((e) => e.odometer)
      .firstWhere((o) => o != null, orElse: () => null);

  /// Odometer reading (km) captured when the driver tapped "End Trip".
  double? get endOdometer => stageLog
      .where((e) => e.stage == TripStage.endTrip)
      .map((e) => e.odometer)
      .firstWhere((o) => o != null, orElse: () => null);

  /// Distance covered during this trip, derived from the start/end
  /// odometer readings. Null until both have been captured.
  double? get distanceKm {
    final start = startOdometer;
    final end = endOdometer;
    if (start == null || end == null) return null;
    final distance = end - start;
    return distance >= 0 ? distance : null;
  }

  Trip copyWith({TripStatus? status, List<TripStageEntry>? stageLog}) {
    return Trip(
      id: id,
      tripId: tripId,
      customerName: customerName,
      origin: origin,
      destination: destination,
      scheduledDate: scheduledDate,
      cargoDescription: cargoDescription,
      status: status ?? this.status,
      cargoWeightTons: cargoWeightTons,
      stageLog: stageLog ?? this.stageLog,
    );
  }
}
