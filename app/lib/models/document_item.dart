import 'package:flutter/material.dart';

/// A document belonging to the driver (e.g. Aadhar Card, Driver's
/// License). Uploaded by the Admin when the driver is created, but the
/// driver can replace it with an updated copy.
class DocumentItem {
  final String id;
  final String title;
  final String subtitle;
  final IconData icon;
  final String? filePath;
  final bool uploadedByAdmin;

  const DocumentItem({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.icon,
    this.filePath,
    this.uploadedByAdmin = false,
  });

  DocumentItem copyWith({String? filePath, bool? uploadedByAdmin}) {
    return DocumentItem(
      id: id,
      title: title,
      subtitle: subtitle,
      icon: icon,
      filePath: filePath ?? this.filePath,
      uploadedByAdmin: uploadedByAdmin ?? this.uploadedByAdmin,
    );
  }
}

/// A document for the truck assigned to the driver (e.g. RC Book,
/// Insurance, Permit). Uploaded by the Admin when the vehicle is
/// created; view-only for the driver.
class VehicleDocument {
  final String id;
  final String title;
  final String expiryDate;
  final IconData icon;

  const VehicleDocument({
    required this.id,
    required this.title,
    required this.expiryDate,
    required this.icon,
  });
}
