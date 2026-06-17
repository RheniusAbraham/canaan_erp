import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../core/app_colors.dart';
import '../models/trip.dart';
import '../models/trip_stage.dart';

/// Vertical 6-step checkpoint timeline (Start Trip → Loaded → In Transit
/// → Reached → Unloaded → End Trip). Completed steps show the captured
/// time and location; the current step is highlighted in gold.
class TripTimeline extends StatelessWidget {
  final Trip trip;

  const TripTimeline({super.key, required this.trip});

  @override
  Widget build(BuildContext context) {
    final stages = TripStage.values;

    return Column(
      children: [
        for (int i = 0; i < stages.length; i++)
          _TimelineRow(
            stage: stages[i],
            entry: i < trip.stageLog.length ? trip.stageLog[i] : null,
            isCurrent: i == trip.stageLog.length,
            isLast: i == stages.length - 1,
          ),
      ],
    );
  }
}

class _TimelineRow extends StatelessWidget {
  final TripStage stage;
  final TripStageEntry? entry;
  final bool isCurrent;
  final bool isLast;

  const _TimelineRow({
    required this.stage,
    required this.entry,
    required this.isCurrent,
    required this.isLast,
  });

  @override
  Widget build(BuildContext context) {
    final isDone = entry != null;

    final Color markerColor = isDone
        ? AppColors.primary
        : isCurrent
            ? AppColors.gold
            : AppColors.neutralChip;
    final Color labelColor = isDone || isCurrent ? AppColors.textPrimary : AppColors.textSecondary;

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                color: isDone ? AppColors.primary : Colors.transparent,
                shape: BoxShape.circle,
                border: Border.all(
                  color: markerColor,
                  width: isCurrent && !isDone ? 2.5 : 1.5,
                ),
              ),
              child: isDone
                  ? const Icon(Icons.check, size: 14, color: Colors.white)
                  : isCurrent
                      ? Center(
                          child: Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(color: AppColors.gold, shape: BoxShape.circle),
                          ),
                        )
                      : null,
            ),
            if (!isLast)
              Container(
                width: 2,
                height: 36,
                color: isDone ? AppColors.primary : AppColors.border,
              ),
          ],
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(bottom: 20, top: 2),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      stage.label,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: isCurrent || isDone ? FontWeight.w700 : FontWeight.w500,
                        color: labelColor,
                      ),
                    ),
                    if (isCurrent) ...[
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.goldSoft,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Text(
                          'NEXT',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.goldDark),
                        ),
                      ),
                    ],
                  ],
                ),
                if (isDone) ...[
                  const SizedBox(height: 4),
                  Text(
                    DateFormat('d MMM, h:mm a').format(entry!.timestamp),
                    style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                  ),
                  if (entry!.hasLocation)
                    Padding(
                      padding: const EdgeInsets.only(top: 2),
                      child: Row(
                        children: [
                          const Icon(Icons.location_on_outlined, size: 13, color: AppColors.textSecondary),
                          const SizedBox(width: 4),
                          Text(
                            '${entry!.latitude!.toStringAsFixed(4)}, ${entry!.longitude!.toStringAsFixed(4)}',
                            style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                          ),
                        ],
                      ),
                    )
                  else
                    const Padding(
                      padding: EdgeInsets.only(top: 2),
                      child: Text(
                        'Location unavailable',
                        style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                      ),
                    ),
                ],
              ],
            ),
          ),
        ),
      ],
    );
  }
}
