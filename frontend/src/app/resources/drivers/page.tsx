"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { DriverTable } from "@/components/drivers/DriverTable";
import { DriverFormDialog } from "@/components/drivers/DriverFormDialog";
import { initialDrivers } from "@/lib/driver-data";
import type { Driver } from "@/types/driver";

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  function handleAdd() {
    setEditingDriver(null);
    setDialogOpen(true);
  }

  function handleEdit(driver: Driver) {
    setEditingDriver(driver);
    setDialogOpen(true);
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this driver?")) return;
    setDrivers((prev) => prev.filter((driver) => driver.id !== id));
  }

  function handleSave(driver: Driver) {
    setDrivers((prev) => {
      const exists = prev.some((existing) => existing.id === driver.id);
      if (exists) {
        return prev.map((existing) => (existing.id === driver.id ? driver : existing));
      }
      return [...prev, driver];
    });
    setDialogOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Our Drivers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage driver records across all branches
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Driver
        </button>
      </div>

      <DriverTable drivers={drivers} onEdit={handleEdit} onDelete={handleDelete} />

      <DriverFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initialData={editingDriver}
        existingDrivers={drivers}
      />
    </div>
  );
}
