import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-400 focus:outline-none";

type FieldProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

export function Field({ label, children, className }: FieldProps) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}
