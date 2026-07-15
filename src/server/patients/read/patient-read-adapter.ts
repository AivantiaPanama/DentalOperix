import type { PatientAdministrativeProfile } from "@/lib/patients/admin-profile";
import type {
  PatientAdministrativeProfileDTO,
  PatientDetailDTO,
  PatientSearchResultDTO,
  PatientSummaryDTO,
} from "./patient-read-dtos";

function normalizeValue(value: string | undefined | null): string {
  return (value ?? "").trim();
}

export function toPatientSummaryDTO(patient: PatientAdministrativeProfile): PatientSummaryDTO {
  return Object.freeze({
    id: patient.id,
    displayName: patient.displayName,
    phone: patient.phone,
    email: patient.email,
    latestStatus: patient.latestStatus,
    source: patient.source,
    completionPercentage: patient.completionPercentage,
    administrativeStatus: patient.administrativeStatus,
    ...(patient.updatedAt ? { updatedAt: patient.updatedAt } : {}),
  });
}

export function toPatientDetailDTO(patient: PatientAdministrativeProfile): PatientDetailDTO {
  return Object.freeze({
    ...patient,
    sourceLeadIds: [...patient.sourceLeadIds],
    missingFields: [...patient.missingFields],
  });
}

export function toPatientSearchResultDTO(
  patient: PatientAdministrativeProfile,
): PatientSearchResultDTO {
  return toPatientSummaryDTO(patient);
}

export function toPatientAdministrativeProfileDTO(
  patient: PatientAdministrativeProfile,
): PatientAdministrativeProfileDTO {
  return Object.freeze({
    id: patient.id,
    displayName: patient.displayName,
    firstName: patient.firstName,
    lastName: patient.lastName,
    phone: patient.phone,
    email: patient.email,
    birthDate: patient.birthDate,
    address: patient.address,
    emergencyContact: patient.emergencyContact,
    preferredContactMethod: patient.preferredContactMethod,
    missingFields: [...patient.missingFields],
    completionPercentage: patient.completionPercentage,
    administrativeStatus: patient.administrativeStatus,
    ...(patient.verifiedAt ? { verifiedAt: patient.verifiedAt } : {}),
    ...(patient.verifiedBy ? { verifiedBy: patient.verifiedBy } : {}),
    ...(patient.updatedAt ? { updatedAt: patient.updatedAt } : {}),
    ...(patient.updatedBy ? { updatedBy: patient.updatedBy } : {}),
  });
}

export function normalizePatientReadSearchValue(value: string | undefined): string {
  return normalizeValue(value).toLowerCase();
}

export function normalizePatientReadPhone(value: string | undefined): string {
  return normalizeValue(value).replace(/\D+/g, "");
}
