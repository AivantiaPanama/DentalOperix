import type { PatientAdministrativeProfile } from "@/lib/patients/admin-profile";
import { buildPatientAdministrativeProfilesFromReadModels } from "@/server/read-models/patient-read-adapter";
import {
  findDuplicateResolvedIdentities,
  resolvePatientIdentity,
  type PatientIdentityDocumentType,
  type PatientResolvedIdentity,
} from "@/server/read-models/patient-identifier-read-adapter";
import {
  resolvePatientContacts,
  type PatientResolvedContact,
} from "@/server/read-models/patient-contact-read-adapter";
import {
  resolvePatientAdministrativeProfile,
  type PatientResolvedAdministrativeProfile,
} from "@/server/read-models/patient-administrative-profile-read-adapter";
import type { WorksheetReadModels } from "@/server/read-models/worksheet-read-models";

export class PatientAggregateNotFoundError extends Error {}

export { resolvePatientIdentity };
export type {
  PatientIdentityDocumentType,
  PatientResolvedIdentity,
  PatientResolvedContact,
  PatientResolvedAdministrativeProfile,
};

export type PatientAggregate = PatientAdministrativeProfile & {
  resolvedIdentity: PatientResolvedIdentity;
  resolvedContact: PatientResolvedContact;
  resolvedAdministrativeProfile: PatientResolvedAdministrativeProfile;
};

export type PatientAggregateReadDiagnostics = {
  totalPatients: number;
  totalIdentifiers: number;
  totalContacts: number;
  patientsWithExplicitIdentity: number;
  patientsWithTemporaryIdentity: number;
  patientsWithExplicitEmail: number;
  patientsWithExplicitPhone: number;
  patientsWithExplicitAdministrativeProfile: number;
  verifiedAdministrativeProfiles: number;
  duplicateResolvedIdentities: string[];
};

export type PatientAggregateReadResult = {
  patients: PatientAggregate[];
  administrativeProfiles: PatientAdministrativeProfile[];
  diagnostics: PatientAggregateReadDiagnostics;
};

function applyResolvedContactToAdministrativeProfile(
  profile: PatientAdministrativeProfile,
  resolvedContact: PatientResolvedContact,
): PatientAdministrativeProfile {
  return {
    ...profile,
    ...(resolvedContact.email ? { email: resolvedContact.email } : {}),
    ...(resolvedContact.phone ? { phone: resolvedContact.phone } : {}),
  };
}

export function buildPatientAggregatesFromReadModels(
  models: WorksheetReadModels,
): PatientAggregateReadResult {
  const profiles = buildPatientAdministrativeProfilesFromReadModels(models);
  const patients = profiles.map((profile) => {
    const resolvedContact = resolvePatientContacts(profile.id, models.contacts);
    const resolvedAdministrativeProfile = resolvePatientAdministrativeProfile(
      profile.id,
      models.administrativeProfiles,
    );
    return {
      ...applyResolvedContactToAdministrativeProfile(profile, resolvedContact),
      resolvedIdentity: resolvePatientIdentity(profile.id, models.identifiers),
      resolvedContact,
      resolvedAdministrativeProfile,
    };
  });
  const identities = patients.map((patient) => patient.resolvedIdentity);

  return {
    patients,
    administrativeProfiles: models.contacts.length
      ? patients.map(({ resolvedIdentity, resolvedContact, resolvedAdministrativeProfile, ...profile }) => profile)
      : profiles,
    diagnostics: {
      totalPatients: patients.length,
      totalIdentifiers: models.identifiers.length,
      totalContacts: models.contacts.length,
      patientsWithExplicitIdentity: identities.filter((identity) => !identity.isTemporary).length,
      patientsWithTemporaryIdentity: identities.filter((identity) => identity.isTemporary).length,
      patientsWithExplicitEmail: patients.filter((patient) => patient.resolvedContact.hasExplicitEmail).length,
      patientsWithExplicitPhone: patients.filter((patient) => patient.resolvedContact.hasExplicitPhone).length,
      patientsWithExplicitAdministrativeProfile: patients.filter(
        (patient) => patient.resolvedAdministrativeProfile.hasExplicitAdministrativeProfile,
      ).length,
      verifiedAdministrativeProfiles: patients.filter(
        (patient) => patient.resolvedAdministrativeProfile.isVerified,
      ).length,
      duplicateResolvedIdentities: findDuplicateResolvedIdentities(identities),
    },
  };
}

export function getPatientAggregateFromReadModels(
  models: WorksheetReadModels,
  patientId: string,
): PatientAggregate {
  const result = buildPatientAggregatesFromReadModels(models);
  const patient = result.patients.find((candidate) => candidate.id === patientId);
  if (!patient) throw new PatientAggregateNotFoundError(`Paciente ${patientId} no encontrado.`);
  return patient;
}
