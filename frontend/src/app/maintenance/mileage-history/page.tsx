"use client";

import { useState } from "react";
import { initialTrucks } from "@/lib/truck-data";
import { initialFuelLogs } from "@/lib/fuel-log-data";
import { FuelHistoryDialog } from "@/components/maintenance/FuelHistoryDialog";
import type { Truck } from "@/types/truck";

export default function MileageHistoryPage() {
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);

  return (
    <div className="animate-stagger flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mileage History</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fuel fill-up records logged by drivers for each truck
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/80 bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {["Truck ID", "Registration No.", "Model", "Type", "Current Odometer", "Total Fill-ups", "Actions"].map((col) => (
                <th key={col} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {initialTrucks.map((truck) => {
              const logs = initialFuelLogs.filter((l) => l.truckId === truck.id);
              return (
                <tr key={truck.id} className="group transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:bg-white/80 relative hover:z-10 cursor-pointer">
                  <td className="px-4 py-3 font-medium text-gray-900">{truck.truckId}</td>
                  <td className="px-4 py-3 text-gray-700">{truck.registrationNumber}</td>
                  <td className="px-4 py-3 text-gray-600">{truck.modelName}</td>
                  <td className="px-4 py-3 text-gray-600">{truck.truckType}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {Number(truck.odometer).toLocaleString("en-IN")} km
                  </td>
                  <td className="px-4 py-3">
                    {logs.length > 0 ? (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                        {logs.length} record{logs.length !== 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">No records</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedTruck(truck)}
                      className="rounded-lg border border-blue-300 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                    >
                      View Fuel Fill-Up History
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <FuelHistoryDialog
        open={selectedTruck !== null}
        truck={selectedTruck}
        logs={selectedTruck ? initialFuelLogs.filter((l) => l.truckId === selectedTruck.id) : []}
        onClose={() => setSelectedTruck(null)}
      />
    </div>
  );
}
