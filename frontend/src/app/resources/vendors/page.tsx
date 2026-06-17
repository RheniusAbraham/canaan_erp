"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { VendorTable } from "@/components/vendors/VendorTable";
import { VendorFormDialog } from "@/components/vendors/VendorFormDialog";
import { initialVendors } from "@/lib/vendor-data";
import type { Vendor } from "@/types/vendor";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  function handleAdd() {
    setEditingVendor(null);
    setDialogOpen(true);
  }

  function handleEdit(vendor: Vendor) {
    setEditingVendor(vendor);
    setDialogOpen(true);
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this vendor?")) return;
    setVendors((prev) => prev.filter((vendor) => vendor.id !== id));
  }

  function handleSave(vendor: Vendor) {
    setVendors((prev) => {
      const exists = prev.some((existing) => existing.id === vendor.id);
      if (exists) {
        return prev.map((existing) => (existing.id === vendor.id ? vendor : existing));
      }
      return [...prev, vendor];
    });
    setDialogOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Our Vendors</h1>
          <p className="mt-1 text-sm text-gray-500">Manage vendor records and contacts</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Vendor
        </button>
      </div>

      <VendorTable vendors={vendors} onEdit={handleEdit} onDelete={handleDelete} />

      <VendorFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initialData={editingVendor}
      />
    </div>
  );
}
