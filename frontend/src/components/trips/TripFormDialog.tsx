"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Field, inputClass } from "@/components/ui/Field";
import {
  BILLING_METHOD_OPTIONS,
  BILLING_TYPE_OPTIONS,
  CARGO_CLASSIFICATION_OPTIONS,
  CONTAINER_SPECIFICATION_OPTIONS,
  DRIVER_ADVANCE_PAYMENT_METHOD_OPTIONS,
  DRIVER_COMPENSATION_TYPE_OPTIONS,
  MOVEMENT_CATEGORY_OPTIONS,
  TRANSPORT_METHOD_OPTIONS,
  TRIP_CATEGORY_OPTIONS,
  generateBookingReferenceNo,
  generateTripId,
} from "@/lib/trip-data";
import type { Trip } from "@/types/trip";
import type { Driver } from "@/types/driver";
import type { Truck } from "@/types/truck";
import type { Customer } from "@/types/customer";

type AssignableDriver = {
  driver: Driver;
  truck: Truck;
};

type TripFormDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (trip: Trip) => void;
  existingTrips: Trip[];
  customers: Customer[];
  assignableDrivers: AssignableDriver[];
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

const emptyForm: Omit<Trip, "id" | "tripId" | "status" | "vehicleId"> = {
  bookingReferenceNo: "",
  bookingCreatedDate: "",
  tripCategory: "",
  movementCategory: "",
  customerId: "",
  shipperConsignee: "",
  billingAccount: "",
  cargoContainerReference: "",
  cargoClassification: "",
  containerSpecification: "",
  releaseOrderReference: "",
  cargoWeight: "",
  origin: "",
  destination: "",
  shippingLine: "",
  vesselName: "",
  transportMethod: "",
  scheduledDate: "",
  driverId: "",
  billingMethod: "",
  billingType: "",
  customerCashAdvance: "",
  customerFuelAdvanceAmount: "",
  customerFuelAdvanceLitres: "",
  driverAdvanceAmount: "",
  driverAdvancePaymentMethod: "",
  driverCompensationType: "",
  transportHireCharge: "",
  finalSettlementAmount: "",
  internalRemarks: "",
  bookingInstructions: "",
};

