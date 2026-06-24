import type { PatientAuditContract } from "../../patient-audit-contract";
import { NoopPatientAuditContract } from "../../patient-audit-contract";
import { PATIENT_ACTOR_ROLES, type PatientActorRole } from "../../patient-domain";
import type { PatientRepository } from "../../patient-repository";
import { PatientNotFoundError } from "../../patient-repository";
import type { ArchivePatientCommand } from "../contracts/archive-patient-command";
import type { ArchivePatientResult } from "../contracts/archive-patient-result";
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

export class ArchivePatientService {
  constructor(
    private readonly repository: PatientRepository,
    private readonly audit: PatientAuditContract = new NoopPatientAuditContract(),
  ) {}

  async execute(command: ArchivePatientCommand): Promise<PatientServiceResult<ArchivePatientResult>> {
    try {
      const current = await this.repository.findPatientById(command.patientId);
      if (!current) {
        return failure("PATIENT_NOT_FOUND", `Patient ${command.patientId} was not found.`);
      }

      const patient = await this.repository.updatePatient(command.patientId, {
        status: "archived",
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
          previousState: current.status,
          newState: patient.status,
          reason: command.reason,
        },
      });

      return {
        success: true,
        data: {
          patientId: patient.id,
          previousState: current.status,
          newState: patient.status,
          archivedAt: new Date(patient.updatedAt),
        },
        errors: [],
      };
    } catch (error) {
      if (error instanceof PatientNotFoundError) {
        return failure("PATIENT_NOT_FOUND", error.message);
      }
      return failure("PATIENT_ARCHIVE_FAILED", "Patient archive failed.", error instanceof Error ? error.message : String(error));
    }
  }
}
