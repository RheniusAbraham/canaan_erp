import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  caption: string;
  icon: LucideIcon;
};

export function StatCard({ label, value, caption, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-xl border border-white/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold tracking-wider text-gray-400 uppercase">
          {label}
        </p>
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <p className="mt-2 text-4xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-[13px] font-normal text-gray-500">{caption}</p>
    </div>
  );
}
