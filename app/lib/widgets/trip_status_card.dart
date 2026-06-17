import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../core/app_colors.dart';
import '../features/driver/trips/trip_progress_screen.dart';
import '../models/trip.dart';
import '../models/trip_stage.dart';
import '../providers/trip_provider.dart';
import 'odometer_input_dialog.dart';

/// Highlights the driver's active trip — or an empty placeholder when
/// none is assigned. This is the priority module on the home screen,
/// in line with the "Fleet Command Center" design direction.
class TripStatusCard extends StatelessWidget {
  const TripStatusCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<TripProvider>(
      builder: (context, trips, _) {
        final trip = trips.currentTrip;

        if (trip == null) {
          return const _NoActiveTripCard();
        }

        return _ActiveTripCard(trip: trip);
      },
    );
  }
}

class _NoActiveTripCard extends StatelessWidget {
  const _NoActiveTripCard();

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 36, horizontal: 16),
        child: Column(
          children: [
            const Icon(Icons.local_shipping_outlined, size: 40, color: AppColors.textSecondary),
            const SizedBox(height: 12),
            const Text(
              'No trips available',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.textSecondary),
            ),
            const SizedBox(height: 4),
            const Text(
              'Fleet manager will assign trips here',
              style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
            ),
          ],
        ),
      ),
    );
  }
}

class _ActiveTripCard extends StatelessWidget {
  final Trip trip;

  const _ActiveTripCard({required this.trip});

  @override
  Widget build(BuildContext context) {
    final hasStarted = trip.hasStartedJourney;
    final nextStage = trip.nextStage;
    final isLogging = context.watch<TripProvider>().isLoggingStage(trip.id);

    return Card(
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            color: AppColors.primary,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.gold,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    hasStarted ? 'ACTIVE TRIP' : 'UPCOMING TRIP',
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primary,
                      letterSpacing: 0.5,
                    ),
                  ),
                ),
                const Spacer(),
                Text(
                  trip.tripId,
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 13),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
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
                const SizedBox(height: 12),
                _InfoRow(icon: Icons.business_outlined, label: trip.customerName),
                const SizedBox(height: 6),
                _InfoRow(icon: Icons.inventory_2_outlined, label: trip.cargoDescription),
                const SizedBox(height: 6),
                _InfoRow(
                  icon: Icons.schedule_outlined,
                  label: DateFormat('d MMM yyyy, h:mm a').format(trip.scheduledDate),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: nextStage != null
                          ? ElevatedButton.icon(
                              onPressed: isLogging
                                  ? null
                                  : () => _advanceStage(context, trip.id, nextStage),
                              icon: isLogging
                                  ? const SizedBox(
                                      width: 18,
                                      height: 18,
                                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                    )
                                  : const Icon(Icons.my_location, size: 18),
                              label: Text(isLogging ? 'Capturing...' : nextStage.actionLabel),
                            )
                          : Container(
                              height: 50,
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
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => TripProgressScreen(tripId: trip.id)),
                          );
                        },
                        style: OutlinedButton.styleFrom(
                          minimumSize: const Size.fromHeight(50),
                          foregroundColor: AppColors.primary,
                          side: const BorderSide(color: AppColors.primary),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        icon: const Icon(Icons.timeline, size: 18),
                        label: const Text('Trip Progress'),
                      ),
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

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;

  const _InfoRow({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 16, color: AppColors.textSecondary),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            label,
            style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
          ),
        ),
      ],
    );
  }
}
