import type { ClinicalRecordPersistencePort } from "../domain/clinical-record-persistence-port";
import {
  RelationalClinicalRecordPersistenceAdapter,
  type ClinicalRecordPersistenceClientFactory,
} from "./relational-clinical-record-persistence-adapter";

export const CLINICAL_RECORD_PERSISTENCE_PROVIDER_VERSION = "75.0-WP-01-CLINICAL-RECORD-PERSISTENCE-PROVIDER" as const;

export type ClinicalRecordPersistenceProviderOptions = {
  clientFactory?: ClinicalRecordPersistenceClientFactory;
};

export class ClinicalRecordPersistenceProvider {
  constructor(private readonly options: ClinicalRecordPersistenceProviderOptions = {}) {}

  getClinicalRecordPersistencePort(): ClinicalRecordPersistencePort {
    return new RelationalClinicalRecordPersistenceAdapter(this.options.clientFactory);
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
