"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Field, inputClass } from "@/components/ui/Field";
import { TYRE_BRAND_OPTIONS, TYRE_CONDITION_OPTIONS, TYRE_TYPE_OPTIONS } from "@/lib/tyre-inventory-data";
import type { TyreInventoryItem } from "@/types/tyre-inventory";

type TyreInventoryFormDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (tyre: TyreInventoryItem) => void;
  initialData: TyreInventoryItem | null;
  existingTyres: TyreInventoryItem[];
};

const emptyForm: Omit<TyreInventoryItem, "id"> = {
  brand: "",
  pattern: "",
  tyreType: "",
  tyreNumber: "",
  size: "",
  range: "",
  cost: "",
  condition: "",
  flaggedForRetreading: false,
  purchaseDate: "",
  repairCost: "0",
  retreadCost: "0",
  retreadCount: "0",
};

export function TyreInventoryFormDialog({
  open,
  onClose,
  onSave,
  initialData,
  existingTyres,
}: TyreInventoryFormDialogProps) {
  const [form, setForm] = useState<Omit<TyreInventoryItem, "id">>(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      const { id: _id, ...rest } = initialData ?? { id: "", ...emptyForm };
      setForm(rest);
      setError("");
    }
  }, [open, initialData]);

  function update<K extends keyof Omit<TyreInventoryItem, "id">>(
    key: K,
    value: Omit<TyreInventoryItem, "id">[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const duplicate = existingTyres.some(
      (tyre) =>
        tyre.tyreNumber.trim().toLowerCase() === form.tyreNumber.trim().toLowerCase() &&
        tyre.id !== initialData?.id
    );
    if (duplicate) {
      setError("This Tyre Number is already in use. Tyre Number must be unique.");
      return;
    }

    onSave({
      id: initialData?.id ?? crypto.randomUUID(),
      ...form,
    });
  }

  return (
    <Dialog open={open} onClose={onClose} title={initialData ? "Edit Tyre" : "Add Tyre"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Brand">
            <input
              type="text"
              required
              list="tyre-brand-options"
              value={form.brand}
              onChange={(e) => update("brand", e.target.value)}
              className={inputClass}
              placeholder="Select or type a brand"
            />
            <datalist id="tyre-brand-options">
              {TYRE_BRAND_OPTIONS.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </Field>

          <Field label="Tyre Pattern">
            <input
              type="text"
              required
              value={form.pattern}
              onChange={(e) => update("pattern", e.target.value)}
              className={inputClass}
              placeholder="e.g. MRF Steeline TT13"
            />
          </Field>

          <Field label="Tyre Type">
            <input
              type="text"
              required
              list="tyre-type-options"
              value={form.tyreType}
              onChange={(e) => update("tyreType", e.target.value)}
              className={inputClass}
              placeholder="Select or type a type"
            />
            <datalist id="tyre-type-options">
              {TYRE_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </Field>

          <Field label="Tyre Number">
            <input
              type="text"
              required
              value={form.tyreNumber}
              onChange={(e) => {
                update("tyreNumber", e.target.value);
                setError("");
              }}
              className={inputClass}
              placeholder="Unique tyre identifier"
            />
          </Field>

          <Field label="Tyre Size">
            <input
              type="text"
              required
              value={form.size}
              onChange={(e) => update("size", e.target.value)}
              className={inputClass}
              placeholder="e.g. 295/95 R22.5"
            />
          </Field>

          <Field label="Range (km)">
            <input
              type="number"
              required
              min="0"
              value={form.range}
              onChange={(e) => update("range", e.target.value)}
              className={inputClass}
              placeholder="e.g. 80000"
            />
          </Field>

          <Field label="Cost">
            <input
              type="number"
              required
              min="0"
              value={form.cost}
              onChange={(e) => update("cost", e.target.value)}
              className={inputClass}
              placeholder="e.g. 18500"
            />
          </Field>

          <Field label="Status">
            <select
              required
              value={form.condition}
              onChange={(e) => update("condition", e.target.value as TyreInventoryItem["condition"])}
              className={inputClass}
            >
              <option value="" disabled>
                Select status
              </option>
              {TYRE_CONDITION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Purchase Date">
            <input
              type="date"
              value={form.purchaseDate}
              onChange={(e) => update("purchaseDate", e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Repair Cost">
            <input
              type="number"
              min="0"
              value={form.repairCost}
              onChange={(e) => update("repairCost", e.target.value)}
              className={inputClass}
              placeholder="Total repair cost so far"
            />
          </Field>

          <Field label="Retreading Cost">
            <input
              type="number"
              min="0"
              value={form.retreadCost}
              onChange={(e) => update("retreadCost", e.target.value)}
              className={inputClass}
              placeholder="Total retreading cost so far"
            />
          </Field>

          <Field label="Number of Retreads">
            <input
              type="number"
              min="0"
              value={form.retreadCount}
              onChange={(e) => update("retreadCount", e.target.value)}
              className={inputClass}
              placeholder="e.g. 1"
            />
          </Field>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {initialData ? "Save Changes" : "Add Tyre"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
