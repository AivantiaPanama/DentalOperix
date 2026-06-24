import type { PatientAuditContract } from "../../patient-audit-contract";
import { NoopPatientAuditContract } from "../../patient-audit-contract";
import { PATIENT_ACTOR_ROLES, type PatientActorRole } from "../../patient-domain";
import type { PatientRepository } from "../../patient-repository";
import { PatientNotFoundError } from "../../patient-repository";
import type { UpdatePatientCommand } from "../contracts/update-patient-command";
import type { UpdatePatientResult } from "../contracts/update-patient-result";
import type { PatientApplicationError } from "../types/patient-application-errors";
import type { PatientServiceResult } from "../types/patient-service-result";

const patientActorRoles = new Set<string>(PATIENT_ACTOR_ROLES);

function failure(code: string, message: string, details?: string): PatientServiceResult<never> {
  const error: PatientApplicationError = details ? { code, message, details } : { code, message };
  return { success: false, errors: [error] };
}

function toActorRole(value: string): PatientActorRole | undefined {
  return patientActorRoles.has(value) ? (value as PatientActorRole) : undefined;
}

export class UpdatePatientService {
  constructor(
    private readonly repository: PatientRepository,
    private readonly audit: PatientAuditContract = new NoopPatientAuditContract(),
  ) {}

  async execute(command: UpdatePatientCommand): Promise<PatientServiceResult<UpdatePatientResult>> {
    try {
      const patient = await this.repository.updatePatient(command.patientId, {
        firstName: command.firstName,
        lastName: command.lastName,
        actor: {
          userId: command.context.actorId,
          role: toActorRole(command.context.actorType),
          via: "admin",
        },
      });

      await this.audit.recordPatientAuditEvent({
        patientId: patient.id,
        type: "patient_updated",
        actorUserId: command.context.actorId,
        actorRole: toActorRole(command.context.actorType),
        source: "admin",
        occurredAt: patient.updatedAt,
        metadata: {
          correlationId: command.context.correlationId,
        },
      });

      return {
        success: true,
        data: {
          patientId: patient.id,
          updatedAt: new Date(patient.updatedAt),
          auditRegistered: true,
        },
        errors: [],
      };
    } catch (error) {
      if (error instanceof PatientNotFoundError) {
        return failure("PATIENT_NOT_FOUND", error.message);
      }
      return failure("PATIENT_UPDATE_FAILED", "Patient update failed.", error instanceof Error ? error.message : String(error));
    }
  }
}
