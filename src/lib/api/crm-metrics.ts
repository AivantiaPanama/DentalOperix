import type { MetricComparison, TrendPoint } from "@/lib/crm-metrics";

export type CrmDashboardMetrics = {
  totals: {
    leads: number;
    agendadas: number;
    completadas: number;
    canceladas: number;
    noAsistio: number;
  };
  conversionRate: number;
  attendanceRate: number;
  pipelineValue: number;
  sources: Array<{ source: string; total: number }>;
  sourceConversions: Array<{
    source: string;
    leads: number;
    scheduled: number;
    completed: number;
    conversionRate: number;
  }>;
  services: Array<{ service: string; total: number }>;
  serviceConversions: Array<{
    service: string;
    leads: number;
    scheduled: number;
    completed: number;
    conversionRate: number;
    estimatedPipelineValue: number;
  }>;
  serviceTrend: Array<{ service: string; leads: number; period?: string }>;
  urgency: {
    alta: number;
    media: number;
    baja: number;
  };
  trend: {
    daily: TrendPoint[];
    weekly: TrendPoint[];
    monthly: TrendPoint[];
  };
  averageLeadScore: number;
  leadScoreDistribution: {
    hot: number;
    warm: number;
    cold: number;
  };
  comparison: {
    leads: MetricComparison;
    agendadas: MetricComparison;
    completadas: MetricComparison;
    canceladas: MetricComparison;
    conversionRate: MetricComparison;
  };
  emptyCRM?: boolean;
};

export async function fetchCRMmetrics(period: string | null = null): Promise<CrmDashboardMetrics> {
  const url = `/api/crm/metrics${period ? `?period=${encodeURIComponent(period)}` : ""}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`CRM metrics request failed: ${response.status}`);
  }
  const data = await response.json();
  if (data.success === false) {
    throw new Error(data.error ?? "CRM metrics fetch failed");
  }
  return data as CrmDashboardMetrics;
}
