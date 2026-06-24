"use client";

import { useState } from "react";
import { AssignDriverTable } from "@/components/trips/AssignDriverTable";
import { AssignDriverDialog } from "@/components/trips/AssignDriverDialog";
import { initialDrivers } from "@/lib/driver-data";
import { initialTrucks } from "@/lib/truck-data";
import { initialDriverAssignments } from "@/lib/driver-assignment-data";
import type { Driver } from "@/types/driver";
import type { DriverAssignment } from "@/types/driver-assignment";

export default function AssignDriversPage() {
  const [assignments, setAssignments] = useState<DriverAssignment[]>(initialDriverAssignments);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const vehicleByDriverId = Object.fromEntries(
    assignments.map((assignment) => [assignment.driverId, assignment.vehicleId])
  );

  function handleAssign(driver: Driver) {
    setSelectedDriver(driver);
    setDialogOpen(true);
  }

  function handleSave(vehicleId: string) {
    if (!selectedDriver) return;

    setAssignments((prev) => {
      const withoutDriver = prev.filter((a) => a.driverId !== selectedDriver.driverId);
      if (!vehicleId) return withoutDriver;
      return [
        ...withoutDriver,
        { id: crypto.randomUUID(), driverId: selectedDriver.driverId, vehicleId },
      ];
    });
    setDialogOpen(false);
  }

  return (
    <div className="animate-stagger flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assign Drivers</h1>
        <p className="mt-1 text-sm text-gray-500">
          Assign a vehicle to each driver so they can be selected when creating trips
        </p>
      </div>

      <AssignDriverTable
        drivers={initialDrivers}
        trucks={initialTrucks}
        vehicleByDriverId={vehicleByDriverId}
        onAssign={handleAssign}
      />

      <AssignDriverDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        driver={selectedDriver}
        trucks={initialTrucks}
        currentVehicleId={selectedDriver ? vehicleByDriverId[selectedDriver.driverId] ?? "" : ""}
        takenVehicleIds={Object.values(vehicleByDriverId)}
      />
    </div>
  );
}
