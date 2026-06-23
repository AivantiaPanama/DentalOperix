import type { PatientAuditContract } from "./patient-audit-contract";
import { NoopPatientAuditContract } from "./patient-audit-contract";
import type { CreatePatientInput, Patient, PatientAuditActor, PatientId, UpdatePatientInput } from "./patient-domain";
import type { PatientRepository } from "./patient-repository";
import { DuplicatePatientIdentityError } from "./patient-repository";
import { PatientIdentityResolutionService } from "./patient-identity-resolution";

export class AmbiguousPatientIdentityError extends Error {
  readonly requiredDifferentiators: string[];

  constructor(requiredDifferentiators: string[]) {
    super("Patient identity is ambiguous and requires manual differentiation before creation.");
    this.name = "AmbiguousPatientIdentityError";
    this.requiredDifferentiators = requiredDifferentiators;
  }
}

export class PatientService {
  private readonly identityResolution: PatientIdentityResolutionService;

  constructor(
    private readonly repository: PatientRepository,
    private readonly audit: PatientAuditContract = new NoopPatientAuditContract(),
  ) {
    this.identityResolution = new PatientIdentityResolutionService(repository);
  }

  async createPatient(input: CreatePatientInput): Promise<Patient> {
    const resolution = await this.identityResolution.resolveBeforeCreate(input);

    if (resolution.status === "strong_match") {
      throw new DuplicatePatientIdentityError("Strong patient identity match found before create.");
    }

    if (resolution.status === "ambiguous_match") {
      throw new AmbiguousPatientIdentityError(resolution.requiredDifferentiators);
    }

    const patient = await this.repository.createPatient(input);
    await this.audit.recordPatientAuditEvent({
      patientId: patient.id,
      type: "patient_created",
      actorUserId: input.actor?.userId,
      actorRole: input.actor?.role,
      source: input.actor?.via ?? input.source,
      occurredAt: patient.createdAt,
      metadata: {
        linkedLeadId: patient.linkedLeadId,
        linkedAppointmentId: patient.linkedAppointmentId,
      },
    });

    return patient;
  }

  async updatePatient(id: PatientId, input: UpdatePatientInput & { actor: PatientAuditActor }): Promise<Patient> {
    const patient = await this.repository.updatePatient(id, input);
    await this.audit.recordPatientAuditEvent({
      patientId: patient.id,
      type: "patient_updated",
      actorUserId: input.actor.userId,
      actorRole: input.actor.role,
      source: input.actor.via,
      occurredAt: patient.updatedAt,
      metadata: { status: patient.status },
    });
    return patient;
  }
}
