import 'package:flutter/foundation.dart';

import '../data/mock_data.dart';
import '../models/driver.dart';

class AuthProvider extends ChangeNotifier {
  // TODO: replace with a real login flow once the auth API is ready.
  // Defaults to a logged-in driver so the app opens straight to the
  // home dashboard for now.
  Driver? _currentDriver = mockCurrentDriver;
  String? _errorMessage;
  String? _profilePhotoPath;

  Driver? get currentDriver => _currentDriver;
  String? get errorMessage => _errorMessage;
  String? get profilePhotoPath => _profilePhotoPath;
  bool get isAuthenticated => _currentDriver != null;

  void setProfilePhoto(String path) {
    _profilePhotoPath = path;
    notifyListeners();
  }

  bool login(String username, String password) {
    final driver = mockDrivers.where(
      (d) => d.username.toLowerCase() == username.trim().toLowerCase() && d.password == password,
    );

    if (driver.isEmpty) {
      _errorMessage = 'Invalid email or password. Please try again.';
      notifyListeners();
      return false;
    }

    _currentDriver = driver.first;
    _errorMessage = null;
    notifyListeners();
    return true;
  }

  void logout() {
    _currentDriver = null;
    notifyListeners();
  }
}
