import type { SupportTicketReadModel } from "@/server/read-models/worksheet-read-models";

export type SupportTicketReadDto = {
  supportTicketId: string;
  supportCaseId?: string;
  patientId?: string;
  ticketStatus: string;
  ticketHistory?: string;
  openedAt?: string;
  source: string;
  isMock: boolean;
  notes?: string;
};

function normalize(value: string | undefined | null) {
  return (value ?? "").trim();
}

function readTimestamp(supportTicket: SupportTicketReadModel) {
  const timestamp = Date.parse(supportTicket.updatedAt || supportTicket.openedAt || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isUsableSupportTicket(supportTicket: SupportTicketReadModel) {
  return Boolean(normalize(supportTicket.supportTicketId));
}

function toSupportTicketDto(supportTicket: SupportTicketReadModel): SupportTicketReadDto {
  return {
    supportTicketId: normalize(supportTicket.supportTicketId),
    ...(normalize(supportTicket.supportCaseId)
      ? { supportCaseId: normalize(supportTicket.supportCaseId) }
      : {}),
    ...(normalize(supportTicket.patientId)
      ? { patientId: normalize(supportTicket.patientId) }
      : {}),
    ticketStatus: normalize(supportTicket.ticketStatus),
    ...(normalize(supportTicket.ticketHistory)
      ? { ticketHistory: normalize(supportTicket.ticketHistory) }
      : {}),
    ...(normalize(supportTicket.openedAt) ? { openedAt: normalize(supportTicket.openedAt) } : {}),
    source: normalize(supportTicket.source) || "read-model",
    isMock: supportTicket.isMock,
    ...(normalize(supportTicket.notes) ? { notes: normalize(supportTicket.notes) } : {}),
  };
}

export function readSupportTickets(
  supportTickets: SupportTicketReadModel[],
): SupportTicketReadDto[] {
  return supportTickets
    .filter(isUsableSupportTicket)
    .sort((left, right) => readTimestamp(right) - readTimestamp(left))
    .map(toSupportTicketDto);
}
