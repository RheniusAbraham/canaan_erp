import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'core/app_theme.dart';
import 'features/driver/driver_shell.dart';
import 'providers/attendance_provider.dart';
import 'providers/auth_provider.dart';
import 'providers/documents_provider.dart';
import 'providers/fuel_provider.dart';
import 'providers/trip_provider.dart';

class CanaanErpApp extends StatelessWidget {
  const CanaanErpApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => TripProvider()),
        ChangeNotifierProvider(create: (_) => AttendanceProvider()),
        ChangeNotifierProvider(create: (_) => DocumentsProvider()),
        ChangeNotifierProvider(create: (_) => FuelProvider()),
      ],
      child: MaterialApp(
        title: 'Canaan ERP - Driver',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light,
        // TODO: route to a login screen once the auth flow is ready;
        // for now the app opens directly into the Driver home.
        home: const DriverShell(),
      ),
    );
  }
}
