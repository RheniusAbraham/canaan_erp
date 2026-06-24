"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { FileText } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Field, inputClass } from "@/components/ui/Field";
import { Avatar } from "@/components/ui/Avatar";
import { DEPARTMENT_OPTIONS, SOFTWARE_DESIGNATION_OPTIONS } from "@/lib/staff-data";
import type { Staff } from "@/types/staff";
import { DatePicker } from "@/components/ui/DatePicker";

type StaffFormDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (staff: Staff) => void;
  initialData: Staff | null;
};

const emptyForm: Omit<Staff, "id"> = {
  photoUrl: null,
  name: "",
  staffId: "",
  department: "",
  designation: "",
  dateOfBirth: "",
  dateOfJoining: "",
  email: "",
  contactNumber: "",
  address: "",
  aadharFileName: null,
  branch: "",
  softwareDesignation: "",
  username: "",
  password: "",
};

export function StaffFormDialog({ open, onClose, onSave, initialData }: StaffFormDialogProps) {
  const [form, setForm] = useState<Omit<Staff, "id">>(emptyForm);
  const lastAutoUsername = useRef<string>("");

  useEffect(() => {
    if (open) {
      const { id: _id, ...rest } = initialData ?? { id: "", ...emptyForm };
      setForm(rest);
      lastAutoUsername.current = rest.username;
    }
  }, [open, initialData]);

  function update<K extends keyof Omit<Staff, "id">>(key: K, value: Omit<Staff, "id">[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleEmailChange(value: string) {
    setForm((prev) => {
      const shouldSyncUsername = prev.username === lastAutoUsername.current;
      lastAutoUsername.current = shouldSyncUsername ? value : lastAutoUsername.current;
      return {
        ...prev,
        email: value,
        username: shouldSyncUsername ? value : prev.username,
      };
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({
      id: initialData?.id ?? crypto.randomUUID(),
      ...form,
    });
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={initialData ? "Edit Staff" : "Add Staff"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Staff's Photo">
          <div className="flex items-center gap-4">
            <Avatar photoUrl={form.photoUrl} label={form.name || form.staffId || "?"} size={56} />
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
          <Field label="Staff's Name">
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputClass}
              placeholder="e.g. Anita Menon"
            />
          </Field>

          <Field label="Staff ID">
            <input
              type="text"
              required
              value={form.staffId}
              onChange={(e) => update("staffId", e.target.value)}
              className={inputClass}
              placeholder="e.g. STF-1003"
            />
          </Field>

          <Field label="Department">
            <input
              type="text"
              required
              list="department-options"
              value={form.department}
              onChange={(e) => update("department", e.target.value)}
              className={inputClass}
              placeholder="Select or type a department"
            />
            <datalist id="department-options">
              {DEPARTMENT_OPTIONS.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </Field>

          <Field label="Designation">
            <input
              type="text"
              required
              value={form.designation}
              onChange={(e) => update("designation", e.target.value)}
              className={inputClass}
              placeholder="e.g. Operations Manager"
            />
          </Field>

          <Field label="Branch">
            <input
              type="text"
              required
              value={form.branch}
              onChange={(e) => update("branch", e.target.value)}
              className={inputClass}
              placeholder="e.g. Chennai"
            />
          </Field>

          <Field label="Date of Birth">
            <DatePicker value={form.dateOfBirth} onChange={(val) => update("dateOfBirth", val)} />
          </Field>

          <Field label="Date of Joining">
            <DatePicker value={form.dateOfJoining} onChange={(val) => update("dateOfJoining", val)} />
          </Field>

          <Field label="Email">
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={inputClass}
              placeholder="name@company.com"
            />
          </Field>

          <Field label="Contact Number">
            <input
              type="tel"
              required
              value={form.contactNumber}
              onChange={(e) => update("contactNumber", e.target.value)}
              className={inputClass}
              placeholder="+91 90000 00000"
            />
          </Field>

          <Field label="Software Designation">
            <select
              required
              value={form.softwareDesignation}
              onChange={(e) => update("softwareDesignation", e.target.value)}
              className={inputClass}
            >
              <option value="" disabled>
                Select a role
              </option>
              {SOFTWARE_DESIGNATION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Software Credentials</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Username">
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => update("username", e.target.value)}
                className={inputClass}
                placeholder="Auto-filled from email"
              />
            </Field>

            <Field label="Password">
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className={inputClass}
                placeholder="Set a login password"
              />
            </Field>
          </div>
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

        <Field label="Aadhar Card (PDF)">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) update("aadharFileName", file.name);
            }}
            className="text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-600 hover:file:bg-blue-100"
          />
          {form.aadharFileName && (
            <span className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
              <FileText className="h-3.5 w-3.5" />
              {form.aadharFileName}
            </span>
          )}
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
            {initialData ? "Save Changes" : "Add Staff"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
