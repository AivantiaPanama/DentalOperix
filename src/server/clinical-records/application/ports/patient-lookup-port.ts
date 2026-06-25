import type { ClinicalRecordPatientId } from "../../domain/clinical-record.types";

export type PatientLookupResult = {
  id: ClinicalRecordPatientId;
  exists: boolean;
};

export interface PatientLookupPort {
  findPatientById(patientId: ClinicalRecordPatientId): Promise<PatientLookupResult | null>;
}
