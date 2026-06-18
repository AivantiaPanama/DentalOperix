import { readBillingProfilesForPatient, type PatientBillingProfileReadDto } from "@/server/read-models/patient-billing-profile-read-adapter";
import type { WorksheetReadModels } from "@/server/read-models/worksheet-read-models";

export type BillingReadAggregate = {
  patientId: string;
  billingProfiles: PatientBillingProfileReadDto[];
};

export type BillingReadAggregateDiagnostics = {
  totalPatients: number;
  totalBillingProfiles: number;
  patientsWithBillingProfiles: number;
  orphanBillingProfiles: number;
  incompleteBillingProfiles: number;
};

export type BillingReadAggregateResult = {
  billingAggregates: BillingReadAggregate[];
  diagnostics: BillingReadAggregateDiagnostics;
};

function normalizeValue(value: string | undefined | null) {
  return (value ?? "").trim();
}

function getPatientIds(models: WorksheetReadModels) {
  return new Set(models.patients.map((patient) => patient.patientId).filter(Boolean));
}

function hasFiscalIdentity(profile: { taxIdValue: string; ruc: string; legalName: string; fiscalAddress: string }) {
  return Boolean(
    normalizeValue(profile.taxIdValue) ||
      normalizeValue(profile.ruc) ||
      normalizeValue(profile.legalName) ||
      normalizeValue(profile.fiscalAddress),
  );
}

export function buildBillingReadAggregatesFromReadModels(models: WorksheetReadModels): BillingReadAggregateResult {
  const patientIds = getPatientIds(models);
  const billingProfiles = models.billingProfiles ?? [];
  const billingAggregates = [...patientIds].map((patientId) => ({
    patientId,
    billingProfiles: readBillingProfilesForPatient(patientId, billingProfiles),
  }));

  return {
    billingAggregates,
    diagnostics: {
      totalPatients: patientIds.size,
      totalBillingProfiles: billingProfiles.length,
      patientsWithBillingProfiles: billingAggregates.filter((aggregate) => aggregate.billingProfiles.length > 0).length,
      orphanBillingProfiles: billingProfiles.filter((profile) => !patientIds.has(profile.patientId)).length,
      incompleteBillingProfiles: billingProfiles.filter((profile) => !hasFiscalIdentity(profile)).length,
    },
  };
}
