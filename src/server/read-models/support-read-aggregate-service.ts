import {
  readResolutionMetrics,
  type ResolutionMetricReadDto,
} from "@/server/read-models/resolution-metric-read-adapter";
import {
  readSatisfactionMetrics,
  type SatisfactionMetricReadDto,
} from "@/server/read-models/satisfaction-metric-read-adapter";
import {
  readSupportCases,
  type SupportCaseReadDto,
} from "@/server/read-models/support-case-read-adapter";
import {
  readSupportTickets,
  type SupportTicketReadDto,
} from "@/server/read-models/support-ticket-read-adapter";
import type { WorksheetReadModels } from "@/server/read-models/worksheet-read-models";

export type SupportReadAggregate = {
  supportCases: SupportCaseReadDto[];
  supportTickets: SupportTicketReadDto[];
  resolutionMetrics: ResolutionMetricReadDto[];
  satisfactionMetrics: SatisfactionMetricReadDto[];
};

export type SupportReadAggregateDiagnostics = {
  totalSupportCases: number;
  totalSupportTickets: number;
  totalResolutionMetrics: number;
  totalSatisfactionMetrics: number;
  usableSupportCases: number;
  usableSupportTickets: number;
  usableResolutionMetrics: number;
  usableSatisfactionMetrics: number;
  incompleteSupportCases: number;
  incompleteSupportTickets: number;
  incompleteResolutionMetrics: number;
  incompleteSatisfactionMetrics: number;
};

export type SupportReadAggregateResult = {
  supportAggregate: SupportReadAggregate;
  diagnostics: SupportReadAggregateDiagnostics;
};

function normalize(value: string | undefined | null) {
  return (value ?? "").trim();
}

export function buildSupportReadAggregateFromReadModels(
  models: WorksheetReadModels,
): SupportReadAggregateResult {
  const supportCases = models.supportCases ?? [];
  const supportTickets = models.supportTickets ?? [];
  const resolutionMetrics = models.resolutionMetrics ?? [];
  const satisfactionMetrics = models.satisfactionMetrics ?? [];

  const usableSupportCases = readSupportCases(supportCases);
  const usableSupportTickets = readSupportTickets(supportTickets);
  const usableResolutionMetrics = readResolutionMetrics(resolutionMetrics);
  const usableSatisfactionMetrics = readSatisfactionMetrics(satisfactionMetrics);

  return {
    supportAggregate: {
      supportCases: usableSupportCases,
      supportTickets: usableSupportTickets,
      resolutionMetrics: usableResolutionMetrics,
      satisfactionMetrics: usableSatisfactionMetrics,
    },
    diagnostics: {
      totalSupportCases: supportCases.length,
      totalSupportTickets: supportTickets.length,
      totalResolutionMetrics: resolutionMetrics.length,
      totalSatisfactionMetrics: satisfactionMetrics.length,
      usableSupportCases: usableSupportCases.length,
      usableSupportTickets: usableSupportTickets.length,
      usableResolutionMetrics: usableResolutionMetrics.length,
      usableSatisfactionMetrics: usableSatisfactionMetrics.length,
      incompleteSupportCases: supportCases.filter(
        (supportCase) => !normalize(supportCase.supportCaseId),
      ).length,
      incompleteSupportTickets: supportTickets.filter(
        (supportTicket) => !normalize(supportTicket.supportTicketId),
      ).length,
      incompleteResolutionMetrics: resolutionMetrics.filter(
        (metric) => !normalize(metric.resolutionMetricId),
      ).length,
      incompleteSatisfactionMetrics: satisfactionMetrics.filter(
        (metric) => !normalize(metric.satisfactionMetricId),
      ).length,
    },
  };
}
