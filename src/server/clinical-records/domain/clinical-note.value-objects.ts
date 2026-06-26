import { ClinicalRecordValidationError } from "./clinical-record.errors";
import type { ClinicalNarrative, ClinicalNoteId, HealthcareProfessionalId } from "./clinical-note.types";

const DEFAULT_MAX_NARRATIVE_LENGTH = 10000;
const DEFAULT_MAX_TITLE_LENGTH = 160;

function requireNonBlank(value: string | undefined, field: string): string {
  const normalized = value?.trim();
  if (!normalized) throw new ClinicalRecordValidationError(`${field} is required.`);
  return normalized;
}

export function createClinicalNoteIdValue(value: string | undefined, fallback: string): ClinicalNoteId {
  return requireNonBlank(value ?? fallback, "clinicalNoteId");
}

export function createHealthcareProfessionalIdValue(value: string | undefined): HealthcareProfessionalId {
  return requireNonBlank(value, "healthcareProfessionalId");
}

export function createClinicalNarrativeValue(value: string | undefined, maxLength = DEFAULT_MAX_NARRATIVE_LENGTH): ClinicalNarrative {
  const narrative = requireNonBlank(value, "clinicalNarrative");
  if (narrative.length > maxLength) {
    throw new ClinicalRecordValidationError(`clinicalNarrative must be ${maxLength} characters or fewer.`);
  }
  return narrative;
}

export function createClinicalNoteTitleValue(value: string | undefined, maxLength = DEFAULT_MAX_TITLE_LENGTH): string | undefined {
  const title = value?.trim();
  if (!title) return undefined;
  if (title.length > maxLength) {
    throw new ClinicalRecordValidationError(`clinicalNoteTitle must be ${maxLength} characters or fewer.`);
  }
  return title;
}

export function createOptionalClinicalReferenceValue(value: string | undefined, field: string): string | undefined {
  const normalized = value?.trim();
  if (!normalized) return undefined;
  if (!normalized) throw new ClinicalRecordValidationError(`${field} is required.`);
  return normalized;
}
