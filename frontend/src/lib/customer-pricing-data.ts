import type { CustomerPricing } from "@/types/customer-pricing";

export const CONTAINER_TYPE_OPTIONS = ["20 FT", "20 FT ARTICULATED", "40 FT", "40 FT ARTICULATED"];

export const initialCustomerPricing: CustomerPricing[] = [
  {
    id: "1",
    customerId: "1",
    customerOrigin: "Chennai, Tamil Nadu",
    customerDestination: "Bengaluru, Karnataka",
    loadType: "FCL",
    containerType: "20 FT",
    rate: "25000",
    validFrom: "2026-01-01",
    validTo: "2026-12-31",
    status: "ACTIVE",
  },
];
