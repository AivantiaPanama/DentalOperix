import type { ClinicalRecordId, ClinicalRecordPatientId } from "../../domain/clinical-record.types";
import type { ClinicalNote, ClinicalNoteId, ClinicalNoteStatus, HealthcareProfessionalId } from "../../domain/clinical-note.types";

export type ClinicalNoteApplicationDto = {
  id: ClinicalNoteId;
  clinicalRecordId: ClinicalRecordId;
  patientId: ClinicalRecordPatientId;
  appointmentId?: string;
  title?: string;
  narrative: string;
  status: ClinicalNoteStatus;
  createdAt: string;
  updatedAt: string;
  createdByHealthcareProfessionalId: HealthcareProfessionalId;
  updatedByHealthcareProfessionalId?: HealthcareProfessionalId;
  completedAt?: string;
  completedByHealthcareProfessionalId?: HealthcareProfessionalId;
  reopenedAt?: string;
  reopenedByHealthcareProfessionalId?: HealthcareProfessionalId;
  archivedAt?: string;
  archivedByHealthcareProfessionalId?: HealthcareProfessionalId;
};

export function toClinicalNoteApplicationDto(note: ClinicalNote): ClinicalNoteApplicationDto {
  return {
    id: note.id,
    clinicalRecordId: note.clinicalRecordId,
    patientId: note.patientId,
    appointmentId: note.appointmentId,
    title: note.title,
    narrative: note.narrative,
    status: note.status,
    createdAt: note.audit.createdAt,
    updatedAt: note.audit.updatedAt,
    createdByHealthcareProfessionalId: note.audit.createdByHealthcareProfessionalId,
    updatedByHealthcareProfessionalId: note.audit.updatedByHealthcareProfessionalId,
    completedAt: note.audit.completedAt,
    completedByHealthcareProfessionalId: note.audit.completedByHealthcareProfessionalId,
    reopenedAt: note.audit.reopenedAt,
    reopenedByHealthcareProfessionalId: note.audit.reopenedByHealthcareProfessionalId,
    archivedAt: note.audit.archivedAt,
    archivedByHealthcareProfessionalId: note.audit.archivedByHealthcareProfessionalId,
  };
}
