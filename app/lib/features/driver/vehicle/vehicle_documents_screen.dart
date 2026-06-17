import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../core/app_colors.dart';
import '../../../data/mock_data.dart';
import '../../../models/document_item.dart';
import '../../../providers/documents_provider.dart';

class VehicleDocumentsScreen extends StatelessWidget {
  const VehicleDocumentsScreen({super.key});

  void _viewDocument(BuildContext context, VehicleDocument document) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Opening ${document.title}...')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final truck = mockAssignedTruck;
    final documents = context.watch<DocumentsProvider>().vehicleDocuments;

    return Scaffold(
      appBar: AppBar(title: const Text('Vehicle Documents')),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
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
                          '${truck.registrationNumber} · ${truck.truckType}',
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
          const Text(
            'These documents are uploaded by your admin when the vehicle is registered. Contact your admin if any document needs to be updated.',
            style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
          ),
          const SizedBox(height: 16),
          for (final document in documents) ...[
            _VehicleDocumentCard(document: document, onTap: () => _viewDocument(context, document)),
            const SizedBox(height: 12),
          ],
        ],
      ),
      backgroundColor: AppColors.background,
    );
  }
}

class _VehicleDocumentCard extends StatelessWidget {
  final VehicleDocument document;
  final VoidCallback onTap;

  const _VehicleDocumentCard({required this.document, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
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
                child: Icon(document.icon, color: AppColors.primary),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      document.title,
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Valid till ${document.expiryDate}',
                      style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.success.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text(
                  'Uploaded by Admin',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.success),
                ),
              ),
              const SizedBox(width: 8),
              const Icon(Icons.chevron_right, color: AppColors.textSecondary),
            ],
          ),
        ),
      ),
    );
  }
}
