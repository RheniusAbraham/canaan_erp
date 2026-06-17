import 'package:flutter/foundation.dart';

import '../data/mock_data.dart';
import '../models/trip.dart';
import '../models/trip_expense.dart';
import '../models/trip_stage.dart';
import '../services/location_service.dart';

class TripProvider extends ChangeNotifier {
  final List<Trip> _trips = buildMockTrips();

  /// Trip ids currently fetching location for a checkpoint update.
  final Set<String> _loggingTripIds = {};

  /// Expense breakdown per trip, keyed by trip id.
  final Map<String, TripExpenses> _expenses = {};

  List<Trip> get trips => List.unmodifiable(_trips);

  List<Trip> get activeTrips => _trips
      .where((t) => t.status == TripStatus.assigned || t.status == TripStatus.inProgress)
      .toList();

  List<Trip> get tripHistory =>
      _trips.where((t) => t.status == TripStatus.completed || t.status == TripStatus.cancelled).toList();

  /// The trip the driver should focus on: an in-progress trip first,
  /// otherwise the next assigned trip.
  Trip? get currentTrip {
    final inProgress = _trips.where((t) => t.status == TripStatus.inProgress);
    if (inProgress.isNotEmpty) return inProgress.first;

    final assigned = _trips.where((t) => t.status == TripStatus.assigned);
    return assigned.isEmpty ? null : assigned.first;
  }

  bool isLoggingStage(String tripId) => _loggingTripIds.contains(tripId);

  /// Logs the next checkpoint for [tripId], capturing the current
  /// time and device location. [odometer] should be supplied for the
  /// Start Trip and End Trip checkpoints so per-trip distance can be
  /// derived.
  Future<void> advanceStage(String tripId, {double? odometer}) async {
    final index = _trips.indexWhere((t) => t.id == tripId);
    if (index == -1) return;

    final trip = _trips[index];
    final next = trip.nextStage;
    if (next == null) return;

    _loggingTripIds.add(tripId);
    notifyListeners();

    final position = await LocationService.getCurrentPosition();

    final entry = TripStageEntry(
      stage: next,
      timestamp: DateTime.now(),
      latitude: position?.latitude,
      longitude: position?.longitude,
      odometer: odometer,
    );

    final currentIndex = _trips.indexWhere((t) => t.id == tripId);
    if (currentIndex != -1) {
      final updatedLog = [..._trips[currentIndex].stageLog, entry];
      TripStatus newStatus = _trips[currentIndex].status;
      if (next == TripStage.startTrip) {
        newStatus = TripStatus.inProgress;
      } else if (next == TripStage.endTrip) {
        newStatus = TripStatus.completed;
      }
      _trips[currentIndex] = _trips[currentIndex].copyWith(status: newStatus, stageLog: updatedLog);
    }

    _loggingTripIds.remove(tripId);
    notifyListeners();
  }

  /// Expense breakdown logged for [tripId], or an empty breakdown.
  TripExpenses expensesFor(String tripId) => _expenses[tripId] ?? const TripExpenses();

  /// Whether the driver is still allowed to edit expenses for [tripId].
  /// Locked once the trip is completed or cancelled.
  bool canEditExpenses(String tripId) {
    final trip = _trips.where((t) => t.id == tripId);
    if (trip.isEmpty) return false;
    final status = trip.first.status;
    return status != TripStatus.completed && status != TripStatus.cancelled;
  }

  void updateFuel(String tripId, double amount) {
    _expenses[tripId] = expensesFor(tripId).copyWith(fuel: amount);
    notifyListeners();
  }

  void updatePayout(String tripId, PayoutExpense Function(PayoutExpense) update) {
    final current = expensesFor(tripId);
    _expenses[tripId] = current.copyWith(payout: update(current.payout));
    notifyListeners();
  }

  void updateOperating(String tripId, OperatingExpense Function(OperatingExpense) update) {
    final current = expensesFor(tripId);
    _expenses[tripId] = current.copyWith(operating: update(current.operating));
    notifyListeners();
  }

  void addOtherExpense(String tripId, String label, double amount) {
    final current = expensesFor(tripId);
    final entry = OtherExpenseItem(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      label: label,
      amount: amount,
    );
    _expenses[tripId] = current.copyWith(otherExpenses: [...current.otherExpenses, entry]);
    notifyListeners();
  }

  void removeOtherExpense(String tripId, String expenseId) {
    final current = expensesFor(tripId);
    _expenses[tripId] = current.copyWith(
      otherExpenses: current.otherExpenses.where((e) => e.id != expenseId).toList(),
    );
    notifyListeners();
  }
}
