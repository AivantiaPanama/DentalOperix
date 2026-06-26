import type { ClinicalRecordPatientId } from "../../domain/clinical-record.types";
import type { ClinicalNoteId } from "../../domain/clinical-note.types";

export type GetClinicalNoteCommand = {
  clinicalNoteId: ClinicalNoteId;
  patientId?: ClinicalRecordPatientId;
};
