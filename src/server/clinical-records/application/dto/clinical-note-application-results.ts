import type { ClinicalNoteApplicationDto } from "./clinical-note-application-dto";

export type RegisterClinicalNoteResult = {
  clinicalNote: ClinicalNoteApplicationDto;
};

export type CompleteClinicalNoteResult = {
  clinicalNote: ClinicalNoteApplicationDto;
};

export type ReopenClinicalNoteResult = {
  clinicalNote: ClinicalNoteApplicationDto;
};

export type AmendClinicalNoteResult = {
  clinicalNote: ClinicalNoteApplicationDto;
};

export type ArchiveClinicalNoteResult = {
  clinicalNote: ClinicalNoteApplicationDto;
};

export type GetClinicalNoteResult = {
  clinicalNote: ClinicalNoteApplicationDto;
};

export type ListClinicalNotesByPatientResult = {
  clinicalNotes: ClinicalNoteApplicationDto[];
};
