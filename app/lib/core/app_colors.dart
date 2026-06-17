import 'package:flutter/material.dart';

/// Fleet Command Center palette — Dark Blue (primary, trust/control)
/// and Dark Gold (accent, highlights/status/active trips).
class AppColors {
  AppColors._();

  // Primary - Dark Blue
  static const primary = Color(0xFF14315B); // deep navy
  static const primaryLight = Color(0xFF2A4A7F); // lighter navy for icon chips
  static const primarySoft = Color(0xFFE7ECF5); // pale blue tint for chips/backgrounds

  // Accent - Dark Gold
  static const gold = Color(0xFFC79A3B);
  static const goldDark = Color(0xFFA9791E);
  static const goldSoft = Color(0xFFFBF1DC); // pale gold tint for badges/banners

  // Surfaces
  static const background = Color(0xFFF6F5F2); // off-white
  static const surface = Color(0xFFFFFFFF);

  // Text
  static const textPrimary = Color(0xFF1C2430);
  static const textSecondary = Color(0xFF6B7280);
  static const border = Color(0xFFE7E5E0);

  // Status
  static const success = Color(0xFF1F8A4C);
  static const warning = Color(0xFFC79A3B);
  static const danger = Color(0xFFCC4B37);
  static const neutralChip = Color(0xFFEDEDEC);
}
