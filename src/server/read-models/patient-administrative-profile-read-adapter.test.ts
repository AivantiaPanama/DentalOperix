import { describe, expect, it } from "vitest";
import { resolvePatientAdministrativeProfile } from "./patient-administrative-profile-read-adapter";
import type { PatientAdministrativeProfileReadModel } from "./worksheet-read-models";

function profile(overrides: Partial<PatientAdministrativeProfileReadModel>): PatientAdministrativeProfileReadModel {
  return {
    profileId: "PRO-BASE",
    patientId: "PAT-001",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    preferredContactMethod: "",
    verificationStatus: "",
    verifiedAt: "",
    verifiedBy: "",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    source: "seed",
    isMock: false,
    notes: "",
    ...overrides,
  };
}

describe("patient administrative profile read adapter", () => {
  it("selects the verified administrative profile before older incomplete records", () => {
    const resolved = resolvePatientAdministrativeProfile("PAT-001", [
      profile({
        profileId: "PRO-OLD",
        address: "Dirección antigua",
        updatedAt: "2026-02-01T00:00:00.000Z",
      }),
      profile({
        profileId: "PRO-VERIFIED",
        address: "Dirección fiscal",
        emergencyContactName: "Ana Demo",
        emergencyContactPhone: "+507 6111 1111",
        preferredContactMethod: "whatsapp",
        verificationStatus: "verified",
        verifiedAt: "2026-01-05T00:00:00.000Z",
        verifiedBy: "admin",
        updatedAt: "2026-01-05T00:00:00.000Z",
        notes: "Perfil verificado.",
      }),
    ]);

    expect(resolved).toMatchObject({
      patientId: "PAT-001",
      profileId: "PRO-VERIFIED",
      address: "Dirección fiscal",
      emergencyContact: "Ana Demo · +507 6111 1111",
      preferredContactMethod: "whatsapp",
      hasExplicitAdministrativeProfile: true,
      isVerified: true,
    });
  });

  it("returns an empty explicit-false profile when the read model has no administrative record", () => {
    const resolved = resolvePatientAdministrativeProfile("PAT-404", []);

    expect(resolved).toEqual({
      patientId: "PAT-404",
      address: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContact: "",
      preferredContactMethod: "",
      verificationStatus: "",
      notes: "",
      hasExplicitAdministrativeProfile: false,
      isVerified: false,
    });
  });
});
