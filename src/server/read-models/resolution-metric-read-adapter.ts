import type { ResolutionMetricReadModel } from "@/server/read-models/worksheet-read-models";

export type ResolutionMetricReadDto = {
  resolutionMetricId: string;
  supportTicketId?: string;
  firstResponseTimeMinutes?: string;
  resolutionTimeMinutes?: string;
  escalationRate?: string;
  periodStart?: string;
  periodEnd?: string;
  source: string;
  isMock: boolean;
  notes?: string;
};

function normalize(value: string | undefined | null) {
  return (value ?? "").trim();
}

function readTimestamp(metric: ResolutionMetricReadModel) {
  const timestamp = Date.parse(metric.updatedAt || metric.createdAt || metric.periodEnd || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isUsableResolutionMetric(metric: ResolutionMetricReadModel) {
  return Boolean(normalize(metric.resolutionMetricId));
}

function toResolutionMetricDto(metric: ResolutionMetricReadModel): ResolutionMetricReadDto {
  return {
    resolutionMetricId: normalize(metric.resolutionMetricId),
    ...(normalize(metric.supportTicketId) ? { supportTicketId: normalize(metric.supportTicketId) } : {}),
    ...(normalize(metric.firstResponseTimeMinutes) ? { firstResponseTimeMinutes: normalize(metric.firstResponseTimeMinutes) } : {}),
    ...(normalize(metric.resolutionTimeMinutes) ? { resolutionTimeMinutes: normalize(metric.resolutionTimeMinutes) } : {}),
    ...(normalize(metric.escalationRate) ? { escalationRate: normalize(metric.escalationRate) } : {}),
    ...(normalize(metric.periodStart) ? { periodStart: normalize(metric.periodStart) } : {}),
    ...(normalize(metric.periodEnd) ? { periodEnd: normalize(metric.periodEnd) } : {}),
    source: normalize(metric.source) || "read-model",
    isMock: metric.isMock,
    ...(normalize(metric.notes) ? { notes: normalize(metric.notes) } : {}),
  };
}

export function readResolutionMetrics(metrics: ResolutionMetricReadModel[]): ResolutionMetricReadDto[] {
  return metrics
    .filter(isUsableResolutionMetric)
    .sort((left, right) => readTimestamp(right) - readTimestamp(left))
    .map(toResolutionMetricDto);
}
