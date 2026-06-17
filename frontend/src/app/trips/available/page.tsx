"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { TripTable } from "@/components/trips/TripTable";
import { initialDrivers } from "@/lib/driver-data";
import { initialTrucks } from "@/lib/truck-data";
import { initialCustomers } from "@/lib/customer-data";
import { initialTrips, TRIP_PROGRESS_STATUSES } from "@/lib/trip-data";
import type { Trip } from "@/types/trip";

const FILTERS: Array<Trip["status"] | "All"> = ["All", ...TRIP_PROGRESS_STATUSES];

export default function AvailableTripsPage() {
  const [filter, setFilter] = useState<Trip["status"] | "All">("All");

  const trips = initialTrips.filter((trip) => filter === "All" || trip.status === filter);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Available Trips</h1>
        <p className="mt-1 text-sm text-gray-500">
          View all trips and filter by the progress status updated by the driver
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {status}
          </button>
        ))}
      </div>

      <TripTable
        trips={trips}
        drivers={initialDrivers}
        trucks={initialTrucks}
        customers={initialCustomers}
      />
    </div>
  );
}
