"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TyreInventoryTable } from "@/components/tyre-inventory/TyreInventoryTable";
import { TyreInventoryFormDialog } from "@/components/tyre-inventory/TyreInventoryFormDialog";
import { TyreHistoryDialog } from "@/components/tyre-inventory/TyreHistoryDialog";
import { TyreReportDialog } from "@/components/tyre-inventory/TyreReportDialog";
import { useTyreInventory } from "@/context/TyreInventoryContext";
import type { TyreInventoryItem } from "@/types/tyre-inventory";

export default function TyreInventoryPage() {
  const { tyres, setTyres, fitmentRecords } = useTyreInventory();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTyre, setEditingTyre] = useState<TyreInventoryItem | null>(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [historyTyre, setHistoryTyre] = useState<TyreInventoryItem | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportTyre, setReportTyre] = useState<TyreInventoryItem | null>(null);

  function handleAdd() {
    setEditingTyre(null);
    setDialogOpen(true);
  }

  function handleEdit(tyre: TyreInventoryItem) {
    setEditingTyre(tyre);
    setDialogOpen(true);
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this tyre?")) return;
    setTyres((prev) => prev.filter((tyre) => tyre.id !== id));
  }

  function handleSave(tyre: TyreInventoryItem) {
    setTyres((prev) => {
      const exists = prev.some((existing) => existing.id === tyre.id);
      if (exists) {
        return prev.map((existing) => (existing.id === tyre.id ? tyre : existing));
      }
      return [...prev, tyre];
    });
    setDialogOpen(false);
  }

  function handleViewHistory(tyre: TyreInventoryItem) {
    setHistoryTyre(tyre);
    setHistoryDialogOpen(true);
  }

  function handleViewReport(tyre: TyreInventoryItem) {
    setReportTyre(tyre);
    setReportDialogOpen(true);
  }

  function handleFlagForRetreading(tyre: TyreInventoryItem) {
    setTyres((prev) =>
      prev.map((existing) => (existing.id === tyre.id ? { ...existing, flaggedForRetreading: true } : existing))
    );
  }

  return (
    <div className="animate-stagger flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tyre Inventory</h1>
          <p className="mt-1 text-sm text-gray-500">Track all tyres purchased by the company</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Tyre
        </button>
      </div>

      <TyreInventoryTable
        tyres={tyres}
        fitmentRecords={fitmentRecords}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewHistory={handleViewHistory}
        onFlagForRetreading={handleFlagForRetreading}
        onViewReport={handleViewReport}
      />

      <TyreInventoryFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initialData={editingTyre}
        existingTyres={tyres}
      />

      <TyreHistoryDialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        tyre={historyTyre}
        records={fitmentRecords}
      />

      <TyreReportDialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        tyre={reportTyre}
        records={fitmentRecords}
      />
    </div>
  );
}
