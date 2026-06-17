import '../models/attendance_record.dart';
import '../models/driver.dart';
import '../models/fuel_log.dart';
import '../models/trip.dart';
import '../models/trip_stage.dart';
import '../models/truck.dart';

/// Mock data mirroring the records used in the admin web app
/// (frontend/src/lib/driver-data.ts, truck-data.ts) until the
/// backend API is wired up.
final List<Driver> mockDrivers = [
  const Driver(
    id: '0',
    driverId: 'CGI-D000',
    name: 'Arun Kumar',
    contactNumber: '+91 90000 11122',
    email: 'arun.kumar@canaanglobal.com',
    branch: 'Coimbatore',
    licenseNumber: 'TN38 20170099887',
    licenseExpiryDate: '2027-04-12',
    username: 'arun.kumar@canaanglobal.com',
    password: 'Arun@1234',
  ),
  const Driver(
    id: '1',
    driverId: 'CGI-D001',
    name: 'Suresh Kumar',
    contactNumber: '+91 99887 66554',
    email: 'suresh.kumar@canaanglobal.com',
    branch: 'Coimbatore',
    licenseNumber: 'TN38 20180012345',
    licenseExpiryDate: '2028-09-30',
    username: 'suresh.kumar@canaanglobal.com',
    password: 'Suresh@1234',
  ),
  const Driver(
    id: '2',
    driverId: 'CGI-D002',
    name: 'Manoj Pillai',
    contactNumber: '+91 98456 12378',
    email: 'manoj.pillai@canaanglobal.com',
    branch: 'Kochi',
    licenseNumber: 'KL07 20190054321',
    licenseExpiryDate: '2027-01-19',
    username: 'manoj.pillai@canaanglobal.com',
    password: 'Manoj@1234',
  ),
];

/// Driver shown by default while the login flow is not yet wired up.
final Driver mockCurrentDriver = mockDrivers.first;

const AssignedTruck mockAssignedTruck = AssignedTruck(
  truckId: 'CGI-T001',
  registrationNumber: 'TN 38 AX 4521',
  manufacturer: 'Ashok Leyland',
  modelName: '3718 XL',
  truckType: 'Trailer',
);

List<Trip> buildMockTrips() {
  final now = DateTime.now();
  return [
    Trip(
      id: '5',
      tripId: 'TRP-1050',
      customerName: 'Coimbatore Textile Hub',
      origin: 'Coimbatore',
      destination: 'Bengaluru',
      scheduledDate: DateTime(now.year, now.month, now.day, 8, 0),
      cargoDescription: 'Cotton bales - 14 tons',
      cargoWeightTons: 14,
      status: TripStatus.assigned,
    ),
    Trip(
      id: '3',
      tripId: 'TRP-1031',
      customerName: 'Vellore Steel Works',
      origin: 'Coimbatore',
      destination: 'Vellore',
      scheduledDate: now.subtract(const Duration(days: 1)),
      cargoDescription: 'Steel rods - 15 tons',
      cargoWeightTons: 15,
      status: TripStatus.completed,
      stageLog: _completedStageLog(
        start: now.subtract(const Duration(days: 1, hours: 5)),
        startOdometer: 84140,
        endOdometer: 84305,
      ),
    ),
    Trip(
      id: '4',
      tripId: 'TRP-1020',
      customerName: 'Nilgiris Fresh Foods',
      origin: 'Coimbatore',
      destination: 'Ooty',
      scheduledDate: now.subtract(const Duration(days: 3)),
      cargoDescription: 'Cold storage produce - 8 tons',
      cargoWeightTons: 8,
      status: TripStatus.completed,
      stageLog: _completedStageLog(
        start: now.subtract(const Duration(days: 3, hours: 6)),
        startOdometer: 84005,
        endOdometer: 84140,
      ),
    ),
  ];
}

/// Builds a fully-logged checkpoint history for a completed trip, with
/// odometer readings captured at Start Trip and End Trip.
List<TripStageEntry> _completedStageLog({
  required DateTime start,
  required double startOdometer,
  required double endOdometer,
}) {
  return [
    TripStageEntry(stage: TripStage.startTrip, timestamp: start, odometer: startOdometer),
    TripStageEntry(stage: TripStage.loaded, timestamp: start.add(const Duration(minutes: 30))),
    TripStageEntry(stage: TripStage.inTransit, timestamp: start.add(const Duration(minutes: 45))),
    TripStageEntry(stage: TripStage.reached, timestamp: start.add(const Duration(hours: 3))),
    TripStageEntry(stage: TripStage.unloaded, timestamp: start.add(const Duration(hours: 3, minutes: 30))),
    TripStageEntry(stage: TripStage.endTrip, timestamp: start.add(const Duration(hours: 4)), odometer: endOdometer),
  ];
}

/// Mock fuel log history for the assigned truck, used to derive its
/// average mileage (km/L) on the Fuel page.
List<FuelLogEntry> buildMockFuelEntries() {
  final now = DateTime.now();
  return [
    FuelLogEntry(
      id: 'f1',
      date: now.subtract(const Duration(days: 18)),
      amount: 18000,
      litres: 200,
      odometer: 83600,
    ),
    FuelLogEntry(
      id: 'f2',
      date: now.subtract(const Duration(days: 11)),
      amount: 9900,
      litres: 110,
      odometer: 84140,
    ),
    FuelLogEntry(
      id: 'f3',
      date: now.subtract(const Duration(days: 4)),
      amount: 10350,
      litres: 115,
      odometer: 84500,
    ),
  ];
}

List<AttendanceRecord> buildMockAttendance() {
  final now = DateTime.now();
  return List.generate(7, (index) {
    final day = DateTime(now.year, now.month, now.day).subtract(Duration(days: index + 1));
    return AttendanceRecord(
      date: day,
      markedAt: day.add(const Duration(hours: 8, minutes: 5)),
      latitude: 8.7433646,
      longitude: 78.0522719,
    );
  });
}
