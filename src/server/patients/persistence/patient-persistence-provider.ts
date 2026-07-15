import type { PatientPersistencePort } from "../domain/patient-persistence-port";
import {
  RelationalPatientPersistenceAdapter,
  type PatientPersistenceClientFactory,
} from "./relational-patient-persistence-adapter";

export const PATIENT_PERSISTENCE_PROVIDER_VERSION = "71.5.3-PATIENT-PERSISTENCE-PROVIDER" as const;

export type PatientPersistenceProviderOptions = {
  clientFactory?: PatientPersistenceClientFactory;
};

export class PatientPersistenceProvider {
  constructor(private readonly options: PatientPersistenceProviderOptions = {}) {}

  getPatientPersistencePort(): PatientPersistencePort {
    return new RelationalPatientPersistenceAdapter(this.options.clientFactory);
  }
}

export function createPatientPersistenceProvider(
  options: PatientPersistenceProviderOptions = {},
): PatientPersistenceProvider {
  return new PatientPersistenceProvider(options);
}

export function createPatientPersistencePort(
  options: PatientPersistenceProviderOptions = {},
): PatientPersistencePort {
  return createPatientPersistenceProvider(options).getPatientPersistencePort();
}
