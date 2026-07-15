import { describe, expect, it } from "vitest";
import { createPatientEntity } from "../domain/patient.entity";
import type {
  PatientPersistencePort,
  PatientIdentitySearch,
} from "../domain/patient-persistence-port";
import type {
  CreatePatientInput,
  Patient,
  PatientId,
  UpdatePatientInput,
} from "../domain/patient.types";
import { PatientApplicationLayerNotFoundError } from "./patient-application.errors";
import { mapIdentitySearchCommandToPortSearch } from "./patient-application-mappers";
import { createPatientApplicationService } from "./patient-application-service";
import { PATIENT_APPLICATION_LAYER_VERSION } from "./patient-application.types";
import {
  createPatientUseCase,
  searchPatientsByIdentityUseCase,
  updatePatientUseCase,
} from "./patient-use-cases";

function createInMemoryPatientPort(
  seed: Patient[] = [],
): PatientPersistencePort & { searches: PatientIdentitySearch[] } {
  const patients = new Map<PatientId, Patient>(seed.map((patient) => [patient.id, patient]));
  const searches: PatientIdentitySearch[] = [];

  return {
    searches,
    async createPatient(input: CreatePatientInput) {
      const patient = createPatientEntity(input, {
        id: input.id ?? `patient_${patients.size + 1}`,
        now: "2026-06-24T00:00:00.000Z",
      });
      patients.set(patient.id, patient);
      return patient;
    },
    async findPatientById(id: PatientId) {
      return patients.get(id) ?? null;
    },
    async updatePatient(id: PatientId, input: UpdatePatientInput) {
      const existing = patients.get(id);
      if (!existing) throw new Error("Unexpected update of a missing patient in fake port.");
      const updated = { ...existing, ...input, updatedAt: "2026-06-24T00:01:00.000Z" };
      patients.set(id, updated);
      return updated;
    },
    async searchPatientsByIdentity(search: PatientIdentitySearch) {
      searches.push(search);
      return Array.from(patients.values()).filter((patient) => {
        if (search.email && patient.emails.some((email) => email.normalizedEmail === search.email))
          return true;
        if (search.phone && patient.phones.some((phone) => phone.normalizedPhone === search.phone))
          return true;
        if (search.normalizedName && patient.normalizedName === search.normalizedName) return true;
        return false;
      });
    },
  };
}

describe("71.5.2 Patient Application Layer", () => {
  it("declares the certified application layer version", () => {
    expect(PATIENT_APPLICATION_LAYER_VERSION).toBe("71.5.2-PATIENT-APPLICATION-LAYER");
  });

  it("creates patients through the domain port without using persistence infrastructure", async () => {
    const port = createInMemoryPatientPort();
    const result = await createPatientApplicationService(port).createPatient({
      id: "patient_app_1",
      displayName: " Ana Rivera ",
      source: "admin",
      phones: [{ phone: "(555) 111-2222" }],
    });

    expect(result.ok).toBe(true);
    expect(result.patient.id).toBe("patient_app_1");
    expect(result.patient.normalizedName).toBe("ana rivera");
    await expect(port.findPatientById("patient_app_1")).resolves.toEqual(result.patient);
  });

  it("gets an existing patient and throws an application error for missing patients", async () => {
    const existing = createPatientEntity({
      id: "patient_existing",
      displayName: "Existing",
      source: "admin",
      phones: [{ phone: "555" }],
    });
    const service = createPatientApplicationService(createInMemoryPatientPort([existing]));

    await expect(service.getPatientById("patient_existing")).resolves.toMatchObject({
      ok: true,
      patient: existing,
    });
    await expect(service.getPatientById("missing")).rejects.toBeInstanceOf(
      PatientApplicationLayerNotFoundError,
    );
  });

  it("updates patients only after confirming the patient exists", async () => {
    const existing = createPatientEntity({
      id: "patient_update",
      displayName: "Before",
      source: "admin",
      phones: [{ phone: "555" }],
    });
    const port = createInMemoryPatientPort([existing]);

    const updated = await updatePatientUseCase(port, "patient_update", { displayName: "After" });

    expect(updated.patient.displayName).toBe("After");
    await expect(
      updatePatientUseCase(port, "missing", { displayName: "Nope" }),
    ).rejects.toBeInstanceOf(PatientApplicationLayerNotFoundError);
  });

  it("normalizes identity searches before delegating to the port", async () => {
    const patient = createPatientEntity({
      id: "patient_identity",
      displayName: "Lucia Gomez",
      source: "admin",
      phones: [{ phone: "+507 6000-0000" }],
    });
    const port = createInMemoryPatientPort([patient]);

    const result = await searchPatientsByIdentityUseCase(port, {
      normalizedName: "  Lucía   Gómez  ",
      phone: "+507 6000-0000",
    });

    expect(result.patients).toHaveLength(1);
    expect(port.searches[0]).toEqual({
      normalizedName: "lucia gomez",
      email: undefined,
      phone: "50760000000",
      identifierType: undefined,
      identifierValue: undefined,
      excludePatientId: undefined,
    });
  });

  it("requires duplicate candidates to stay in manual review instead of automated merge", async () => {
    const one = createPatientEntity({
      id: "patient_dup_1",
      displayName: "Sam",
      source: "admin",
      phones: [{ phone: "555" }],
    });
    const two = createPatientEntity({
      id: "patient_dup_2",
      displayName: "Sam",
      source: "admin",
      phones: [{ phone: "555" }],
    });
    const result = await createPatientApplicationService(
      createInMemoryPatientPort([one, two]),
    ).searchPatientsByIdentity({ phone: "555" });

    expect(result.patients).toHaveLength(2);
    expect(result.duplicateReviewRequired).toBe(true);
  });

  it("exposes use-case functions without binding to adapters or providers", async () => {
    const port = createInMemoryPatientPort();
    const result = await createPatientUseCase(port, {
      displayName: "Use Case",
      source: "admin",
      phones: [{ phone: "555" }],
    });

    expect(result.ok).toBe(true);
    expect(result.patient.displayName).toBe("Use Case");
  });

  it("maps identity search values deterministically", () => {
    expect(
      mapIdentitySearchCommandToPortSearch({
        email: " TEST@Example.COM ",
        identifierValue: " cid 123 ",
      }),
    ).toEqual({
      normalizedName: undefined,
      email: "test@example.com",
      phone: undefined,
      identifierType: undefined,
      identifierValue: "CID123",
      excludePatientId: undefined,
    });
  });
});
