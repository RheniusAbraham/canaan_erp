"use client";

import { useMemo, useState } from "react";
import {
  Truck,
  Navigation,
  Users,
  ClipboardList,
  AlertTriangle,
  Activity,
  Wrench,
  ShieldCheck,
  Wallet,
  CreditCard,
  Building2,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/StatCard";
import { initialTrucks } from "@/lib/truck-data";
import { initialDrivers } from "@/lib/driver-data";
import { initialStaff } from "@/lib/staff-data";
import { initialCustomers } from "@/lib/customer-data";
import { initialVendors } from "@/lib/vendor-data";
import { initialTrips } from "@/lib/trip-data";
import { initialLeaveRequests, LEAVE_CATEGORIES } from "@/lib/leave-request-data";
import { initialTyreInventory } from "@/lib/tyre-inventory-data";
import {
  initialMaintenanceRecords,
  getMaintenanceStatus,
  getTruckMaintenanceSummary,
} from "@/lib/truck-maintenance-data";
import { getComplianceStatus } from "@/lib/compliance";
import { initialEmiRecords, initialRecurringPayments } from "@/lib/finance-data";
import {
  initialDriverTransactions,
  initialStaffTransactions,
  driverStatuses,
  staffStatuses,
} from "@/lib/compensation-data";
import {
  initialDriverAttendance,
  initialStaffAttendance,
  getAttendanceForDate,
  getStaffAttendanceForDate,
} from "@/lib/attendance-data";
import type { TripStatus } from "@/types/trip";

const TABS = ["Overview", "Fleet & Trips", "Attendance & HR", "Maintenance", "Finance"] as const;
type Tab = (typeof TABS)[number];

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatCurrency(value: number): string {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

const TRIP_STATUS_BADGE: Record<TripStatus, string> = {
  Assigned: "bg-blue-100 text-blue-700",
  Started: "bg-indigo-100 text-indigo-700",
  Loaded: "bg-purple-100 text-purple-700",
  "On-Transit": "bg-yellow-100 text-yellow-700",
  Reached: "bg-teal-100 text-teal-700",
  Unloaded: "bg-cyan-100 text-cyan-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const ACTIVE_TRIP_STATUSES: TripStatus[] = [
  "Assigned",
  "Started",
  "Loaded",
  "On-Transit",
  "Reached",
  "Unloaded",
];

const RECURRING_FREQUENCY_DIVISOR: Record<string, number> = {
  Monthly: 1,
  Quarterly: 3,
  Yearly: 12,
};

const COMPLIANCE_BADGE: Record<string, string> = {
  Valid: "bg-green-100 text-green-700",
  "Expiring Soon": "bg-yellow-100 text-yellow-700",
  Expired: "bg-red-100 text-red-700",
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const today = todayIso();

  const truckSummaries = useMemo(
    () =>
      initialTrucks.map((truck) => ({
        truck,
        summary: getTruckMaintenanceSummary(truck, initialMaintenanceRecords),
        status: getMaintenanceStatus(truck, initialMaintenanceRecords),
      })),
    []
  );

  const avgHealthScore = useMemo(() => {
    if (truckSummaries.length === 0) return 0;
    const total = truckSummaries.reduce((sum, item) => sum + item.summary.reliabilityScore, 0);
    return Math.round(total / truckSummaries.length);
  }, [truckSummaries]);

  const maintenanceItems = useMemo(
    () =>
      truckSummaries.flatMap((item) =>
        item.status.map((status) => ({ ...status, registrationNumber: item.truck.registrationNumber }))
      ),
    [truckSummaries]
  );

  const maintenanceCounts = useMemo(() => {
    const counts = { attention: 0, upcoming: 0 };
    for (const item of maintenanceItems) counts[item.status] += 1;
    return counts;
  }, [maintenanceItems]);

  const topMaintenanceItems = useMemo(
    () => [...maintenanceItems].sort((a, b) => a.remainingKm - b.remainingKm).slice(0, 5),
    [maintenanceItems]
  );

  const complianceCounts = useMemo(() => {
    const counts: Record<string, number> = { Valid: 0, "Expiring Soon": 0, Expired: 0 };
    for (const truck of initialTrucks) {
      const dates = [truck.fcExpiryDate, truck.roadTaxDate, truck.nationalPermitDate, truck.pollutionCertificateDate];
      for (const date of dates) counts[getComplianceStatus(date)] += 1;
    }
    return counts;
  }, []);

  const tripStatusCounts = useMemo(() => {
    const counts: Record<TripStatus, number> = {
      Assigned: 0,
      Started: 0,
      Loaded: 0,
      "On-Transit": 0,
      Reached: 0,
      Unloaded: 0,
      Completed: 0,
      Cancelled: 0,
    };
    for (const trip of initialTrips) counts[trip.status] += 1;
    return counts;
  }, []);

  const activeTripsCount = useMemo(
    () => initialTrips.filter((trip) => ACTIVE_TRIP_STATUSES.includes(trip.status)).length,
    []
  );

  const driverAttendanceToday = useMemo(() => {
    const counts = { Present: 0, Absent: 0, "On Leave": 0, "Not Marked": 0 };
    for (const driver of initialDrivers) {
      const record = getAttendanceForDate(initialDriverAttendance, driver.id, today);
      counts[record?.status ?? "Not Marked"] += 1;
    }
    return counts;
  }, [today]);

  const staffAttendanceToday = useMemo(() => {
    const counts = { Present: 0, Absent: 0, "On Leave": 0, "Not Marked": 0 };
    for (const member of initialStaff) {
      const record = getStaffAttendanceForDate(initialStaffAttendance, member.id, today);
      counts[record?.status ?? "Not Marked"] += 1;
    }
    return counts;
  }, [today]);

  const leaveSummary = useMemo(() => {
    const counts = { Pending: 0, Approved: 0, Rejected: 0 };
    for (const request of initialLeaveRequests) counts[request.status] += 1;
    return counts;
  }, []);

  const pendingLeaveRequests = useMemo(
    () => initialLeaveRequests.filter((request) => request.status === "Pending"),
    []
  );

  const pendingLeaveByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const category of LEAVE_CATEGORIES) counts[category] = 0;
    for (const request of pendingLeaveRequests) {
      counts[request.category] = (counts[request.category] ?? 0) + 1;
    }
    return counts;
  }, [pendingLeaveRequests]);

  const monthlyEmiTotal = useMemo(
    () => initialEmiRecords.reduce((sum, emi) => sum + (Number(emi.emiAmount) || 0), 0),
    []
  );

  const activeRecurringPayments = useMemo(
    () => initialRecurringPayments.filter((payment) => payment.status === "Active"),
    []
  );

  const monthlyRecurringTotal = useMemo(
    () =>
      activeRecurringPayments.reduce(
        (sum, payment) => sum + payment.amount / (RECURRING_FREQUENCY_DIVISOR[payment.frequency] ?? 1),
        0
      ),
    [activeRecurringPayments]
  );

  const driverCompTotals = useMemo(() => {
    const totals = { Salary: 0, Advance: 0 };
    for (const tx of initialDriverTransactions) totals[tx.type] += tx.amount;
    return totals;
  }, []);

  const staffCompTotals = useMemo(() => {
    const totals = { Salary: 0, Advance: 0 };
    for (const tx of initialStaffTransactions) totals[tx.type] += tx.amount;
    return totals;
  }, []);

  const driverStatusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const driver of initialDrivers) {
      const status = driverStatuses[driver.id] ?? "Non-Active";
      counts[status] = (counts[status] ?? 0) + 1;
    }
    return counts;
  }, []);

  const staffStatusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const member of initialStaff) {
      const status = staffStatuses[member.id] ?? "Non-Active";
      counts[status] = (counts[status] ?? 0) + 1;
    }
    return counts;
  }, []);

  const totalAlerts = complianceCounts.Expired + complianceCounts["Expiring Soon"] + maintenanceCounts.attention;
  const activeCustomers = initialCustomers.filter((customer) => customer.status === "ACTIVE").length;
  const activeVendors = initialVendors.filter((vendor) => vendor.status === "ACTIVE").length;
  const tyreInventoryValue = initialTyreInventory.reduce((sum, tyre) => sum + (Number(tyre.cost) || 0), 0);
  const totalCompensationPaid = driverCompTotals.Salary + staffCompTotals.Salary;

  return (
    <div className="animate-stagger flex flex-col gap-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-[13px] font-normal text-gray-500">
          Real-time overview of fleet operations, trips, attendance, maintenance, and finances
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-all",
              activeTab === tab
                ? "bg-blue-600 text-white shadow-blue-200"
                : "border border-white/50 bg-white/60 backdrop-blur-md text-gray-600 hover:border-white/70 hover:bg-white/80"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Vehicles"
              value={String(initialTrucks.length)}
              caption={`Avg health score ${avgHealthScore}/100`}
              icon={Truck}
            />
            <StatCard
              label="Active Trips"
              value={String(activeTripsCount)}
              caption={`${initialTrips.length} total trips`}
              icon={Navigation}
            />
            <StatCard
              label="Workforce"
              value={String(initialDrivers.length + initialStaff.length)}
              caption={`${initialDrivers.length} drivers, ${initialStaff.length} staff`}
              icon={Users}
            />
            <StatCard
              label="Active Alerts"
              value={String(totalAlerts)}
              caption={`${complianceCounts.Expired} expired docs, ${maintenanceCounts.attention} maintenance`}
              icon={AlertTriangle}
            />
            <StatCard
              label="Pending Leave Requests"
              value={String(leaveSummary.Pending)}
              caption={`${leaveSummary.Approved} approved, ${leaveSummary.Rejected} rejected`}
              icon={ClipboardList}
            />
            <StatCard
              label="Business Partners"
              value={String(initialCustomers.length + initialVendors.length)}
              caption={`${activeCustomers} active customers, ${activeVendors} active vendors`}
              icon={Building2}
            />
            <StatCard
              label="Monthly Recurring Spend"
              value={formatCurrency(monthlyRecurringTotal)}
              caption={`${activeRecurringPayments.length} of ${initialRecurringPayments.length} payments active`}
              icon={Wallet}
            />
            <StatCard
              label="Compensation Paid"
              value={formatCurrency(totalCompensationPaid)}
              caption="Driver + staff salaries (latest cycle)"
              icon={CreditCard}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-white/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
              <h2 className="text-2xl font-bold text-gray-900">Recent Trips</h2>
              <div className="mt-3 flex flex-col gap-3">
                {initialTrips.map((trip) => (
                  <div key={trip.id} className="group flex items-center justify-between gap-3 rounded-xl border border-white/50 bg-white/40 p-3 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:bg-white/80 backdrop-blur-sm cursor-pointer">
                    <div>
                      <p className="text-[15px] font-semibold text-gray-900">{trip.tripId}</p>
                      <p className="text-xs text-gray-500">
                        {trip.origin} → {trip.destination} · {trip.shipperConsignee}
                      </p>
                    </div>
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", TRIP_STATUS_BADGE[trip.status])}>
                      {trip.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
              <h2 className="text-2xl font-bold text-gray-900">Pending Approvals</h2>
              <div className="mt-3 flex flex-col gap-3">
                {pendingLeaveRequests.length === 0 && (
                  <p className="text-sm text-gray-500">No pending leave requests.</p>
                )}
                {pendingLeaveRequests.map((request) => (
                  <div key={request.id} className="group flex items-center justify-between gap-3 rounded-xl border border-white/50 bg-white/40 p-3 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:bg-white/80 backdrop-blur-sm cursor-pointer">
                    <div>
                      <p className="text-[15px] font-semibold text-gray-900">{request.applicantName}</p>
                      <p className="text-xs text-gray-500">
                        {request.category} · {request.fromDate} to {request.toDate}
                      </p>
                    </div>
                    <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Fleet & Trips" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Vehicles"
              value={String(initialTrucks.length)}
              caption={initialTrucks.map((truck) => truck.registrationNumber).join(", ")}
              icon={Truck}
            />
            <StatCard
              label="Active Trips"
              value={String(activeTripsCount)}
              caption={`Out of ${initialTrips.length} total trips`}
              icon={Navigation}
            />
            <StatCard
              label="Completed Trips"
              value={String(tripStatusCounts.Completed)}
              caption={`${tripStatusCounts.Cancelled} cancelled`}
              icon={ClipboardList}
            />
            <StatCard
              label="Avg Fleet Health"
              value={`${avgHealthScore}/100`}
              caption={truckSummaries.map((item) => item.summary.health).join(", ")}
              icon={Activity}
            />
          </div>

          <div className="rounded-xl border border-white/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <h2 className="text-2xl font-bold text-gray-900">Trip Status Breakdown</h2>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {(Object.entries(tripStatusCounts) as [TripStatus, number][])
                .filter(([, count]) => count > 0)
                .map(([status, count]) => (
                  <span
                    key={status}
                    className={cn("rounded-full px-3 py-1.5 text-sm font-semibold", TRIP_STATUS_BADGE[status])}
                  >
                    {status}: {count}
                  </span>
                ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/80 bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-gray-50 text-[13px] font-semibold tracking-wider text-gray-500 uppercase">
                <tr>
                  <th className="px-4 py-3">Trip ID</th>
                  <th className="px-4 py-3">Booking Ref</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Transport Hire (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {initialTrips.map((trip) => (
                  <tr key={trip.id} className="group transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:bg-white/80 relative hover:z-10 cursor-pointer">
                    <td className="px-4 py-3 text-[15px] font-semibold text-gray-900">{trip.tripId}</td>
                    <td className="px-4 py-3 text-gray-600">{trip.bookingReferenceNo}</td>
                    <td className="px-4 py-3 text-gray-600">{trip.shipperConsignee}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {trip.origin} → {trip.destination}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{trip.tripCategory}</td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", TRIP_STATUS_BADGE[trip.status])}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatCurrency(Number(trip.transportHireCharge) || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "Attendance & HR" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Drivers"
              value={String(initialDrivers.length)}
              caption={`${driverStatusCounts["On-Trip"] ?? 0} on-trip`}
              icon={Users}
            />
            <StatCard
              label="Total Staff"
              value={String(initialStaff.length)}
              caption={`${staffStatusCounts["On-Trip"] ?? 0} on-trip`}
              icon={Users}
            />
            <StatCard
              label="Pending Leave Requests"
              value={String(leaveSummary.Pending)}
              caption={`${pendingLeaveByCategory.Driver ?? 0} drivers, ${pendingLeaveByCategory.Staff ?? 0} staff`}
              icon={ClipboardList}
            />
            <StatCard
              label="Today's Attendance Marked"
              value={String(
                driverAttendanceToday.Present +
                  driverAttendanceToday.Absent +
                  driverAttendanceToday["On Leave"] +
                  staffAttendanceToday.Present +
                  staffAttendanceToday.Absent +
                  staffAttendanceToday["On Leave"]
              )}
              caption={`Out of ${initialDrivers.length + initialStaff.length} total`}
              icon={Activity}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-white/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
              <h2 className="text-2xl font-bold text-gray-900">Driver Attendance Today</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border border-gray-100 p-3 text-center">
                  <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Present</p>
                  <p className="mt-1 text-xl font-bold text-green-600">{driverAttendanceToday.Present}</p>
                </div>
                <div className="rounded-lg border border-gray-100 p-3 text-center">
                  <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Absent</p>
                  <p className="mt-1 text-xl font-bold text-red-600">{driverAttendanceToday.Absent}</p>
                </div>
                <div className="rounded-lg border border-gray-100 p-3 text-center">
                  <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">On Leave</p>
                  <p className="mt-1 text-xl font-bold text-yellow-600">{driverAttendanceToday["On Leave"]}</p>
                </div>
                <div className="rounded-lg border border-gray-100 p-3 text-center">
                  <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Not Marked</p>
                  <p className="mt-1 text-xl font-bold text-gray-500">{driverAttendanceToday["Not Marked"]}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
              <h2 className="text-2xl font-bold text-gray-900">Staff Attendance Today</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border border-gray-100 p-3 text-center">
                  <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Present</p>
                  <p className="mt-1 text-xl font-bold text-green-600">{staffAttendanceToday.Present}</p>
                </div>
                <div className="rounded-lg border border-gray-100 p-3 text-center">
                  <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Absent</p>
                  <p className="mt-1 text-xl font-bold text-red-600">{staffAttendanceToday.Absent}</p>
                </div>
                <div className="rounded-lg border border-gray-100 p-3 text-center">
                  <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">On Leave</p>
                  <p className="mt-1 text-xl font-bold text-yellow-600">{staffAttendanceToday["On Leave"]}</p>
                </div>
                <div className="rounded-lg border border-gray-100 p-3 text-center">
                  <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Not Marked</p>
                  <p className="mt-1 text-xl font-bold text-gray-500">{staffAttendanceToday["Not Marked"]}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/80 bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-gray-50 text-[13px] font-semibold tracking-wider text-gray-500 uppercase">
                <tr>
                  <th className="px-4 py-3">Applicant</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">From</th>
                  <th className="px-4 py-3">To</th>
                  <th className="px-4 py-3">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingLeaveRequests.length === 0 && (
                  <tr>
                    <td className="px-4 py-3 text-gray-500" colSpan={5}>
                      No pending leave requests.
                    </td>
                  </tr>
                )}
                {pendingLeaveRequests.map((request) => (
                  <tr key={request.id} className="group transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:bg-white/80 relative hover:z-10 cursor-pointer">
                    <td className="px-4 py-3 text-[15px] font-semibold text-gray-900">{request.applicantName}</td>
                    <td className="px-4 py-3 text-gray-600">{request.category}</td>
                    <td className="px-4 py-3 text-gray-600">{request.fromDate}</td>
                    <td className="px-4 py-3 text-gray-600">{request.toDate}</td>
                    <td className="px-4 py-3 text-gray-600">{request.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "Maintenance" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Fleet Health Score"
              value={`${avgHealthScore}/100`}
              caption={truckSummaries.map((item) => item.summary.health).join(", ")}
              icon={Activity}
            />
            <StatCard
              label="Maintenance Alerts"
              value={String(maintenanceCounts.attention)}
              caption="Require immediate attention"
              icon={Wrench}
            />
            <StatCard
              label="Upcoming Services"
              value={String(maintenanceCounts.upcoming)}
              caption="Due within 1,000 km"
              icon={ClipboardList}
            />
            <StatCard
              label="Tyre Inventory"
              value={String(initialTyreInventory.length)}
              caption={`Stock value ${formatCurrency(tyreInventoryValue)}`}
              icon={Package}
            />
          </div>

          <div className="rounded-xl border border-white/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <h2 className="text-2xl font-bold text-gray-900">Compliance Status</h2>
            <p className="mt-1 text-[13px] font-normal text-gray-500">FC, Road Tax, National Permit, and Pollution Certificate validity</p>
            <div className="mt-3 grid grid-cols-3 gap-4 sm:max-w-md">
              {(["Valid", "Expiring Soon", "Expired"] as const).map((status) => (
                <div key={status} className="rounded-lg border border-gray-100 p-4">
                  <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">{status}</p>
                  <p
                    className={cn(
                      "mt-1 text-2xl font-bold",
                      status === "Valid" && "text-green-600",
                      status === "Expiring Soon" && "text-yellow-600",
                      status === "Expired" && "text-red-600"
                    )}
                  >
                    {complianceCounts[status]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/80 bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-gray-50 text-[13px] font-semibold tracking-wider text-gray-500 uppercase">
                <tr>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Remaining (km)</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topMaintenanceItems.length === 0 && (
                  <tr>
                    <td className="px-4 py-3 text-gray-500" colSpan={5}>
                      No maintenance items due.
                    </td>
                  </tr>
                )}
                {topMaintenanceItems.map((item, index) => (
                  <tr key={`${item.truckId}-${item.item}-${index}`} className="group transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:bg-white/80 relative hover:z-10 cursor-pointer">
                    <td className="px-4 py-3 text-[15px] font-semibold text-gray-900">{item.registrationNumber}</td>
                    <td className="px-4 py-3 text-gray-600">{item.category}</td>
                    <td className="px-4 py-3 text-gray-600">{item.item}</td>
                    <td className="px-4 py-3 text-gray-600">{item.remainingKm}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold",
                          item.status === "attention" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                        )}
                      >
                        {item.status === "attention" ? "Overdue" : "Upcoming"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "Finance" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Monthly EMI"
              value={formatCurrency(monthlyEmiTotal)}
              caption={`${initialEmiRecords.length} active loan${initialEmiRecords.length === 1 ? "" : "s"}`}
              icon={CreditCard}
            />
            <StatCard
              label="Recurring Payments"
              value={String(activeRecurringPayments.length)}
              caption={`Active of ${initialRecurringPayments.length} total`}
              icon={Wallet}
            />
            <StatCard
              label="Monthly Recurring Spend"
              value={formatCurrency(monthlyRecurringTotal)}
              caption="Normalized to monthly cost"
              icon={ShieldCheck}
            />
            <StatCard
              label="Compensation Paid"
              value={formatCurrency(totalCompensationPaid)}
              caption={`${formatCurrency(driverCompTotals.Advance)} driver advances pending settlement`}
              icon={CreditCard}
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/80 bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-gray-50 text-[13px] font-semibold tracking-wider text-gray-500 uppercase">
                <tr>
                  <th className="px-4 py-3">EMI Name</th>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Bank</th>
                  <th className="px-4 py-3">EMI Amount</th>
                  <th className="px-4 py-3">Next Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {initialEmiRecords.map((emi) => (
                  <tr key={emi.id} className="group transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:bg-white/80 relative hover:z-10 cursor-pointer">
                    <td className="px-4 py-3 text-[15px] font-semibold text-gray-900">{emi.emiName}</td>
                    <td className="px-4 py-3 text-gray-600">{emi.truckRegistration}</td>
                    <td className="px-4 py-3 text-gray-600">{emi.bankName}</td>
                    <td className="px-4 py-3 text-gray-600">{formatCurrency(Number(emi.emiAmount) || 0)}</td>
                    <td className="px-4 py-3 text-gray-600">{emi.emiPaymentDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/80 bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-gray-50 text-[13px] font-semibold tracking-wider text-gray-500 uppercase">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Frequency</th>
                  <th className="px-4 py-3">Next Due</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {initialRecurringPayments.map((payment) => (
                  <tr key={payment.id} className="group transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:bg-white/80 relative hover:z-10 cursor-pointer">
                    <td className="px-4 py-3 text-[15px] font-semibold text-gray-900">{payment.title}</td>
                    <td className="px-4 py-3 text-gray-600">{payment.category}</td>
                    <td className="px-4 py-3 text-gray-600">{formatCurrency(payment.amount)}</td>
                    <td className="px-4 py-3 text-gray-600">{payment.frequency}</td>
                    <td className="px-4 py-3 text-gray-600">{payment.nextDueDate}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold",
                          payment.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        )}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-white/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
              <h2 className="text-2xl font-bold text-gray-900">Driver Compensation</h2>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-gray-100 p-3">
                  <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Salaries Paid</p>
                  <p className="mt-1 text-xl font-bold text-green-600">{formatCurrency(driverCompTotals.Salary)}</p>
                </div>
                <div className="rounded-lg border border-gray-100 p-3">
                  <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Advances Given</p>
                  <p className="mt-1 text-xl font-bold text-yellow-600">{formatCurrency(driverCompTotals.Advance)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
              <h2 className="text-2xl font-bold text-gray-900">Staff Compensation</h2>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-gray-100 p-3">
                  <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Salaries Paid</p>
                  <p className="mt-1 text-xl font-bold text-green-600">{formatCurrency(staffCompTotals.Salary)}</p>
                </div>
                <div className="rounded-lg border border-gray-100 p-3">
                  <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Advances Given</p>
                  <p className="mt-1 text-xl font-bold text-yellow-600">{formatCurrency(staffCompTotals.Advance)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
