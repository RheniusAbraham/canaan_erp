import 'package:flutter/material.dart';

import '../models/document_item.dart';

class DocumentsProvider extends ChangeNotifier {
  final List<DocumentItem> _driverDocuments = [
    const DocumentItem(
      id: 'aadhar',
      title: 'Aadhar Card',
      subtitle: 'Government identity proof',
      icon: Icons.badge_outlined,
      uploadedByAdmin: true,
    ),
    const DocumentItem(
      id: 'license',
      title: "Driver's License",
      subtitle: 'Issued by RTO',
      icon: Icons.credit_card_outlined,
      uploadedByAdmin: true,
    ),
  ];

  final List<VehicleDocument> _vehicleDocuments = const [
    VehicleDocument(
      id: 'rc',
      title: 'RC Book',
      expiryDate: 'Lifetime',
      icon: Icons.directions_car_outlined,
    ),
    VehicleDocument(
      id: 'insurance',
      title: 'Insurance',
      expiryDate: '2026-11-30',
      icon: Icons.security_outlined,
    ),
    VehicleDocument(
      id: 'permit',
      title: 'Permit',
      expiryDate: '2027-03-15',
      icon: Icons.assignment_outlined,
    ),
    VehicleDocument(
      id: 'fitness',
      title: 'Fitness Certificate',
      expiryDate: '2026-08-21',
      icon: Icons.verified_outlined,
    ),
    VehicleDocument(
      id: 'puc',
      title: 'Pollution Certificate (PUC)',
      expiryDate: '2026-09-10',
      icon: Icons.eco_outlined,
    ),
  ];

  List<DocumentItem> get driverDocuments => List.unmodifiable(_driverDocuments);

  List<VehicleDocument> get vehicleDocuments => List.unmodifiable(_vehicleDocuments);

  void uploadDriverDocument(String id, String filePath) {
    final index = _driverDocuments.indexWhere((d) => d.id == id);
    if (index == -1) return;
    _driverDocuments[index] = _driverDocuments[index].copyWith(
      filePath: filePath,
      uploadedByAdmin: false,
    );
    notifyListeners();
  }
}
