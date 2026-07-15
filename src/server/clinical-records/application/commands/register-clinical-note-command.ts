import type { ClinicalRecordId, ClinicalRecordPatientId } from "../../domain/clinical-record.types";
import type {
  ClinicalNoteId,
  ClinicalNarrative,
  HealthcareProfessionalId,
} from "../../domain/clinical-note.types";

export type RegisterClinicalNoteCommand = {
  id?: ClinicalNoteId;
  clinicalRecordId: ClinicalRecordId;
  patientId: ClinicalRecordPatientId;
  appointmentId?: string;
  title?: string;
  narrative: ClinicalNarrative;
  healthcareProfessionalId: HealthcareProfessionalId;
  now?: string;
};
