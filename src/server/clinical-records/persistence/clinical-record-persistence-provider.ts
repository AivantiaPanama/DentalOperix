import type { ClinicalRecordPersistencePort } from "../domain/clinical-record-persistence-port";
import type { ClinicalNoteRepositoryPort } from "../application/ports/clinical-note-repository-port";
import {
  RelationalClinicalRecordPersistenceAdapter,
  type ClinicalRecordPersistenceClientFactory,
} from "./relational-clinical-record-persistence-adapter";
import { RelationalClinicalNoteRepositoryAdapter } from "./relational-clinical-note-repository-adapter";

export const CLINICAL_RECORD_PERSISTENCE_PROVIDER_VERSION =
  "75.0-WP-02-I1-M4-CLINICAL-RECORD-PERSISTENCE-PROVIDER" as const;

export type ClinicalRecordPersistenceProviderOptions = {
  clientFactory?: ClinicalRecordPersistenceClientFactory;
};

export class ClinicalRecordPersistenceProvider {
  constructor(private readonly options: ClinicalRecordPersistenceProviderOptions = {}) {}

  getClinicalRecordPersistencePort(): ClinicalRecordPersistencePort {
    return new RelationalClinicalRecordPersistenceAdapter(this.options.clientFactory);
  }

  getClinicalNoteRepositoryPort(): ClinicalNoteRepositoryPort {
    return new RelationalClinicalNoteRepositoryAdapter(this.options.clientFactory);
  }
}

export function createClinicalRecordPersistenceProvider(
  options: ClinicalRecordPersistenceProviderOptions = {},
): ClinicalRecordPersistenceProvider {
  return new ClinicalRecordPersistenceProvider(options);
}

export function createClinicalRecordPersistencePort(
  options: ClinicalRecordPersistenceProviderOptions = {},
): ClinicalRecordPersistencePort {
  return createClinicalRecordPersistenceProvider(options).getClinicalRecordPersistencePort();
}

export function createClinicalNoteRepositoryPort(
  options: ClinicalRecordPersistenceProviderOptions = {},
): ClinicalNoteRepositoryPort {
  return createClinicalRecordPersistenceProvider(options).getClinicalNoteRepositoryPort();
}
