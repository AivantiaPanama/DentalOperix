import type { PatientId } from "../domain/patient.types";

export class PatientApplicationLayerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PatientApplicationLayerError";
  }
}

export class PatientApplicationLayerValidationError extends PatientApplicationLayerError {
  readonly issues: string[];

  constructor(message: string, issues: string[] = [message]) {
    super(message);
    this.name = "PatientApplicationLayerValidationError";
    this.issues = issues;
  }
}

export class PatientApplicationLayerNotFoundError extends PatientApplicationLayerError {
  constructor(id: PatientId) {
    super(`Patient ${id} was not found by the Patient Application Layer.`);
    this.name = "PatientApplicationLayerNotFoundError";
  }
}

export class PatientDuplicateReviewRequiredError extends PatientApplicationLayerError {
  constructor() {
    super(
      "Possible duplicate patients require manual review. Automated patient merge is not allowed.",
    );
    this.name = "PatientDuplicateReviewRequiredError";
  }
}
