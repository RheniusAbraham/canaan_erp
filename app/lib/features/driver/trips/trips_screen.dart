import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../../../core/app_colors.dart';
import '../../../models/trip.dart';
import '../../../models/trip_stage.dart';
import '../../../providers/trip_provider.dart';

class TripsScreen extends StatelessWidget {
  const TripsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final trips = context.watch<TripProvider>();
    final active = trips.activeTrips;
    final history = trips.tripHistory;

    return Scaffold(
      appBar: AppBar(title: const Text('My Trips')),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
        children: [
          const _SectionHeader(title: 'Active & Upcoming'),
          const SizedBox(height: 8),
          if (active.isEmpty)
            const _EmptyState(message: 'No active or upcoming trips assigned yet.')
          else
            ...active.map((trip) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: _TripCard(trip: trip),
                )),
          const SizedBox(height: 24),
          const _SectionHeader(title: 'Trip History'),
          const SizedBox(height: 8),
          if (history.isEmpty)
            const _EmptyState(message: 'No completed trips yet.')
          else
            ...history.map((trip) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: _TripCard(trip: trip),
                )),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;

  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textSecondary),
    );
  }
}

class _EmptyState extends StatelessWidget {
  final String message;

  const _EmptyState({required this.message});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
        child: Center(
          child: Text(
            message,
            style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
            textAlign: TextAlign.center,
          ),
        ),
      ),
    );
  }
}

class _TripCard extends StatelessWidget {
  final Trip trip;

  const _TripCard({required this.trip});

  @override
  Widget build(BuildContext context) {
    final Color statusBg;
    final Color statusFg;
    switch (trip.status) {
      case TripStatus.inProgress:
        statusBg = AppColors.goldSoft;
        statusFg = AppColors.goldDark;
        break;
      case TripStatus.assigned:
        statusBg = AppColors.primarySoft;
        statusFg = AppColors.primary;
        break;
      case TripStatus.completed:
        statusBg = AppColors.neutralChip;
        statusFg = AppColors.success;
        break;
      case TripStatus.cancelled:
        statusBg = AppColors.neutralChip;
        statusFg = AppColors.danger;
        break;
    }

    return Card(
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
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: statusBg,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    trip.status.label,
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: statusFg),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: Text(
                    trip.origin,
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
                  ),
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
            const SizedBox(height: 8),
            Text(
              DateFormat('d MMM yyyy, h:mm a').format(trip.scheduledDate),
              style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
            ),
            if (trip.status == TripStatus.assigned || trip.status == TripStatus.inProgress) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.timeline, size: 14, color: AppColors.goldDark),
                  const SizedBox(width: 6),
                  Text(
                    trip.hasStartedJourney
                        ? 'Checkpoint ${trip.stageLog.length}/${TripStage.values.length}: ${trip.stageLog.last.stage.label}'
                        : 'Not started yet',
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.goldDark),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}
