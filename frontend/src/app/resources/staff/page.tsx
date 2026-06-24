"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { StaffTable } from "@/components/staff/StaffTable";
import { StaffFormDialog } from "@/components/staff/StaffFormDialog";
import { initialStaff } from "@/lib/staff-data";
import type { Staff } from "@/types/staff";

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  function handleAdd() {
    setEditingStaff(null);
    setDialogOpen(true);
  }

  function handleEdit(member: Staff) {
    setEditingStaff(member);
    setDialogOpen(true);
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this staff member?")) return;
    setStaff((prev) => prev.filter((member) => member.id !== id));
  }

  function handleSave(member: Staff) {
    setStaff((prev) => {
      const exists = prev.some((existing) => existing.id === member.id);
      if (exists) {
        return prev.map((existing) => (existing.id === member.id ? member : existing));
      }
      return [...prev, member];
    });
    setDialogOpen(false);
  }

  return (
    <div className="animate-stagger flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Our Staff</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage staff records across all branches
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="group relative overflow-hidden flex items-center gap-2 rounded-xl bg-white/40 px-4 py-2 text-sm font-semibold text-blue-600 shadow-[0_4px_15px_rgba(37,99,235,0.1)] backdrop-blur-xl border border-white/80 transition-all duration-300 hover:bg-white/60 hover:shadow-[0_8px_25px_rgba(37,99,235,0.2)] hover:-translate-y-0.5 hover:border-white hover:text-blue-700 after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent after:-translate-x-full hover:after:translate-x-full after:transition-transform after:duration-700"
        >
          <Plus className="h-4 w-4" />
          Add Staff
        </button>
      </div>

      <StaffTable staff={staff} onEdit={handleEdit} onDelete={handleDelete} />

      <StaffFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initialData={editingStaff}
      />
    </div>
  );
}
