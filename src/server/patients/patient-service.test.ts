import { describe, expect, it } from "vitest";
import { createPatientEntity, type CreatePatientInput, type Patient, type UpdatePatientInput } from "./patient-domain";
import { AmbiguousPatientIdentityError, PatientService } from "./patient-service";
import { DuplicatePatientIdentityError, type PatientIdentitySearch, type PatientRepository } from "./patient-repository";
import type { PatientAuditContract, PatientAuditEvent } from "./patient-audit-contract";

class InMemoryPatientRepository implements PatientRepository {
  readonly patients: Patient[] = [];
  constructor(seed: Patient[] = []) { this.patients = [...seed]; }
  async createPatient(input: CreatePatientInput) {
    const patient = createPatientEntity(input, { id: `patient_${this.patients.length + 1}` });
    this.patients.push(patient);
    return patient;
  }
  async findPatientById(id: string) { return this.patients.find((patient) => patient.id === id) ?? null; }
  async updatePatient(id: string, input: UpdatePatientInput) {
    const patient = this.patients.find((current) => current.id === id);
    if (!patient) throw new Error("missing");
    Object.assign(patient, { ...patient, ...input, updatedAt: "2026-06-24T00:00:00.000Z" });
    return patient;
  }
  async searchPatientsByIdentity(search: PatientIdentitySearch) {
    return this.patients.filter((patient) =>
      patient.normalizedName === search.normalizedName || patient.emails.some((email) => email.normalizedEmail === search.email),
    );
  }
}

class CapturingAudit implements PatientAuditContract {
  events: PatientAuditEvent[] = [];
  async recordPatientAuditEvent(event: PatientAuditEvent) { this.events.push(event); }
}

describe("PatientService", () => {
  it("creates patient and records audit event when no match exists", async () => {
    const repository = new InMemoryPatientRepository();
    const audit = new CapturingAudit();
    const service = new PatientService(repository, audit);

    const patient = await service.createPatient({ displayName: "Paciente Nuevo", source: "admin", phones: [{ phone: "555" }] });

    expect(patient.id).toBe("patient_1");
    expect(audit.events[0]).toMatchObject({ patientId: patient.id, type: "patient_created", source: "admin" });
  });

  it("blocks duplicate strong identity matches", async () => {
    const existing = createPatientEntity({ displayName: "Ana Ruiz", source: "web", emails: [{ email: "ana@example.com" }] }, { id: "patient_existing" });
    const service = new PatientService(new InMemoryPatientRepository([existing]));

    await expect(service.createPatient({ displayName: "Ana Ruiz", source: "web", emails: [{ email: "ana@example.com" }] })).rejects.toThrow(DuplicatePatientIdentityError);
  });

  it("blocks ambiguous identity matches without automatic merge", async () => {
    const existing = createPatientEntity({ displayName: "Luis García", source: "admin", phones: [{ phone: "111" }] }, { id: "patient_existing" });
    const service = new PatientService(new InMemoryPatientRepository([existing]));

    await expect(service.createPatient({ displayName: "Luis García", source: "admin", phones: [{ phone: "222" }] })).rejects.toThrow(AmbiguousPatientIdentityError);
  });
});
