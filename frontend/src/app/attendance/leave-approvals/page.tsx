"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { LeaveApprovalTable } from "@/components/attendance/LeaveApprovalTable";
import { LEAVE_CATEGORIES, initialLeaveRequests } from "@/lib/leave-request-data";
import type { LeaveApplicantCategory, LeaveRequest } from "@/types/leave-request";

const categoryLabels: Record<LeaveApplicantCategory, string> = {
  Driver: "Drivers",
  "Fleet Manager": "Fleet Managers",
  "Tyre Manager": "Tyre Managers",
  Staff: "Staff",
};

type FilterValue = "All" | LeaveApplicantCategory;

export default function LeaveApprovalsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [filter, setFilter] = useState<FilterValue>("All");
  const [search, setSearch] = useState("");

  const summary = useMemo(() => {
    const counts = { Pending: 0, Approved: 0, Rejected: 0 };
    for (const request of requests) {
      counts[request.status] += 1;
    }
    return counts;
  }, [requests]);

  const filteredRequests = useMemo(() => {
    let result = requests;
    if (filter !== "All") {
      result = result.filter((request) => request.category === filter);
    }
    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((request) => request.applicantName.toLowerCase().includes(query));
    }
    return result;
  }, [requests, filter, search]);

  const pendingCounts = useMemo(() => {
    const counts: Record<FilterValue, number> = {
      All: 0,
      Driver: 0,
      "Fleet Manager": 0,
      "Tyre Manager": 0,
      Staff: 0,
    };
    for (const request of requests) {
      if (request.status !== "Pending") continue;
      counts[request.category] += 1;
      counts.All += 1;
    }
    return counts;
  }, [requests]);

  function handleApprove(id: string) {
    setRequests((prev) =>
      prev.map((request) => (request.id === id ? { ...request, status: "Approved" } : request))
    );
  }

  function handleReject(id: string) {
    setRequests((prev) =>
      prev.map((request) => (request.id === id ? { ...request, status: "Rejected" } : request))
    );
  }

  return (
    <div className="animate-stagger flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leave Approvals</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and respond to leave requests from drivers, fleet managers, tyre managers, and staff
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 sm:max-w-md">
        <div className="rounded-xl border border-white/80 bg-white/90 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
          <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Pending</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600">{summary.Pending}</p>
        </div>
        <div className="rounded-xl border border-white/80 bg-white/90 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
          <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Approved</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{summary.Approved}</p>
        </div>
        <div className="rounded-xl border border-white/80 bg-white/90 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
          <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Rejected</p>
          <p className="mt-1 text-2xl font-bold text-red-600">{summary.Rejected}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => setFilter("All")}
          className={cn(
            "group relative rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:-translate-y-1 hover:shadow-md",
            filter === "All"
              ? "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700"
              : "border border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600"
          )}
        >
          All
          {pendingCounts.All > 0 && (
            <span
              className={cn(
                "absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold ring-2 transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:scale-110",
                filter === "All"
                  ? "bg-amber-400 text-amber-900 ring-blue-600 group-hover:ring-blue-700"
                  : "bg-red-500 text-white ring-white"
              )}
            >
              {pendingCounts.All}
            </span>
          )}
        </button>
        {LEAVE_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            className={cn(
              "group relative rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:-translate-y-1 hover:shadow-md",
              filter === category
                ? "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700"
                : "border border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600"
            )}
          >
            {categoryLabels[category]}
            {pendingCounts[category] > 0 && (
              <span
                className={cn(
                  "absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold ring-2 transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:scale-110",
                  filter === category
                    ? "bg-amber-400 text-amber-900 ring-blue-600 group-hover:ring-blue-700"
                    : "bg-red-500 text-white ring-white"
                )}
              >
                {pendingCounts[category]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by applicant name"
          className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <LeaveApprovalTable requests={filteredRequests} onApprove={handleApprove} onReject={handleReject} />
    </div>
  );
}
