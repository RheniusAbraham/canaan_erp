import 'package:flutter/material.dart';

import '../../widgets/glass_bottom_nav.dart';
import 'dashboard/dashboard_screen.dart';
import 'expenses/expenses_screen.dart';
import 'fuel/fuel_screen.dart';
import 'profile/profile_screen.dart';
import 'trips/trips_screen.dart';

/// Root scaffold for the Driver interface with bottom navigation:
/// Today, Trips, Fuel, Expenses, Profile.
class DriverShell extends StatefulWidget {
  const DriverShell({super.key});

  @override
  State<DriverShell> createState() => _DriverShellState();
}

class _DriverShellState extends State<DriverShell> {
  int _index = 0;

  static const _screens = [
    DashboardScreen(),
    TripsScreen(),
    FuelScreen(),
    ExpensesScreen(),
    ProfileScreen(),
  ];

  static const _items = [
    GlassNavItem(icon: Icons.grid_view_outlined, selectedIcon: Icons.grid_view_rounded, label: 'Today'),
    GlassNavItem(icon: Icons.local_shipping_outlined, selectedIcon: Icons.local_shipping, label: 'Trips'),
    GlassNavItem(icon: Icons.local_gas_station_outlined, selectedIcon: Icons.local_gas_station, label: 'Fuel'),
    GlassNavItem(icon: Icons.receipt_long_outlined, selectedIcon: Icons.receipt_long, label: 'Expenses'),
    GlassNavItem(icon: Icons.person_outline, selectedIcon: Icons.person, label: 'Profile'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      body: IndexedStack(index: _index, children: _screens),
      bottomNavigationBar: GlassBottomNav(
        currentIndex: _index,
        onTap: (value) => setState(() => _index = value),
        items: _items,
      ),
    );
  }
}
