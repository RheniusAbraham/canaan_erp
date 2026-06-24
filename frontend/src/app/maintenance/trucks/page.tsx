"use client";

import { useState } from "react";
import { TruckMaintenanceTable } from "@/components/maintenance/TruckMaintenanceTable";
import { MaintenanceRecordFormDialog } from "@/components/maintenance/MaintenanceRecordFormDialog";
import { MaintenanceRecordHistoryDialog } from "@/components/maintenance/MaintenanceRecordHistoryDialog";
import { MaintenanceStatusDialog } from "@/components/maintenance/MaintenanceStatusDialog";
import { initialTrucks } from "@/lib/truck-data";
import { getMaintenanceStatus, initialMaintenanceRecords } from "@/lib/truck-maintenance-data";
import type { Truck } from "@/types/truck";
import type { MaintenanceRecord } from "@/types/truck-maintenance";

export default function TruckMaintenancePage() {
  const [trucks, setTrucks] = useState<Truck[]>(initialTrucks);
  const [records, setRecords] = useState<MaintenanceRecord[]>(initialMaintenanceRecords);

  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [upcomingDialogOpen, setUpcomingDialogOpen] = useState(false);
  const [attentionDialogOpen, setAttentionDialogOpen] = useState(false);

  function handleUpdateRecord(truck: Truck) {
    setSelectedTruck(truck);
    setUpdateDialogOpen(true);
  }

  function handleViewRecord(truck: Truck) {
    setSelectedTruck(truck);
    setHistoryDialogOpen(true);
  }

  function handleViewUpcoming(truck: Truck) {
    setSelectedTruck(truck);
    setUpcomingDialogOpen(true);
  }

  function handleViewAttention(truck: Truck) {
    setSelectedTruck(truck);
    setAttentionDialogOpen(true);
  }

  function handleSaveRecord(record: MaintenanceRecord) {
    setRecords((prev) => [...prev, record]);
    setTrucks((prev) =>
      prev.map((truck) =>
        truck.id === record.truckId && Number(record.odometer) > Number(truck.odometer)
          ? { ...truck, odometer: record.odometer }
          : truck
      )
    );
    setUpdateDialogOpen(false);
  }

  const status = selectedTruck ? getMaintenanceStatus(selectedTruck, records) : [];
  const upcomingItems = status.filter((item) => item.status === "upcoming");
  const attentionItems = status.filter((item) => item.status === "attention");

  return (
    <div className="animate-stagger flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Truck Maintenance</h1>
        <p className="mt-1 text-sm text-gray-500">Track the health and reliability of every truck in the fleet</p>
      </div>

      <TruckMaintenanceTable
        trucks={trucks}
        records={records}
        onUpdateRecord={handleUpdateRecord}
        onViewRecord={handleViewRecord}
        onViewUpcoming={handleViewUpcoming}
        onViewAttention={handleViewAttention}
      />

      <MaintenanceRecordFormDialog
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        onSave={handleSaveRecord}
        truck={selectedTruck}
      />

      <MaintenanceRecordHistoryDialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        truck={selectedTruck}
        records={records}
      />

      <MaintenanceStatusDialog
        open={upcomingDialogOpen}
        onClose={() => setUpcomingDialogOpen(false)}
        title="Upcoming Maintenance"
        truck={selectedTruck}
        items={upcomingItems}
        emptyMessage="No upcoming maintenance for this truck right now."
      />

      <MaintenanceStatusDialog
        open={attentionDialogOpen}
        onClose={() => setAttentionDialogOpen(false)}
        title="Attention Required"
        truck={selectedTruck}
        items={attentionItems}
        emptyMessage="Nothing overdue for this truck right now."
      />
    </div>
  );
}
