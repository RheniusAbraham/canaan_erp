export type CustomerType = "Transports" | "Shipping";

export type CustomerStatus = "ACTIVE" | "INACTIVE" | "BLACKLISTED";

export type Customer = {
  id: string;
  photoUrl: string | null;
  name: string;
  gstin: string;
  contactPersonnelName: string;
  phone: string;
  email: string;
  address: string;
  customerType: CustomerType | "";
  status: CustomerStatus | "";
};
