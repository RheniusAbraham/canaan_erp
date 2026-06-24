"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMaintenanceStatus, getTruckMaintenanceSummary } from "@/lib/truck-maintenance-data";
import type { Truck } from "@/types/truck";
import type { MaintenanceRecord } from "@/types/truck-maintenance";

type TruckMaintenanceTableProps = {
  trucks: Truck[];
  records: MaintenanceRecord[];
  onUpdateRecord: (truck: Truck) => void;
  onViewRecord: (truck: Truck) => void;
  onViewUpcoming: (truck: Truck) => void;
  onViewAttention: (truck: Truck) => void;
};

const columns = [
  "Registration Number",
  "Current Odometer",
  "Truck Health",
  "Truck Reliability Score",
  "",
  "",
  "",
  "",
];

const healthStyles: Record<string, string> = {
  Excellent: "bg-green-50 text-green-700",
  Good: "bg-emerald-50 text-emerald-700",
  Fair: "bg-yellow-50 text-yellow-700",
  Poor: "bg-orange-50 text-orange-700",
  Critical: "bg-red-50 text-red-700",
};

function reliabilityColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
}

export function TruckMaintenanceTable({
  trucks,
  records,
  onUpdateRecord,
  onViewRecord,
  onViewUpcoming,
  onViewAttention,
}: TruckMaintenanceTableProps) {
  if (trucks.length === 0) {
    return (
      <div className="rounded-xl border border-white/80 bg-white/90 p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl text-center text-sm text-gray-500 transition-all duration-300">
        No trucks yet. Add a truck under &ldquo;Our Fleet&rdquo; to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/80 bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
      <table className="w-full min-w-[1300px] text-left text-sm">
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
          {trucks.map((truck) => {
            const summary = getTruckMaintenanceSummary(truck, records);
            const { health, reliabilityScore: score } = summary;
            const status = getMaintenanceStatus(truck, records);
            const upcomingCount = status.filter((item) => item.status === "upcoming").length;
            const attentionCount = status.filter((item) => item.status === "attention").length;
            return (
              <tr key={truck.id} className="group transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:bg-white/80 relative hover:z-10 cursor-pointer">
                <td className="px-4 py-3 font-medium text-gray-900">{truck.registrationNumber}</td>
                <td className="px-4 py-3 text-gray-600">{Number(truck.odometer).toLocaleString()} km</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      healthStyles[health] ?? "bg-gray-100 text-gray-600"
                    )}
                  >
                    {health}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={cn("h-full rounded-full", reliabilityColor(score))}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="text-gray-600">{score}/100</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onUpdateRecord(truck)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Update Truck&apos;s Maintenance Record
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onViewRecord(truck)}
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                  >
                    View Maintenance Record
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onViewUpcoming(truck)}
                    className="flex items-center gap-1.5 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
                  >
                    Upcoming Maintenance
                    {upcomingCount > 0 && (
                      <span className="rounded-full bg-yellow-200 px-1.5 py-0.5 text-[10px] font-semibold text-yellow-800">
                        {upcomingCount}
                      </span>
                    )}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onViewAttention(truck)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium",
                      attentionCount > 0
                        ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                        : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
                    )}
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Attention Required
                    {attentionCount > 0 && (
                      <span className="rounded-full bg-red-200 px-1.5 py-0.5 text-[10px] font-semibold text-red-800">
                        {attentionCount}
                      </span>
                    )}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
