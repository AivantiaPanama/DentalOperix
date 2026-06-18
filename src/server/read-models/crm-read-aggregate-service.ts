import { readCrmFoliosForPatient, type CrmFolioReadDto } from "@/server/read-models/crm-folio-read-adapter";
import { readTreatmentInterestsForPatient, type TreatmentInterestReadDto } from "@/server/read-models/treatment-interest-read-adapter";
import type { WorksheetReadModels } from "@/server/read-models/worksheet-read-models";

export type CrmReadAggregate = {
  patientId: string;
  treatmentInterests: TreatmentInterestReadDto[];
  crmFolios: CrmFolioReadDto[];
};

export type CrmReadAggregateDiagnostics = {
  totalPatients: number;
  totalTreatmentInterests: number;
  totalCrmFolios: number;
  patientsWithTreatmentInterests: number;
  patientsWithCrmFolios: number;
  orphanTreatmentInterests: number;
  orphanCrmFolios: number;
};

export type CrmReadAggregateResult = {
  crmAggregates: CrmReadAggregate[];
  diagnostics: CrmReadAggregateDiagnostics;
};

function getPatientIds(models: WorksheetReadModels) {
  return new Set(models.patients.map((patient) => patient.patientId).filter(Boolean));
}

export function buildCrmReadAggregatesFromReadModels(models: WorksheetReadModels): CrmReadAggregateResult {
  const patientIds = getPatientIds(models);
  const crmAggregates = [...patientIds].map((patientId) => ({
    patientId,
    treatmentInterests: readTreatmentInterestsForPatient(patientId, models.treatmentInterests),
    crmFolios: readCrmFoliosForPatient(patientId, models.crmFolios),
  }));

  return {
    crmAggregates,
    diagnostics: {
      totalPatients: patientIds.size,
      totalTreatmentInterests: models.treatmentInterests.length,
      totalCrmFolios: models.crmFolios.length,
      patientsWithTreatmentInterests: crmAggregates.filter((aggregate) => aggregate.treatmentInterests.length > 0).length,
      patientsWithCrmFolios: crmAggregates.filter((aggregate) => aggregate.crmFolios.length > 0).length,
      orphanTreatmentInterests: models.treatmentInterests.filter((interest) => !patientIds.has(interest.patientId)).length,
      orphanCrmFolios: models.crmFolios.filter((folio) => !patientIds.has(folio.patientId)).length,
    },
  };
}
