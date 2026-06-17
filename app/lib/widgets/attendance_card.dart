import 'dart:io';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../core/app_colors.dart';
import '../core/ist_time.dart';
import '../providers/attendance_provider.dart';
import '../providers/auth_provider.dart';

class AttendanceCard extends StatelessWidget {
  const AttendanceCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer2<AttendanceProvider, AuthProvider>(
      builder: (context, attendance, auth, _) {
        final today = attendance.today;
        final isMarked = attendance.isMarkedToday;
        final isCapturing = attendance.isCapturing;
        final photoPath = auth.profilePhotoPath;

        final String statusLabel = isMarked ? 'Marked' : 'Not Marked';
        final Color statusBg = isMarked ? AppColors.success.withValues(alpha: 0.12) : AppColors.neutralChip;
        final Color statusFg = isMarked ? AppColors.success : AppColors.textSecondary;

        final String buttonLabel = isCapturing ? 'Capturing...' : 'Mark Attendance';

        return Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: AppColors.primarySoft,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.fingerprint, color: AppColors.primary),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Attendance',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: AppColors.primary,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            DateFormat('d MMM yyyy').format(DateTime.now()),
                            style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: statusBg,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        statusLabel,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: statusFg,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                const Divider(height: 1, color: AppColors.border),
                const SizedBox(height: 14),
                if (today == null)
                  const Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(Icons.info_outline, size: 18, color: AppColors.textSecondary),
                      SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Tap below to mark your attendance for today.',
                          style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
                        ),
                      ),
                    ],
                  )
                else
                  _AttendanceMarkedBanner(
                    photoPath: photoPath,
                    time: today.markedAt,
                    latitude: today.latitude,
                    longitude: today.longitude,
                  ),
                if (!isMarked) ...[
                  const SizedBox(height: 14),
                  ElevatedButton.icon(
                    onPressed: isCapturing ? null : () => _markAttendance(context, attendance),
                    icon: isCapturing
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                          )
                        : const Icon(Icons.task_alt, size: 20),
                    label: Text(buttonLabel),
                  ),
                ],
              ],
            ),
          ),
        );
      },
    );
  }

  Future<void> _markAttendance(
    BuildContext context,
    AttendanceProvider attendance,
  ) async {
    final confirmed = await showModalBottomSheet<bool>(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.fromLTRB(20, 24, 20, 32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: const BoxDecoration(
                  color: AppColors.primarySoft,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.location_on, color: AppColors.primary, size: 28),
              ),
              const SizedBox(height: 16),
              const Text(
                'Confirm Your Attendance',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 6),
              const Text(
                'Your current time and location will be recorded to mark today\'s attendance.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () => Navigator.of(context).pop(true),
                child: const Text('Confirm Attendance'),
              ),
            ],
          ),
        );
      },
    );

    if (confirmed == true) {
      await attendance.markAttendance();
    }
  }
}

class _AttendanceMarkedBanner extends StatelessWidget {
  final String? photoPath;
  final DateTime time;
  final double? latitude;
  final double? longitude;

  const _AttendanceMarkedBanner({
    required this.photoPath,
    required this.time,
    required this.latitude,
    required this.longitude,
  });

  @override
  Widget build(BuildContext context) {
    final hasLocation = latitude != null && longitude != null;

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.primarySoft,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              CircleAvatar(
                radius: 24,
                backgroundColor: AppColors.surface,
                backgroundImage: photoPath != null ? FileImage(File(photoPath!)) : null,
                child: photoPath == null ? const Icon(Icons.person, color: AppColors.primary) : null,
              ),
              Positioned(
                right: -2,
                bottom: -2,
                child: Container(
                  padding: const EdgeInsets.all(3),
                  decoration: const BoxDecoration(
                    color: AppColors.success,
                    shape: BoxShape.circle,
                    border: Border.fromBorderSide(BorderSide(color: AppColors.primarySoft, width: 2)),
                  ),
                  child: const Icon(Icons.check, size: 11, color: Colors.white),
                ),
              ),
            ],
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Attendance marked for today',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.primary),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 6,
                  children: [
                    _InfoChip(icon: Icons.access_time, label: formatIst(time)),
                    _InfoChip(
                      icon: Icons.location_on_outlined,
                      label: hasLocation
                          ? '${latitude!.toStringAsFixed(4)}, ${longitude!.toStringAsFixed(4)}'
                          : 'Location unavailable',
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _InfoChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: AppColors.primary),
          const SizedBox(width: 4),
          Text(
            label,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
          ),
        ],
      ),
    );
  }
}
