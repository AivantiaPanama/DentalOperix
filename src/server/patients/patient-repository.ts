import type { CreatePatientInput, Patient, PatientId, UpdatePatientInput } from "./patient-domain";

export type PatientIdentitySearch = {
  normalizedName?: string;
  email?: string;
  phone?: string;
  identifierType?: string;
  identifierValue?: string;
  excludePatientId?: PatientId;
};

export interface PatientRepository {
  createPatient(input: CreatePatientInput): Promise<Patient>;
  findPatientById(id: PatientId): Promise<Patient | null>;
  updatePatient(id: PatientId, input: UpdatePatientInput): Promise<Patient>;
  searchPatientsByIdentity(search: PatientIdentitySearch): Promise<Patient[]>;
}

export class PatientNotFoundError extends Error {
  constructor(id: PatientId) {
    super(`Patient ${id} was not found.`);
    this.name = "PatientNotFoundError";
  }
}

export class DuplicatePatientIdentityError extends Error {
  constructor(message = "A patient with the same identity already exists.") {
    super(message);
    this.name = "DuplicatePatientIdentityError";
  }
}
