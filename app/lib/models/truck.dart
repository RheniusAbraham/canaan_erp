class AssignedTruck {
  final String truckId;
  final String registrationNumber;
  final String manufacturer;
  final String modelName;
  final String truckType;

  const AssignedTruck({
    required this.truckId,
    required this.registrationNumber,
    required this.manufacturer,
    required this.modelName,
    required this.truckType,
  });

  String get displayName => '$manufacturer $modelName';
}
