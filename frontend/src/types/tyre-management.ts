export type TyreHealthStatus = "Excellent" | "Good" | "Fair" | "Poor" | "Critical";

export type TyreMaintenanceSummary = {
  truckId: string;
  healthStatus: TyreHealthStatus;
  upcomingMaintenanceCount: number;
};
