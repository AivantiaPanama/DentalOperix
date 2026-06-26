import type { ClinicalRecordPatientId } from "../../domain/clinical-record.types";

export type ListClinicalNotesByPatientCommand = {
  patientId: ClinicalRecordPatientId;
};
