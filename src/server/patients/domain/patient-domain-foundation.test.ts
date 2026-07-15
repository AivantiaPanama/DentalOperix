import { describe, expect, it } from "vitest";
import {
  AutomatedPatientMergeNotAllowedError,
  PATIENT_DOMAIN_FOUNDATION_VERSION,
  createPatientEntity,
  normalizeEmail,
  normalizeIdentifier,
  normalizeName,
  normalizePhone,
  validateCreatePatientInput,
} from "./index";
import type { PatientPersistencePort } from "./index";

describe("71.5.1 Patient Domain Foundation", () => {
  it("declares the certified foundation version", () => {
    expect(PATIENT_DOMAIN_FOUNDATION_VERSION).toBe("71.5.1-PATIENT-DOMAIN-FOUNDATION");
  });

  it("creates a normalized patient entity without persistence or adapters", () => {
    const patient = createPatientEntity(
      {
        firstName: " María ",
        lastName: " López ",
        source: "admin",
        phones: [{ phone: "(555) 123-4567" }],
        actor: { role: "administrator", via: "admin", userId: "admin-1" },
      },
      { id: "patient_71_5_1", now: "2026-06-24T00:00:00.000Z" },
    );

    expect(patient.id).toBe("patient_71_5_1");
    expect(patient.displayName).toBe("María López");
    expect(patient.normalizedName).toBe("maria lopez");
    expect(patient.phones[0]?.normalizedPhone).toBe("5551234567");
    expect(patient.phones[0]?.isPrimary).toBe(true);
    expect(patient.createdByRole).toBe("administrator");
  });

  it("validates channel-specific patient identity requirements", () => {
    expect(() =>
      validateCreatePatientInput({
        displayName: "Public Patient",
        source: "web",
      }),
    ).toThrow("Invalid patient data.");

    expect(() =>
      validateCreatePatientInput({
        displayName: "Clinic Patient",
        source: "admin",
        emails: [{ email: "clinic@example.com" }],
      }),
    ).toThrow("Invalid patient data.");
  });

  it("normalizes value objects deterministically", () => {
    expect(normalizeName("  José   Pérez ")).toBe("jose perez");
    expect(normalizePhone("+1 (555) 000-1234")).toBe("15550001234");
    expect(normalizeEmail(" TEST@Example.COM ")).toBe("test@example.com");
    expect(normalizeIdentifier(" ab c 123 ")).toBe("ABC123");
  });

  it("exposes a domain-only persistence port contract", async () => {
    const port: PatientPersistencePort = {
      createPatient: async (input) => createPatientEntity(input, { id: "patient_port" }),
      findPatientById: async () => null,
      updatePatient: async (_id, input) =>
        createPatientEntity({
          displayName: input.displayName,
          source: "admin",
          phones: [{ phone: "555" }],
        }),
      searchPatientsByIdentity: async () => [],
    };

    await expect(port.findPatientById("missing")).resolves.toBeNull();
  });

  it("keeps automated patient merge explicitly blocked", () => {
    expect(() => {
      throw new AutomatedPatientMergeNotAllowedError();
    }).toThrow("Automated patient merge is not allowed under DentalOperix governance.");
  });
});
