import { leadPersistenceProvider } from "@/server/leads/persistence";
import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import { getServerConfig } from "@/lib/config.server";
import { calculateLeadScore } from "@/lib/lead-scoring";
import {
  calculateAttendanceRate,
  calculateConversionRate,
  calculateDailyTrend,
  calculateEstimatedPipelineValue,
  calculateMonthlyTrend,
  calculatePeriodComparison,
  calculateServiceConversion,
  calculateServicePerformance,
  calculateServiceTrend,
  calculateSourceConversion,
  calculateSourcePerformance,
  calculateWeeklyTrend,
  type CrmLeadRow,
} from "@/lib/crm-metrics";
import {
  normalizeDashboardPeriod,
  filterLeadsByPeriod,
  filterLeadsByDateRange,
  getPreviousPeriodRange,
  type DashboardPeriod,
} from "@/lib/date-filters";

const KNOWN_SOURCES = [
  "chat-widget",
  "hero-button",
  "navbar-button",
  "services-page",
  "whatsapp",
] as const;

type SourceMetric = {
  source: string;
  total: number;
};

type ServiceMetric = {
  service: string;
  total: number;
};

export async function GET(request: Request) {
  try {
    requirePermission(request, "reports:read");
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return createUnauthorizedResponse();
    }
    if (error instanceof ForbiddenError) {
      return createForbiddenResponse();
    }
    throw error;
  }

  const config = getServerConfig();
  if (config.nodeEnv === "production" && !config.googleRefreshToken) {
    return new Response(
      JSON.stringify({ success: false, error: "CRM access is restricted in production." }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const leads = await leadPersistenceProvider.getActiveLeadPersistenceAdapter().listLeads();
    if (!leads.length) {
      return new Response(
        JSON.stringify({
          success: true,
          emptyCRM: true,
          totals: {
            leads: 0,
            agendadas: 0,
            completadas: 0,
            canceladas: 0,
            noAsistio: 0,
          },
          conversionRate: 0,
          attendanceRate: 0,
          pipelineValue: 0,
          averageLeadScore: 0,
          leadScoreDistribution: {
            hot: 0,
            warm: 0,
            cold: 0,
          },
          sources: [],
          sourceConversions: [],
          services: [],
          serviceConversions: [],
          serviceTrend: [],
          urgency: {
            alta: 0,
            media: 0,
            baja: 0,
          },
          trend: {
            daily: [],
            weekly: [],
            monthly: [],
          },
          comparison: {
            leads: { current: 0, previous: 0, changePercent: 0 },
            agendadas: { current: 0, previous: 0, changePercent: 0 },
            completadas: { current: 0, previous: 0, changePercent: 0 },
            canceladas: { current: 0, previous: 0, changePercent: 0 },
            conversionRate: { current: 0, previous: 0, changePercent: 0 },
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const periodParam = normalizeDashboardPeriod(new URL(request.url).searchParams.get("period"));
    const filteredLeads = filterLeadsByPeriod(leads as CrmLeadRow[], periodParam);

    const totals = {
      leads: filteredLeads.length,
      agendadas: filteredLeads.filter((row) => row.status === "agendada").length,
      completadas: filteredLeads.filter((row) => row.status === "completada").length,
      canceladas: filteredLeads.filter((row) => row.status === "cancelada").length,
      noAsistio: filteredLeads.filter((row) => row.status === "no asistió").length,
    };

    const urgency = filteredLeads.reduce(
      (acc, row) => {
        const level = row.urgency?.toString().toLowerCase();
        if (level === "alta") acc.alta += 1;
        else if (level === "media") acc.media += 1;
        else if (level === "baja") acc.baja += 1;
        return acc;
      },
      { alta: 0, media: 0, baja: 0 },
    );

    const scoredLeads = filteredLeads.map((lead) => calculateLeadScore(lead));
    const averageLeadScore =
      scoredLeads.length > 0
        ? Math.round(scoredLeads.reduce((sum, item) => sum + item.score, 0) / scoredLeads.length)
        : 0;
    const leadScoreDistribution = scoredLeads.reduce(
      (acc, item) => {
        acc[item.category] += 1;
        return acc;
      },
      { hot: 0, warm: 0, cold: 0 },
    );

    const sourcePerformance = calculateSourcePerformance(filteredLeads as CrmLeadRow[]);
    const sources: SourceMetric[] = KNOWN_SOURCES.map((source) => {
      const item = sourcePerformance.find((row) => row.source === source);
      return { source, total: item?.leads ?? 0 };
    }).sort((a, b) => b.total - a.total);

    const servicePerformance = calculateServicePerformance(filteredLeads as CrmLeadRow[]);
    const services: ServiceMetric[] = servicePerformance
      .map((row) => ({ service: row.service, total: row.leads }))
      .sort((a, b) => b.total - a.total);

    const trend = {
      daily: calculateDailyTrend(filteredLeads as CrmLeadRow[]),
      weekly: calculateWeeklyTrend(filteredLeads as CrmLeadRow[]),
      monthly: calculateMonthlyTrend(filteredLeads as CrmLeadRow[]),
    };

    const pipelineValue = calculateEstimatedPipelineValue(filteredLeads as CrmLeadRow[]);
    const sourceConversions = calculateSourceConversion(filteredLeads as CrmLeadRow[]);
    const serviceConversions = calculateServiceConversion(filteredLeads as CrmLeadRow[]);
    const serviceTrend = calculateServiceTrend(filteredLeads as CrmLeadRow[]);

    const previousRange = getPreviousPeriodRange(periodParam);
    const previousLeads = previousRange
      ? filterLeadsByDateRange(
          leads as CrmLeadRow[],
          previousRange.startDate,
          previousRange.endDate,
        )
      : [];

    const comparison = previousRange
      ? calculatePeriodComparison(filteredLeads as CrmLeadRow[], previousLeads)
      : {
          leads: { current: 0, previous: 0, changePercent: 0 },
          agendadas: { current: 0, previous: 0, changePercent: 0 },
          completadas: { current: 0, previous: 0, changePercent: 0 },
          canceladas: { current: 0, previous: 0, changePercent: 0 },
          conversionRate: { current: 0, previous: 0, changePercent: 0 },
        };

    return new Response(
      JSON.stringify({
        totals,
        conversionRate: calculateConversionRate(filteredLeads as CrmLeadRow[]),
        attendanceRate: calculateAttendanceRate(filteredLeads as CrmLeadRow[]),
        pipelineValue,
        averageLeadScore,
        leadScoreDistribution,
        sources,
        sourceConversions,
        services,
        serviceConversions,
        serviceTrend,
        urgency,
        trend,
        comparison,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Failed to load CRM metrics; returning degraded empty CRM metrics:", error);
    return new Response(
      JSON.stringify({
        success: true,
        degraded: true,
        source: "empty-fallback",
        totals: {
          leads: 0,
          agendadas: 0,
          completadas: 0,
          canceladas: 0,
          noAsistio: 0,
        },
        conversionRate: 0,
        attendanceRate: 0,
        pipelineValue: 0,
        averageLeadScore: 0,
        leadScoreDistribution: {
          hot: 0,
          warm: 0,
          cold: 0,
        },
        sources: [],
        sourceConversions: [],
        services: [],
        serviceConversions: [],
        serviceTrend: [],
        urgency: {
          alta: 0,
          media: 0,
          baja: 0,
        },
        trend: {
          daily: [],
          weekly: [],
          monthly: [],
        },
        comparison: {
          leads: { current: 0, previous: 0, changePercent: 0 },
          agendadas: { current: 0, previous: 0, changePercent: 0 },
          completadas: { current: 0, previous: 0, changePercent: 0 },
          canceladas: { current: 0, previous: 0, changePercent: 0 },
          conversionRate: { current: 0, previous: 0, changePercent: 0 },
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
