"use client";

import { useState } from "react";
import { useTripWorkflow } from "@/context/TripWorkflowContext";
import { initialDrivers } from "@/lib/driver-data";
import { initialTrucks } from "@/lib/truck-data";
import { initialCustomers } from "@/lib/customer-data";
import { initialTrips } from "@/lib/trip-data";
import { n, calcTripExpenses } from "@/types/trip-sheet";

export default function TripFinalizationPage() {
  const { closures, sheets, verifications } = useTripWorkflow();
  const [invoiced, setInvoiced] = useState<Set<string>>(new Set());

  const driverById = new Map(initialDrivers.map((d) => [d.driverId, d]));
  const truckById = new Map(initialTrucks.map((t) => [t.truckId, t]));
  const customerById = new Map(initialCustomers.map((c) => [c.id, c]));

  // Only show trips that have been verified
  const verifiedTrips = initialTrips.filter((t) => verifications.has(t.id));

  const fmt = (n: number) =>
    `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Trip Finalization</h1>
        <p className="mt-1 text-sm text-gray-500">
          Generate invoices for verified trips to complete the trip workflow
        </p>
      </div>

      {verifiedTrips.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          No verified trips yet. Verify trip data on the{" "}
          <a href="/trips/verification" className="text-blue-600 underline">Trip Verification</a> page first.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[1050px] text-left text-sm">
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
              {verifiedTrips.map((trip) => {
                const closure = closures.get(trip.id);
                const sheet = sheets.get(trip.id);
                const driver = driverById.get(trip.driverId);
                const truck = truckById.get(trip.vehicleId);
                const customer = customerById.get(trip.customerId);
                const isInvoiced = invoiced.has(trip.id);

                const totalTransport = sheet ? n(sheet.hireAmount) : 0;
                const totalBilling   = sheet ? calcTripExpenses(sheet) : 0;

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
                    <td className="px-4 py-3 font-medium text-blue-700">{fmt(totalTransport)}</td>
                    <td className="px-4 py-3 font-medium text-emerald-700">{fmt(totalBilling)}</td>
                    <td className="px-4 py-3">
                      {isInvoiced ? (
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex w-fit items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            Invoice Generated
                          </span>
                          <p className="text-xs text-gray-500">
                            by <span className="font-medium text-gray-700">Fleet Manager</span>
                          </p>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setInvoiced((prev) => new Set([...prev, trip.id]))}
                          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                        >
                          GENERATE INVOICE
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
    </div>
  );
}
