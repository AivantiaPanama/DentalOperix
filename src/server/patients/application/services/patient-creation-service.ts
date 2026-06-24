import type { PatientAuditContract } from "../../patient-audit-contract";
import { NoopPatientAuditContract } from "../../patient-audit-contract";
import {
  PATIENT_ACTOR_ROLES,
  PATIENT_CREATION_SOURCES,
  type CreatePatientInput,
  type PatientActorRole,
  type PatientCreationSource,
} from "../../patient-domain";
import type { PatientRepository } from "../../patient-repository";
import { DuplicatePatientIdentityError } from "../../patient-repository";
import { PatientIdentityResolutionService as DomainPatientIdentityResolutionService } from "../../patient-identity-resolution";
import type { CreatePatientCommand } from "../contracts/create-patient-command";
import type { CreatePatientResult } from "../contracts/create-patient-result";
import type { PatientApplicationError } from "../types/patient-application-errors";
import type { PatientServiceResult } from "../types/patient-service-result";

const patientCreationSources = new Set<string>(PATIENT_CREATION_SOURCES);
const patientActorRoles = new Set<string>(PATIENT_ACTOR_ROLES);

function failure(code: string, message: string, details?: string): PatientServiceResult<never> {
  const error: PatientApplicationError = details ? { code, message, details } : { code, message };
  return { success: false, errors: [error] };
}

function isPatientCreationSource(value: string): value is PatientCreationSource {
  return patientCreationSources.has(value);
}

function toActorRole(value: string): PatientActorRole | undefined {
  return patientActorRoles.has(value) ? (value as PatientActorRole) : undefined;
}

function buildCreateInput(command: CreatePatientCommand): CreatePatientInput | PatientApplicationError {
  if (!isPatientCreationSource(command.source)) {
    return {
      code: "INVALID_PATIENT_SOURCE",
      message: "Patient creation source is not supported by the patient domain.",
      details: command.source,
    };
  }

  return {
    firstName: command.firstName,
    lastName: command.lastName,
    source: command.source,
    phones: command.phones?.map((phone, index) => ({ phone, isPrimary: index === 0 })) ?? [],
    emails: command.emails?.map((email, index) => ({ email, isPrimary: index === 0 })) ?? [],
    actor: {
      userId: command.context.actorId,
      role: toActorRole(command.context.actorType),
      via: command.source,
    },
  };
}

export class CreatePatientService {
  private readonly identityResolution: DomainPatientIdentityResolutionService;

  constructor(
    private readonly repository: PatientRepository,
    private readonly audit: PatientAuditContract = new NoopPatientAuditContract(),
  ) {
    this.identityResolution = new DomainPatientIdentityResolutionService(repository);
  }

  async execute(command: CreatePatientCommand): Promise<PatientServiceResult<CreatePatientResult>> {
    const input = buildCreateInput(command);
    if ("code" in input) {
      return { success: false, errors: [input] };
    }

    try {
      const resolution = await this.identityResolution.resolveBeforeCreate(input);
      if (resolution.status === "strong_match") {
        return failure("DUPLICATE_PATIENT_IDENTITY", "Strong patient identity match found before create.");
      }

      if (resolution.status === "ambiguous_match") {
        return failure(
          "AMBIGUOUS_PATIENT_IDENTITY",
          "Patient identity is ambiguous and requires manual differentiation before creation.",
          resolution.requiredDifferentiators.join(","),
        );
      }

      const patient = await this.repository.createPatient(input);
      await this.audit.recordPatientAuditEvent({
        patientId: patient.id,
        type: "patient_created",
        actorUserId: command.context.actorId,
        actorRole: toActorRole(command.context.actorType),
        source: input.source,
        occurredAt: patient.createdAt,
        metadata: {
          correlationId: command.context.correlationId,
        },
      });

      return {
        success: true,
        data: {
          patientId: patient.id,
          createdAt: new Date(patient.createdAt),
          auditRegistered: true,
        },
        errors: [],
      };
    } catch (error) {
      if (error instanceof DuplicatePatientIdentityError) {
        return failure("DUPLICATE_PATIENT_IDENTITY", error.message);
      }
      return failure("PATIENT_CREATE_FAILED", "Patient creation failed.", error instanceof Error ? error.message : String(error));
    }
  }
}
