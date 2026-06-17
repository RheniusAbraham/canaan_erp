class Driver {
  final String id;
  final String driverId;
  final String name;
  final String? photoUrl;
  final String contactNumber;
  final String email;
  final String branch;
  final String licenseNumber;
  final String licenseExpiryDate;
  final String username;
  final String password;

  const Driver({
    required this.id,
    required this.driverId,
    required this.name,
    this.photoUrl,
    required this.contactNumber,
    required this.email,
    required this.branch,
    required this.licenseNumber,
    required this.licenseExpiryDate,
    required this.username,
    required this.password,
  });
}
