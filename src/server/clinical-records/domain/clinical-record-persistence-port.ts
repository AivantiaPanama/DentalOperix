import type {
  ClinicalRecord,
  ClinicalRecordId,
  ClinicalRecordPatientId,
  CreateClinicalRecordInput,
} from "./clinical-record.types";

export interface ClinicalRecordPersistencePort {
  createClinicalRecord(input: CreateClinicalRecordInput): Promise<ClinicalRecord>;
  findClinicalRecordById(id: ClinicalRecordId): Promise<ClinicalRecord | null>;
  findClinicalRecordByPatientId(patientId: ClinicalRecordPatientId): Promise<ClinicalRecord | null>;
}
