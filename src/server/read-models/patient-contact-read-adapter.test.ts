import { describe, expect, it } from "vitest";
import { resolvePatientContacts } from "./patient-contact-read-adapter";
import type { PatientContactReadModel } from "./worksheet-read-models";

const contact = (overrides: Partial<PatientContactReadModel>): PatientContactReadModel => ({
  contactId: "CON-BASE",
  patientId: "PAT-001",
  contactType: "email",
  contactValue: "demo@example.com",
  isPrimary: false,
  verificationStatus: "unverified",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  source: "seed",
  isMock: false,
  notes: "",
  ...overrides,
});

describe("patient contact read adapter", () => {
  it("resolves primary email and primary phone for the same patient", () => {
    const resolved = resolvePatientContacts("PAT-001", [
      contact({ contactId: "CON-EMAIL-OLD", contactValue: "old@example.com" }),
      contact({ contactId: "CON-EMAIL", contactValue: "new@example.com", isPrimary: true }),
      contact({ contactId: "CON-PHONE", contactType: "phone", contactValue: "+507 6000 0000", isPrimary: true }),
    ]);

    expect(resolved).toMatchObject({
      email: "new@example.com",
      phone: "+507 6000 0000",
      hasExplicitEmail: true,
      hasExplicitPhone: true,
    });
    expect(resolved.sourceContactIds).toEqual(["CON-EMAIL", "CON-PHONE"]);
  });

  it("returns empty contact values without breaking fallback semantics", () => {
    expect(resolvePatientContacts("PAT-404", [])).toEqual({
      patientId: "PAT-404",
      email: "",
      phone: "",
      sourceContactIds: [],
      hasExplicitEmail: false,
      hasExplicitPhone: false,
    });
  });
});
