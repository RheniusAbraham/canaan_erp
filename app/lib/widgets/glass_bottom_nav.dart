import 'dart:ui';

import 'package:flutter/material.dart';

import '../core/app_colors.dart';

class GlassNavItem {
  final IconData icon;
  final IconData selectedIcon;
  final String label;

  const GlassNavItem({required this.icon, required this.selectedIcon, required this.label});
}

/// Floating glass-morphic bottom navigation bar with a sliding active pill.
class GlassBottomNav extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;
  final List<GlassNavItem> items;

  const GlassBottomNav({super.key, required this.currentIndex, required this.onTap, required this.items});

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.of(context).padding.bottom;

    return Padding(
      padding: EdgeInsets.fromLTRB(16, 0, 16, bottomInset + 12),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(28),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 40, sigmaY: 40),
          child: Container(
            height: 68,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.82),
              borderRadius: BorderRadius.circular(28),
              border: Border.all(color: Colors.white.withValues(alpha: 0.6), width: 1.2),
              boxShadow: [
                BoxShadow(color: AppColors.primary.withValues(alpha: 0.18), blurRadius: 24, offset: const Offset(0, 10)),
              ],
            ),
            padding: const EdgeInsets.all(8),
            child: LayoutBuilder(
              builder: (context, constraints) {
                final itemWidth = constraints.maxWidth / items.length;
                return Stack(
                  children: [
                    AnimatedPositioned(
                      duration: const Duration(milliseconds: 280),
                      curve: Curves.easeOutCubic,
                      left: itemWidth * currentIndex,
                      width: itemWidth,
                      top: 0,
                      bottom: 0,
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [AppColors.primary, AppColors.primaryLight],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(color: AppColors.primary.withValues(alpha: 0.35), blurRadius: 14, offset: const Offset(0, 6)),
                          ],
                        ),
                      ),
                    ),
                    Row(
                      children: List.generate(items.length, (index) {
                        final selected = index == currentIndex;
                        final item = items[index];
                        return Expanded(
                          child: GestureDetector(
                            behavior: HitTestBehavior.opaque,
                            onTap: () => onTap(index),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  selected ? item.selectedIcon : item.icon,
                                  size: 22,
                                  color: selected ? Colors.white : AppColors.textSecondary,
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  item.label,
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: selected ? FontWeight.w700 : FontWeight.w600,
                                    color: selected ? Colors.white : AppColors.textSecondary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      }),
                    ),
                  ],
                );
              },
            ),
          ),
        ),
      ),
    );
  }
}
