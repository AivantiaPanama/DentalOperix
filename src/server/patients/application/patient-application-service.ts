import type { PatientPersistencePort } from "../domain/patient-persistence-port";
import type { Patient, PatientId } from "../domain/patient.types";
import { PatientApplicationLayerNotFoundError } from "./patient-application.errors";
import {
  mapCreatePatientCommandToDomainInput,
  mapIdentitySearchCommandToPortSearch,
  mapUpdatePatientCommandToDomainInput,
} from "./patient-application-mappers";
import type {
  CreatePatientApplicationCommand,
  PatientApplicationResult,
  PatientApplicationServiceContract,
  PatientIdentitySearchCommand,
  PatientSearchResult,
  UpdatePatientApplicationCommand,
} from "./patient-application.types";

export class PatientApplicationService implements PatientApplicationServiceContract {
  constructor(private readonly patientPersistencePort: PatientPersistencePort) {}

  async createPatient(
    command: CreatePatientApplicationCommand,
  ): Promise<PatientApplicationResult<Patient>> {
    const patient = await this.patientPersistencePort.createPatient(
      mapCreatePatientCommandToDomainInput(command),
    );
    return { ok: true, patient };
  }

  async getPatientById(id: PatientId): Promise<PatientApplicationResult<Patient>> {
    const patient = await this.patientPersistencePort.findPatientById(id);
    if (!patient) throw new PatientApplicationLayerNotFoundError(id);
    return { ok: true, patient };
  }

  async updatePatient(
    id: PatientId,
    command: UpdatePatientApplicationCommand,
  ): Promise<PatientApplicationResult<Patient>> {
    const existing = await this.patientPersistencePort.findPatientById(id);
    if (!existing) throw new PatientApplicationLayerNotFoundError(id);

    const patient = await this.patientPersistencePort.updatePatient(
      id,
      mapUpdatePatientCommandToDomainInput(command),
    );
    return { ok: true, patient };
  }

  async searchPatientsByIdentity(
    command: PatientIdentitySearchCommand,
  ): Promise<PatientSearchResult> {
    const patients = await this.patientPersistencePort.searchPatientsByIdentity(
      mapIdentitySearchCommandToPortSearch(command),
    );
    return {
      ok: true,
      patients,
      duplicateReviewRequired: patients.length > 1,
    };
  }
}

export function createPatientApplicationService(
  patientPersistencePort: PatientPersistencePort,
): PatientApplicationService {
  return new PatientApplicationService(patientPersistencePort);
}
