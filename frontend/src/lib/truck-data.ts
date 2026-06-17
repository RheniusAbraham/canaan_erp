import type { Truck } from "@/types/truck";

const TRUCK_ID_PREFIX = "CGI-T";

export function generateTruckId(existing: Truck[]): string {
  const maxNumber = existing.reduce((max, truck) => {
    const match = truck.truckId.match(/(\d+)$/);
    const value = match ? parseInt(match[1], 10) : 0;
    return Math.max(max, value);
  }, 0);

  return `${TRUCK_ID_PREFIX}${String(maxNumber + 1).padStart(3, "0")}`;
}

export const TRUCK_TYPE_OPTIONS = [
  "20 FT RIGID",
  "20 FT ARTICULATED",
  "40 FT RIGID",
  "40 FT ARTICULATED",
];

export function addYearsToDate(date: string, years: number): string {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  parsed.setFullYear(parsed.getFullYear() + years);
  return parsed.toISOString().slice(0, 10);
}

export const initialTrucks: Truck[] = [
  {
    id: "1",
    truckId: "CGI-T001",
    registrationNumber: "TN 69 AA 1256",
    manufacturer: "Tata Motors",
    modelName: "Tata Signa 4623.S",
    truckType: "40 FT RIGID",
    truckPhotosFileName: "cgi_t001_truck_photos.pdf",
    tyreLayout: "12+1",
    odometer: "84500",
    rcDate: "2020-04-10",
    rcDocumentUrl: null,
    fcDate: "2025-04-10",
    fcExpiryDate: "2026-04-10",
    fcDocumentFileName: "cgi_t001_fc.pdf",
    roadTaxDate: "2020-04-10",
    roadTaxNumber: "RT-TN-998877",
    roadTaxDocumentFileName: "cgi_t001_road_tax.pdf",
    insuranceExpiryDate: "2026-12-15",
    nationalPermitNumber: "NP-TN-554433",
    nationalPermitDate: "2020-04-10",
    nationalPermitProofFileName: "cgi_t001_national_permit.pdf",
    localPermitNumber: "LP-TN-112233",
    localPermitDate: "2020-04-10",
    localPermitProofFileName: "cgi_t001_local_permit.pdf",
    pollutionCertificateDate: "2026-01-05",
    pollutionCertificateProofFileName: "cgi_t001_puc.pdf",
  },
];
