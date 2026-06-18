import type { PatientAdministrativeProfileReadModel } from "./worksheet-read-models";

function normalizeValue(value: string | undefined | null) {
  return (value ?? "").trim();
}

function parseTime(value: string | undefined | null) {
  const time = Date.parse(normalizeValue(value));
  return Number.isNaN(time) ? 0 : time;
}

function getCompletenessScore(profile: PatientAdministrativeProfileReadModel) {
  return [
    profile.address,
    profile.emergencyContactName,
    profile.emergencyContactPhone,
    profile.preferredContactMethod,
    profile.verificationStatus,
    profile.verifiedAt,
    profile.verifiedBy,
  ].filter((value) => normalizeValue(value).length > 0).length;
}

function isVerified(profile: PatientAdministrativeProfileReadModel) {
  const status = normalizeValue(profile.verificationStatus).toLowerCase();
  return status === "verified" || status === "verificado";
}

function compareAdministrativeProfiles(
  left: PatientAdministrativeProfileReadModel,
  right: PatientAdministrativeProfileReadModel,
) {
  const verifiedDelta = Number(isVerified(right)) - Number(isVerified(left));
  if (verifiedDelta !== 0) return verifiedDelta;

  const updatedDelta = parseTime(right.updatedAt) - parseTime(left.updatedAt);
  if (updatedDelta !== 0) return updatedDelta;

  const completenessDelta = getCompletenessScore(right) - getCompletenessScore(left);
  if (completenessDelta !== 0) return completenessDelta;

  return normalizeValue(right.profileId).localeCompare(normalizeValue(left.profileId), "es");
}

export type PatientResolvedAdministrativeProfile = {
  patientId: string;
  profileId?: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContact: string;
  preferredContactMethod: string;
  verificationStatus: string;
  verifiedAt?: string;
  verifiedBy?: string;
  updatedAt?: string;
  notes: string;
  hasExplicitAdministrativeProfile: boolean;
  isVerified: boolean;
};

export function resolvePatientAdministrativeProfile(
  patientId: string,
  profiles: PatientAdministrativeProfileReadModel[],
): PatientResolvedAdministrativeProfile {
  const profile = profiles
    .filter((candidate) => normalizeValue(candidate.patientId) === patientId)
    .sort(compareAdministrativeProfiles)[0];

  if (!profile) {
    return {
      patientId,
      address: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContact: "",
      preferredContactMethod: "",
      verificationStatus: "",
      notes: "",
      hasExplicitAdministrativeProfile: false,
      isVerified: false,
    };
  }

  const emergencyContactName = normalizeValue(profile.emergencyContactName);
  const emergencyContactPhone = normalizeValue(profile.emergencyContactPhone);

  return {
    patientId,
    profileId: normalizeValue(profile.profileId) || undefined,
    address: normalizeValue(profile.address),
    emergencyContactName,
    emergencyContactPhone,
    emergencyContact: [emergencyContactName, emergencyContactPhone].filter(Boolean).join(" · "),
    preferredContactMethod: normalizeValue(profile.preferredContactMethod),
    verificationStatus: normalizeValue(profile.verificationStatus),
    verifiedAt: normalizeValue(profile.verifiedAt) || undefined,
    verifiedBy: normalizeValue(profile.verifiedBy) || undefined,
    updatedAt: normalizeValue(profile.updatedAt) || undefined,
    notes: normalizeValue(profile.notes),
    hasExplicitAdministrativeProfile: true,
    isVerified: isVerified(profile),
  };
}
