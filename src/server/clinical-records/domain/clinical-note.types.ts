import type { ClinicalRecordId, ClinicalRecordPatientId } from "./clinical-record.types";

export type ClinicalNoteId = string;
export type ClinicalNarrative = string;
export type HealthcareProfessionalId = string;
export type ClinicalNoteStatus = "draft" | "completed" | "amended" | "archived";
export type ClinicalNoteSource = "clinical-notes-foundation";

export type ClinicalNoteAudit = {
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
  source: ClinicalNoteSource;
};

export type ClinicalNote = {
  id: ClinicalNoteId;
  clinicalRecordId: ClinicalRecordId;
  patientId: ClinicalRecordPatientId;
  appointmentId?: string;
  title?: string;
  narrative: ClinicalNarrative;
  status: ClinicalNoteStatus;
  audit: ClinicalNoteAudit;
};

export type CreateClinicalNoteInput = {
  id?: ClinicalNoteId;
  clinicalRecordId: ClinicalRecordId;
  patientId: ClinicalRecordPatientId;
  appointmentId?: string;
  title?: string;
  narrative: ClinicalNarrative;
  healthcareProfessionalId: HealthcareProfessionalId;
  status?: ClinicalNoteStatus;
};

export type CreateClinicalNoteOptions = {
  id?: ClinicalNoteId;
  now?: string;
};

export type UpdateClinicalNoteInput = {
  narrative?: ClinicalNarrative;
  title?: string;
  healthcareProfessionalId: HealthcareProfessionalId;
};

export type ClinicalNoteTransitionInput = {
  healthcareProfessionalId: HealthcareProfessionalId;
  reason?: string;
};

export type ClinicalNoteDomainEventType =
  | "ClinicalNoteRegistered"
  | "ClinicalNoteCompleted"
  | "ClinicalNoteReopened"
  | "ClinicalNoteAmended"
  | "ClinicalNoteArchived";

export type ClinicalNoteDomainEvent = {
  id: string;
  type: ClinicalNoteDomainEventType;
  clinicalRecordId: ClinicalRecordId;
  clinicalNoteId: ClinicalNoteId;
  patientId: ClinicalRecordPatientId;
  occurredAt: string;
};
