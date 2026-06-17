import 'package:geolocator/geolocator.dart';

/// Wraps geolocator to fetch the device's current position for
/// trip checkpoint logging. Returns null if permission is denied or
/// location services are unavailable, so callers can still record
/// the timestamp without blocking the driver's update.
class LocationService {
  LocationService._();

  static Future<Position?> getCurrentPosition() async {
    try {
      final serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) return null;

      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      if (permission == LocationPermission.denied || permission == LocationPermission.deniedForever) {
        return null;
      }

      return await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
      );
    } catch (_) {
      return null;
    }
  }
}
