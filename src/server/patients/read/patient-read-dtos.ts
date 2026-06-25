import type {
  PatientAdministrativeField,
  PatientAdministrativeStatus,
  PatientAdministrativeProfile,
} from "@/lib/patients/admin-profile";

export type PatientSummaryDTO = Readonly<{
  id: string;
  displayName: string;
  phone: string;
  email: string;
  latestStatus: string;
  source: string;
  completionPercentage: number;
  administrativeStatus: PatientAdministrativeStatus;
  updatedAt?: string;
}>;

export type PatientDetailDTO = Readonly<PatientAdministrativeProfile>;

export type PatientSearchResultDTO = PatientSummaryDTO;

export type PatientAdministrativeProfileDTO = Readonly<{
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthDate: string;
  address: string;
  emergencyContact: string;
  preferredContactMethod: string;
  missingFields: readonly PatientAdministrativeField[];
  completionPercentage: number;
  administrativeStatus: PatientAdministrativeStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}>;

export type PatientReadSearchQuery = Readonly<{
  normalizedName?: string;
  name?: string;
  email?: string;
  phone?: string;
  identifierValue?: string;
  excludePatientId?: string;
}>;
