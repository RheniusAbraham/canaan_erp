"use client";

import { Trash2 } from "lucide-react";
import type { Trip } from "@/types/trip";
import type { Driver } from "@/types/driver";
import type { Truck } from "@/types/truck";
import type { Customer } from "@/types/customer";

type TripTableProps = {
  trips: Trip[];
  drivers: Driver[];
  trucks: Truck[];
  customers: Customer[];
  onCancel?: (id: string) => void;
  onCloseTrip?: (trip: Trip) => void;
  closedTripIds?: Set<string>;
};

const statusStyles: Record<Trip["status"], string> = {
  Assigned: "bg-amber-50 text-amber-700",
  Started: "bg-sky-50 text-sky-700",
  Loaded: "bg-indigo-50 text-indigo-700",
  "On-Transit": "bg-purple-50 text-purple-700",
  Reached: "bg-cyan-50 text-cyan-700",
  Unloaded: "bg-teal-50 text-teal-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-gray-100 text-gray-500",
};

export function TripTable({ trips, drivers, trucks, customers, onCancel, onCloseTrip, closedTripIds }: TripTableProps) {
  if (trips.length === 0) {
    return (
      <div className="rounded-xl border border-white/80 bg-white/90 p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl text-center text-sm text-gray-500 transition-all duration-300">
        No trips assigned yet. Click &ldquo;Assign Trip&rdquo; to create one.
      </div>
    );
  }

  const driverById = new Map(drivers.map((driver) => [driver.driverId, driver]));
  const truckById = new Map(trucks.map((truck) => [truck.truckId, truck]));
  const customerById = new Map(customers.map((customer) => [customer.id, customer]));

  return (
    <div className="overflow-x-auto rounded-xl border border-white/80 bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
      <table className="w-full min-w-[1200px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {[
              "Trip ID",
              "Booking Ref",
              "Customer",
              "Route",
              "Cargo / Container Ref",
              "Scheduled Date",
              "Driver",
              "Vehicle",
              "Status",
              ...(onCancel || onCloseTrip ? ["Actions"] : []),
            ].map(
              (column) => (
                <th key={column} className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  {column}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {trips.map((trip) => {
            const driver = driverById.get(trip.driverId);
            const truck = truckById.get(trip.vehicleId);
            const customer = customerById.get(trip.customerId);

            return (
              <tr key={trip.id} className="group transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:bg-white/80 relative hover:z-10 cursor-pointer">
                <td className="px-4 py-3 font-medium text-gray-900">{trip.tripId}</td>
                <td className="px-4 py-3 text-gray-600">{trip.bookingReferenceNo}</td>
                <td className="px-4 py-3 text-gray-600">{customer?.name ?? "—"}</td>
                <td className="px-4 py-3 text-gray-600">
                  {trip.origin} <span className="text-gray-400">→</span> {trip.destination}
                </td>
                <td className="px-4 py-3 text-gray-600">{trip.cargoContainerReference}</td>
                <td className="px-4 py-3 text-gray-600">{trip.scheduledDate}</td>
                <td className="px-4 py-3 text-gray-600">{driver?.name ?? "—"}</td>
                <td className="px-4 py-3 text-gray-600">{truck?.registrationNumber ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[trip.status]}`}>
                    {trip.status}
                  </span>
                </td>
                {(onCancel || onCloseTrip) && (
                  <td className="px-4 py-3">
                    {onCancel && trip.status !== "Cancelled" && trip.status !== "Completed" && (
                      <button
                        type="button"
                        onClick={() => onCancel(trip.id)}
                        aria-label={`Cancel ${trip.tripId}`}
                        className="rounded-md p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    {onCloseTrip && trip.status === "Completed" && (
                      closedTripIds?.has(trip.id) ? (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                          Closed
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onCloseTrip(trip)}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          CLOSE TRIP
                        </button>
                      )
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
