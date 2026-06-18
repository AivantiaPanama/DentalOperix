import type { FinancialKpiReadModel } from "@/server/read-models/worksheet-read-models";

export type FinancialKpiReadDto = {
  financialKpiId: string;
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

function readTimestamp(kpi: FinancialKpiReadModel) {
  const timestamp = Date.parse(kpi.updatedAt || kpi.periodEnd || kpi.createdAt || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isUsableKpi(kpi: FinancialKpiReadModel) {
  return Boolean(normalize(kpi.financialKpiId) && normalize(kpi.metricName));
}

function toFinancialKpiDto(kpi: FinancialKpiReadModel): FinancialKpiReadDto {
  return {
    financialKpiId: normalize(kpi.financialKpiId),
    metricName: normalize(kpi.metricName),
    metricValue: normalize(kpi.metricValue),
    ...(normalize(kpi.metricUnit) ? { metricUnit: normalize(kpi.metricUnit) } : {}),
    ...(normalize(kpi.periodStart) ? { periodStart: normalize(kpi.periodStart) } : {}),
    ...(normalize(kpi.periodEnd) ? { periodEnd: normalize(kpi.periodEnd) } : {}),
    domain: normalize(kpi.domain) || "Finance",
    source: normalize(kpi.source) || "read-model",
    isMock: kpi.isMock,
    ...(normalize(kpi.notes) ? { notes: normalize(kpi.notes) } : {}),
  };
}

export function readFinancialKpis(financialKpis: FinancialKpiReadModel[]): FinancialKpiReadDto[] {
  return financialKpis
    .filter(isUsableKpi)
    .sort((left, right) => readTimestamp(right) - readTimestamp(left))
    .map(toFinancialKpiDto);
}
