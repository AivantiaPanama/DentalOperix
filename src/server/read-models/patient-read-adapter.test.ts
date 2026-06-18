import { describe, expect, it } from "vitest";
import { buildPatientAdministrativeProfilesFromReadModels } from "./patient-read-adapter";
import type { WorksheetReadModels } from "./worksheet-read-models";

const baseModels: WorksheetReadModels = {
  patients: [
    {
      patientId: "PAT-001",
      displayName: "Carlos Pareja",
      firstName: "Carlos",
      lastName: "Pareja",
      dateOfBirth: "1985-03-21",
      administrativeStatus: "pending-verification",
      identityStatus: "temporary",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
      source: "seed",
      isMock: false,
      notes: "Paciente seed.",
    },
  ],
  identifiers: [],
  contacts: [
    {
      contactId: "CON-001",
      patientId: "PAT-001",
      contactType: "email",
      contactValue: "carlos@example.com",
      isPrimary: true,
      verificationStatus: "unverified",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "",
      source: "seed",
      isMock: false,
      notes: "",
    },
    {
      contactId: "CON-002",
      patientId: "PAT-001",
      contactType: "phone",
      contactValue: "+507 6000 0000",
      isPrimary: true,
      verificationStatus: "unverified",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "",
      source: "seed",
      isMock: false,
      notes: "",
    },
  ],
  administrativeProfiles: [
    {
      profileId: "PRO-001",
      patientId: "PAT-001",
      address: "Calle Demo 123",
      emergencyContactName: "Ana Demo",
      emergencyContactPhone: "+507 6111 1111",
      preferredContactMethod: "whatsapp",
      verificationStatus: "verified",
      verifiedAt: "2026-01-03T00:00:00.000Z",
      verifiedBy: "admin",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-03T00:00:00.000Z",
      source: "seed",
      isMock: false,
      notes: "Perfil administrativo.",
    },
  ],
  treatmentInterests: [
    {
      treatmentInterestId: "TRT-001",
      patientId: "PAT-001",
      leadId: "lead-001",
      serviceSlug: "ortodoncia",
      serviceName: "Ortodoncia",
      status: "activo",
      interestSource: "crm",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "",
      source: "seed",
      isMock: false,
      notes: "",
    },
  ],
  crmFolios: [
    {
      crmFolioId: "FOL-001",
      folio: "lead-001",
      patientId: "PAT-001",
      leadId: "lead-001",
      originSheet: "Leads",
      originRow: "2",
      createdAt: "2026-01-01T00:00:00.000Z",
      source: "seed",
      isMock: false,
      notes: "",
    },
  ],
  billingProfiles: [],
  treatmentPlans: [],
  treatmentStages: [],
  clinicalOutcomes: [],
};

describe("Patient read adapter", () => {
  it("builds administrative profiles from read models without reading Leads", () => {
    const profiles = buildPatientAdministrativeProfilesFromReadModels(baseModels);

    expect(profiles).toHaveLength(1);
    expect(profiles[0].id).toBe("PAT-001");
    expect(profiles[0].email).toBe("carlos@example.com");
    expect(profiles[0].phone).toBe("+507 6000 0000");
    expect(profiles[0].treatmentInterest).toBe("Ortodoncia");
    expect(profiles[0].sourceLeadIds).toEqual(["lead-001"]);
    expect(profiles[0].administrativeStatus).toBe("verified");
    expect(profiles[0].missingFields).toEqual([]);
  });

  it("keeps administrative completeness rules when read model data is incomplete", () => {
    const profiles = buildPatientAdministrativeProfilesFromReadModels({
      ...baseModels,
      patients: [{ ...baseModels.patients[0], dateOfBirth: "" }],
      administrativeProfiles: [],
    });

    expect(profiles[0].administrativeStatus).toBe("incomplete");
    expect(profiles[0].missingFields).toContain("birthDate");
    expect(profiles[0].missingFields).toContain("address");
    expect(profiles[0].missingFields).toContain("emergencyContact");
    expect(profiles[0].missingFields).toContain("preferredContactMethod");
  });
});
