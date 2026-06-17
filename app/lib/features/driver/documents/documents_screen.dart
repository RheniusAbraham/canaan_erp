import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

import '../../../core/app_colors.dart';
import '../../../models/document_item.dart';
import '../../../providers/documents_provider.dart';

class DocumentsScreen extends StatelessWidget {
  const DocumentsScreen({super.key});

  Future<void> _upload(BuildContext context, DocumentItem document) async {
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
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 8),
                child: Text(
                  'Upload ${document.title}',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
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
    final picked = await picker.pickImage(source: source, maxWidth: 1600, imageQuality: 85);
    if (picked == null) return;

    if (context.mounted) {
      context.read<DocumentsProvider>().uploadDriverDocument(document.id, picked.path);
    }
  }

  @override
  Widget build(BuildContext context) {
    final documents = context.watch<DocumentsProvider>().driverDocuments;

    return Scaffold(
      appBar: AppBar(title: const Text('My Documents')),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
        children: [
          const Text(
            'These documents are added by your admin. Keep them up to date by uploading a new copy if they change or expire.',
            style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
          ),
          const SizedBox(height: 16),
          for (final document in documents) ...[
            _DocumentCard(document: document, onUpload: () => _upload(context, document)),
            const SizedBox(height: 12),
          ],
        ],
      ),
      backgroundColor: AppColors.background,
    );
  }
}

class _DocumentCard extends StatelessWidget {
  final DocumentItem document;
  final VoidCallback onUpload;

  const _DocumentCard({required this.document, required this.onUpload});

  @override
  Widget build(BuildContext context) {
    final hasFile = document.filePath != null;
    final String statusLabel = hasFile ? 'Uploaded by you' : (document.uploadedByAdmin ? 'Uploaded by Admin' : 'Not uploaded');
    final Color statusBg = hasFile || document.uploadedByAdmin
        ? AppColors.success.withValues(alpha: 0.12)
        : AppColors.goldSoft;
    final Color statusFg = hasFile || document.uploadedByAdmin ? AppColors.success : AppColors.goldDark;

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
                        document.subtitle,
                        style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: statusBg,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    statusLabel,
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: statusFg),
                  ),
                ),
              ],
            ),
            if (hasFile) ...[
              const SizedBox(height: 12),
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.file(
                  File(document.filePath!),
                  height: 140,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
            ],
            const SizedBox(height: 12),
            OutlinedButton.icon(
              onPressed: onUpload,
              icon: const Icon(Icons.upload_file_outlined, size: 18),
              label: Text(hasFile ? 'Replace Document' : 'Upload Document'),
            ),
          ],
        ),
      ),
    );
  }
}
