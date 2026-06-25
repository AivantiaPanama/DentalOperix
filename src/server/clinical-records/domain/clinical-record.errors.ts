import type { ClinicalRecordId } from "./clinical-record.types";

export class ClinicalRecordDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClinicalRecordDomainError";
  }
}

export class ClinicalRecordValidationError extends ClinicalRecordDomainError {
  readonly issues: string[];

  constructor(message: string, issues: string[] = [message]) {
    super(message);
    this.name = "ClinicalRecordValidationError";
    this.issues = issues;
  }
}

export class ClinicalRecordNotFoundError extends ClinicalRecordDomainError {
  constructor(id: ClinicalRecordId) {
    super(`Clinical record ${id} was not found.`);
    this.name = "ClinicalRecordNotFoundError";
  }
}

export class ClinicalRecordPatientNotFoundError extends ClinicalRecordDomainError {
  constructor(patientId: string) {
    super(`Patient ${patientId} was not found for clinical record creation.`);
    this.name = "ClinicalRecordPatientNotFoundError";
  }
}
