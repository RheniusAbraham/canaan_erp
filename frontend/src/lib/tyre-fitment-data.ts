import type { Truck } from "@/types/truck";
import type { TyreFitmentRecord } from "@/types/tyre-fitment";
import type { TyreInventoryItem } from "@/types/tyre-inventory";

export const RETREAD_HEALTH_THRESHOLD = 30;

export const initialTyreFitmentRecords: TyreFitmentRecord[] = [];

export function getActiveFitment(tyreId: string, records: TyreFitmentRecord[]): TyreFitmentRecord | null {
  return records.find((record) => record.tyreId === tyreId && record.removedOdometer === null) ?? null;
}

export function getFitmentForPosition(
  truckId: string,
  position: string,
  records: TyreFitmentRecord[]
): TyreFitmentRecord | null {
  return (
    records.find(
      (record) => record.truckId === truckId && record.position === position && record.removedOdometer === null
    ) ?? null
  );
}

export function getTyreMileage(tyreId: string, records: TyreFitmentRecord[], trucks: Truck[]): number {
  return records
    .filter((record) => record.tyreId === tyreId)
    .reduce((total, record) => {
      if (record.removedOdometer !== null) {
        return total + Math.max(0, record.removedOdometer - record.fittedOdometer);
      }
      const truck = trucks.find((t) => t.id === record.truckId);
      const currentOdometer = truck ? Number(truck.odometer) : record.fittedOdometer;
      return total + Math.max(0, currentOdometer - record.fittedOdometer);
    }, 0);
}

export function getTyreHealth(tyre: TyreInventoryItem, mileage: number): number {
  const range = Number(tyre.range) || 0;
  if (range <= 0) return 0;
  const health = ((range - mileage) / range) * 100;
  return Math.max(0, Math.min(100, Math.round(health)));
}

export function getAvailableTyres(tyres: TyreInventoryItem[], records: TyreFitmentRecord[]): TyreInventoryItem[] {
  const fittedTyreIds = new Set(
    records.filter((record) => record.removedOdometer === null).map((record) => record.tyreId)
  );
  return tyres.filter((tyre) => !fittedTyreIds.has(tyre.id));
}
