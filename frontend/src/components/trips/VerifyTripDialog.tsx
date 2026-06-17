"use client";

import { Dialog } from "@/components/ui/Dialog";
import type { Trip } from "@/types/trip";
import type { TripClosureData } from "@/types/trip-closure";
import type { TripSheetData } from "@/types/trip-sheet";
import { sumCharges } from "@/types/trip-sheet";

type VerifyTripDialogProps = {
  open: boolean;
  trip: Trip | null;
  closure: TripClosureData | undefined;
  sheet: TripSheetData | undefined;
  onClose: () => void;
  onViewSheet: () => void;
  onEditSheet: () => void;
  onFlag: () => void;
  onConfirm: () => void;
};

const sectionHeadingClass = "text-xs font-semibold uppercase tracking-wider text-gray-400 pt-2";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
      <span className="shrink-0 text-gray-500">{label}</span>
      <span className="text-right font-medium text-gray-800">{value || "—"}</span>
    </div>
  );
}

function Divider() {
  return <div className="my-2 border-t border-gray-100" />;
}

export function VerifyTripDialog({
  open, trip, closure, sheet,
  onClose, onViewSheet, onEditSheet, onFlag, onConfirm,
}: VerifyTripDialogProps) {
  if (!trip) return null;

  const fmt = (n: number) =>
    `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const totalTransport = sheet
    ? sumCharges(sheet.baseTransportHire, sheet.transportHaltCharges, sheet.transportUnloadingCharges, sheet.transportLiftingCharges, sheet.transportWeighmentCharges)
    : 0;

  const totalBilling = sheet
    ? sumCharges(sheet.billingBaseHire, sheet.billingHaltCharges, sheet.billingUnloadingCharges, sheet.billingLiftingCharges, sheet.billingWeighmentCharges)
    : 0;

  return (
    <Dialog open={open} onClose={onClose} title={`Verify Trip Data — ${trip.tripId}`} className="max-w-2xl">
      <div className="flex flex-col gap-5">

        {/* Trip Sheet attribution */}
        <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm">
          <span className="text-blue-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </span>
          <span className="text-blue-700">
            Trip Sheet uploaded by{" "}
            <span className="font-semibold">Fleet Manager</span>
          </span>
        </div>

        {/* Trip Identification */}
        <section>
          <p className={sectionHeadingClass}>Trip Identification</p>
          <Divider />
          <Row label="Trip ID" value={trip.tripId} />
          <Row label="Booking Reference" value={trip.bookingReferenceNo} />
          <Row label="Container Reference" value={trip.cargoContainerReference} />
          <Row label="Origin → Destination" value={`${trip.origin} → ${trip.destination}`} />
          <Row label="Cargo Classification" value={trip.cargoClassification} />
          <Row label="Container Specification" value={trip.containerSpecification} />
        </section>

        {/* Trip Closure */}
        <section>
          <p className={sectionHeadingClass}>Trip Closure</p>
          <Divider />
          <Row label="Bill To" value={closure?.billTo ?? ""} />
          <Row label="Trip Completed Date" value={closure?.tripCompletedDate ?? ""} />
          <Row label="Trip Closing Date" value={closure?.tripClosingDate ?? ""} />
          <Row label="Hire Amount" value={closure ? `₹${closure.hireAmount}` : ""} />
          <Row label="Transport Amount" value={closure ? `₹${closure.transportAmount}` : ""} />
          <Row label="Billing Amount" value={closure ? `₹${closure.billingAmount}` : ""} />
          <Row label="Driver Advance" value={closure ? `₹${closure.driverAdvanceAmount}` : ""} />
          <Row label="Payment Mode" value={closure?.paymentMode ?? ""} />
          <Row label="Company Halt Days" value={closure?.companyHaltDays ?? ""} />
          <Row label="Party Halt Days" value={closure?.partyHaltDays ?? ""} />
          <Row label="Halt Remarks" value={closure?.haltRemarks ?? ""} />
        </section>

        {/* Transport Charges */}
        <section>
          <p className={sectionHeadingClass}>Transport Charges</p>
          <Divider />
          <Row label="Base Transport Hire" value={sheet ? `₹${sheet.baseTransportHire}` : ""} />
          <Row label="Halt Charges" value={sheet ? `₹${sheet.transportHaltCharges}` : ""} />
          <Row label="Unloading Charges" value={sheet ? `₹${sheet.transportUnloadingCharges}` : ""} />
          <Row label="Lifting Charges" value={sheet ? `₹${sheet.transportLiftingCharges}` : ""} />
          <Row label="Weighment Charges" value={sheet ? `₹${sheet.transportWeighmentCharges}` : ""} />
          <div className="mt-2 flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2 text-sm">
            <span className="font-semibold text-gray-700">Total Transport Charges</span>
            <span className="font-bold text-blue-700">{fmt(totalTransport)}</span>
          </div>
        </section>

        {/* Customer Billing */}
        <section>
          <p className={sectionHeadingClass}>Customer Billing</p>
          <Divider />
          <Row label="Billing Base Hire" value={sheet ? `₹${sheet.billingBaseHire}` : ""} />
          <Row label="Halt Charges" value={sheet ? `₹${sheet.billingHaltCharges}` : ""} />
          <Row label="Unloading Charges" value={sheet ? `₹${sheet.billingUnloadingCharges}` : ""} />
          <Row label="Lifting Charges" value={sheet ? `₹${sheet.billingLiftingCharges}` : ""} />
          <Row label="Weighment Charges" value={sheet ? `₹${sheet.billingWeighmentCharges}` : ""} />
          <div className="mt-2 flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm">
            <span className="font-semibold text-gray-700">Total Billing Amount</span>
            <span className="font-bold text-emerald-700">{fmt(totalBilling)}</span>
          </div>
        </section>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
          {/* Left: sheet actions */}
          <div className="flex gap-2">
            <button type="button" onClick={onViewSheet}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
              View Trip Sheet
            </button>
            <button type="button" onClick={onEditSheet}
              className="rounded-lg border border-blue-300 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50">
              Edit Trip Sheet
            </button>
            <button type="button" onClick={onFlag}
              className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
              Flag for Rechecking
            </button>
          </div>
          {/* Right: confirm */}
          <button type="button" onClick={onConfirm}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            Confirm Verification
          </button>
        </div>
      </div>
    </Dialog>
  );
}
