"use client";

import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { getStaffAttendanceForDate } from "@/lib/attendance-data";
import type { Staff } from "@/types/staff";
import type { StaffAttendanceRecord } from "@/types/attendance";

type StaffAttendanceTableProps = {
  staff: Staff[];
  records: StaffAttendanceRecord[];
  date: string;
};

const columns = [
  "Photo",
  "Staff ID",
  "Name",
  "Role",
  "Branch",
  "Status",
  "Check-in Time",
  "Marked At",
  "Source",
];

const statusStyles: Record<string, string> = {
  Present: "bg-green-50 text-green-700",
  Absent: "bg-red-50 text-red-700",
  "On Leave": "bg-yellow-50 text-yellow-700",
  "Not Marked": "bg-gray-100 text-gray-500",
};

const sourceStyles: Record<string, string> = {
  Web: "bg-blue-50 text-blue-700",
  App: "bg-purple-50 text-purple-700",
};

function formatMarkedAt(markedAt: string | null): string {
  if (!markedAt) return "—";
  return new Date(markedAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function StaffAttendanceTable({ staff, records, date }: StaffAttendanceTableProps) {
  if (staff.length === 0) {
    return (
      <div className="rounded-xl border border-white/80 bg-white/90 p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl text-center text-sm text-gray-500 transition-all duration-300">
        No staff records yet. Add staff under &ldquo;Our Staff&rdquo; to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/80 bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
      <table className="w-full min-w-[1000px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((column) => (
              <th
                key={column}
                className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {staff.map((member) => {
            const record = getStaffAttendanceForDate(records, member.id, date);
            const status = record?.status ?? "Not Marked";
            return (
              <tr key={member.id} className="group transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:bg-white/80 relative hover:z-10 cursor-pointer">
                <td className="px-4 py-3">
                  <Avatar photoUrl={member.photoUrl} label={member.name} size={44} />
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{member.staffId}</td>
                <td className="px-4 py-3 text-gray-600">{member.name}</td>
                <td className="px-4 py-3 text-gray-600">{member.softwareDesignation}</td>
                <td className="px-4 py-3 text-gray-600">{member.branch}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      statusStyles[status] ?? "bg-gray-100 text-gray-600"
                    )}
                  >
                    {status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{record?.checkInTime ?? "—"}</td>
                <td className="px-4 py-3 text-gray-600">{formatMarkedAt(record?.markedAt ?? null)}</td>
                <td className="px-4 py-3">
                  {record ? (
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        sourceStyles[record.source] ?? "bg-gray-100 text-gray-600"
                      )}
                    >
                      {record.source}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
