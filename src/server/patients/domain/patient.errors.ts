import type { PatientId } from "./patient.types";

export class PatientDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PatientDomainError";
  }
}

export class PatientValidationError extends PatientDomainError {
  readonly issues: string[];

  constructor(message: string, issues: string[] = [message]) {
    super(message);
    this.name = "PatientValidationError";
    this.issues = issues;
  }
}

export class PatientNotFoundError extends PatientDomainError {
  constructor(id: PatientId) {
    super(`Patient ${id} was not found.`);
    this.name = "PatientNotFoundError";
  }
}

export class DuplicatePatientIdentityError extends PatientDomainError {
  constructor(message = "A patient with the same identity already exists.") {
    super(message);
    this.name = "DuplicatePatientIdentityError";
  }
}

export class AutomatedPatientMergeNotAllowedError extends PatientDomainError {
  constructor() {
    super("Automated patient merge is not allowed under DentalOperix governance.");
    this.name = "AutomatedPatientMergeNotAllowedError";
  }
}
