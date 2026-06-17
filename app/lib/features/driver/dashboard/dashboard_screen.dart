import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../core/app_colors.dart';
import '../../../providers/auth_provider.dart';
import '../../../widgets/attendance_card.dart';
import '../../../widgets/quick_access_grid.dart';
import '../../../widgets/trip_status_card.dart';
import '../documents/documents_screen.dart';
import '../vehicle/vehicle_documents_screen.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final driver = context.watch<AuthProvider>().currentDriver;
    final firstName = (driver?.name ?? '').split(' ').first;

    return Scaffold(
      appBar: AppBar(
        title: Text('Hi, $firstName'),
        actions: [
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.notifications_none),
          ),
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.more_vert),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
        children: [
          const AttendanceCard(),
          const SizedBox(height: 16),
          const TripStatusCard(),
          const SizedBox(height: 16),
          QuickAccessGrid(
            items: [
              QuickAccessItem(label: 'Apply Leave', icon: Icons.event_available_outlined, onTap: () {}),
              QuickAccessItem(label: 'Request Advance', icon: Icons.account_balance_wallet_outlined, onTap: () {}),
              QuickAccessItem(
                label: 'Documents',
                icon: Icons.description_outlined,
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const DocumentsScreen()),
                  );
                },
              ),
              QuickAccessItem(label: 'Notifications', icon: Icons.notifications_active_outlined, onTap: () {}),
              QuickAccessItem(label: 'My Earnings', icon: Icons.payments_outlined, onTap: () {}),
              QuickAccessItem(
                label: 'Vehicle',
                icon: Icons.local_shipping_outlined,
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const VehicleDocumentsScreen()),
                  );
                },
              ),
            ],
          ),
          const SizedBox(height: 8),
        ],
      ),
      backgroundColor: AppColors.background,
    );
  }
}
