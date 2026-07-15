import type { PatientAuditEventType } from "../../patient-audit-contract";
import { PATIENT_AUDIT_EVENT_TYPES, type PatientAuditContract } from "../../patient-audit-contract";
import { PATIENT_ACTOR_ROLES, type PatientActorRole } from "../../patient-domain";
import type { RegisterPatientAuditEventCommand } from "../contracts/register-patient-audit-event-command";
import type { RegisterPatientAuditEventResult } from "../contracts/register-patient-audit-event-result";
import type { PatientApplicationError } from "../types/patient-application-errors";
import type { PatientServiceResult } from "../types/patient-service-result";

const auditEventTypes = new Set<string>(PATIENT_AUDIT_EVENT_TYPES);
const patientActorRoles = new Set<string>(PATIENT_ACTOR_ROLES);

function failure(code: string, message: string, details?: string): PatientServiceResult<never> {
  const error: PatientApplicationError = details ? { code, message, details } : { code, message };
  return { success: false, errors: [error] };
}

function toActorRole(value: string): PatientActorRole | undefined {
  return patientActorRoles.has(value) ? (value as PatientActorRole) : undefined;
}

function toAuditEventType(value: string): PatientAuditEventType | PatientApplicationError {
  if (auditEventTypes.has(value)) return value as PatientAuditEventType;
  return {
    code: "INVALID_PATIENT_AUDIT_EVENT_TYPE",
    message: "Patient audit event type is not supported by the patient audit contract.",
    details: value,
  };
}

export class RegisterPatientAuditEventService {
  constructor(private readonly audit: PatientAuditContract) {}

  async execute(
    command: RegisterPatientAuditEventCommand,
  ): Promise<PatientServiceResult<RegisterPatientAuditEventResult>> {
    const eventType = toAuditEventType(command.eventType);
    if (typeof eventType !== "string") {
      return { success: false, errors: [eventType] };
    }

    try {
      const eventId = `${command.patientId}_${eventType}_${command.context.timestamp.getTime()}`;
      await this.audit.recordPatientAuditEvent({
        id: eventId,
        patientId: command.patientId,
        type: eventType,
        actorUserId: command.context.actorId,
        actorRole: toActorRole(command.context.actorType),
        source: "admin",
        occurredAt: command.context.timestamp.toISOString(),
        metadata: {
          correlationId: command.context.correlationId,
          beforeState: command.beforeState,
          afterState: command.afterState,
        },
      });

      return {
        success: true,
        data: {
          auditRegistered: true,
          eventId,
        },
        errors: [],
      };
    } catch (error) {
      return failure(
        "PATIENT_AUDIT_REGISTRATION_FAILED",
        "Patient audit registration failed.",
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
