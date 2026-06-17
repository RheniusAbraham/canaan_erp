"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Field, inputClass } from "@/components/ui/Field";
import { Avatar } from "@/components/ui/Avatar";
import { CUSTOMER_STATUS_OPTIONS, CUSTOMER_TYPE_OPTIONS } from "@/lib/customer-data";
import type { Customer } from "@/types/customer";

type CustomerFormDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  initialData: Customer | null;
};

const emptyForm: Omit<Customer, "id"> = {
  photoUrl: null,
  name: "",
  gstin: "",
  contactPersonnelName: "",
  phone: "",
  email: "",
  address: "",
  customerType: "",
  status: "",
};

export function CustomerFormDialog({ open, onClose, onSave, initialData }: CustomerFormDialogProps) {
  const [form, setForm] = useState<Omit<Customer, "id">>(emptyForm);

  useEffect(() => {
    if (open) {
      const { id: _id, ...rest } = initialData ?? { id: "", ...emptyForm };
      setForm(rest);
    }
  }, [open, initialData]);

  function update<K extends keyof Omit<Customer, "id">>(key: K, value: Omit<Customer, "id">[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({
      id: initialData?.id ?? crypto.randomUUID(),
      ...form,
    });
  }

  return (
    <Dialog open={open} onClose={onClose} title={initialData ? "Edit Customer" : "Add Customer"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Customer Photo">
          <div className="flex items-center gap-4">
            <Avatar photoUrl={form.photoUrl} label={form.name || "?"} size={56} />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => update("photoUrl", reader.result as string);
                reader.readAsDataURL(file);
              }}
              className="text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-600 hover:file:bg-blue-100"
            />
          </div>
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Customer Name">
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputClass}
              placeholder="e.g. Sri Lakshmi Traders"
            />
          </Field>

          <Field label="GSTIN">
            <input
              type="text"
              required
              value={form.gstin}
              onChange={(e) => update("gstin", e.target.value)}
              className={inputClass}
              placeholder="e.g. 33AABCS1234F1Z5"
            />
          </Field>

          <Field label="Contact Personnel Name">
            <input
              type="text"
              required
              value={form.contactPersonnelName}
              onChange={(e) => update("contactPersonnelName", e.target.value)}
              className={inputClass}
              placeholder="e.g. Karthik Raja"
            />
          </Field>

          <Field label="Phone">
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={inputClass}
              placeholder="+91 90000 00000"
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClass}
              placeholder="name@company.com"
            />
          </Field>

          <Field label="Customer Type">
            <select
              required
              value={form.customerType}
              onChange={(e) => update("customerType", e.target.value as Customer["customerType"])}
              className={inputClass}
            >
              <option value="" disabled>
                Select customer type
              </option>
              {CUSTOMER_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Status">
            <select
              required
              value={form.status}
              onChange={(e) => update("status", e.target.value as Customer["status"])}
              className={inputClass}
            >
              <option value="" disabled>
                Select status
              </option>
              {CUSTOMER_STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Address">
          <textarea
            required
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            className={inputClass}
            rows={3}
          />
        </Field>

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
            {initialData ? "Save Changes" : "Add Customer"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
