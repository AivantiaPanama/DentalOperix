import { describe, expect, it } from "vitest";
import {
  buildPatientAggregatesFromReadModels,
  getPatientAggregateFromReadModels,
  PatientAggregateNotFoundError,
  resolvePatientIdentity,
} from "./patient-aggregate-read-service";
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
      identityStatus: "verified",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
      source: "seed",
      isMock: false,
      notes: "Paciente seed.",
    },
    {
      patientId: "PAT-002",
      displayName: "Ana Demo",
      firstName: "Ana",
      lastName: "Demo",
      dateOfBirth: "1990-05-10",
      administrativeStatus: "pending-verification",
      identityStatus: "temporary",
      createdAt: "2026-01-04T00:00:00.000Z",
      updatedAt: "2026-01-04T00:00:00.000Z",
      source: "seed",
      isMock: false,
      notes: "Paciente temporal.",
    },
  ],
  identifiers: [
    {
      identifierId: "ID-PASSPORT-001",
      patientId: "PAT-001",
      identifierType: "PASSPORT",
      identifierValue: "PA-123456",
      country: "PA",
      isPrimary: true,
      verificationStatus: "verified",
      issuedAt: "",
      expiresAt: "",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      source: "seed",
      isMock: false,
      notes: "",
    },
    {
      identifierId: "ID-CID-001",
      patientId: "PAT-001",
      identifierType: "CID",
      identifierValue: "8-888-888",
      country: "PA",
      isPrimary: false,
      verificationStatus: "verified",
      issuedAt: "",
      expiresAt: "",
      createdAt: "2026-01-02T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
      source: "seed",
      isMock: false,
      notes: "",
    },
  ],
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
  treatmentInterests: [],
  crmFolios: [],
  billingProfiles: [],
  treatmentPlans: [],
  treatmentStages: [],
  clinicalOutcomes: [],
};

