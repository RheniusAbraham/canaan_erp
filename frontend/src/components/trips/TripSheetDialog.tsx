"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Field, inputClass } from "@/components/ui/Field";
import type { Trip } from "@/types/trip";
import type { TripClosureData } from "@/types/trip-closure";
import { type TripSheetData, sumCharges } from "@/types/trip-sheet";

const sectionHeadingClass = "text-xs font-semibold uppercase tracking-wider text-gray-400 pt-2";

const totalClass =
  "flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm";

const emptySheet = (tripId: string): TripSheetData => ({
  tripId,
  baseTransportHire: "",
  transportHaltCharges: "",
  transportUnloadingCharges: "",
  transportLiftingCharges: "",
  transportWeighmentCharges: "",
  billingBaseHire: "",
  billingHaltCharges: "",
  billingUnloadingCharges: "",
  billingLiftingCharges: "",
  billingWeighmentCharges: "",
});

type TripSheetDialogProps = {
  open: boolean;
  trip: Trip | null;
  closure: TripClosureData | undefined;
  existingSheet?: TripSheetData;
  readOnly?: boolean;
  onClose: () => void;
  onSubmit: (data: TripSheetData) => void;
};

export function TripSheetDialog({ open, trip, closure, existingSheet, readOnly, onClose, onSubmit }: TripSheetDialogProps) {
  const [form, setForm] = useState<TripSheetData>(emptySheet(""));

  useEffect(() => {
    if (open && trip) {
      setForm(existingSheet ? { ...existingSheet } : emptySheet(trip.id));
    }
  }, [open, trip, existingSheet]);

  function update<K extends keyof TripSheetData>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(form);
  }

  if (!trip) return null;

  const totalTransport = sumCharges(
    form.baseTransportHire,
    form.transportHaltCharges,
    form.transportUnloadingCharges,
    form.transportLiftingCharges,
    form.transportWeighmentCharges,
  );

  const totalBilling = sumCharges(
    form.billingBaseHire,
    form.billingHaltCharges,
    form.billingUnloadingCharges,
    form.billingLiftingCharges,
    form.billingWeighmentCharges,
  );

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const fieldClass = readOnly
    ? `${inputClass} bg-gray-50 cursor-default`
    : inputClass;

  return (
    <Dialog open={open} onClose={onClose} title={readOnly ? `View Trip Sheet — ${trip.tripId}` : `Trip Sheet — ${trip.tripId}`} className="max-w-2xl">
      {/* Trip reference strip */}
      <div className="mb-5 grid grid-cols-3 gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-xs">
        <div>
          <p className="text-gray-400">Booking Ref</p>
          <p className="font-medium text-gray-700">{trip.bookingReferenceNo}</p>
        </div>
        <div>
          <p className="text-gray-400">Container Ref</p>
          <p className="font-medium text-gray-700">{trip.cargoContainerReference}</p>
        </div>
        <div>
          <p className="text-gray-400">Bill To</p>
          <p className="font-medium text-gray-700">{closure?.billTo || "—"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* 1. Transport Charges */}
        <section className="flex flex-col gap-4">
          <p className={sectionHeadingClass}>1. Transport Charges</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Base Transport Hire (₹)">
              <input type="number" min="0" value={form.baseTransportHire}
                onChange={(e) => update("baseTransportHire", e.target.value)}
                readOnly={readOnly} className={fieldClass} placeholder="e.g. 32000" />
            </Field>
            <Field label="Transport Halt Charges (₹)">
              <input type="number" min="0" value={form.transportHaltCharges}
                onChange={(e) => update("transportHaltCharges", e.target.value)}
                readOnly={readOnly} className={fieldClass} placeholder="e.g. 0" />
            </Field>
            <Field label="Transport Unloading Charges (₹)">
              <input type="number" min="0" value={form.transportUnloadingCharges}
                onChange={(e) => update("transportUnloadingCharges", e.target.value)}
                readOnly={readOnly} className={fieldClass} placeholder="e.g. 0" />
            </Field>
            <Field label="Transport Lifting Charges (₹)">
              <input type="number" min="0" value={form.transportLiftingCharges}
                onChange={(e) => update("transportLiftingCharges", e.target.value)}
                readOnly={readOnly} className={fieldClass} placeholder="e.g. 0" />
            </Field>
            <Field label="Transport Weighment Charges (₹)" className="sm:col-span-2">
              <input type="number" min="0" value={form.transportWeighmentCharges}
                onChange={(e) => update("transportWeighmentCharges", e.target.value)}
                readOnly={readOnly} className={fieldClass} placeholder="e.g. 0" />
            </Field>
          </div>
          <div className={totalClass}>
            <span className="font-semibold text-gray-700">Total Transport Charges</span>
            <span className="font-bold text-blue-700">{fmt(totalTransport)}</span>
          </div>
        </section>

        {/* 2. Customer Billing */}
        <section className="flex flex-col gap-4">
          <p className={sectionHeadingClass}>2. Customer Billing</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Billing Base Hire (₹)">
              <input type="number" min="0" value={form.billingBaseHire}
                onChange={(e) => update("billingBaseHire", e.target.value)}
                readOnly={readOnly} className={fieldClass} placeholder="e.g. 35000" />
            </Field>
            <Field label="Billing Halt Charges (₹)">
              <input type="number" min="0" value={form.billingHaltCharges}
                onChange={(e) => update("billingHaltCharges", e.target.value)}
                readOnly={readOnly} className={fieldClass} placeholder="e.g. 0" />
            </Field>
            <Field label="Billing Unloading Charges (₹)">
              <input type="number" min="0" value={form.billingUnloadingCharges}
                onChange={(e) => update("billingUnloadingCharges", e.target.value)}
                readOnly={readOnly} className={fieldClass} placeholder="e.g. 0" />
            </Field>
            <Field label="Billing Lifting Charges (₹)">
              <input type="number" min="0" value={form.billingLiftingCharges}
                onChange={(e) => update("billingLiftingCharges", e.target.value)}
                readOnly={readOnly} className={fieldClass} placeholder="e.g. 0" />
            </Field>
            <Field label="Billing Weighment Charges (₹)" className="sm:col-span-2">
              <input type="number" min="0" value={form.billingWeighmentCharges}
                onChange={(e) => update("billingWeighmentCharges", e.target.value)}
                readOnly={readOnly} className={fieldClass} placeholder="e.g. 0" />
            </Field>
          </div>
          <div className={totalClass}>
            <span className="font-semibold text-gray-700">Total Billing Amount</span>
            <span className="font-bold text-emerald-700">{fmt(totalBilling)}</span>
          </div>
        </section>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
          <button type="button" onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
            {readOnly ? "Close" : "Cancel"}
          </button>
          {!readOnly && (
            <button type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              Save Trip Sheet
            </button>
          )}
        </div>
      </form>
    </Dialog>
  );
}
