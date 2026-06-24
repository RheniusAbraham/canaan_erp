"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Field, inputClass } from "@/components/ui/Field";
import type { Trip } from "@/types/trip";
import type { Driver } from "@/types/driver";
import type { Truck } from "@/types/truck";
import type { TripClosureData, PaymentMode } from "@/types/trip-closure";
import { DatePicker } from "@/components/ui/DatePicker";

const PAYMENT_MODE_OPTIONS: PaymentMode[] = [
  "Cash",
  "UPI",
  "Bank Transfer",
  "Cheque",
  "NEFT / RTGS",
];

const readonlyClass =
  "w-full rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700 cursor-not-allowed";

const sectionHeadingClass = "text-xs font-semibold uppercase tracking-wider text-gray-400 pt-2";

const emptyForm = (tripId: string): TripClosureData => ({
  tripId,
  billTo: "",
  tripCompletedDate: "",
  tripClosingDate: "",
  hireAmount: "",
  transportAmount: "",
  billingAmount: "",
  driverAdvanceAmount: "",
  paymentMode: "",
  companyHaltDays: "",
  partyHaltDays: "",
  haltRemarks: "",
});

type CloseTripDialogProps = {
  open: boolean;
  trip: Trip | null;
  driver: Driver | undefined;
  truck: Truck | undefined;
  onClose: () => void;
  onSubmit: (data: TripClosureData) => void;
};

export function CloseTripDialog({ open, trip, driver, truck, onClose, onSubmit }: CloseTripDialogProps) {
  const [form, setForm] = useState<TripClosureData>(emptyForm(""));

  useEffect(() => {
    if (open && trip) {
      setForm(emptyForm(trip.id));
    }
  }, [open, trip]);

  function update<K extends keyof TripClosureData>(key: K, value: TripClosureData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(form);
  }

  if (!trip) return null;

  return (
    <Dialog open={open} onClose={onClose} title="Close Trip" className="max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* 1. Trip Identification */}
        <section className="flex flex-col gap-4">
          <p className={sectionHeadingClass}>1. Trip Identification</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Booking Reference">
              <input readOnly disabled value={trip.bookingReferenceNo} className={readonlyClass} />
            </Field>
            <Field label="Container Reference">
              <input readOnly disabled value={trip.cargoContainerReference} className={readonlyClass} />
            </Field>
            <Field label="Release Order Reference" className="sm:col-span-2">
              <input readOnly disabled value={trip.releaseOrderReference} className={readonlyClass} />
            </Field>
          </div>
        </section>

        {/* 2. Trip Summary */}
        <section className="flex flex-col gap-4">
          <p className={sectionHeadingClass}>2. Trip Summary</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Vehicle">
              <input readOnly disabled value={truck?.registrationNumber ?? "—"} className={readonlyClass} />
            </Field>
            <Field label="Driver">
              <input readOnly disabled value={driver?.name ?? "—"} className={readonlyClass} />
            </Field>
            <Field label="Shipping Line">
              <input readOnly disabled value={trip.shippingLine} className={readonlyClass} />
            </Field>
            <Field label="Container Specification">
              <input readOnly disabled value={trip.containerSpecification} className={readonlyClass} />
            </Field>
            <Field label="Load Type">
              <input readOnly disabled value={trip.cargoClassification} className={readonlyClass} />
            </Field>
            <Field label="Origin">
              <input readOnly disabled value={trip.origin} className={readonlyClass} />
            </Field>
            <Field label="Destination">
              <input readOnly disabled value={trip.destination} className={readonlyClass} />
            </Field>
            <Field label="Bill To">
              <input
                type="text"
                required
                value={form.billTo}
                onChange={(e) => update("billTo", e.target.value)}
                className={inputClass}
                placeholder="e.g. Blue Wave Shipping Pvt Ltd"
              />
            </Field>
          </div>
        </section>

        {/* 3. Trip Completion */}
        <section className="flex flex-col gap-4">
          <p className={sectionHeadingClass}>3. Trip Completion</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Trip Completed Date">
              <DatePicker value={form.tripCompletedDate} onChange={(val) => update("tripCompletedDate", val)} />
            </Field>
            <Field label="Trip Closing Date">
              <DatePicker value={form.tripClosingDate} onChange={(val) => update("tripClosingDate", val)} />
            </Field>
          </div>
        </section>

        {/* 4. Financial Settlement */}
        <section className="flex flex-col gap-4">
          <p className={sectionHeadingClass}>4. Financial Settlement</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Hire Amount (₹)">
              <input
                type="number"
                min="0"
                required
                value={form.hireAmount}
                onChange={(e) => update("hireAmount", e.target.value)}
                className={inputClass}
                placeholder="e.g. 32000"
              />
            </Field>
            <Field label="Transport Amount (₹)">
              <input
                type="number"
                min="0"
                required
                value={form.transportAmount}
                onChange={(e) => update("transportAmount", e.target.value)}
                className={inputClass}
                placeholder="e.g. 30000"
              />
            </Field>
            <Field label="Billing Amount (₹)">
              <input
                type="number"
                min="0"
                required
                value={form.billingAmount}
                onChange={(e) => update("billingAmount", e.target.value)}
                className={inputClass}
                placeholder="e.g. 30000"
              />
            </Field>
            <Field label="Driver Advance Amount (₹)">
              <input
                type="number"
                min="0"
                value={form.driverAdvanceAmount}
                onChange={(e) => update("driverAdvanceAmount", e.target.value)}
                className={inputClass}
                placeholder="e.g. 2000"
              />
            </Field>
            <Field label="Payment Mode" className="sm:col-span-2">
              <select
                required
                value={form.paymentMode}
                onChange={(e) => update("paymentMode", e.target.value as PaymentMode)}
                className={inputClass}
              >
                <option value="" disabled>Select payment mode</option>
                {PAYMENT_MODE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </Field>
          </div>
        </section>

        {/* 5. Halt Information */}
        <section className="flex flex-col gap-4">
          <p className={sectionHeadingClass}>5. Halt Information</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Company Halt Days">
              <input
                type="number"
                min="0"
                value={form.companyHaltDays}
                onChange={(e) => update("companyHaltDays", e.target.value)}
                className={inputClass}
                placeholder="0"
              />
            </Field>
            <Field label="Party Halt Days">
              <input
                type="number"
                min="0"
                value={form.partyHaltDays}
                onChange={(e) => update("partyHaltDays", e.target.value)}
                className={inputClass}
                placeholder="0"
              />
            </Field>
            <Field label="Halt Remarks" className="sm:col-span-2">
              <textarea
                rows={3}
                value={form.haltRemarks}
                onChange={(e) => update("haltRemarks", e.target.value)}
                className={inputClass}
                placeholder="e.g. Delayed at port due to documentation"
              />
            </Field>
          </div>
        </section>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Close Trip
          </button>
        </div>
      </form>
    </Dialog>
  );
}
