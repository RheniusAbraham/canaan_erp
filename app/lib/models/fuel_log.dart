/// A single fuel fill-up logged by the driver for their assigned truck.
class FuelLogEntry {
  final String id;
  final DateTime date;
  final double amount;
  final double litres;
  final double odometer;
  final String? photoPath;

  const FuelLogEntry({
    required this.id,
    required this.date,
    required this.amount,
    required this.litres,
    required this.odometer,
    this.photoPath,
  });

  /// Price per litre, derived from the logged amount and quantity.
  double? get pricePerLitre => litres > 0 ? amount / litres : null;
}
