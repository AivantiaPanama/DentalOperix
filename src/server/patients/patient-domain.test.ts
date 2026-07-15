import { describe, expect, it } from "vitest";
import {
  PatientValidationError,
  applyPatientUpdate,
  createPatientEntity,
  normalizeName,
  normalizePhone,
} from "./patient-domain";

describe("Patient Identity Foundation domain", () => {
  it("creates a permanent Patient identity with normalized contact points", () => {
    const patient = createPatientEntity(
      {
        firstName: "María",
        lastName: "Pérez",
        source: "assistant",
        phones: [{ phone: "+52 55 1234 5678" }],
        emails: [{ email: "MARIA@example.com" }],
        actor: { role: "assistant", via: "assistant" },
      },
      { id: "patient_1", now: "2026-06-23T00:00:00.000Z" },
    );

    expect(patient.id).toBe("patient_1");
    expect(patient.displayName).toBe("María Pérez");
    expect(patient.normalizedName).toBe("maria perez");
    expect(patient.status).toBe("active");
    expect(patient.phones[0]).toMatchObject({ normalizedPhone: "525512345678", isPrimary: true });
    expect(patient.emails[0]).toMatchObject({
      normalizedEmail: "maria@example.com",
      isPrimary: true,
    });
    expect(patient.createdVia).toBe("assistant");
  });

  it("preserves Patient identity when attributes change", () => {
    const patient = createPatientEntity(
      {
        displayName: "Juan López",
        source: "admin",
        phones: [{ phone: "5551234" }],
      },
      { id: "patient_2", now: "2026-06-23T00:00:00.000Z" },
    );

    const updated = applyPatientUpdate(
      patient,
      { displayName: "Juan Carlos López", actor: { role: "administrator", via: "admin" } },
      "2026-06-24T00:00:00.000Z",
    );

    expect(updated.id).toBe(patient.id);
    expect(updated.normalizedName).toBe("juan carlos lopez");
    expect(updated.updatedVia).toBe("admin");
    expect(updated.createdAt).toBe(patient.createdAt);
  });

  it("requires public-channel email", () => {
    expect(() =>
      createPatientEntity({ displayName: "Paciente Web", source: "web" }, { id: "patient_3" }),
    ).toThrow(PatientValidationError);
  });

  it("requires CID when invoice data is required", () => {
    expect(() =>
      createPatientEntity(
        {
          displayName: "Paciente Factura",
          source: "admin",
          phones: [{ phone: "555" }],
          requiresInvoice: true,
        },
        { id: "patient_4" },
      ),
    ).toThrow(PatientValidationError);
  });

  it("normalizes identity helpers deterministically", () => {
    expect(normalizeName("  José   Núñez ")).toBe("jose nunez");
    expect(normalizePhone("+52 (55) 1000-2000")).toBe("525510002000");
  });
});
