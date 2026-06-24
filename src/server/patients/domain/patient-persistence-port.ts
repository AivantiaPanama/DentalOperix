import type { CreatePatientInput, Patient, PatientId, UpdatePatientInput } from "./patient.types";

export type PatientIdentitySearch = {
  normalizedName?: string;
  email?: string;
  phone?: string;
  identifierType?: string;
  identifierValue?: string;
  excludePatientId?: PatientId;
};

/**
 * Certified 71.5.1 domain contract only.
 * Implementations belong to later controlled increments and must not be introduced here.
 */
export interface PatientPersistencePort {
  createPatient(input: CreatePatientInput): Promise<Patient>;
  findPatientById(id: PatientId): Promise<Patient | null>;
  updatePatient(id: PatientId, input: UpdatePatientInput): Promise<Patient>;
  searchPatientsByIdentity(search: PatientIdentitySearch): Promise<Patient[]>;
}
