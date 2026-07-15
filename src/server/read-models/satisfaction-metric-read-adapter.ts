import type { SatisfactionMetricReadModel } from "@/server/read-models/worksheet-read-models";

export type SatisfactionMetricReadDto = {
  satisfactionMetricId: string;
  supportTicketId?: string;
  csat?: string;
  nps?: string;
  surveyResult?: string;
  recordedAt?: string;
  source: string;
  isMock: boolean;
  notes?: string;
};

function normalize(value: string | undefined | null) {
  return (value ?? "").trim();
}

function readTimestamp(metric: SatisfactionMetricReadModel) {
  const timestamp = Date.parse(metric.updatedAt || metric.recordedAt || metric.createdAt || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isUsableSatisfactionMetric(metric: SatisfactionMetricReadModel) {
  return Boolean(normalize(metric.satisfactionMetricId));
}

function toSatisfactionMetricDto(metric: SatisfactionMetricReadModel): SatisfactionMetricReadDto {
  return {
    satisfactionMetricId: normalize(metric.satisfactionMetricId),
    ...(normalize(metric.supportTicketId)
      ? { supportTicketId: normalize(metric.supportTicketId) }
      : {}),
    ...(normalize(metric.csat) ? { csat: normalize(metric.csat) } : {}),
    ...(normalize(metric.nps) ? { nps: normalize(metric.nps) } : {}),
    ...(normalize(metric.surveyResult) ? { surveyResult: normalize(metric.surveyResult) } : {}),
    ...(normalize(metric.recordedAt) ? { recordedAt: normalize(metric.recordedAt) } : {}),
    source: normalize(metric.source) || "read-model",
    isMock: metric.isMock,
    ...(normalize(metric.notes) ? { notes: normalize(metric.notes) } : {}),
  };
}

export function readSatisfactionMetrics(
  metrics: SatisfactionMetricReadModel[],
): SatisfactionMetricReadDto[] {
  return metrics
    .filter(isUsableSatisfactionMetric)
    .sort((left, right) => readTimestamp(right) - readTimestamp(left))
    .map(toSatisfactionMetricDto);
}
