"use client";

import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { initialTrucks } from "@/lib/truck-data";
import { RETREAD_HEALTH_THRESHOLD, getTyreHealth, getTyreMileage } from "@/lib/tyre-fitment-data";
import type { TyreFitmentRecord } from "@/types/tyre-fitment";
import type { TyreInventoryItem } from "@/types/tyre-inventory";

type TyreInventoryTableProps = {
  tyres: TyreInventoryItem[];
  fitmentRecords: TyreFitmentRecord[];
  onEdit: (tyre: TyreInventoryItem) => void;
  onDelete: (id: string) => void;
  onViewHistory: (tyre: TyreInventoryItem) => void;
  onFlagForRetreading: (tyre: TyreInventoryItem) => void;
  onViewReport: (tyre: TyreInventoryItem) => void;
};

const columns = [
  "Brand",
  "Tyre Pattern",
  "Tyre Type",
  "Tyre Number",
  "Tyre Size",
  "Range (km)",
  "Mileage (km)",
  "Tyre Health",
  "Cost",
  "Status",
  "",
  "",
  "",
  "Actions",
];

const conditionStyles: Record<string, string> = {
  New: "bg-green-50 text-green-700",
  Rethreaded: "bg-yellow-50 text-yellow-700",
};

function healthColor(health: number): string {
  if (health >= 70) return "bg-green-500";
  if (health >= RETREAD_HEALTH_THRESHOLD) return "bg-yellow-500";
  return "bg-red-500";
}

export function TyreInventoryTable({
  tyres,
  fitmentRecords,
  onEdit,
  onDelete,
  onViewHistory,
  onFlagForRetreading,
  onViewReport,
}: TyreInventoryTableProps) {
  if (tyres.length === 0) {
    return (
      <div className="rounded-xl border border-white/80 bg-white/90 p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl text-center text-sm text-gray-500 transition-all duration-300">
        No tyres yet. Click &ldquo;Add Tyre&rdquo; to create one.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/80 bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
      <table className="w-full min-w-[1700px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((column, index) => (
              <th
                key={`${column}-${index}`}
                className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tyres.map((tyre) => {
            const mileage = getTyreMileage(tyre.id, fitmentRecords, initialTrucks);
            const health = getTyreHealth(tyre, mileage);
            const eligibleForRetreading = health < RETREAD_HEALTH_THRESHOLD;

            return (
              <tr key={tyre.id} className="group transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:bg-white/80 relative hover:z-10 cursor-pointer">
                <td className="px-4 py-3 font-medium text-gray-900">{tyre.brand}</td>
                <td className="px-4 py-3 text-gray-600">{tyre.pattern}</td>
                <td className="px-4 py-3 text-gray-600">{tyre.tyreType}</td>
                <td className="px-4 py-3 text-gray-600">{tyre.tyreNumber}</td>
                <td className="px-4 py-3 text-gray-600">{tyre.size}</td>
                <td className="px-4 py-3 text-gray-600">{Number(tyre.range).toLocaleString()} km</td>
                <td className="px-4 py-3 text-gray-600">{mileage.toLocaleString()} km</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-100">
                      <div className={cn("h-full rounded-full", healthColor(health))} style={{ width: `${health}%` }} />
                    </div>
                    <span className="text-gray-600">{health}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">₹{Number(tyre.cost).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col items-start gap-1">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        conditionStyles[tyre.condition] ?? "bg-gray-100 text-gray-600"
                      )}
                    >
                      {tyre.condition}
                    </span>
                    {tyre.flaggedForRetreading && (
                      <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
                        Flagged for Retreading
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onViewHistory(tyre)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    View Tyre History
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onViewReport(tyre)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    View Tyre Report
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onFlagForRetreading(tyre)}
                    disabled={!eligibleForRetreading || tyre.flaggedForRetreading}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-medium",
                      !eligibleForRetreading || tyre.flaggedForRetreading
                        ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                        : "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
                    )}
                  >
                    {tyre.flaggedForRetreading ? "Flagged for Retreading" : "Flag for Retreading"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(tyre)}
                      aria-label={`Edit ${tyre.tyreNumber}`}
                      className="rounded-md p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(tyre.id)}
                      aria-label={`Delete ${tyre.tyreNumber}`}
                      className="rounded-md p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
