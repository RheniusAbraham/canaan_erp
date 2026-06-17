export type TripSheetData = {
  tripId: string;

  // Transport Charges
  baseTransportHire: string;
  transportHaltCharges: string;
  transportUnloadingCharges: string;
  transportLiftingCharges: string;
  transportWeighmentCharges: string;

  // Customer Billing
  billingBaseHire: string;
  billingHaltCharges: string;
  billingUnloadingCharges: string;
  billingLiftingCharges: string;
  billingWeighmentCharges: string;
};

export function sumCharges(...values: string[]): number {
  return values.reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
}
