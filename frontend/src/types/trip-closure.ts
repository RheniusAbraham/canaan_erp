export type PaymentMode = "Cash" | "UPI" | "Bank Transfer" | "Cheque" | "NEFT / RTGS";

export type TripClosureData = {
  tripId: string;

  // Trip Summary — user input
  billTo: string;

  // Trip Completion
  tripCompletedDate: string;
  tripClosingDate: string;

  // Financial Settlement
  hireAmount: string;
  transportAmount: string;
  billingAmount: string;
  driverAdvanceAmount: string;
  paymentMode: PaymentMode | "";

  // Halt Information
  companyHaltDays: string;
  partyHaltDays: string;
  haltRemarks: string;
};
