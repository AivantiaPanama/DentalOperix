import type { ClinicalRecordPatientId } from "../../domain/clinical-record.types";
import type {
  ClinicalNoteId,
  ClinicalNarrative,
  HealthcareProfessionalId,
} from "../../domain/clinical-note.types";

export type AmendClinicalNoteCommand = {
  clinicalNoteId: ClinicalNoteId;
  patientId?: ClinicalRecordPatientId;
  healthcareProfessionalId: HealthcareProfessionalId;
  title?: string;
  narrative?: ClinicalNarrative;
  now?: string;
};