describe("patient aggregate read service", () => {
  it("resolves identity by the required CID > Passport > Foreign ID > TMP-PAT priority", () => {
    const identity = resolvePatientIdentity("PAT-001", baseModels.identifiers);

    expect(identity.documentType).toBe("CID");
    expect(identity.documentValue).toBe("8-888-888");
    expect(identity.sourceIdentifierId).toBe("ID-CID-001");
    expect(identity.isTemporary).toBe(false);
  });

  it("creates temporary TMP-PAT identity when no explicit document exists", () => {
    const identity = resolvePatientIdentity("PAT-002", baseModels.identifiers);

    expect(identity.documentType).toBe("TMP-PAT");
    expect(identity.documentValue).toBe("TMP-PAT-PAT-002");
    expect(identity.isTemporary).toBe(true);
  });

  it("builds patient aggregates without changing the administrative profile contract", () => {
    const result = buildPatientAggregatesFromReadModels(baseModels);

    expect(result.patients).toHaveLength(2);
    expect(result.patients[0].id).toBe("PAT-002");
    expect(result.patients[1].id).toBe("PAT-001");
    expect(result.patients[1].email).toBe("carlos@example.com");
    expect(result.patients[1].phone).toBe("+507 6000 0000");
    expect(result.patients[1].resolvedIdentity.documentType).toBe("CID");
    expect(result.patients[1].resolvedContact).toMatchObject({
      email: "carlos@example.com",
      phone: "+507 6000 0000",
      hasExplicitEmail: true,
      hasExplicitPhone: true,
    });
    expect(result.patients[1].resolvedAdministrativeProfile).toMatchObject({
      profileId: "PRO-001",
      address: "Calle Demo 123",
      emergencyContact: "Ana Demo · +507 6111 1111",
      preferredContactMethod: "whatsapp",
      hasExplicitAdministrativeProfile: true,
      isVerified: true,
    });
    expect(result.diagnostics).toEqual({
      totalPatients: 2,
      totalIdentifiers: 2,
      totalContacts: 2,
      patientsWithExplicitIdentity: 1,
      patientsWithTemporaryIdentity: 1,
      patientsWithExplicitEmail: 1,
      patientsWithExplicitPhone: 1,
      patientsWithExplicitAdministrativeProfile: 1,
      verifiedAdministrativeProfiles: 1,
      duplicateResolvedIdentities: [],
    });
  });

  it("gets a single aggregate by patient id", () => {
    const patient = getPatientAggregateFromReadModels(baseModels, "PAT-001");

    expect(patient.displayName).toBe("Carlos Pareja");
    expect(patient.resolvedIdentity.documentValue).toBe("8-888-888");
  });

  it("ignores incomplete identifiers and keeps TMP-PAT fallback deterministic", () => {
    const identity = resolvePatientIdentity("PAT-002", [
      {
        identifierId: "ID-INCOMPLETE-001",
        patientId: "PAT-002",
        identifierType: "CID",
        identifierValue: "",
        country: "PA",
        isPrimary: true,
        verificationStatus: "unverified",
        issuedAt: "",
        expiresAt: "",
        createdAt: "2026-01-05T00:00:00.000Z",
        updatedAt: "2026-01-05T00:00:00.000Z",
        source: "seed",
        isMock: false,
        notes: "",
      },
      {
        identifierId: "ID-UNKNOWN-001",
        patientId: "PAT-002",
        identifierType: "RUC",
        identifierValue: "123456",
        country: "PA",
        isPrimary: true,
        verificationStatus: "unverified",
        issuedAt: "",
        expiresAt: "",
        createdAt: "2026-01-05T00:00:00.000Z",
        updatedAt: "2026-01-05T00:00:00.000Z",
        source: "seed",
        isMock: false,
        notes: "",
      },
    ]);

    expect(identity).toEqual({
      patientId: "PAT-002",
      documentType: "TMP-PAT",
      documentValue: "TMP-PAT-PAT-002",
      priority: 4,
      isTemporary: true,
    });
  });

  it("reports duplicate explicit resolved identities without changing the public profiles", () => {
    const result = buildPatientAggregatesFromReadModels({
      ...baseModels,
      identifiers: [
        ...baseModels.identifiers,
        {
          identifierId: "ID-CID-002",
          patientId: "PAT-002",
          identifierType: "CID",
          identifierValue: "8-888-888",
          country: "PA",
          isPrimary: true,
          verificationStatus: "verified",
          issuedAt: "",
          expiresAt: "",
          createdAt: "2026-01-06T00:00:00.000Z",
          updatedAt: "2026-01-06T00:00:00.000Z",
          source: "seed",
          isMock: false,
          notes: "",
        },
      ],
    });

    expect(result.diagnostics.duplicateResolvedIdentities).toEqual(["CID:8-888-888"]);
    expect(result.administrativeProfiles).toHaveLength(result.patients.length);
    expect(JSON.stringify(result.administrativeProfiles)).not.toContain("resolvedIdentity");
    expect(JSON.stringify(result.administrativeProfiles)).not.toContain("resolvedContact");
    expect(JSON.stringify(result.administrativeProfiles)).not.toContain(
      "resolvedAdministrativeProfile",
    );
  });

  it("keeps public administrative profiles contact-compatible while contacts remain internal diagnostics", () => {
    const result = buildPatientAggregatesFromReadModels(baseModels);

    expect(result.administrativeProfiles[1].email).toBe("carlos@example.com");
    expect(result.administrativeProfiles[1].phone).toBe("+507 6000 0000");
    expect(JSON.stringify(result.administrativeProfiles)).not.toContain("resolvedContact");
    expect(JSON.stringify(result.administrativeProfiles)).not.toContain(
      "resolvedAdministrativeProfile",
    );
  });

  it("throws a domain error when the requested aggregate does not exist", () => {
    expect(() => getPatientAggregateFromReadModels(baseModels, "PAT-404")).toThrow(
      PatientAggregateNotFoundError,
    );
  });

  it("keeps administrative profile resolution internal while preserving public profile fields", () => {
    const result = buildPatientAggregatesFromReadModels(baseModels);

    const patient = result.patients.find((candidate) => candidate.id === "PAT-001");
    const publicProfile = result.administrativeProfiles.find(
      (candidate) => candidate.id === "PAT-001",
    );

    expect(patient?.resolvedAdministrativeProfile.hasExplicitAdministrativeProfile).toBe(true);
    expect(patient?.resolvedAdministrativeProfile.isVerified).toBe(true);
    expect(publicProfile?.address).toBe("Calle Demo 123");
    expect(publicProfile?.emergencyContact).toBe("Ana Demo · +507 6111 1111");
    expect(JSON.stringify(publicProfile)).not.toContain("resolvedAdministrativeProfile");
  });
});
