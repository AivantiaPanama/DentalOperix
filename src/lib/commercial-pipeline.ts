import type { CrmDashboardMetrics } from "./api/crm-metrics";

export type PipelineForecast = {
  pipelineValue: number;
  expectedRevenue: number;
  conversionForecast: number;
};

export function calculatePipelineValue(metrics: CrmDashboardMetrics) {
  return metrics.pipelineValue;
}

export function calculateExpectedRevenue(metrics: CrmDashboardMetrics) {
  const rate = Math.max(0, Math.min(100, metrics.conversionRate)) / 100;
  return Math.round(metrics.pipelineValue * rate);
}

export function calculateConversionForecast(metrics: CrmDashboardMetrics) {
  const changePercent = metrics.comparison.conversionRate.changePercent;
  const forecast = metrics.conversionRate + changePercent * 0.25;
  return Number(Math.min(100, Math.max(0, forecast)).toFixed(1));
}
