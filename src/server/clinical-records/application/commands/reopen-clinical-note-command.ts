import type { ClinicalRecordPatientId } from "../../domain/clinical-record.types";
import type { ClinicalNoteId, HealthcareProfessionalId } from "../../domain/clinical-note.types";

export type ReopenClinicalNoteCommand = {
  clinicalNoteId: ClinicalNoteId;
  patientId?: ClinicalRecordPatientId;
  healthcareProfessionalId: HealthcareProfessionalId;
  reason?: string;
  now?: string;
};
