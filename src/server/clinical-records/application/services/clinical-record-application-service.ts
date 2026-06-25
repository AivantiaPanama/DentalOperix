import { ClinicalRecordNotFoundError, ClinicalRecordPatientNotFoundError } from "../../domain/clinical-record.errors";
import type { ClinicalRecordPersistencePort } from "../../domain/clinical-record-persistence-port";
import type { CreateClinicalRecordCommand } from "../contracts/create-clinical-record-command";
import type { CreateClinicalRecordResult } from "../contracts/create-clinical-record-result";
import type { GetClinicalRecordQuery } from "../contracts/get-clinical-record-query";
import type { GetClinicalRecordResult } from "../contracts/get-clinical-record-result";
import type { PatientLookupPort } from "../ports/patient-lookup-port";

export type ClinicalRecordApplicationServiceDependencies = {
  clinicalRecordPersistencePort: ClinicalRecordPersistencePort;
  patientLookupPort: PatientLookupPort;
};

export class ClinicalRecordApplicationService {
  constructor(private readonly dependencies: ClinicalRecordApplicationServiceDependencies) {}

  async createClinicalRecord(command: CreateClinicalRecordCommand): Promise<CreateClinicalRecordResult> {
    const patient = await this.dependencies.patientLookupPort.findPatientById(command.patientId);
    if (!patient?.exists) throw new ClinicalRecordPatientNotFoundError(command.patientId);
    const clinicalRecord = await this.dependencies.clinicalRecordPersistencePort.createClinicalRecord(command);
    return { clinicalRecord };
  }

  async getClinicalRecord(query: GetClinicalRecordQuery): Promise<GetClinicalRecordResult> {
    const clinicalRecord = await this.dependencies.clinicalRecordPersistencePort.findClinicalRecordById(query.id);
    if (!clinicalRecord) throw new ClinicalRecordNotFoundError(query.id);
    return { clinicalRecord };
  }
}

export function createClinicalRecordApplicationService(
  dependencies: ClinicalRecordApplicationServiceDependencies,
): ClinicalRecordApplicationService {
  return new ClinicalRecordApplicationService(dependencies);
}
