import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../../../core/app_colors.dart';
import '../../../data/mock_data.dart';
import '../../../models/fuel_log.dart';
import '../../../providers/fuel_provider.dart';

class FuelScreen extends StatelessWidget {
  const FuelScreen({super.key});

  Future<void> _addEntry(BuildContext context) async {
    final result = await showModalBottomSheet<Map<String, Object>>(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) => const _AddFuelSheet(),
    );

    if (result != null && context.mounted) {
      context.read<FuelProvider>().addEntry(
        amount: result['amount'] as double,
        litres: result['litres'] as double,
        odometer: result['odometer'] as double,
        photoPath: result['photoPath'] as String?,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final fuel = context.watch<FuelProvider>();
    final entries = fuel.entries;
    final truck = mockAssignedTruck;

    return Scaffold(
      appBar: AppBar(title: const Text('Fuel')),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: AppColors.primarySoft,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.local_shipping_outlined, color: AppColors.primary),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          truck.displayName,
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          truck.registrationNumber,
                          style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          if (entries.isEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 48),
              child: Column(
                children: [
                  Container(
                    width: 64,
                    height: 64,
                    decoration: BoxDecoration(
                      color: AppColors.primarySoft,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Icon(Icons.local_gas_station_outlined, size: 28, color: AppColors.primary),
                  ),
                  const SizedBox(height: 16),
                  const Text('No Fuel Logs Yet', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 6),
                  const Text(
                    'Tap "Add Fuel Entry" to record a fill-up.',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
                  ),
                ],
              ),
            )
          else
            for (final entry in entries) ...[
              _FuelEntryCard(entry: entry),
              const SizedBox(height: 12),
            ],
        ],
      ),
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 80),
        child: FloatingActionButton.extended(
          onPressed: () => _addEntry(context),
          icon: const Icon(Icons.add),
          label: const Text('Add Fuel Entry'),
        ),
      ),
      backgroundColor: AppColors.background,
    );
  }
}

class _FuelEntryCard extends StatelessWidget {
  final FuelLogEntry entry;

  const _FuelEntryCard({required this.entry});

  @override
  Widget build(BuildContext context) {
    final pricePerLitre = entry.pricePerLitre;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: entry.photoPath != null
                  ? Image.file(File(entry.photoPath!), width: 56, height: 56, fit: BoxFit.cover)
                  : Container(
                      width: 56,
                      height: 56,
                      color: AppColors.primarySoft,
                      child: const Icon(Icons.local_gas_station_outlined, color: AppColors.primary),
                    ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          DateFormat('d MMM yyyy, h:mm a').format(entry.date),
                          style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                        ),
                      ),
                      Text(
                        '₹${_trimZeros(entry.amount)}',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.primary),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 6,
                    children: [
                      _InfoChip(icon: Icons.water_drop_outlined, label: '${_trimZeros(entry.litres)} L'),
                      _InfoChip(icon: Icons.speed_outlined, label: '${_trimZeros(entry.odometer)} km'),
                      if (pricePerLitre != null)
                        _InfoChip(icon: Icons.sell_outlined, label: '₹${pricePerLitre.toStringAsFixed(2)}/L'),
                    ],
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

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _InfoChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.neutralChip,
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

String _trimZeros(double value) {
  if (value == value.roundToDouble()) return value.toInt().toString();
  return value.toString();
}

/// Bottom sheet for logging a fuel fill-up: a receipt/odometer photo,
/// the amount paid, litres filled, and the current odometer reading.
class _AddFuelSheet extends StatefulWidget {
  const _AddFuelSheet();

  @override
  State<_AddFuelSheet> createState() => _AddFuelSheetState();
}

class _AddFuelSheetState extends State<_AddFuelSheet> {
  final _amountController = TextEditingController();
  final _litresController = TextEditingController();
  final _odometerController = TextEditingController();
  String? _photoPath;

  @override
  void dispose() {
    _amountController.dispose();
    _litresController.dispose();
    _odometerController.dispose();
    super.dispose();
  }

  Future<void> _pickPhoto() async {
    final source = await showModalBottomSheet<ImageSource>(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Padding(
                padding: EdgeInsets.fromLTRB(20, 20, 20, 8),
                child: Text('Add Fuel Receipt Photo', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
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
    final picked = await picker.pickImage(source: source, maxWidth: 1600, imageQuality: 85);
    if (picked == null) return;

    setState(() => _photoPath = picked.path);
  }

  void _submit() {
    final amount = double.tryParse(_amountController.text.trim()) ?? 0;
    final litres = double.tryParse(_litresController.text.trim()) ?? 0;
    final odometer = double.tryParse(_odometerController.text.trim()) ?? 0;
    if (amount <= 0 || litres <= 0 || odometer <= 0) return;

    Navigator.of(context).pop(<String, Object>{
      'amount': amount,
      'litres': litres,
      'odometer': odometer,
      if (_photoPath != null) 'photoPath': _photoPath!,
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(20, 24, 20, 32 + MediaQuery.of(context).viewInsets.bottom),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 64,
              height: 64,
              decoration: const BoxDecoration(color: AppColors.primarySoft, shape: BoxShape.circle),
              child: const Icon(Icons.local_gas_station_outlined, color: AppColors.primary, size: 28),
            ),
          ),
          const SizedBox(height: 16),
          const Center(
            child: Text('Add Fuel Entry', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
          ),
          const SizedBox(height: 6),
          const Center(
            child: Text(
              'Upload a receipt photo and enter the fill-up details.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
            ),
          ),
          const SizedBox(height: 20),
          const Text('Photo', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          GestureDetector(
            onTap: _pickPhoto,
            child: Container(
              height: 140,
              width: double.infinity,
              decoration: BoxDecoration(
                color: AppColors.primarySoft,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.border),
              ),
              clipBehavior: Clip.antiAlias,
              child: _photoPath != null
                  ? Image.file(File(_photoPath!), fit: BoxFit.cover, width: double.infinity)
                  : const Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.add_a_photo_outlined, color: AppColors.primary, size: 28),
                        SizedBox(height: 8),
                        Text(
                          'Tap to take or choose a photo',
                          style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                        ),
                      ],
                    ),
            ),
          ),
          const SizedBox(height: 20),
          const Text('Fuel Amount', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          TextField(
            controller: _amountController,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(prefixText: '₹ ', hintText: '0'),
          ),
          const SizedBox(height: 16),
          const Text('Fuel in Litres', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          TextField(
            controller: _litresController,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(suffixText: 'L', hintText: '0'),
          ),
          const SizedBox(height: 16),
          const Text('Odometer Value', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          TextField(
            controller: _odometerController,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(suffixText: 'km', hintText: '0'),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: _submit,
            child: const Text('Add Fuel Entry'),
          ),
        ],
      ),
    );
  }
}
