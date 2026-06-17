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
import { sumCharges } from "@/types/trip-sheet";

type DialogMode = "add" | "view" | "edit";

export default function TripReconciliationPage() {
  const { closures, sheets, addSheet } = useTripWorkflow();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [dialogMode, setDialogMode] = useState<DialogMode>("add");

  const driverById = new Map(initialDrivers.map((d) => [d.driverId, d]));
  const truckById = new Map(initialTrucks.map((t) => [t.truckId, t]));
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

  const fmt = (n: number) =>
    `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Trip Reconciliation</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add trip sheets for closed trips to reconcile transport and billing charges
        </p>
      </div>

      {closedTrips.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          No closed trips yet. Close a completed trip first from the{" "}
          <a href="/trips/completed" className="text-blue-600 underline">Completed Trips</a> page.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {[
                  "Trip ID",
                  "Booking Ref",
                  "Customer",
                  "Route",
                  "Driver",
                  "Vehicle",
                  "Bill To",
                  "Total Transport",
                  "Total Billing",
                  "Actions",
                ].map((col) => (
                  <th key={col} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {closedTrips.map((trip) => {
                const closure = closures.get(trip.id);
                const sheet = sheets.get(trip.id);
                const driver = driverById.get(trip.driverId);
                const truck = truckById.get(trip.vehicleId);
                const customer = customerById.get(trip.customerId);

                const totalTransport = sheet
                  ? sumCharges(sheet.baseTransportHire, sheet.transportHaltCharges, sheet.transportUnloadingCharges, sheet.transportLiftingCharges, sheet.transportWeighmentCharges)
                  : null;

                const totalBilling = sheet
                  ? sumCharges(sheet.billingBaseHire, sheet.billingHaltCharges, sheet.billingUnloadingCharges, sheet.billingLiftingCharges, sheet.billingWeighmentCharges)
                  : null;

                return (
                  <tr key={trip.id} className="hover:bg-gray-50">
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
                      {totalTransport !== null ? fmt(totalTransport) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 font-medium text-emerald-700">
                      {totalBilling !== null ? fmt(totalBilling) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {sheet ? (
                        <div className="flex flex-col gap-1.5">
                          <p className="text-xs text-gray-500">
                            Trip Sheet Added by{" "}
                            <span className="font-medium text-gray-700">Fleet Manager</span>
                          </p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => openDialog(trip, "view")}
                              className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                            >
                              View Trip Sheet
                            </button>
                            <button
                              type="button"
                              onClick={() => openDialog(trip, "edit")}
                              className="rounded-lg border border-blue-300 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                            >
                              Edit Trip Sheet
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openDialog(trip, "add")}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                        >
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
