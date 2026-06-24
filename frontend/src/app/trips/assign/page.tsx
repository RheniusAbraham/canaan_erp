"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TripTable } from "@/components/trips/TripTable";
import { TripFormDialog } from "@/components/trips/TripFormDialog";
import { initialDrivers } from "@/lib/driver-data";
import { initialTrucks } from "@/lib/truck-data";
import { initialCustomers } from "@/lib/customer-data";
import { initialDriverAssignments } from "@/lib/driver-assignment-data";
import { initialTrips } from "@/lib/trip-data";
import type { Trip } from "@/types/trip";

export default function AssignTripsPage() {
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [dialogOpen, setDialogOpen] = useState(false);

  const truckById = new Map(initialTrucks.map((truck) => [truck.truckId, truck]));
  const assignableDrivers = initialDriverAssignments
    .map((assignment) => {
      const driver = initialDrivers.find((d) => d.driverId === assignment.driverId);
      const truck = truckById.get(assignment.vehicleId);
      return driver && truck ? { driver, truck } : null;
    })
    .filter((entry): entry is { driver: (typeof initialDrivers)[number]; truck: (typeof initialTrucks)[number] } => entry !== null);

  function handleAdd() {
    setDialogOpen(true);
  }

  function handleSave(trip: Trip) {
    setTrips((prev) => [...prev, trip]);
    setDialogOpen(false);
  }

  function handleCancel(id: string) {
    if (!confirm("Cancel this trip?")) return;
    setTrips((prev) => prev.map((trip) => (trip.id === id ? { ...trip, status: "Cancelled" } : trip)));
  }

  return (
    <div className="animate-stagger flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assign Trips</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and assign trips to drivers who have a vehicle assigned
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="group relative overflow-hidden flex items-center gap-2 rounded-xl bg-white/40 px-4 py-2 text-sm font-semibold text-blue-600 shadow-[0_4px_15px_rgba(37,99,235,0.1)] backdrop-blur-xl border border-white/80 transition-all duration-300 hover:bg-white/60 hover:shadow-[0_8px_25px_rgba(37,99,235,0.2)] hover:-translate-y-0.5 hover:border-white hover:text-blue-700 after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent after:-translate-x-full hover:after:translate-x-full after:transition-transform after:duration-700"
        >
          <Plus className="h-4 w-4" />
          Assign Trip
        </button>
      </div>

      <TripTable
        trips={trips}
        drivers={initialDrivers}
        trucks={initialTrucks}
        customers={initialCustomers}
        onCancel={handleCancel}
      />

      <TripFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        existingTrips={trips}
        customers={initialCustomers}
        assignableDrivers={assignableDrivers}
      />
    </div>
  );
}
