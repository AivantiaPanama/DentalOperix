import type { ClinicalNote, ClinicalNoteStatus } from "../domain/clinical-note.types";

export type RelationalClinicalNoteRow = {
  id: string;
  clinical_record_id: string;
  patient_id: string;
  appointment_id: string | null;
  title: string | null;
  narrative: string;
  status: ClinicalNoteStatus;
  created_at: string | Date;
  updated_at: string | Date;
  created_by_healthcare_professional_id: string;
  updated_by_healthcare_professional_id: string | null;
  completed_at: string | Date | null;
  completed_by_healthcare_professional_id: string | null;
  reopened_at: string | Date | null;
  reopened_by_healthcare_professional_id: string | null;
  archived_at: string | Date | null;
  archived_by_healthcare_professional_id: string | null;
  source: "clinical-notes-foundation";
};

function serializeTimestamp(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : value;
}

function serializeNullableTimestamp(value: string | Date | null): string | undefined {
  if (!value) return undefined;
  return serializeTimestamp(value);
}

export function mapClinicalNoteToRelationalValues(note: ClinicalNote): unknown[] {
  return [
    note.id,
    note.clinicalRecordId,
    note.patientId,
    note.appointmentId ?? null,
    note.title ?? null,
    note.narrative,
    note.status,
    note.audit.createdAt,
    note.audit.updatedAt,
    note.audit.createdByHealthcareProfessionalId,
    note.audit.updatedByHealthcareProfessionalId ?? null,
    note.audit.completedAt ?? null,
    note.audit.completedByHealthcareProfessionalId ?? null,
    note.audit.reopenedAt ?? null,
    note.audit.reopenedByHealthcareProfessionalId ?? null,
    note.audit.archivedAt ?? null,
    note.audit.archivedByHealthcareProfessionalId ?? null,
    note.audit.source,
  ];
}

export function mapRelationalClinicalNoteToDomain(row: RelationalClinicalNoteRow): ClinicalNote {
  return {
    id: row.id,
    clinicalRecordId: row.clinical_record_id,
    patientId: row.patient_id,
    appointmentId: row.appointment_id ?? undefined,
    title: row.title ?? undefined,
    narrative: row.narrative,
    status: row.status,
    audit: {
      createdAt: serializeTimestamp(row.created_at),
      updatedAt: serializeTimestamp(row.updated_at),
      createdByHealthcareProfessionalId: row.created_by_healthcare_professional_id,
      updatedByHealthcareProfessionalId: row.updated_by_healthcare_professional_id ?? undefined,
      completedAt: serializeNullableTimestamp(row.completed_at),
      completedByHealthcareProfessionalId: row.completed_by_healthcare_professional_id ?? undefined,
      reopenedAt: serializeNullableTimestamp(row.reopened_at),
      reopenedByHealthcareProfessionalId: row.reopened_by_healthcare_professional_id ?? undefined,
      archivedAt: serializeNullableTimestamp(row.archived_at),
      archivedByHealthcareProfessionalId: row.archived_by_healthcare_professional_id ?? undefined,
      source: row.source,
    },
  };
}
