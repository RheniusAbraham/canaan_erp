import { RETREAD_HEALTH_THRESHOLD } from "./tyre-fitment-data";
import type { TyreInventoryItem } from "@/types/tyre-inventory";

export type TyreHealthLabel = "Healthy" | "Warning" | "Critical";

export function getTotalInvestment(tyre: TyreInventoryItem): number {
  return (Number(tyre.cost) || 0) + (Number(tyre.repairCost) || 0) + (Number(tyre.retreadCost) || 0);
}

export function getCostPerKilometer(totalInvestment: number, lifetimeKm: number): number | null {
  if (lifetimeKm <= 0) return null;
  return totalInvestment / lifetimeKm;
}

export function getNumberOfRetreads(tyre: TyreInventoryItem): number {
  return Math.max(0, Math.round(Number(tyre.retreadCount) || 0));
}

export function getTyreAgeInDays(tyre: TyreInventoryItem): number | null {
  if (!tyre.purchaseDate) return null;
  const purchase = new Date(tyre.purchaseDate).getTime();
  if (Number.isNaN(purchase)) return null;
  return Math.max(0, Math.floor((Date.now() - purchase) / (1000 * 60 * 60 * 24)));
}

export function getTyreHealthScore(
  treadHealth: number,
  retreadCount: number,
  ageInDays: number | null
): { score: number; label: TyreHealthLabel } {
  const treadScore = Math.max(0, Math.min(100, treadHealth));
  const pressureScore = 100; // pending Tyre Manager pressure inspections
  const ageYears = ageInDays !== null ? ageInDays / 365 : 0;
  const ageScore = Math.max(0, Math.min(100, 100 - ageYears * 15));
  const retreadScore = Math.max(0, 100 - retreadCount * 25);

  const score = Math.round(treadScore * 0.4 + pressureScore * 0.2 + ageScore * 0.2 + retreadScore * 0.2);
  const label: TyreHealthLabel = score >= 70 ? "Healthy" : score >= RETREAD_HEALTH_THRESHOLD ? "Warning" : "Critical";

  return { score: Math.max(0, Math.min(100, score)), label };
}
