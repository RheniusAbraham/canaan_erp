import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../../../core/app_colors.dart';
import '../../../models/trip.dart';
import '../../../models/trip_stage.dart';
import '../../../providers/fuel_provider.dart';
import '../../../providers/trip_provider.dart';
import '../../../widgets/odometer_input_dialog.dart';
import '../../../widgets/trip_timeline.dart';

/// Full-screen view of a trip's checkpoint timeline, with the action
/// to log the next checkpoint (captures time + location).
class TripProgressScreen extends StatelessWidget {
  final String tripId;

  const TripProgressScreen({super.key, required this.tripId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Trip Progress')),
      body: Consumer<TripProvider>(
        builder: (context, trips, _) {
          final trip = trips.trips.where((t) => t.id == tripId);
          if (trip.isEmpty) {
            return const Center(child: Text('Trip not found'));
          }
          return _ProgressBody(trip: trip.first);
        },
      ),
    );
  }
}

class _ProgressBody extends StatelessWidget {
  final Trip trip;

  const _ProgressBody({required this.trip});

  @override
  Widget build(BuildContext context) {
    final nextStage = trip.nextStage;
    final isLogging = context.watch<TripProvider>().isLoggingStage(trip.id);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
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
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.primary),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        trip.origin,
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                      ),
                    ),
                    const Icon(Icons.arrow_forward, size: 18, color: AppColors.gold),
                    Expanded(
                      child: Text(
                        trip.destination,
                        textAlign: TextAlign.right,
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  trip.customerName,
                  style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                ),
                const SizedBox(height: 2),
                Text(
                  trip.cargoDescription,
                  style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                ),
                const SizedBox(height: 2),
                Text(
                  DateFormat('d MMM yyyy, h:mm a').format(trip.scheduledDate),
                  style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Checkpoints',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.primary),
                ),
                const SizedBox(height: 12),
                TripTimeline(trip: trip),
                if (nextStage != null)
                  ElevatedButton.icon(
                    onPressed: isLogging ? null : () => _advanceStage(context, trip.id, nextStage),
                    icon: isLogging
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                          )
                        : const Icon(Icons.my_location, size: 18),
                    label: Text(isLogging ? 'Capturing location...' : nextStage.actionLabel),
                  )
                else
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    decoration: BoxDecoration(
                      color: AppColors.primarySoft,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Center(
                      child: Text(
                        'Trip Completed',
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.primary),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
        if (trip.cargoWeightTons != null || trip.distanceKm != null) ...[
          const SizedBox(height: 16),
          _TripSummaryCard(trip: trip),
        ],
      ],
    );
  }
}

/// Advances [tripId] to its next checkpoint. For Start Trip and End Trip,
/// the driver is first prompted for the current odometer reading so the
/// per-trip distance can be derived.
Future<void> _advanceStage(BuildContext context, String tripId, TripStage nextStage) async {
  double? odometer;

  if (nextStage == TripStage.startTrip || nextStage == TripStage.endTrip) {
    odometer = await showOdometerInputDialog(
      context,
      title: nextStage == TripStage.startTrip ? 'Starting Odometer Reading' : 'Ending Odometer Reading',
    );
    if (odometer == null) return;
  }

  if (!context.mounted) return;
  await context.read<TripProvider>().advanceStage(tripId, odometer: odometer);
}

/// Shows the trip's distance, cargo weight, and an estimated fuel
/// consumption derived from the truck's average mileage.
class _TripSummaryCard extends StatelessWidget {
  final Trip trip;

  const _TripSummaryCard({required this.trip});

  @override
  Widget build(BuildContext context) {
    final avgMileage = context.watch<FuelProvider>().averageMileage;
    final distance = trip.distanceKm;
    final fuelConsumed = (distance != null && avgMileage != null && avgMileage > 0) ? distance / avgMileage : null;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Trip Summary',
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.primary),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                if (distance != null)
                  Expanded(
                    child: _SummaryStat(
                      icon: Icons.route_outlined,
                      label: 'Distance',
                      value: '${distance.toStringAsFixed(0)} km',
                    ),
                  ),
                if (fuelConsumed != null)
                  Expanded(
                    child: _SummaryStat(
                      icon: Icons.local_gas_station_outlined,
                      label: 'Est. Fuel Consumed',
                      value: '${fuelConsumed.toStringAsFixed(1)} L',
                    ),
                  ),
                if (trip.cargoWeightTons != null)
                  Expanded(
                    child: _SummaryStat(
                      icon: Icons.inventory_2_outlined,
                      label: 'Cargo Weight',
                      value: '${trip.cargoWeightTons!.toStringAsFixed(1)} t',
                    ),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _SummaryStat extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _SummaryStat({required this.icon, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 18, color: AppColors.primary),
        const SizedBox(height: 6),
        Text(
          value,
          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
        ),
        Text(
          label,
          style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
        ),
      ],
    );
  }
}
