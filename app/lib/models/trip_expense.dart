/// Breakdown of expenses a driver can log against a trip.
class TripExpenses {
  final double fuel;
  final PayoutExpense payout;
  final OperatingExpense operating;
  final List<OtherExpenseItem> otherExpenses;

  const TripExpenses({
    this.fuel = 0,
    this.payout = const PayoutExpense(),
    this.operating = const OperatingExpense(),
    this.otherExpenses = const [],
  });

  double get otherTotal => otherExpenses.fold(0.0, (sum, item) => sum + item.amount);

  double get total => fuel + payout.total + operating.total + otherTotal;

  TripExpenses copyWith({
    double? fuel,
    PayoutExpense? payout,
    OperatingExpense? operating,
    List<OtherExpenseItem>? otherExpenses,
  }) {
    return TripExpenses(
      fuel: fuel ?? this.fuel,
      payout: payout ?? this.payout,
      operating: operating ?? this.operating,
      otherExpenses: otherExpenses ?? this.otherExpenses,
    );
  }
}

/// Clerk, RTO/PC, Unloading, and Lift-On payouts for a trip.
class PayoutExpense {
  final double clerkPayout;
  final double rtoPcRate;
  final int rtoPcQuantity;
  final double unloading;
  final double liftOn;

  const PayoutExpense({
    this.clerkPayout = 0,
    this.rtoPcRate = 0,
    this.rtoPcQuantity = 0,
    this.unloading = 0,
    this.liftOn = 0,
  });

  double get rtoPcTotal => rtoPcRate * rtoPcQuantity;

  double get total => clerkPayout + rtoPcTotal + unloading + liftOn;

  PayoutExpense copyWith({
    double? clerkPayout,
    double? rtoPcRate,
    int? rtoPcQuantity,
    double? unloading,
    double? liftOn,
  }) {
    return PayoutExpense(
      clerkPayout: clerkPayout ?? this.clerkPayout,
      rtoPcRate: rtoPcRate ?? this.rtoPcRate,
      rtoPcQuantity: rtoPcQuantity ?? this.rtoPcQuantity,
      unloading: unloading ?? this.unloading,
      liftOn: liftOn ?? this.liftOn,
    );
  }
}

/// CFS, PASS, and Weight charges for a trip.
class OperatingExpense {
  final double cfs;
  final double pass;
  final double weight;

  const OperatingExpense({this.cfs = 0, this.pass = 0, this.weight = 0});

  double get total => cfs + pass + weight;

  OperatingExpense copyWith({double? cfs, double? pass, double? weight}) {
    return OperatingExpense(
      cfs: cfs ?? this.cfs,
      pass: pass ?? this.pass,
      weight: weight ?? this.weight,
    );
  }
}

/// A one-off, unexpected expense (e.g. "Puncture - 30").
class OtherExpenseItem {
  final String id;
  final String label;
  final double amount;

  const OtherExpenseItem({required this.id, required this.label, required this.amount});
}
