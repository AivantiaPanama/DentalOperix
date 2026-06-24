import { normalizeIdentifier, normalizeName, normalizePhone, type Patient } from "../../patient-domain";
import type { PatientIdentitySearch, PatientRepository } from "../../patient-repository";
import type { IdentityResolutionCandidate, IdentityResolutionResult } from "../contracts/identity-resolution-result";
import type { ResolvePatientIdentityCommand } from "../contracts/resolve-patient-identity-command";
import type { PatientApplicationError } from "../types/patient-application-errors";
import type { PatientServiceResult } from "../types/patient-service-result";

function failure(code: string, message: string, details?: string): PatientServiceResult<never> {
  const error: PatientApplicationError = details ? { code, message, details } : { code, message };
  return { success: false, errors: [error] };
}

function buildSearch(command: ResolvePatientIdentityCommand): PatientIdentitySearch | PatientApplicationError {
  const hasName = Boolean(command.firstName || command.lastName);
  const hasCriterion = hasName || Boolean(command.phone || command.email || command.identifier);
  if (!hasCriterion) {
    return {
      code: "IDENTITY_CRITERION_REQUIRED",
      message: "At least one patient identity search criterion is required.",
    };
  }

  const displayName = [command.firstName, command.lastName].filter(Boolean).join(" ");
  return {
    normalizedName: displayName ? normalizeName(displayName) : undefined,
    email: command.email?.trim().toLowerCase(),
    phone: command.phone ? normalizePhone(command.phone) : undefined,
    identifierValue: command.identifier ? normalizeIdentifier(command.identifier) : undefined,
  };
}

function matchedFields(patient: Patient, search: PatientIdentitySearch): string[] {
  const fields: string[] = [];
  if (search.normalizedName && patient.normalizedName === search.normalizedName) fields.push("name");
  if (search.email && patient.emails.some((email) => email.normalizedEmail === search.email)) fields.push("email");
  if (search.phone && patient.phones.some((phone) => phone.normalizedPhone === search.phone)) fields.push("phone");
  if (search.identifierValue && patient.identifiers.some((identifier) => identifier.normalizedValue === search.identifierValue)) fields.push("identifier");
  return fields;
}

function confidence(fields: string[]): number {
  if (fields.includes("identifier")) return 1;
  if (fields.includes("email") && fields.includes("name")) return 0.95;
  if (fields.includes("phone") && fields.includes("name")) return 0.9;
  if (fields.includes("email") || fields.includes("phone")) return 0.8;
  return 0.5;
}

function toCandidate(patient: Patient, search: PatientIdentitySearch): IdentityResolutionCandidate {
  const fields = matchedFields(patient, search);
  return {
    patientId: patient.id,
    confidence: confidence(fields),
    matchedFields: fields,
  };
}

export class ResolvePatientIdentityService {
  constructor(private readonly repository: PatientRepository) {}

  async execute(command: ResolvePatientIdentityCommand): Promise<PatientServiceResult<IdentityResolutionResult>> {
    const search = buildSearch(command);
    if ("code" in search) {
      return { success: false, errors: [search] };
    }

    try {
      const patients = await this.repository.searchPatientsByIdentity(search);
      const candidates = patients.map((patient) => toCandidate(patient, search));
      const exactMatches = candidates.filter((candidate) => candidate.confidence >= 0.95);

      return {
        success: true,
        data: {
          candidates,
          ambiguous: candidates.length > 1 || exactMatches.length > 1,
          exactMatch: exactMatches.length === 1,
        },
        errors: [],
      };
    } catch (error) {
      return failure("PATIENT_IDENTITY_RESOLUTION_FAILED", "Patient identity resolution failed.", error instanceof Error ? error.message : String(error));
    }
  }
}
