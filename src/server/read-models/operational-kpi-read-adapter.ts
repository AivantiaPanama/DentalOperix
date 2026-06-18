import type { OperationalKpiReadModel } from "@/server/read-models/worksheet-read-models";

export type OperationalKpiReadDto = {
  operationalKpiId: string;
  metricName: string;
  metricValue: string;
  metricUnit?: string;
  periodStart?: string;
  periodEnd?: string;
  domain: string;
  source: string;
  isMock: boolean;
  notes?: string;
};

function normalize(value: string | undefined | null) {
  return (value ?? "").trim();
}

function readTimestamp(kpi: OperationalKpiReadModel) {
  const timestamp = Date.parse(kpi.updatedAt || kpi.periodEnd || kpi.createdAt || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isUsableKpi(kpi: OperationalKpiReadModel) {
  return Boolean(normalize(kpi.operationalKpiId) && normalize(kpi.metricName));
}

function toOperationalKpiDto(kpi: OperationalKpiReadModel): OperationalKpiReadDto {
  return {
    operationalKpiId: normalize(kpi.operationalKpiId),
    metricName: normalize(kpi.metricName),
    metricValue: normalize(kpi.metricValue),
    ...(normalize(kpi.metricUnit) ? { metricUnit: normalize(kpi.metricUnit) } : {}),
    ...(normalize(kpi.periodStart) ? { periodStart: normalize(kpi.periodStart) } : {}),
    ...(normalize(kpi.periodEnd) ? { periodEnd: normalize(kpi.periodEnd) } : {}),
    domain: normalize(kpi.domain) || "Operations",
    source: normalize(kpi.source) || "read-model",
    isMock: kpi.isMock,
    ...(normalize(kpi.notes) ? { notes: normalize(kpi.notes) } : {}),
  };
}

export function readOperationalKpis(operationalKpis: OperationalKpiReadModel[]): OperationalKpiReadDto[] {
  return operationalKpis
    .filter(isUsableKpi)
    .sort((left, right) => readTimestamp(right) - readTimestamp(left))
    .map(toOperationalKpiDto);
}
