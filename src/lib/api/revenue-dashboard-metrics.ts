import { fetchRevenueIntelligence } from "@/lib/api/revenue-intelligence";
import type { CrmDashboardMetrics } from "@/lib/api/crm-metrics";
import type { RevenueSnapshotV1 } from "@/lib/revenue-intelligence";

function createComparison(current: number) {
  return {
    current,
    previous: 0,
    changePercent: 0,
  };
}

function createEmptyLeadScoreDistribution() {
  return {
    hot: 0,
    warm: 0,
    cold: 0,
  };
}

export function mapRevenueSnapshotToCrmDashboardMetrics(
  snapshot: RevenueSnapshotV1,
): CrmDashboardMetrics {
  const totals = {
    leads: snapshot.totals.leads,
    agendadas: snapshot.totals.scheduled,
    completadas: snapshot.totals.completed,
    canceladas: snapshot.totals.cancelled,
    noAsistio: snapshot.totals.noShow,
  };

  return {
    totals,
    conversionRate: snapshot.conversion.leadToAppointmentRate,
    attendanceRate: snapshot.conversion.appointmentToAttendanceRate,
    pipelineValue: snapshot.pipeline.estimatedPipelineValue,
    sources: snapshot.performance.bySource.map((item) => ({
      source: item.source,
      total: item.leads,
    })),
    sourceConversions: snapshot.performance.bySource,
    services: snapshot.performance.byService.map((item) => ({
      service: item.service,
      total: item.leads,
    })),
    serviceConversions: snapshot.performance.byService,
    serviceTrend: snapshot.performance.byService.map((item) => ({
      service: item.service,
      leads: item.leads,
    })),
    urgency: {
      alta: 0,
      media: 0,
      baja: 0,
    },
    trend: {
      daily: snapshot.trends.daily,
      weekly: snapshot.trends.weekly,
      monthly: snapshot.trends.monthly,
    },
    averageLeadScore: 0,
    leadScoreDistribution: createEmptyLeadScoreDistribution(),
    comparison: {
      leads: createComparison(totals.leads),
      agendadas: createComparison(totals.agendadas),
      completadas: createComparison(totals.completadas),
      canceladas: createComparison(totals.canceladas),
      conversionRate: createComparison(snapshot.conversion.leadToAppointmentRate),
    },
    emptyCRM: totals.leads === 0,
  };
}

export async function fetchRevenueDashboardMetrics(
  period: string | null = null,
): Promise<CrmDashboardMetrics> {
  const { snapshot } = await fetchRevenueIntelligence(period);
  return mapRevenueSnapshotToCrmDashboardMetrics(snapshot);
}
