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
    <div className="animate-stagger flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Our Fleet</h1>
          <p className="mt-1 text-sm text-gray-500">Manage trucks across all branches</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="group relative overflow-hidden flex items-center gap-2 rounded-xl bg-white/40 px-4 py-2 text-sm font-semibold text-blue-600 shadow-[0_4px_15px_rgba(37,99,235,0.1)] backdrop-blur-xl border border-white/80 transition-all duration-300 hover:bg-white/60 hover:shadow-[0_8px_25px_rgba(37,99,235,0.2)] hover:-translate-y-0.5 hover:border-white hover:text-blue-700 after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent after:-translate-x-full hover:after:translate-x-full after:transition-transform after:duration-700"
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
