import type { PatientId } from "./patient-domain";

export type PatientMergeRequest = {
  mergedFromPatientId: PatientId;
  mergedIntoPatientId: PatientId;
  mergedByUserId: string;
  mergeReason: string;
};

export type PatientMergeResult = PatientMergeRequest & {
  mergedAt: string;
  auditEventId?: string;
};

export interface PatientMergeContract {
  requestManualMerge(input: PatientMergeRequest): Promise<PatientMergeResult>;
}

export class AutomatedPatientMergeNotAllowedError extends Error {
  constructor() {
    super(
      "Automated patient merge is not allowed. Patient merge must be manual, authorized and auditable.",
    );
    this.name = "AutomatedPatientMergeNotAllowedError";
  }
}
