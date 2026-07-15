import type { CrmFolioReadModel } from "@/server/read-models/worksheet-read-models";

export type CrmFolioReadDto = {
  crmFolioId: string;
  folio: string;
  patientId: string;
  leadId?: string;
  originSheet?: string;
  originRow?: string;
  createdAt?: string;
  source: string;
  isMock: boolean;
  notes?: string;
};

function normalize(value: string | undefined) {
  return (value ?? "").trim();
}

function compareByCreatedAtDesc(a: CrmFolioReadDto, b: CrmFolioReadDto) {
  return normalize(b.createdAt).localeCompare(normalize(a.createdAt));
}

export function readCrmFoliosForPatient(
  patientId: string,
  folios: CrmFolioReadModel[],
): CrmFolioReadDto[] {
  return folios
    .filter((folio) => normalize(folio.patientId) === patientId)
    .map((folio) => ({
      crmFolioId: folio.crmFolioId,
      folio: folio.folio,
      patientId: folio.patientId,
      ...(folio.leadId ? { leadId: folio.leadId } : {}),
      ...(folio.originSheet ? { originSheet: folio.originSheet } : {}),
      ...(folio.originRow ? { originRow: folio.originRow } : {}),
      ...(folio.createdAt ? { createdAt: folio.createdAt } : {}),
      source: folio.source,
      isMock: folio.isMock,
      ...(folio.notes ? { notes: folio.notes } : {}),
    }))
    .sort(compareByCreatedAtDesc);
}
