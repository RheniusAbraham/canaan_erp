/// The 6 checkpoints a driver must report for every trip.
/// Each checkpoint captures the vehicle's location and time when logged.
enum TripStage {
  startTrip,
  loaded,
  inTransit,
  reached,
  unloaded,
  endTrip,
}

extension TripStageX on TripStage {
  /// Label shown on the timeline.
  String get label {
    switch (this) {
      case TripStage.startTrip:
        return 'Start Trip';
      case TripStage.loaded:
        return 'Loaded';
      case TripStage.inTransit:
        return 'In Transit';
      case TripStage.reached:
        return 'Reached';
      case TripStage.unloaded:
        return 'Unloaded';
      case TripStage.endTrip:
        return 'End Trip';
    }
  }

  /// Label shown on the action button used to log this checkpoint.
  String get actionLabel {
    switch (this) {
      case TripStage.startTrip:
        return 'Start Trip';
      case TripStage.loaded:
        return 'Mark as Loaded';
      case TripStage.inTransit:
        return 'Start Transit';
      case TripStage.reached:
        return 'Mark as Reached';
      case TripStage.unloaded:
        return 'Mark as Unloaded';
      case TripStage.endTrip:
        return 'End Trip';
    }
  }
}

/// A captured checkpoint: which stage, when, and where the vehicle was.
class TripStageEntry {
  final TripStage stage;
  final DateTime timestamp;
  final double? latitude;
  final double? longitude;

  /// Odometer reading (km) captured at this checkpoint. Only recorded for
  /// [TripStage.startTrip] and [TripStage.endTrip], used to derive the
  /// per-trip distance.
  final double? odometer;

  const TripStageEntry({
    required this.stage,
    required this.timestamp,
    this.latitude,
    this.longitude,
    this.odometer,
  });

  bool get hasLocation => latitude != null && longitude != null;
}
