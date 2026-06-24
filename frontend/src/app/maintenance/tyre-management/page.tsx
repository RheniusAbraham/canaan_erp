"use client";

import { useState } from "react";
import { TyreManagementTable } from "@/components/maintenance/TyreManagementTable";
import { ManageTyresDialog } from "@/components/maintenance/ManageTyresDialog";
import { initialTrucks } from "@/lib/truck-data";
import { initialTyreMaintenanceSummaries } from "@/lib/tyre-management-data";
import type { Truck } from "@/types/truck";

export default function TyreManagementPage() {
  const [trucks] = useState<Truck[]>(initialTrucks);
  const [summaries] = useState(initialTyreMaintenanceSummaries);

  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);

  function handleManageTyres(truck: Truck) {
    setSelectedTruck(truck);
    setManageDialogOpen(true);
  }

  return (
    <div className="animate-stagger flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tyre Management</h1>
        <p className="mt-1 text-sm text-gray-500">Track tyre health and layouts across the fleet</p>
      </div>

      <TyreManagementTable trucks={trucks} summaries={summaries} onManageTyres={handleManageTyres} />

      <ManageTyresDialog open={manageDialogOpen} onClose={() => setManageDialogOpen(false)} truck={selectedTruck} />
    </div>
  );
}
