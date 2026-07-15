import { describe, expect, it } from "vitest";
import { createPatientEntity, type CreatePatientInput, type Patient } from "./patient-domain";
import { PatientIdentityResolutionService } from "./patient-identity-resolution";
import type { PatientIdentitySearch, PatientRepository } from "./patient-repository";

class InMemoryPatientRepository implements PatientRepository {
  constructor(private readonly patients: Patient[]) {}
  async createPatient(input: CreatePatientInput) {
    return createPatientEntity(input);
  }
  async findPatientById(id: string) {
    return this.patients.find((patient) => patient.id === id) ?? null;
  }
  async updatePatient(): Promise<Patient> {
    throw new Error("not needed");
  }
  async searchPatientsByIdentity(search: PatientIdentitySearch) {
    return this.patients.filter(
      (patient) =>
        patient.normalizedName === search.normalizedName ||
        patient.emails.some((email) => email.normalizedEmail === search.email) ||
        patient.phones.some((phone) => phone.normalizedPhone === search.phone) ||
        patient.identifiers.some(
          (identifier) =>
            identifier.type === search.identifierType &&
            identifier.normalizedValue === search.identifierValue,
        ),
    );
  }
}

describe("Patient identity resolution", () => {
  it("returns strong_match for normalized name and email", async () => {
    const existing = createPatientEntity(
      { displayName: "Ana Ruiz", source: "web", emails: [{ email: "ana@example.com" }] },
      { id: "patient_1" },
    );
    const service = new PatientIdentityResolutionService(new InMemoryPatientRepository([existing]));

    const result = await service.resolveBeforeCreate({
      displayName: "Ana Ruiz",
      source: "web",
      emails: [{ email: "ANA@example.com" }],
    });

    expect(result.status).toBe("strong_match");
    expect(result.matches).toHaveLength(1);
  });

  it("returns ambiguous_match when same name lacks safe differentiator", async () => {
    const existing = createPatientEntity(
      { displayName: "Luis García", source: "admin", phones: [{ phone: "111" }] },
      { id: "patient_2" },
    );
    const service = new PatientIdentityResolutionService(new InMemoryPatientRepository([existing]));

    const result = await service.resolveBeforeCreate({
      displayName: "Luis García",
      source: "admin",
      phones: [{ phone: "222" }],
    });

    expect(result.status).toBe("ambiguous_match");
    expect(result.requiredDifferentiators).toContain("cid");
  });

  it("returns no_match when no identity evidence exists", async () => {
    const service = new PatientIdentityResolutionService(new InMemoryPatientRepository([]));
    const result = await service.resolveBeforeCreate({
      displayName: "Nuevo Paciente",
      source: "admin",
      phones: [{ phone: "333" }],
    });
    expect(result.status).toBe("no_match");
  });
});
