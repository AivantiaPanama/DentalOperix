import type { ClinicalNote, CreateClinicalNoteInput, CreateClinicalNoteOptions, UpdateClinicalNoteInput } from "./clinical-note.types";
import { createClinicalRecordIdValue, createClinicalRecordPatientIdValue } from "./clinical-record.value-objects";
import {
  createClinicalNarrativeValue,
  createClinicalNoteIdValue,
  createClinicalNoteTitleValue,
  createHealthcareProfessionalIdValue,
  createOptionalClinicalReferenceValue,
} from "./clinical-note.value-objects";

function resolveOperationTimestamp(now?: string): string {
  return now ?? new Date().toISOString();
}

export function createClinicalNoteEntity(input: CreateClinicalNoteInput, options: CreateClinicalNoteOptions = {}): ClinicalNote {
  const now = resolveOperationTimestamp(options.now);
  const id = createClinicalNoteIdValue(input.id ?? options.id, `clinical_note_${Date.now()}`);
  const clinicalRecordId = createClinicalRecordIdValue(input.clinicalRecordId, "");
  const patientId = createClinicalRecordPatientIdValue(input.patientId);
  const healthcareProfessionalId = createHealthcareProfessionalIdValue(input.healthcareProfessionalId);

  return {
    id,
    clinicalRecordId,
    patientId,
    appointmentId: createOptionalClinicalReferenceValue(input.appointmentId, "appointmentId"),
    title: createClinicalNoteTitleValue(input.title),
    narrative: createClinicalNarrativeValue(input.narrative),
    status: input.status ?? "draft",
    audit: {
      createdAt: now,
      updatedAt: now,
      createdByHealthcareProfessionalId: healthcareProfessionalId,
      source: "clinical-notes-foundation",
    },
  };
}

export function updateClinicalNoteEntity(note: ClinicalNote, input: UpdateClinicalNoteInput, now = new Date().toISOString()): ClinicalNote {
  const healthcareProfessionalId = createHealthcareProfessionalIdValue(input.healthcareProfessionalId);
  const nextNarrative = input.narrative === undefined ? note.narrative : createClinicalNarrativeValue(input.narrative);
  const nextTitle = input.title === undefined ? note.title : createClinicalNoteTitleValue(input.title);

  return {
    ...note,
    title: nextTitle,
    narrative: nextNarrative,
    status: note.status === "draft" ? "draft" : "amended",
    audit: {
      ...note.audit,
      updatedAt: now,
      updatedByHealthcareProfessionalId: healthcareProfessionalId,
    },
  };
}

export function archiveClinicalNoteEntity(note: ClinicalNote, healthcareProfessionalId: string, now = new Date().toISOString()): ClinicalNote {
  return {
    ...note,
    status: "archived",
    audit: {
      ...note.audit,
      updatedAt: now,
      updatedByHealthcareProfessionalId: createHealthcareProfessionalIdValue(healthcareProfessionalId),
      archivedAt: now,
      archivedByHealthcareProfessionalId: createHealthcareProfessionalIdValue(healthcareProfessionalId),
    },
  };
}
