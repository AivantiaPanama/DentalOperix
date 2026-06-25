import type { PatientPersistencePort } from "../domain/patient-persistence-port";
import type { PatientId } from "../domain/patient.types";
import { createPatientApplicationService } from "./patient-application-service";
import type { CreatePatientApplicationCommand, PatientIdentitySearchCommand, UpdatePatientApplicationCommand } from "./patient-application.types";

export function createPatientUseCase(port: PatientPersistencePort, command: CreatePatientApplicationCommand) {
  return createPatientApplicationService(port).createPatient(command);
}

export function getPatientByIdUseCase(port: PatientPersistencePort, id: PatientId) {
  return createPatientApplicationService(port).getPatientById(id);
}

export function updatePatientUseCase(port: PatientPersistencePort, id: PatientId, command: UpdatePatientApplicationCommand) {
  return createPatientApplicationService(port).updatePatient(id, command);
}

export function searchPatientsByIdentityUseCase(port: PatientPersistencePort, command: PatientIdentitySearchCommand) {
  return createPatientApplicationService(port).searchPatientsByIdentity(command);
}
