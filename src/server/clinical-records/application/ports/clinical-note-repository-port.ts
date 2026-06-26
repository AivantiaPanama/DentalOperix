import type { ClinicalNote, ClinicalNoteId } from "../../domain/clinical-note.types";
import type { ClinicalRecordId, ClinicalRecordPatientId } from "../../domain/clinical-record.types";

export type ClinicalNoteRepositoryPort = {
  saveClinicalNote(note: ClinicalNote): Promise<ClinicalNote>;
  findClinicalNoteById(id: ClinicalNoteId): Promise<ClinicalNote | null>;
  findClinicalNotesByClinicalRecordId(clinicalRecordId: ClinicalRecordId): Promise<ClinicalNote[]>;
  findClinicalNotesByPatientId(patientId: ClinicalRecordPatientId): Promise<ClinicalNote[]>;
  updateClinicalNote(note: ClinicalNote): Promise<ClinicalNote>;
};
