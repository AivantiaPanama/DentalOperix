import type { CreatePatientInput, UpdatePatientInput } from "../domain/patient.types";
import type { PatientIdentitySearch } from "../domain/patient-persistence-port";
import {
  normalizeEmail,
  normalizeIdentifier,
  normalizeName,
  normalizePhone,
} from "../domain/patient.value-objects";
import type {
  CreatePatientApplicationCommand,
  PatientIdentitySearchCommand,
  UpdatePatientApplicationCommand,
} from "./patient-application.types";

export function mapCreatePatientCommandToDomainInput(
  command: CreatePatientApplicationCommand,
): CreatePatientInput {
  const { metadata: _metadata, ...domainInput } = command;
  return domainInput;
}

export function mapUpdatePatientCommandToDomainInput(
  command: UpdatePatientApplicationCommand,
): UpdatePatientInput {
  const { metadata: _metadata, ...domainInput } = command;
  return domainInput;
}

export function mapIdentitySearchCommandToPortSearch(
  command: PatientIdentitySearchCommand,
): PatientIdentitySearch {
  return {
    normalizedName: command.normalizedName ? normalizeName(command.normalizedName) : undefined,
    email: command.email ? normalizeEmail(command.email) : undefined,
    phone: command.phone ? normalizePhone(command.phone) : undefined,
    identifierType: command.identifierType,
    identifierValue: command.identifierValue
      ? normalizeIdentifier(command.identifierValue)
      : undefined,
    excludePatientId: command.excludePatientId,
  };
}
