"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TruckTable } from "@/components/fleet/TruckTable";
import { TruckFormDialog } from "@/components/fleet/TruckFormDialog";
import { initialTrucks } from "@/lib/truck-data";
import type { Truck } from "@/types/truck";

export default function FleetPage() {
  const [trucks, setTrucks] = useState<Truck[]>(initialTrucks);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState<Truck | null>(null);

  function handleAdd() {
    setEditingTruck(null);
    setDialogOpen(true);
  }

  function handleEdit(truck: Truck) {
    setEditingTruck(truck);
    setDialogOpen(true);
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this truck?")) return;
    setTrucks((prev) => prev.filter((truck) => truck.id !== id));
  }

  function handleSave(truck: Truck) {
    setTrucks((prev) => {
      const exists = prev.some((existing) => existing.id === truck.id);
      if (exists) {
        return prev.map((existing) => (existing.id === truck.id ? truck : existing));
      }
      return [...prev, truck];
    });
    setDialogOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Our Fleet</h1>
          <p className="mt-1 text-sm text-gray-500">Manage trucks across all branches</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Truck
        </button>
      </div>

      <TruckTable trucks={trucks} onEdit={handleEdit} onDelete={handleDelete} />

      <TruckFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initialData={editingTruck}
        existingTrucks={trucks}
      />
    </div>
  );
}