export function TripFormDialog({
  open,
  onClose,
  onSave,
  existingTrips,
  customers,
  assignableDrivers,
}: TripFormDialogProps) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (open) {
      const initialDate = todayIso();
      setForm({
        ...emptyForm,
        bookingCreatedDate: initialDate,
        bookingReferenceNo: generateBookingReferenceNo(existingTrips, initialDate),
      });
    }
  }, [open, existingTrips]);

  function update<K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleBookingDateChange(value: string) {
    setForm((prev) => ({
      ...prev,
      bookingCreatedDate: value,
      bookingReferenceNo: generateBookingReferenceNo(existingTrips, value),
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const assigned = assignableDrivers.find((a) => a.driver.driverId === form.driverId);
    if (!assigned) return;

    onSave({
      id: crypto.randomUUID(),
      tripId: generateTripId(existingTrips),
      status: "Assigned",
      vehicleId: assigned.truck.truckId,
      ...form,
    });
  }

  const selectedAssignment = assignableDrivers.find((a) => a.driver.driverId === form.driverId);

  return (
    <Dialog open={open} onClose={onClose} title="Assign Trip" className="max-w-3xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Booking Information */}
        <section className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-900">Booking Information</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Booking Reference No">
              <input
                type="text"
                readOnly
                disabled
                value={form.bookingReferenceNo}
                className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-500`}
              />
            </Field>

            <Field label="Booking Created Date">
              <input
                type="date"
                required
                value={form.bookingCreatedDate}
                onChange={(e) => handleBookingDateChange(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Trip Category">
              <select
                required
                value={form.tripCategory}
                onChange={(e) => update("tripCategory", e.target.value as Trip["tripCategory"])}
                className={inputClass}
              >
                <option value="" disabled>
                  Select trip category
                </option>
                {TRIP_CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Movement Category">
              <select
                required
                value={form.movementCategory}
                onChange={(e) => update("movementCategory", e.target.value as Trip["movementCategory"])}
                className={inputClass}
              >
                <option value="" disabled>
                  Select movement category
                </option>
                {MOVEMENT_CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </section>

        {/* Customer Information */}
        <section className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-900">Customer Information</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Customer Account">
              <select
                required
                value={form.customerId}
                onChange={(e) => update("customerId", e.target.value)}
                className={inputClass}
              >
                <option value="" disabled>
                  Select a customer
                </option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Shipper / Consignee">
              <input
                type="text"
                required
                value={form.shipperConsignee}
                onChange={(e) => update("shipperConsignee", e.target.value)}
                className={inputClass}
                placeholder="e.g. Sri Lakshmi Traders"
              />
            </Field>

            <Field label="Billing Account" className="sm:col-span-2">
              <input
                type="text"
                required
                value={form.billingAccount}
                onChange={(e) => update("billingAccount", e.target.value)}
                className={inputClass}
                placeholder="e.g. Sri Lakshmi Traders"
              />
            </Field>
          </div>
        </section>

        {/* Cargo Information */}
        <section className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-900">Cargo Information</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Cargo / Container Reference">
              <input
                type="text"
                required
                value={form.cargoContainerReference}
                onChange={(e) => update("cargoContainerReference", e.target.value)}
                className={inputClass}
                placeholder="e.g. CONT-554821"
              />
            </Field>

            <Field label="Cargo Classification">
              <select
                required
                value={form.cargoClassification}
                onChange={(e) => update("cargoClassification", e.target.value as Trip["cargoClassification"])}
                className={inputClass}
              >
                <option value="" disabled>
                  Select cargo classification
                </option>
                {CARGO_CLASSIFICATION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Container Specification">
              <select
                required
                value={form.containerSpecification}
                onChange={(e) => update("containerSpecification", e.target.value as Trip["containerSpecification"])}
                className={inputClass}
              >
                <option value="" disabled>
                  Select container specification
                </option>
                {CONTAINER_SPECIFICATION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Release Order Reference">
              <input
                type="text"
                required
                value={form.releaseOrderReference}
                onChange={(e) => update("releaseOrderReference", e.target.value)}
                className={inputClass}
                placeholder="e.g. RO-99231"
              />
            </Field>

            <Field label="Cargo Weight (tons)">
              <input
                type="number"
                required
                min="0"
                step="0.1"
                value={form.cargoWeight}
                onChange={(e) => update("cargoWeight", e.target.value)}
                className={inputClass}
                placeholder="e.g. 14"
              />
            </Field>
          </div>
        </section>

        {/* Route Information */}
        <section className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-900">Route Information</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Origin Location">
              <input
                type="text"
                required
                value={form.origin}
                onChange={(e) => update("origin", e.target.value)}
                className={inputClass}
                placeholder="e.g. Coimbatore"
              />
            </Field>

            <Field label="Destination Location">
              <input
                type="text"
                required
                value={form.destination}
                onChange={(e) => update("destination", e.target.value)}
                className={inputClass}
                placeholder="e.g. Bengaluru"
              />
            </Field>
          </div>
        </section>

        {/* Shipping Information */}
        <section className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-900">Shipping Information</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Shipping Line">
              <input
                type="text"
                value={form.shippingLine}
                onChange={(e) => update("shippingLine", e.target.value)}
                className={inputClass}
                placeholder="e.g. Cochin Shipyard Lines"
              />
            </Field>

            <Field label="Vessel Name">
              <input
                type="text"
                value={form.vesselName}
                onChange={(e) => update("vesselName", e.target.value)}
                className={inputClass}
                placeholder="e.g. MV Malabar Star"
              />
            </Field>
          </div>
        </section>

        {/* Vehicle & Trip Assignment */}
        <section className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-900">Vehicle &amp; Trip Assignment</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Transport Method">
              <select
                required
                value={form.transportMethod}
                onChange={(e) => update("transportMethod", e.target.value as Trip["transportMethod"])}
                className={inputClass}
              >
                <option value="" disabled>
                  Select transport method
                </option>
                {TRANSPORT_METHOD_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Scheduled Trip Date">
              <input
                type="date"
                required
                value={form.scheduledDate}
                onChange={(e) => update("scheduledDate", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Assigned Vehicle" className="sm:col-span-2">
              <select
                required
                value={form.driverId}
                onChange={(e) => update("driverId", e.target.value)}
                className={inputClass}
              >
                <option value="" disabled>
                  {assignableDrivers.length === 0 ? "No drivers with an assigned vehicle" : "Select a driver / vehicle"}
                </option>
                {assignableDrivers.map(({ driver, truck }) => (
                  <option key={driver.id} value={driver.driverId}>
                    {driver.name} — {truck.registrationNumber}
                  </option>
                ))}
              </select>
              {selectedAssignment && (
                <span className="text-xs text-gray-500">
                  Vehicle: {selectedAssignment.truck.truckId} — {selectedAssignment.truck.registrationNumber}
                </span>
              )}
            </Field>
          </div>
        </section>

        {/* Payment & Advances */}
        <section className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-900">Payment &amp; Advances</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Billing Method">
              <select
                required
                value={form.billingMethod}
                onChange={(e) => update("billingMethod", e.target.value as Trip["billingMethod"])}
                className={inputClass}
              >
                <option value="" disabled>
                  Select billing method
                </option>
                {BILLING_METHOD_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Billing Type">
              <select
                required
                value={form.billingType}
                onChange={(e) => update("billingType", e.target.value as Trip["billingType"])}
                className={inputClass}
              >
                <option value="" disabled>
                  Select billing type
                </option>
                {BILLING_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Customer Cash Advance (₹)">
              <input
                type="number"
                min="0"
                value={form.customerCashAdvance}
                onChange={(e) => update("customerCashAdvance", e.target.value)}
                className={inputClass}
                placeholder="e.g. 5000"
              />
            </Field>

            <Field label="Customer Fuel Advance (₹)">
              <input
                type="number"
                min="0"
                value={form.customerFuelAdvanceAmount}
                onChange={(e) => update("customerFuelAdvanceAmount", e.target.value)}
                className={inputClass}
                placeholder="e.g. 8000"
              />
            </Field>

            <Field label="Customer Fuel Advance (Litres)">
              <input
                type="number"
                min="0"
                value={form.customerFuelAdvanceLitres}
                onChange={(e) => update("customerFuelAdvanceLitres", e.target.value)}
                className={inputClass}
                placeholder="e.g. 85"
              />
            </Field>
          </div>
        </section>

        {/* Driver Compensation */}
        <section className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-900">Driver Compensation</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

            <Field label="Driver Advance Payment Method">
              <select
                required
                value={form.driverAdvancePaymentMethod}
                onChange={(e) => update("driverAdvancePaymentMethod", e.target.value as Trip["driverAdvancePaymentMethod"])}
                className={inputClass}
              >
                <option value="" disabled>
                  Select payment method
                </option>
                {DRIVER_ADVANCE_PAYMENT_METHOD_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Driver Compensation Type" className="sm:col-span-2">
              <select
                required
                value={form.driverCompensationType}
                onChange={(e) => update("driverCompensationType", e.target.value as Trip["driverCompensationType"])}
                className={inputClass}
              >
                <option value="" disabled>
                  Select compensation type
                </option>
                {DRIVER_COMPENSATION_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </section>

        {/* Transport Cost Details */}
        <section className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-900">Transport Cost Details</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Transport Hire Charge (₹)">
              <input
                type="number"
                min="0"
                value={form.transportHireCharge}
                onChange={(e) => update("transportHireCharge", e.target.value)}
                className={inputClass}
                placeholder="e.g. 32000"
              />
            </Field>

            <Field label="Final Settlement Amount (₹)">
              <input
                type="number"
                min="0"
                value={form.finalSettlementAmount}
                onChange={(e) => update("finalSettlementAmount", e.target.value)}
                className={inputClass}
                placeholder="e.g. 30000"
              />
            </Field>
          </div>
        </section>

        {/* Operational Notes */}
        <section className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-900">Operational Notes</h3>
          <div className="grid grid-cols-1 gap-4">
            <Field label="Internal Remarks">
              <textarea
                value={form.internalRemarks}
                onChange={(e) => update("internalRemarks", e.target.value)}
                className={`${inputClass} min-h-20 resize-y`}
                placeholder="Notes visible to internal staff only"
              />
            </Field>

            <Field label="Booking Instructions">
              <textarea
                value={form.bookingInstructions}
                onChange={(e) => update("bookingInstructions", e.target.value)}
                className={`${inputClass} min-h-20 resize-y`}
                placeholder="Instructions related to this booking"
              />
            </Field>
          </div>
        </section>

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
            disabled={assignableDrivers.length === 0}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Assign Trip
          </button>
        </div>
      </form>
    </Dialog>
  );
}
