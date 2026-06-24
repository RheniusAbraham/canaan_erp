"use client";

import { useState } from "react";
import { TripTable } from "@/components/trips/TripTable";
import { CloseTripDialog } from "@/components/trips/CloseTripDialog";
import { useTripWorkflow } from "@/context/TripWorkflowContext";
import { initialDrivers } from "@/lib/driver-data";
import { initialTrucks } from "@/lib/truck-data";
import { initialCustomers } from "@/lib/customer-data";
import { initialTrips } from "@/lib/trip-data";
import type { Trip } from "@/types/trip";
import type { TripClosureData } from "@/types/trip-closure";

const completedTrips = initialTrips.filter((trip) => trip.status === "Completed");

export default function CompletedTripsPage() {
  const { closures, addClosure } = useTripWorkflow();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const driverById = new Map(initialDrivers.map((d) => [d.driverId, d]));
  const truckById = new Map(initialTrucks.map((t) => [t.truckId, t]));

  function handleSubmitClosure(data: TripClosureData) {
    addClosure(data);
    setSelectedTrip(null);
  }

  return (
    <div className="animate-stagger flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Completed Trips</h1>
        <p className="mt-1 text-sm text-gray-500">
          All trips that have been successfully completed
        </p>
      </div>

      <TripTable
        trips={completedTrips}
        drivers={initialDrivers}
        trucks={initialTrucks}
        customers={initialCustomers}
        onCloseTrip={(trip) => setSelectedTrip(trip)}
        closedTripIds={new Set(closures.keys())}
      />

      <CloseTripDialog
        open={selectedTrip !== null}
        trip={selectedTrip}
        driver={selectedTrip ? driverById.get(selectedTrip.driverId) : undefined}
        truck={selectedTrip ? truckById.get(selectedTrip.vehicleId) : undefined}
        onClose={() => setSelectedTrip(null)}
        onSubmit={handleSubmitClosure}
      />
    </div>
  );
}
