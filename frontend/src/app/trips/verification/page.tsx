"use client";

import { useState } from "react";
import { useTripWorkflow } from "@/context/TripWorkflowContext";
import { VerifyTripDialog } from "@/components/trips/VerifyTripDialog";
import { TripSheetDialog } from "@/components/trips/TripSheetDialog";
import { initialDrivers } from "@/lib/driver-data";
import { initialTrucks } from "@/lib/truck-data";
import { initialCustomers } from "@/lib/customer-data";
import { initialTrips } from "@/lib/trip-data";
import type { Trip } from "@/types/trip";
import type { TripSheetData } from "@/types/trip-sheet";
import { n, calcTripExpenses } from "@/types/trip-sheet";

type SheetDialogMode = "view" | "edit";

export default function TripVerificationPage() {
  const { closures, sheets, addSheet, verifications, addVerification, flags, addFlag } = useTripWorkflow();

  // Which trip is open in the Verify dialog
  const [verifyTrip, setVerifyTrip] = useState<Trip | null>(null);
  // Which trip is open in the Sheet dialog (view/edit)
  const [sheetTrip, setSheetTrip] = useState<Trip | null>(null);
  const [sheetMode, setSheetMode] = useState<SheetDialogMode>("view");

  const driverById = new Map(initialDrivers.map((d) => [d.driverId, d]));
  const truckById = new Map(initialTrucks.map((t) => [t.truckId, t]));
  const customerById = new Map(initialCustomers.map((c) => [c.id, c]));

  const sheettedTrips = initialTrips.filter((t) => sheets.has(t.id));

  function openSheetDialog(trip: Trip, mode: SheetDialogMode) {
    setVerifyTrip(null); // close verify dialog first
    setSheetTrip(trip);
    setSheetMode(mode);
  }

  function handleSaveSheet(data: TripSheetData) {
    addSheet(data);
    setSheetTrip(null);
    // Reopen verify dialog for the same trip
    const trip = initialTrips.find((t) => t.id === data.tripId) ?? null;
    setVerifyTrip(trip);
  }

  function handleConfirmVerification() {
    if (!verifyTrip) return;
    addVerification(verifyTrip.id);
    setVerifyTrip(null);
  }

  function handleFlag() {
    if (!verifyTrip) return;
    addFlag(verifyTrip.id);
    setVerifyTrip(null);
  }

  const fmt = (n: number) =>
    `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Trip Verification</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and verify all trip data before proceeding to finalization
        </p>
      </div>

      {sheettedTrips.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          No trips ready for verification. Add a trip sheet on the{" "}
          <a href="/trips/reconciliation" className="text-blue-600 underline">Trip Reconciliation</a> page first.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {["Trip ID", "Booking Ref", "Customer", "Route", "Driver", "Vehicle",
                  "Hire Amount", "Total Expense", "Status", "Actions"].map((col) => (
                  <th key={col} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sheettedTrips.map((trip) => {
                const closure = closures.get(trip.id);
                const sheet = sheets.get(trip.id)!;
                const driver = driverById.get(trip.driverId);
                const truck = truckById.get(trip.vehicleId);
                const customer = customerById.get(trip.customerId);
                const isVerified = verifications.has(trip.id);
                const isFlagged = flags.has(trip.id);

                const totalTransport = n(sheet.hireAmount);
                const totalBilling   = calcTripExpenses(sheet);

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
                    <td className="px-4 py-3 font-medium text-blue-700">{fmt(totalTransport)}</td>
                    <td className="px-4 py-3 font-medium text-emerald-700">{fmt(totalBilling)}</td>
                    <td className="px-4 py-3">
                      {isVerified ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          Verified
                        </span>
                      ) : isFlagged ? (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-600">
                          Flagged
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isVerified ? (
                        <div className="flex flex-col gap-1">
                          <p className="text-xs text-gray-500">
                            Trip Sheet Verified by{" "}
                            <span className="font-medium text-gray-700">Fleet Manager</span>
                          </p>
                          <button
                            type="button"
                            onClick={() => setVerifyTrip(trip)}
                            className="w-fit rounded-lg border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                          >
                            View Details
                          </button>
                        </div>
                      ) : isFlagged ? (
                        <div className="flex flex-col gap-1">
                          <p className="text-xs text-red-500">Flagged for rechecking</p>
                          <button
                            type="button"
                            onClick={() => setVerifyTrip(trip)}
                            className="w-fit rounded-lg border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            Review Again
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setVerifyTrip(trip)}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          VERIFY TRIP DATA
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

      {/* Verify dialog */}
      <VerifyTripDialog
        open={verifyTrip !== null}
        trip={verifyTrip}
        closure={verifyTrip ? closures.get(verifyTrip.id) : undefined}
        sheet={verifyTrip ? sheets.get(verifyTrip.id) : undefined}
        onClose={() => setVerifyTrip(null)}
        onViewSheet={() => verifyTrip && openSheetDialog(verifyTrip, "view")}
        onEditSheet={() => verifyTrip && openSheetDialog(verifyTrip, "edit")}
        onFlag={handleFlag}
        onConfirm={handleConfirmVerification}
      />

      {/* Trip sheet view / edit dialog */}
      <TripSheetDialog
        open={sheetTrip !== null}
        trip={sheetTrip}
        closure={sheetTrip ? closures.get(sheetTrip.id) : undefined}
        existingSheet={sheetTrip ? sheets.get(sheetTrip.id) : undefined}
        readOnly={sheetMode === "view"}
        onClose={() => {
          // Reopen the verify dialog for the same trip
          setVerifyTrip(sheetTrip);
          setSheetTrip(null);
        }}
        onSubmit={handleSaveSheet}
      />
    </div>
  );
}
