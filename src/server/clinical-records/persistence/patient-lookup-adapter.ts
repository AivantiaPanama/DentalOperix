import type { PatientPersistencePort } from "../../patients/domain/patient-persistence-port";
import { createPatientPersistencePort } from "../../patients/persistence/patient-persistence-provider";
import type { ClinicalRecordPatientId } from "../domain/clinical-record.types";
import type {
  PatientLookupPort,
  PatientLookupResult,
} from "../application/ports/patient-lookup-port";

export const PATIENT_LOOKUP_ADAPTER_VERSION = "75.0-WP-01-PATIENT-LOOKUP-ADAPTER" as const;

export class PatientLookupAdapter implements PatientLookupPort {
  constructor(
    private readonly patientPersistencePort: PatientPersistencePort = createPatientPersistencePort(),
  ) {}

  async findPatientById(patientId: ClinicalRecordPatientId): Promise<PatientLookupResult | null> {
    const patient = await this.patientPersistencePort.findPatientById(patientId);
    return patient ? { id: patient.id, exists: true } : null;
  }
}

export function createPatientLookupPort(
  patientPersistencePort?: PatientPersistencePort,
): PatientLookupPort {
  return new PatientLookupAdapter(patientPersistencePort);
}
