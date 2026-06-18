import type { PatientBillingProfileReadModel } from "@/server/read-models/worksheet-read-models";

export type PatientBillingProfileReadDto = {
  billingProfileId: string;
  patientId: string;
  billingType: string;
  taxIdType: string;
  taxIdValue: string;
  ruc: string;
  dv: string;
  legalName: string;
  fiscalAddress: string;
  billingEmail: string;
  billingPhone: string;
  country: string;
  billingStatus: string;
  source: string;
  isMock: boolean;
  notes: string;
};

function normalizeValue(value: string | undefined | null) {
  return (value ?? "").trim();
}

function readTimestamp(profile: PatientBillingProfileReadModel) {
  const timestamp = Date.parse(profile.updatedAt || profile.createdAt || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isProfileUsable(profile: PatientBillingProfileReadModel) {
  return Boolean(
    normalizeValue(profile.taxIdValue) ||
      normalizeValue(profile.ruc) ||
      normalizeValue(profile.legalName) ||
      normalizeValue(profile.fiscalAddress),
  );
}

function toBillingProfileDto(profile: PatientBillingProfileReadModel): PatientBillingProfileReadDto {
  return {
    billingProfileId: normalizeValue(profile.billingProfileId),
    patientId: normalizeValue(profile.patientId),
    billingType: normalizeValue(profile.billingType),
    taxIdType: normalizeValue(profile.taxIdType),
    taxIdValue: normalizeValue(profile.taxIdValue),
    ruc: normalizeValue(profile.ruc),
    dv: normalizeValue(profile.dv),
    legalName: normalizeValue(profile.legalName),
    fiscalAddress: normalizeValue(profile.fiscalAddress),
    billingEmail: normalizeValue(profile.billingEmail),
    billingPhone: normalizeValue(profile.billingPhone),
    country: normalizeValue(profile.country),
    billingStatus: normalizeValue(profile.billingStatus),
    source: normalizeValue(profile.source) || "read-model",
    isMock: profile.isMock,
    notes: normalizeValue(profile.notes),
  };
}

export function readBillingProfilesForPatient(
  patientId: string,
  billingProfiles: PatientBillingProfileReadModel[],
): PatientBillingProfileReadDto[] {
  return billingProfiles
    .filter((profile) => normalizeValue(profile.patientId) === patientId && isProfileUsable(profile))
    .sort((left, right) => readTimestamp(right) - readTimestamp(left))
    .map(toBillingProfileDto);
}
