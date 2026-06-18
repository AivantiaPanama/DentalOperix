import type { CrmDashboardMetrics } from "./api/crm-metrics";
import { calculateForecast } from "./forecast-engine";
import {
  calculateExpectedRevenue,
  calculatePipelineValue,
  calculateConversionForecast,
} from "./commercial-pipeline";

export type DashboardCommercialMetrics = {
  expectedLeads: number;
  expectedConversions: number;
  expectedRevenue: number;
  projectedRevenue: number;
  pipelineValue: number;
  conversionForecast: number;
  forecastReliable: boolean;
  sampleSize: number;
};

export function getDashboardCommercialMetrics(
  metrics: CrmDashboardMetrics,
): DashboardCommercialMetrics {
  const forecast = calculateForecast(metrics);

  return {
    expectedLeads: forecast.expectedLeads,
    expectedConversions: forecast.expectedConversions,
    expectedRevenue: forecast.expectedRevenue,
    projectedRevenue: calculateExpectedRevenue(metrics),
    pipelineValue: calculatePipelineValue(metrics),
    conversionForecast: calculateConversionForecast(metrics),
    forecastReliable: forecast.reliable,
    sampleSize: forecast.sampleSize,
  };
}
