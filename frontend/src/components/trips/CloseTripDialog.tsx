"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Field, inputClass } from "@/components/ui/Field";
import type { Trip } from "@/types/trip";
import type { Driver } from "@/types/driver";
import type { Truck } from "@/types/truck";
import type { TripClosureData, PaymentMode } from "@/types/trip-closure";

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
  additionalDriverAdvanceAmount: "",
  paymentMode: "",
  startingOdometer: "",
  endingOdometer: "",
  totalDistance: "",
  grossWeight: "",
  tareWeight: "",
  netWeight: "",
  bunkName: "",
  dieselQuantity: "",
  fuelTotalCost: "",
  totalHaltDays: "",
  haltRemarks: "",
  driversCompensation: "",
  haltCompensation: "",
  portPassExpense: "",
  weightSheetExpense: "",
  mamolExpense: "",
  claimableMamolExpense: "",
  trafficRtoPoliceExpense: "",
  liftOnOffExpense: "",
  craneOperatorExpense: "",
  parkingExpenses: "",
  punctureExpense: "",
  sparePartsExpense: "",
  otherExpenses: "",
  tollExpenses: "",
  companyHaltDays: "",
  partyHaltDays: "",
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
              <input
                readOnly
                disabled
                value={
                  trip.containerSpecification === "2 X 20 FEET CONTAINERS"
                    ? `${trip.containerNumber1} / ${trip.containerNumber2}`
                    : trip.containerSpecification === "20 FT CONTAINER" || trip.containerSpecification === "40 FT CONTAINER"
                    ? trip.containerNumber
                    : trip.containerSpecification === "OPEN LOAD CARGO"
                    ? trip.cargoReference
                    : ""
                }
                className={readonlyClass}
              />
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
              <input
                type="date"
                required
                value={form.tripCompletedDate}
                onChange={(e) => update("tripCompletedDate", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Trip Closing Date">
              <input
                type="date"
                required
                value={form.tripClosingDate}
                onChange={(e) => update("tripClosingDate", e.target.value)}
                className={inputClass}
              />
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
            <Field label="Additional Driver Advance Amount (₹)">
              <input
                type="number"
                min="0"
                value={form.additionalDriverAdvanceAmount}
                onChange={(e) => update("additionalDriverAdvanceAmount", e.target.value)}
                className={inputClass}
                placeholder="e.g. 1000"
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

        {/* 5. Trip Distance Details */}
        <section className="flex flex-col gap-4">
          <p className={sectionHeadingClass}>5. Trip Distance Details</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Starting Odometer (km)">
              <input
                type="number"
                min="0"
                value={form.startingOdometer}
                onChange={(e) => update("startingOdometer", e.target.value)}
                className={inputClass}
                placeholder="e.g. 45000"
              />
            </Field>
            <Field label="Ending Odometer (km)">
              <input
                type="number"
                min="0"
                value={form.endingOdometer}
                onChange={(e) => update("endingOdometer", e.target.value)}
                className={inputClass}
                placeholder="e.g. 45350"
              />
            </Field>
            <Field label="Total Distance (km)">
              <input
                type="number"
                readOnly
                disabled
                value={form.startingOdometer && form.endingOdometer
                  ? (parseInt(form.endingOdometer) - parseInt(form.startingOdometer)).toString()
                  : ""}
                className={readonlyClass}
                placeholder="Auto-calculated"
              />
            </Field>
          </div>
        </section>

        {/* 6. Cargo Weight Details */}
        <section className="flex flex-col gap-4">
          <p className={sectionHeadingClass}>6. Cargo Weight Details</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Gross Weight (kg)">
              <input
                type="number"
                min="0"
                value={form.grossWeight}
                onChange={(e) => update("grossWeight", e.target.value)}
                className={inputClass}
                placeholder="e.g. 20000"
              />
            </Field>
            <Field label="Tare Weight (kg)">
              <input
                type="number"
                min="0"
                value={form.tareWeight}
                onChange={(e) => update("tareWeight", e.target.value)}
                className={inputClass}
                placeholder="e.g. 2500"
              />
            </Field>
            <Field label="Net Weight (kg)">
              <input
                type="number"
                min="0"
                value={form.netWeight}
                onChange={(e) => update("netWeight", e.target.value)}
                className={inputClass}
                placeholder="e.g. 17500"
              />
            </Field>
          </div>
        </section>

        {/* 7. Trip Fuel Details */}
        <section className="flex flex-col gap-4">
          <p className={sectionHeadingClass}>7. Trip Fuel Details</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name of the Bunk" className="sm:col-span-2">
              <input
                type="text"
                value={form.bunkName}
                onChange={(e) => update("bunkName", e.target.value)}
                className={inputClass}
                placeholder="e.g. Shell Fuel Station, Coimbatore"
              />
            </Field>
            <Field label="Diesel Quantity (Litres)">
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.dieselQuantity}
                onChange={(e) => update("dieselQuantity", e.target.value)}
                className={inputClass}
                placeholder="e.g. 85"
              />
            </Field>
            <Field label="Total Cost (₹)">
              <input
                type="number"
                min="0"
                value={form.fuelTotalCost}
                onChange={(e) => update("fuelTotalCost", e.target.value)}
                className={inputClass}
                placeholder="e.g. 6800"
              />
            </Field>
          </div>
        </section>

        {/* 8. Trip Expenses */}
        <section className="flex flex-col gap-4">
          <p className={sectionHeadingClass}>8. Trip Expenses</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Total Halt Days">
              <input
                type="number"
                min="0"
                value={form.totalHaltDays}
                onChange={(e) => update("totalHaltDays", e.target.value)}
                className={inputClass}
                placeholder="0"
              />
            </Field>
            <Field label="Halt Remarks" className="sm:col-span-2">
              <textarea
                rows={2}
                value={form.haltRemarks}
                onChange={(e) => update("haltRemarks", e.target.value)}
                className={inputClass}
                placeholder="e.g. Delayed at port due to documentation"
              />
            </Field>
            <Field label="Driver's Compensation (₹)">
              <input
                type="number"
                min="0"
                value={form.driversCompensation}
                onChange={(e) => update("driversCompensation", e.target.value)}
                className={inputClass}
                placeholder="e.g. 500"
              />
            </Field>
            <Field label="Halt Compensation (₹)">
              <input
                type="number"
                min="0"
                value={form.haltCompensation}
                onChange={(e) => update("haltCompensation", e.target.value)}
                className={inputClass}
                placeholder="e.g. 300"
              />
            </Field>
            <Field label="Port Pass Expense (பாஸ்) (₹)">
              <input
                type="number"
                min="0"
                value={form.portPassExpense}
                onChange={(e) => update("portPassExpense", e.target.value)}
                className={inputClass}
                placeholder="e.g. 250"
              />
            </Field>
            <Field label="Weight Sheet Expense (எடை) (₹)">
              <input
                type="number"
                min="0"
                value={form.weightSheetExpense}
                onChange={(e) => update("weightSheetExpense", e.target.value)}
                className={inputClass}
                placeholder="e.g. 150"
              />
            </Field>
            <Field label="Mamol Expense (இறக்கு / ஏற்று மாமூல்) (₹)">
              <input
                type="number"
                min="0"
                value={form.mamolExpense}
                onChange={(e) => update("mamolExpense", e.target.value)}
                className={inputClass}
                placeholder="e.g. 400"
              />
            </Field>
            <Field label="Claimable Mamol Expense (திரும்பப் பெறக்கூடிய இறக்கு / ஏற்று மாமூல்) (₹)">
              <input
                type="number"
                min="0"
                value={form.claimableMamolExpense}
                onChange={(e) => update("claimableMamolExpense", e.target.value)}
                className={inputClass}
                placeholder="e.g. 200"
              />
            </Field>
            <Field label="Traffic/RTO / Police Expense (₹)">
              <input
                type="number"
                min="0"
                value={form.trafficRtoPoliceExpense}
                onChange={(e) => update("trafficRtoPoliceExpense", e.target.value)}
                className={inputClass}
                placeholder="e.g. 100"
              />
            </Field>
            <Field label="Lift On / Off (லிப்டான்) (₹)">
              <input
                type="number"
                min="0"
                value={form.liftOnOffExpense}
                onChange={(e) => update("liftOnOffExpense", e.target.value)}
                className={inputClass}
                placeholder="e.g. 500"
              />
            </Field>
            <Field label="Crane Operator Expense (₹)">
              <input
                type="number"
                min="0"
                value={form.craneOperatorExpense}
                onChange={(e) => update("craneOperatorExpense", e.target.value)}
                className={inputClass}
                placeholder="e.g. 600"
              />
            </Field>
            <Field label="Parking Expenses (₹)">
              <input
                type="number"
                min="0"
                value={form.parkingExpenses}
                onChange={(e) => update("parkingExpenses", e.target.value)}
                className={inputClass}
                placeholder="e.g. 200"
              />
            </Field>
            <Field label="Puncture Expense (₹)">
              <input
                type="number"
                min="0"
                value={form.punctureExpense}
                onChange={(e) => update("punctureExpense", e.target.value)}
                className={inputClass}
                placeholder="e.g. 1500"
              />
            </Field>
            <Field label="Spare Parts Expense (₹)">
              <input
                type="number"
                min="0"
                value={form.sparePartsExpense}
                onChange={(e) => update("sparePartsExpense", e.target.value)}
                className={inputClass}
                placeholder="e.g. 2000"
              />
            </Field>
            <Field label="Other Expenses (₹)">
              <input
                type="number"
                min="0"
                value={form.otherExpenses}
                onChange={(e) => update("otherExpenses", e.target.value)}
                className={inputClass}
                placeholder="e.g. 500"
              />
            </Field>
            <Field label="Toll Expenses (₹)">
              <input
                type="number"
                min="0"
                value={form.tollExpenses}
                onChange={(e) => update("tollExpenses", e.target.value)}
                className={inputClass}
                placeholder="e.g. 1200"
              />
            </Field>
          </div>
        </section>

        {/* 9. Halt Information */}
        <section className="flex flex-col gap-4">
          <p className={sectionHeadingClass}>9. Halt Information</p>
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
