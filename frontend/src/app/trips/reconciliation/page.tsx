"use client";

import { useState } from "react";
import { useTripWorkflow } from "@/context/TripWorkflowContext";
import { TripSheetDialog } from "@/components/trips/TripSheetDialog";
import { initialDrivers } from "@/lib/driver-data";
import { initialTrucks } from "@/lib/truck-data";
import { initialCustomers } from "@/lib/customer-data";
import { initialTrips } from "@/lib/trip-data";
import type { Trip } from "@/types/trip";
import type { TripSheetData } from "@/types/trip-sheet";
import { n } from "@/types/trip-sheet";

type DialogMode = "add" | "view" | "edit";

export default function TripReconciliationPage() {
  const { closures, sheets, addSheet } = useTripWorkflow();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [dialogMode, setDialogMode] = useState<DialogMode>("add");

  const driverById = new Map(initialDrivers.map((d) => [d.driverId, d]));
  const truckById  = new Map(initialTrucks.map((t) => [t.truckId, t]));
  const customerById = new Map(initialCustomers.map((c) => [c.id, c]));

  const closedTrips = initialTrips.filter((t) => closures.has(t.id));

  function openDialog(trip: Trip, mode: DialogMode) {
    setSelectedTrip(trip);
    setDialogMode(mode);
  }

  function handleSubmitSheet(data: TripSheetData) {
    addSheet(data);
    setSelectedTrip(null);
  }

  const fmt = (v: number) =>
    `₹${v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="animate-stagger flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Trip Reconciliation</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add trip sheets for closed trips to reconcile hire and expenses
        </p>
      </div>

      {closedTrips.length === 0 ? (
        <div className="rounded-xl border border-white/80 bg-white/90 p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl text-center text-sm text-gray-500 transition-all duration-300">
          No closed trips yet. Close a completed trip first from the{" "}
          <a href="/trips/completed" className="text-blue-600 underline">Completed Trips</a> page.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/80 bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {["Trip ID", "Booking Ref", "Customer", "Route", "Driver", "Vehicle",
                  "Bill To", "Hire Amount", "Total Expense", "Actions"].map((col) => (
                  <th key={col} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {closedTrips.map((trip) => {
                const closure  = closures.get(trip.id);
                const sheet    = sheets.get(trip.id);
                const driver   = driverById.get(trip.driverId);
                const truck    = truckById.get(trip.vehicleId);
                const customer = customerById.get(trip.customerId);

                return (
                  <tr key={trip.id} className="group transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:bg-white/80 relative hover:z-10 cursor-pointer">
                    <td className="px-4 py-3 font-medium text-gray-900">{trip.tripId}</td>
                    <td className="px-4 py-3 text-gray-600">{trip.bookingReferenceNo}</td>
                    <td className="px-4 py-3 text-gray-600">{customer?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {trip.origin} <span className="text-gray-400">→</span> {trip.destination}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{driver?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{truck?.registrationNumber ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{closure?.billTo ?? "—"}</td>
                    <td className="px-4 py-3 font-medium text-blue-700">
                      {sheet ? fmt(n(sheet.hireAmount)) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 font-medium text-emerald-700">
                      {sheet ? fmt(n(sheet.totalExpense)) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {sheet ? (
                        <div className="flex flex-col gap-1.5">
                          <p className="text-xs text-gray-500">
                            Trip Sheet Added by{" "}
                            <span className="font-medium text-gray-700">Fleet Manager</span>
                          </p>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => openDialog(trip, "view")}
                              className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100">
                              View Trip Sheet
                            </button>
                            <button type="button" onClick={() => openDialog(trip, "edit")}
                              className="rounded-lg border border-blue-300 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50">
                              Edit Trip Sheet
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button type="button" onClick={() => openDialog(trip, "add")}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
                          ADD TRIP SHEET
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <TripSheetDialog
        open={selectedTrip !== null}
        trip={selectedTrip}
        closure={selectedTrip ? closures.get(selectedTrip.id) : undefined}
        existingSheet={selectedTrip ? sheets.get(selectedTrip.id) : undefined}
        readOnly={dialogMode === "view"}
        onClose={() => setSelectedTrip(null)}
        onSubmit={handleSubmitSheet}
      />
    </div>
  );
}
