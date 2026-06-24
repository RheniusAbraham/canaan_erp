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
  additionalDriverAdvanceAmount: string;
  paymentMode: PaymentMode | "";

  // Trip Distance Details
  startingOdometer: string;
  endingOdometer: string;
  totalDistance: string;

  // Cargo Weight Details
  grossWeight: string;
  tareWeight: string;
  netWeight: string;

  // Trip Fuel Details
  bunkName: string;
  dieselQuantity: string;
  fuelTotalCost: string;

  // Trip Expenses
  totalHaltDays: string;
  haltRemarks: string;
  driversCompensation: string;
  haltCompensation: string;
  portPassExpense: string;
  weightSheetExpense: string;
  mamolExpense: string;
  claimableMamolExpense: string;
  trafficRtoPoliceExpense: string;
  liftOnOffExpense: string;
  craneOperatorExpense: string;
  parkingExpenses: string;
  punctureExpense: string;
  sparePartsExpense: string;
  otherExpenses: string;
  tollExpenses: string;

  // Halt Information (kept for backward compatibility)
  companyHaltDays: string;
  partyHaltDays: string;
};
