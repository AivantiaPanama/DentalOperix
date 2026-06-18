import { describe, expect, it } from "vitest";
import { resolvePatientIdentity } from "./patient-identifier-read-adapter";
import type { PatientIdentifierReadModel } from "./worksheet-read-models";

const identifier = (
  overrides: Partial<PatientIdentifierReadModel>,
): PatientIdentifierReadModel => ({
  identifierId: "ID-BASE",
  patientId: "PAT-001",
  identifierType: "CID",
  identifierValue: "8-888-888",
  country: "PA",
  isPrimary: false,
  verificationStatus: "verified",
  issuedAt: "",
  expiresAt: "",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  source: "seed",
  isMock: false,
  notes: "",
  ...overrides,
});

describe("patient identifier read adapter", () => {
  it("uses CID ahead of primary passport because domain priority wins", () => {
    const identity = resolvePatientIdentity("PAT-001", [
      identifier({ identifierId: "ID-PASS", identifierType: "PASSPORT", identifierValue: "PA-123", isPrimary: true }),
      identifier({ identifierId: "ID-CID", identifierType: "CID", identifierValue: "8-888-888" }),
    ]);

    expect(identity.documentType).toBe("CID");
    expect(identity.sourceIdentifierId).toBe("ID-CID");
  });

  it("falls back to deterministic TMP-PAT when identifiers are unavailable", () => {
    expect(resolvePatientIdentity("PAT-002", [])).toMatchObject({
      patientId: "PAT-002",
      documentType: "TMP-PAT",
      documentValue: "TMP-PAT-PAT-002",
      isTemporary: true,
    });
  });
});
