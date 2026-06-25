import type { CreatePatientInput, Patient, PatientId, UpdatePatientInput } from "../domain/patient.types";
import type { PatientIdentitySearch } from "../domain/patient-persistence-port";

/**
 * 71.5.2 Patient Application Layer.
 * Governance boundary: application orchestration only; no API, UI, adapter, Supabase, Lead replacement, or automated merge behavior.
 */
export const PATIENT_APPLICATION_LAYER_VERSION = "71.5.2-PATIENT-APPLICATION-LAYER" as const;

export type PatientApplicationCommandMetadata = {
  correlationId?: string;
  requestedByUserId?: string;
};

export type CreatePatientApplicationCommand = CreatePatientInput & {
  metadata?: PatientApplicationCommandMetadata;
};

export type UpdatePatientApplicationCommand = UpdatePatientInput & {
  metadata?: PatientApplicationCommandMetadata;
};

export type PatientIdentitySearchCommand = PatientIdentitySearch & {
  metadata?: PatientApplicationCommandMetadata;
};

export type PatientApplicationResult<T> = {
  ok: true;
  patient: T;
};

export type PatientSearchResult = {
  ok: true;
  patients: Patient[];
  duplicateReviewRequired: boolean;
};

export type PatientDuplicateReview = {
  duplicateReviewRequired: true;
  candidates: Patient[];
};

export type PatientApplicationServiceContract = {
  createPatient(command: CreatePatientApplicationCommand): Promise<PatientApplicationResult<Patient>>;
  getPatientById(id: PatientId): Promise<PatientApplicationResult<Patient>>;
  updatePatient(id: PatientId, command: UpdatePatientApplicationCommand): Promise<PatientApplicationResult<Patient>>;
  searchPatientsByIdentity(command: PatientIdentitySearchCommand): Promise<PatientSearchResult>;
};
