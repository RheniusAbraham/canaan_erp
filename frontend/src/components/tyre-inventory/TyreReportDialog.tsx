"use client";

import { Dialog } from "@/components/ui/Dialog";
import { cn } from "@/lib/utils";
import { initialTrucks } from "@/lib/truck-data";
import { getTyreHealth, getTyreMileage } from "@/lib/tyre-fitment-data";
import {
  getCostPerKilometer,
  getNumberOfRetreads,
  getTotalInvestment,
  getTyreAgeInDays,
  getTyreHealthScore,
} from "@/lib/tyre-report";
import type { TyreFitmentRecord } from "@/types/tyre-fitment";
import type { TyreInventoryItem } from "@/types/tyre-inventory";

type TyreReportDialogProps = {
  open: boolean;
  onClose: () => void;
  tyre: TyreInventoryItem | null;
  records: TyreFitmentRecord[];
};

const healthBadgeStyles: Record<string, string> = {
  Healthy: "bg-green-50 text-green-700",
  Warning: "bg-yellow-50 text-yellow-700",
  Critical: "bg-red-50 text-red-700",
};

const healthBarStyles: Record<string, string> = {
  Healthy: "bg-green-500",
  Warning: "bg-yellow-500",
  Critical: "bg-red-500",
};

export function TyreReportDialog({ open, onClose, tyre, records }: TyreReportDialogProps) {
  if (!tyre) return null;

  const lifetimeKm = getTyreMileage(tyre.id, records, initialTrucks);
  const treadHealth = getTyreHealth(tyre, lifetimeKm);
  const totalInvestment = getTotalInvestment(tyre);
  const costPerKm = getCostPerKilometer(totalInvestment, lifetimeKm);
  const numberOfRetreads = getNumberOfRetreads(tyre);
  const ageInDays = getTyreAgeInDays(tyre);
  const { score, label } = getTyreHealthScore(treadHealth, numberOfRetreads, ageInDays);

  return (
    <Dialog open={open} onClose={onClose} title={`Tyre Report — ${tyre.tyreNumber}`} className="max-w-2xl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-3">
          <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Lifetime Kilometers</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{lifetimeKm.toLocaleString()} km</p>
          <p className="mt-1 text-xs text-gray-500">Sum of distance covered across every installation cycle</p>
        </div>

        <div className="rounded-lg border border-gray-200 p-3">
          <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Cost Per Kilometer</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {costPerKm !== null ? `₹${costPerKm.toFixed(2)} / km` : "—"}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Total investment ₹{totalInvestment.toLocaleString()} (purchase + repairs + retreading)
            {costPerKm === null && " — no kilometers run yet"}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 p-3">
          <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Remaining Tread %</p>
          <p className="mt-1 text-lg font-semibold text-gray-400">Pending Tyre Manager Data</p>
          <p className="mt-1 text-xs text-gray-500">
            Calculated from the latest tread depth inspection once the Tyre Manager app is live
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 p-3">
          <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Estimated Remaining Life</p>
          <p className="mt-1 text-lg font-semibold text-gray-400">Pending Tyre Manager Data</p>
          <p className="mt-1 text-xs text-gray-500">
            Predicted from tread wear rate vs. kilometers travelled once tread inspections are recorded
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 p-3">
          <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Number of Retreads</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{numberOfRetreads}</p>
          <p className="mt-1 text-xs text-gray-500">Total retread cycles recorded for this tyre</p>
        </div>

        <div className="rounded-lg border border-gray-200 p-3">
          <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Tyre Health Score</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">{score}/100</span>
            <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", healthBadgeStyles[label])}>
              {label}
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div className={cn("h-full rounded-full", healthBarStyles[label])} style={{ width: `${score}%` }} />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Weighted from tread condition, tyre pressure compliance, age, and retread count. Tread and pressure
            currently use estimated/default values pending Tyre Manager inspection data.
          </p>
        </div>
      </div>
    </Dialog>
  );
}
