"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { getTyreMaintenanceSummary } from "@/lib/tyre-management-data";
import type { Truck } from "@/types/truck";
import type { TyreMaintenanceSummary } from "@/types/tyre-management";

type TyreManagementTableProps = {
  trucks: Truck[];
  summaries: TyreMaintenanceSummary[];
  onManageTyres: (truck: Truck) => void;
};

const columns = ["Truck Photo", "Truck Registration", "Truck Tyre Health Status", "Upcoming Maintenance", ""];

const healthStyles: Record<string, string> = {
  Excellent: "bg-green-50 text-green-700",
  Good: "bg-emerald-50 text-emerald-700",
  Fair: "bg-yellow-50 text-yellow-700",
  Poor: "bg-orange-50 text-orange-700",
  Critical: "bg-red-50 text-red-700",
};

export function TyreManagementTable({ trucks, summaries, onManageTyres }: TyreManagementTableProps) {
  if (trucks.length === 0) {
    return (
      <div className="rounded-xl border border-white/80 bg-white/90 p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl text-center text-sm text-gray-500 transition-all duration-300">
        No trucks yet. Add a truck under &ldquo;Our Fleet&rdquo; to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/80 bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
      <table className="w-full min-w-[900px] text-left text-sm">
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
            const summary = getTyreMaintenanceSummary(truck.id, summaries);
            return (
              <tr key={truck.id} className="group transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:bg-white/80 relative hover:z-10 cursor-pointer">
                <td className="px-4 py-3">
                  <Avatar photoUrl={null} label={truck.registrationNumber} size={40} />
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{truck.registrationNumber}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      healthStyles[summary.healthStatus] ?? "bg-gray-100 text-gray-600"
                    )}
                  >
                    {summary.healthStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      summary.upcomingMaintenanceCount > 0
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-gray-100 text-gray-500"
                    )}
                  >
                    {summary.upcomingMaintenanceCount > 0
                      ? `${summary.upcomingMaintenanceCount} due soon`
                      : "Up to date"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onManageTyres(truck)}
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                  >
                    Manage Tyres
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
