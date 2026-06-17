import type { TyreMaintenanceSummary } from "@/types/tyre-management";

export const initialTyreMaintenanceSummaries: TyreMaintenanceSummary[] = [
  {
    truckId: "1",
    healthStatus: "Good",
    upcomingMaintenanceCount: 1,
  },
];

export function getTyreMaintenanceSummary(
  truckId: string,
  summaries: TyreMaintenanceSummary[]
): TyreMaintenanceSummary {
  return (
    summaries.find((summary) => summary.truckId === truckId) ?? {
      truckId,
      healthStatus: "Good",
      upcomingMaintenanceCount: 0,
    }
  );
}
