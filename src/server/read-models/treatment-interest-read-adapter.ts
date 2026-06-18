import type { TreatmentInterestReadModel } from "@/server/read-models/worksheet-read-models";

export type TreatmentInterestReadDto = {
  treatmentInterestId: string;
  patientId: string;
  leadId?: string;
  serviceSlug: string;
  serviceName: string;
  status: string;
  interestSource?: string;
  createdAt?: string;
  updatedAt?: string;
  source: string;
  isMock: boolean;
  notes?: string;
};

function normalize(value: string | undefined) {
  return (value ?? "").trim();
}

function compareByUpdatedAtDesc(a: TreatmentInterestReadDto, b: TreatmentInterestReadDto) {
  return normalize(b.updatedAt || b.createdAt).localeCompare(normalize(a.updatedAt || a.createdAt));
}

export function readTreatmentInterestsForPatient(patientId: string, interests: TreatmentInterestReadModel[]): TreatmentInterestReadDto[] {
  return interests
    .filter((interest) => normalize(interest.patientId) === patientId)
    .map((interest) => ({
      treatmentInterestId: interest.treatmentInterestId,
      patientId: interest.patientId,
      ...(interest.leadId ? { leadId: interest.leadId } : {}),
      serviceSlug: interest.serviceSlug,
      serviceName: interest.serviceName,
      status: interest.status,
      ...(interest.interestSource ? { interestSource: interest.interestSource } : {}),
      ...(interest.createdAt ? { createdAt: interest.createdAt } : {}),
      ...(interest.updatedAt ? { updatedAt: interest.updatedAt } : {}),
      source: interest.source,
      isMock: interest.isMock,
      ...(interest.notes ? { notes: interest.notes } : {}),
    }))
    .sort(compareByUpdatedAtDesc);
}
