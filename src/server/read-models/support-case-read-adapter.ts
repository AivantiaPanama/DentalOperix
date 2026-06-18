import type { SupportCaseReadModel } from "@/server/read-models/worksheet-read-models";

export type SupportCaseReadDto = {
  supportCaseId: string;
  patientId?: string;
  caseStatus: string;
  casePriority?: string;
  caseCategory?: string;
  openedAt?: string;
  closedAt?: string;
  source: string;
  isMock: boolean;
  notes?: string;
};

function normalize(value: string | undefined | null) {
  return (value ?? "").trim();
}

function readTimestamp(supportCase: SupportCaseReadModel) {
  const timestamp = Date.parse(supportCase.updatedAt || supportCase.openedAt || supportCase.createdAt || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isUsableSupportCase(supportCase: SupportCaseReadModel) {
  return Boolean(normalize(supportCase.supportCaseId));
}

function toSupportCaseDto(supportCase: SupportCaseReadModel): SupportCaseReadDto {
  return {
    supportCaseId: normalize(supportCase.supportCaseId),
    ...(normalize(supportCase.patientId) ? { patientId: normalize(supportCase.patientId) } : {}),
    caseStatus: normalize(supportCase.caseStatus),
    ...(normalize(supportCase.casePriority) ? { casePriority: normalize(supportCase.casePriority) } : {}),
    ...(normalize(supportCase.caseCategory) ? { caseCategory: normalize(supportCase.caseCategory) } : {}),
    ...(normalize(supportCase.openedAt) ? { openedAt: normalize(supportCase.openedAt) } : {}),
    ...(normalize(supportCase.closedAt) ? { closedAt: normalize(supportCase.closedAt) } : {}),
    source: normalize(supportCase.source) || "read-model",
    isMock: supportCase.isMock,
    ...(normalize(supportCase.notes) ? { notes: normalize(supportCase.notes) } : {}),
  };
}

export function readSupportCases(supportCases: SupportCaseReadModel[]): SupportCaseReadDto[] {
  return supportCases
    .filter(isUsableSupportCase)
    .sort((left, right) => readTimestamp(right) - readTimestamp(left))
    .map(toSupportCaseDto);
}
