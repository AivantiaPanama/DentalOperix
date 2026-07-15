import type { PatientAdministrativeProfile } from "@/lib/patients/admin-profile";
import { getReadModelSource } from "@/server/read-models/read-model-source-provider";
import {
  normalizePatientReadPhone,
  normalizePatientReadSearchValue,
  toPatientAdministrativeProfileDTO,
  toPatientDetailDTO,
  toPatientSearchResultDTO,
  toPatientSummaryDTO,
} from "./patient-read-adapter";
import type {
  PatientAdministrativeProfileDTO,
  PatientDetailDTO,
  PatientReadSearchQuery,
  PatientSearchResultDTO,
  PatientSummaryDTO,
} from "./patient-read-dtos";

export class PatientReadServiceNotFoundError extends Error {}

export type PatientReadService = Readonly<{
  listPatients(consumerName?: string): Promise<PatientSummaryDTO[]>;
  listAdministrativeProfiles(consumerName?: string): Promise<PatientAdministrativeProfileDTO[]>;
  getPatientById(patientId: string, consumerName?: string): Promise<PatientDetailDTO>;
  searchPatients(
    query: PatientReadSearchQuery,
    consumerName?: string,
  ): Promise<PatientSearchResultDTO[]>;
  getAdministrativeProfile(
    patientId: string,
    consumerName?: string,
  ): Promise<PatientAdministrativeProfileDTO>;
}>;

function includesNormalized(value: string | undefined, query: string | undefined): boolean {
  const normalizedQuery = normalizePatientReadSearchValue(query);
  if (!normalizedQuery) return true;
  return normalizePatientReadSearchValue(value).includes(normalizedQuery);
}

function matchesPhone(value: string | undefined, query: string | undefined): boolean {
  const normalizedQuery = normalizePatientReadPhone(query);
  if (!normalizedQuery) return true;
  return normalizePatientReadPhone(value).includes(normalizedQuery);
}

function matchesPatient(
  patient: PatientAdministrativeProfile,
  query: PatientReadSearchQuery,
): boolean {
  if (query.excludePatientId && patient.id === query.excludePatientId) return false;

  const name = query.normalizedName ?? query.name;
  const identifierValue = query.identifierValue;

  return (
    includesNormalized(patient.displayName, name) &&
    includesNormalized(patient.email, query.email) &&
    matchesPhone(patient.phone, query.phone) &&
    includesNormalized(patient.id, identifierValue)
  );
}

async function loadPatients(consumerName: string): Promise<PatientAdministrativeProfile[]> {
  const source = await getReadModelSource({ consumerName });
  return source.patients;
}

export function createPatientReadService(): PatientReadService {
  return Object.freeze({
    async listPatients(consumerName = "Patient Read Service List") {
      const patients = await loadPatients(consumerName);
      return patients.map(toPatientSummaryDTO);
    },

    async listAdministrativeProfiles(
      consumerName = "Patient Read Service Administrative Profile List",
    ) {
      const patients = await loadPatients(consumerName);
      return patients.map(toPatientAdministrativeProfileDTO);
    },

    async getPatientById(patientId: string, consumerName = "Patient Read Service Detail") {
      const patients = await loadPatients(consumerName);
      const patient = patients.find((candidate) => candidate.id === patientId);
      if (!patient)
        throw new PatientReadServiceNotFoundError(`Paciente ${patientId} no encontrado.`);
      return toPatientDetailDTO(patient);
    },

    async searchPatients(
      query: PatientReadSearchQuery,
      consumerName = "Patient Read Service Search",
    ) {
      const patients = await loadPatients(consumerName);
      return patients
        .filter((patient) => matchesPatient(patient, query))
        .map(toPatientSearchResultDTO);
    },

    async getAdministrativeProfile(
      patientId: string,
      consumerName = "Patient Read Service Administrative Profile",
    ) {
      const patients = await loadPatients(consumerName);
      const patient = patients.find((candidate) => candidate.id === patientId);
      if (!patient)
        throw new PatientReadServiceNotFoundError(`Paciente ${patientId} no encontrado.`);
      return toPatientAdministrativeProfileDTO(patient);
    },
  });
}
