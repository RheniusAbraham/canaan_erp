import type { CustomerStatus } from "@/types/customer";

export type CustomerPricing = {
  id: string;
  customerId: string;
  customerOrigin: string;
  customerDestination: string;
  loadType: string;
  containerType: string;
  rate: string;
  validFrom: string;
  validTo: string;
  status: CustomerStatus | "";
};
