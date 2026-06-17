import 'package:flutter/material.dart';

import '../core/app_colors.dart';

/// Prompts the driver to enter the current odometer reading (km).
/// Returns the entered value, or null if the driver cancelled.
Future<double?> showOdometerInputDialog(BuildContext context, {required String title}) {
  final controller = TextEditingController();
  final formKey = GlobalKey<FormState>();

  return showDialog<double>(
    context: context,
    builder: (context) {
      return AlertDialog(
        title: Text(title),
        content: Form(
          key: formKey,
          child: TextFormField(
            controller: controller,
            autofocus: true,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(
              labelText: 'Odometer reading (km)',
              suffixText: 'km',
              border: OutlineInputBorder(),
            ),
            validator: (value) {
              final parsed = double.tryParse(value?.trim() ?? '');
              if (parsed == null || parsed <= 0) {
                return 'Enter a valid odometer reading';
              }
              return null;
            },
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
            onPressed: () {
              if (formKey.currentState!.validate()) {
                Navigator.of(context).pop(double.parse(controller.text.trim()));
              }
            },
            child: const Text('Confirm'),
          ),
        ],
      );
    },
  );
}
