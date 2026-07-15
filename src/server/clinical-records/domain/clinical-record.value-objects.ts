import { ClinicalRecordValidationError } from "./clinical-record.errors";
import type { ClinicalRecordId, ClinicalRecordPatientId } from "./clinical-record.types";

function requireNonBlank(value: string | undefined, field: string): string {
  const normalized = value?.trim();
  if (!normalized) throw new ClinicalRecordValidationError(`${field} is required.`);
  return normalized;
}

export function createClinicalRecordIdValue(
  value: string | undefined,
  fallback: string,
): ClinicalRecordId {
  return requireNonBlank(value ?? fallback, "clinicalRecordId");
}

export function createClinicalRecordPatientIdValue(
  value: string | undefined,
): ClinicalRecordPatientId {
  return requireNonBlank(value, "patientId");
}
