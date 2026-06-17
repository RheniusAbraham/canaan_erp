import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

import '../../../core/app_colors.dart';
import '../../../data/mock_data.dart';
import '../../../providers/auth_provider.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  Future<void> _pickPhoto(BuildContext context) async {
    final source = await showModalBottomSheet<ImageSource>(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Padding(
                padding: EdgeInsets.fromLTRB(20, 20, 20, 8),
                child: Text(
                  'Update Profile Photo',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                ),
              ),
              ListTile(
                leading: const Icon(Icons.photo_camera_outlined, color: AppColors.primary),
                title: const Text('Take a photo'),
                onTap: () => Navigator.of(context).pop(ImageSource.camera),
              ),
              ListTile(
                leading: const Icon(Icons.photo_library_outlined, color: AppColors.primary),
                title: const Text('Choose from gallery'),
                onTap: () => Navigator.of(context).pop(ImageSource.gallery),
              ),
              const SizedBox(height: 8),
            ],
          ),
        );
      },
    );

    if (source == null) return;

    final picker = ImagePicker();
    final picked = await picker.pickImage(source: source, maxWidth: 800, imageQuality: 85);
    if (picked == null) return;

    if (context.mounted) {
      context.read<AuthProvider>().setProfilePhoto(picked.path);
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final driver = auth.currentDriver;
    final photoPath = auth.profilePhotoPath;
    final truck = mockAssignedTruck;

    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  GestureDetector(
                    onTap: () => _pickPhoto(context),
                    child: Stack(
                      children: [
                        Container(
                          width: 72,
                          height: 72,
                          decoration: const BoxDecoration(
                            color: AppColors.primarySoft,
                            shape: BoxShape.circle,
                          ),
                          clipBehavior: Clip.antiAlias,
                          child: photoPath != null
                              ? Image.file(File(photoPath), fit: BoxFit.cover)
                              : const Icon(Icons.person, size: 36, color: AppColors.primary),
                        ),
                        Positioned(
                          right: 0,
                          bottom: 0,
                          child: Container(
                            padding: const EdgeInsets.all(4),
                            decoration: const BoxDecoration(
                              color: AppColors.gold,
                              shape: BoxShape.circle,
                              border: Border.fromBorderSide(BorderSide(color: AppColors.surface, width: 2)),
                            ),
                            child: const Icon(Icons.camera_alt, size: 14, color: AppColors.primary),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    driver?.name ?? '-',
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.goldSoft,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      driver?.driverId ?? '-',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.goldDark),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          _SectionCard(
            title: 'Contact Details',
            rows: [
              _InfoRowData(Icons.phone_outlined, 'Phone', driver?.contactNumber ?? '-'),
              _InfoRowData(Icons.email_outlined, 'Email', driver?.email ?? '-'),
              _InfoRowData(Icons.location_on_outlined, 'Branch', driver?.branch ?? '-'),
            ],
          ),
          const SizedBox(height: 16),
          _SectionCard(
            title: 'License Details',
            rows: [
              _InfoRowData(Icons.badge_outlined, 'License No.', driver?.licenseNumber ?? '-'),
              _InfoRowData(Icons.event_outlined, 'Expires On', driver?.licenseExpiryDate ?? '-'),
            ],
          ),
          const SizedBox(height: 16),
          _SectionCard(
            title: 'Assigned Vehicle',
            rows: [
              _InfoRowData(Icons.local_shipping_outlined, 'Vehicle', truck.displayName),
              _InfoRowData(Icons.pin_outlined, 'Registration No.', truck.registrationNumber),
              _InfoRowData(Icons.category_outlined, 'Type', truck.truckType),
            ],
          ),
        ],
      ),
    );
  }
}

class _InfoRowData {
  final IconData icon;
  final String label;
  final String value;

  const _InfoRowData(this.icon, this.label, this.value);
}

class _SectionCard extends StatelessWidget {
  final String title;
  final List<_InfoRowData> rows;

  const _SectionCard({required this.title, required this.rows});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.primary),
            ),
            const SizedBox(height: 12),
            for (final row in rows)
              Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Row(
                  children: [
                    Icon(row.icon, size: 18, color: AppColors.textSecondary),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(row.label, style: const TextStyle(fontSize: 13, color: AppColors.textSecondary)),
                    ),
                    Text(
                      row.value,
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
