"use client";

import { useMemo } from "react";
import { ComplianceTable } from "@/components/fleet/ComplianceTable";
import { getComplianceStatus } from "@/lib/compliance";
import { initialTrucks } from "@/lib/truck-data";

export default function CompliancePage() {
  const summary = useMemo(() => {
    const counts = { Valid: 0, "Expiring Soon": 0, Expired: 0 };
    for (const truck of initialTrucks) {
      const dates = [
        truck.fcExpiryDate,
        truck.roadTaxDate,
        truck.nationalPermitDate,
        truck.pollutionCertificateDate,
      ];
      for (const date of dates) {
        counts[getComplianceStatus(date)] += 1;
      }
    }
    return counts;
  }, []);

  return (
    <div className="animate-stagger flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Compliance &amp; Renewals</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track FC, Road Tax, National Permit, and Pollution Certificate validity across the fleet
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/80 bg-white/90 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
          <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Valid</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{summary.Valid}</p>
        </div>
        <div className="rounded-xl border border-white/80 bg-white/90 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
          <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Expiring Soon</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600">{summary["Expiring Soon"]}</p>
        </div>
        <div className="rounded-xl border border-white/80 bg-white/90 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
          <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Expired</p>
          <p className="mt-1 text-2xl font-bold text-red-600">{summary.Expired}</p>
        </div>
      </div>

      <ComplianceTable trucks={initialTrucks} />
    </div>
  );
}
