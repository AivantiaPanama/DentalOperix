import { ClinicalRecordValidationError } from "./clinical-record.errors";
import { archiveClinicalNoteEntity, createClinicalNoteEntity, updateClinicalNoteEntity } from "./clinical-note.entity";
import type {
  ClinicalNote,
  ClinicalNoteTransitionInput,
  CreateClinicalNoteInput,
  CreateClinicalNoteOptions,
  HealthcareProfessionalId,
  UpdateClinicalNoteInput,
} from "./clinical-note.types";
import { createHealthcareProfessionalIdValue } from "./clinical-note.value-objects";

function resolveOperationTimestamp(now?: string): string {
  return now ?? new Date().toISOString();
}

function requireNoteTransitionActor(input: ClinicalNoteTransitionInput): HealthcareProfessionalId {
  return createHealthcareProfessionalIdValue(input.healthcareProfessionalId);
}

function assertClinicalNoteCanBeCompleted(note: ClinicalNote): void {
  if (note.status === "archived") {
    throw new ClinicalRecordValidationError("Archived clinical notes cannot be completed.");
  }

  if (note.status === "completed") {
    throw new ClinicalRecordValidationError("Clinical note is already completed.");
  }
}

function assertClinicalNoteCanBeReopened(note: ClinicalNote): void {
  if (note.status === "archived") {
    throw new ClinicalRecordValidationError("Archived clinical notes cannot be reopened.");
  }

  if (note.status === "draft") {
    throw new ClinicalRecordValidationError("Draft clinical notes are already open.");
  }
}

function assertClinicalNoteCanBeAmended(note: ClinicalNote): void {
  if (note.status === "archived") {
    throw new ClinicalRecordValidationError("Archived clinical notes cannot be amended.");
  }
}

export type RegisterClinicalNoteInput = CreateClinicalNoteInput;
export type RegisterClinicalNoteOptions = CreateClinicalNoteOptions;

export type CompleteClinicalNoteOptions = {
  now?: string;
};

export type ReopenClinicalNoteOptions = {
  now?: string;
};

export type AmendClinicalNoteOptions = {
  now?: string;
};

export function registerClinicalNote(input: RegisterClinicalNoteInput, options: RegisterClinicalNoteOptions = {}): ClinicalNote {
  return createClinicalNoteEntity({ ...input, status: "draft" }, options);
}

export function completeClinicalNote(note: ClinicalNote, input: ClinicalNoteTransitionInput, options: CompleteClinicalNoteOptions = {}): ClinicalNote {
  assertClinicalNoteCanBeCompleted(note);
  const now = resolveOperationTimestamp(options.now);
  const healthcareProfessionalId = requireNoteTransitionActor(input);

  return {
    ...note,
    status: "completed",
    audit: {
      ...note.audit,
      updatedAt: now,
      updatedByHealthcareProfessionalId: healthcareProfessionalId,
      completedAt: now,
      completedByHealthcareProfessionalId: healthcareProfessionalId,
    },
  };
}

export function reopenClinicalNote(note: ClinicalNote, input: ClinicalNoteTransitionInput, options: ReopenClinicalNoteOptions = {}): ClinicalNote {
  assertClinicalNoteCanBeReopened(note);
  const now = resolveOperationTimestamp(options.now);
  const healthcareProfessionalId = requireNoteTransitionActor(input);

  return {
    ...note,
    status: "draft",
    audit: {
      ...note.audit,
      updatedAt: now,
      updatedByHealthcareProfessionalId: healthcareProfessionalId,
      reopenedAt: now,
      reopenedByHealthcareProfessionalId: healthcareProfessionalId,
    },
  };
}

export function amendClinicalNote(note: ClinicalNote, input: UpdateClinicalNoteInput, options: AmendClinicalNoteOptions = {}): ClinicalNote {
  assertClinicalNoteCanBeAmended(note);
  return updateClinicalNoteEntity(note, input, resolveOperationTimestamp(options.now));
}

export function archiveClinicalNote(note: ClinicalNote, input: ClinicalNoteTransitionInput, options: AmendClinicalNoteOptions = {}): ClinicalNote {
  if (note.status === "archived") {
    throw new ClinicalRecordValidationError("Clinical note is already archived.");
  }

  return archiveClinicalNoteEntity(note, input.healthcareProfessionalId, resolveOperationTimestamp(options.now));
}

export const ClinicalNoteDomainService = {
  registerClinicalNote,
  completeClinicalNote,
  reopenClinicalNote,
  amendClinicalNote,
  archiveClinicalNote,
} as const;
