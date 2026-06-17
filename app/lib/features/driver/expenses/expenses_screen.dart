import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../../../core/app_colors.dart';
import '../../../models/trip.dart';
import '../../../providers/trip_provider.dart';
import '../../../widgets/coming_soon.dart';
import 'trip_expenses_screen.dart';

class ExpensesScreen extends StatelessWidget {
  const ExpensesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final tripProvider = context.watch<TripProvider>();
    final trips = tripProvider.trips;

    return Scaffold(
      appBar: AppBar(title: const Text('Expenses')),
      body: trips.isEmpty
          ? const ComingSoon(
              icon: Icons.receipt_long_outlined,
              title: 'Trip Expenses',
              message: 'Submit and track trip-related expenses here.',
            )
          : ListView(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
              children: trips
                  .map((trip) => Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: _ExpenseTripCard(trip: trip),
                      ))
                  .toList(),
            ),
    );
  }
}

class _ExpenseTripCard extends StatelessWidget {
  final Trip trip;

  const _ExpenseTripCard({required this.trip});

  @override
  Widget build(BuildContext context) {
    final total = context.watch<TripProvider>().expensesFor(trip.id).total;

    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => Navigator.of(context).push(
          MaterialPageRoute(builder: (_) => TripExpensesScreen(tripId: trip.id)),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text(
                    trip.tripId,
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textSecondary),
                  ),
                  const Spacer(),
                  Text(
                    trip.status.label,
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.primary),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: Text(trip.origin, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
                  ),
                  const Icon(Icons.arrow_forward, size: 16, color: AppColors.gold),
                  Expanded(
                    child: Text(
                      trip.destination,
                      textAlign: TextAlign.right,
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  const Icon(Icons.receipt_long_outlined, size: 16, color: AppColors.textSecondary),
                  const SizedBox(width: 6),
                  Text(
                    'Total Expense: ${NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0).format(total)}',
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textSecondary),
                  ),
                  const Spacer(),
                  const Icon(Icons.chevron_right, size: 18, color: AppColors.textSecondary),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
