import type { CrmDashboardMetrics } from "./api/crm-metrics";

export type CommercialForecast = {
  expectedLeads: number;
  expectedAppointments: number;
  expectedConversions: number;
  expectedRevenue: number;
  reliable: boolean;
  sampleSize: number;
};

const MIN_SAMPLE_SIZE = 5;

export function calculateForecast(metrics: CrmDashboardMetrics): CommercialForecast {
  const monthlyTrend = metrics.trend.monthly.filter((point) => typeof point.leads === "number");
  const sampleSize = monthlyTrend.length;

  if (sampleSize < MIN_SAMPLE_SIZE) {
    return {
      expectedLeads: 0,
      expectedAppointments: 0,
      expectedConversions: 0,
      expectedRevenue: 0,
      reliable: false,
      sampleSize,
    };
  }

  const recentMonths = monthlyTrend.slice(-Math.min(3, sampleSize));
  const averageLeads = Math.round(
    recentMonths.reduce((sum, point) => sum + point.leads, 0) / recentMonths.length,
  );
  const expectedAppointments = Math.round((averageLeads * metrics.conversionRate) / 100);
  const expectedConversions = Math.round((expectedAppointments * metrics.attendanceRate) / 100);

  const averageCompletedValue =
    metrics.totals.completadas > 0
      ? metrics.pipelineValue / metrics.totals.completadas
      : metrics.totals.agendadas > 0
        ? metrics.pipelineValue / metrics.totals.agendadas
        : metrics.pipelineValue;

  const expectedRevenue = Math.round(averageCompletedValue * expectedConversions);

  return {
    expectedLeads: averageLeads,
    expectedAppointments,
    expectedConversions,
    expectedRevenue,
    reliable: true,
    sampleSize,
  };
}
