export type TripStatus =
  | "Assigned"
  | "Started"
  | "Loaded"
  | "On-Transit"
  | "Reached"
  | "Unloaded"
  | "Completed"
  | "Cancelled";

export type TripCategory = "LOCAL" | "LOCAL CFS" | "OUTSTATION" | "SHIFTING";

export type MovementCategory = "Company" | "Outsourced";

export type CargoClassification =
  | "IMPORT"
  | "EXPORT"
  | "EMPTY"
  | "CFS LADEN"
  | "OPEN LOAD"
  | "COASTAL";

export type ContainerSpecification =
  | "20 FT CONTAINER"
  | "40 FT CONTAINER"
  | "2 X 20 FEET CONTAINERS"
  | "OPEN LOAD CARGO";

export type BillingType =
  | "NORMAL"
  | "UPTO 20 TONS AND UNDER"
  | "20 - 25 TONS"
  | "25 - 28 TONS"
  | "28 - 30 TONS"
  | "TON BASED";

export type TransportMethod = "Own Fleet" | "Hired Vehicle" | "Third-Party Transporter";

export type BillingMethod = "To Pay" | "Prepaid" | "Credit";

export type DriverAdvancePaymentMethod = "Cash" | "UPI" | "Bank Transfer";

export type DriverCompensationType = "Per Trip" | "Per Kilometer" | "Fixed Salary";

export type Trip = {
  id: string;
  tripId: string;
  status: TripStatus;

  // Booking Information
  bookingReferenceNo: string;
  bookingCreatedDate: string;
  tripCategory: TripCategory | "";
  movementCategory: MovementCategory | "";

  // Customer Information
  customerId: string;
  shipperConsignee: string;
  billingAccount: string;

  // Cargo Information
  cargoContainerReference: string;
  cargoClassification: CargoClassification | "";
  containerSpecification: ContainerSpecification | "";
  releaseOrderReference: string;
  cargoWeight: string;

  // Route Information
  origin: string;
  destination: string;

  // Shipping Information
  shippingLine: string;
  vesselName: string;

  // Vehicle & Trip Assignment
  transportMethod: TransportMethod | "";
  scheduledDate: string;
  driverId: string;
  vehicleId: string;

  // Payment & Advances
  billingMethod: BillingMethod | "";
  billingType: BillingType | "";
  customerCashAdvance: string;
  customerFuelAdvanceAmount: string;
  customerFuelAdvanceLitres: string;

  // Driver Compensation
  driverAdvanceAmount: string;
  driverAdvancePaymentMethod: DriverAdvancePaymentMethod | "";
  driverCompensationType: DriverCompensationType | "";

  // Transport Cost Details
  transportHireCharge: string;
  finalSettlementAmount: string;

  // Operational Notes
  internalRemarks: string;
  bookingInstructions: string;
};
