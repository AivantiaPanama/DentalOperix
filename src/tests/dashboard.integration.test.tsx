// @vitest-environment jsdom
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi, beforeEach, type MockedFunction } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardPage } from "@/routes/admin/dashboard";
import type { CrmDashboardMetrics } from "@/lib/api/crm-metrics";
import { fetchRevenueDashboardMetrics } from "@/lib/api/revenue-dashboard-metrics";
import { fetchExecutiveAnalytics } from "@/lib/api/executive-analytics";
import type { ExecutiveAnalyticsSnapshot } from "@/lib/executive-analytics";

vi.mock("@/lib/api/revenue-dashboard-metrics", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api/revenue-dashboard-metrics")>(
    "@/lib/api/revenue-dashboard-metrics",
  );
  return {
    ...actual,
    fetchRevenueDashboardMetrics: vi.fn(),
  };
});


vi.mock("@/lib/api/executive-analytics", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api/executive-analytics")>(
    "@/lib/api/executive-analytics",
  );
  return {
    ...actual,
    fetchExecutiveAnalytics: vi.fn(),
  };
});

vi.mock("@/lib/dashboard-export", () => ({
  exportDashboardMetricsToCsv: vi.fn(),
}));

vi.mock("@/components/site/SiteLayout", async () => {
  const actual = await vi.importActual<typeof import("@/components/site/SiteLayout")>(
    "@/components/site/SiteLayout",
  );
  return {
    ...actual,
    SiteLayout: ({ children }: any) => {
      return <div>{children}</div>;
    },
  };
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock as any;

const mockedFetchRevenueDashboardMetrics = fetchRevenueDashboardMetrics as unknown as MockedFunction<
  typeof fetchRevenueDashboardMetrics
>;

const mockedFetchExecutiveAnalytics = fetchExecutiveAnalytics as unknown as MockedFunction<
  typeof fetchExecutiveAnalytics
>;

describe("DashboardPage integration", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders average lead score, hot/warm/cold leads and forecast KPIs", async () => {
    const metrics: CrmDashboardMetrics = {
      totals: { leads: 10, agendadas: 6, completadas: 4, canceladas: 1, noAsistio: 0 },
      conversionRate: 60,
      attendanceRate: 75,
      pipelineValue: 20000,
      sources: [{ source: "hero-button", total: 6 }],
      sourceConversions: [
        { source: "hero-button", leads: 6, scheduled: 5, completed: 4, conversionRate: 80 },
      ],
      services: [{ service: "Implantes Dentales", total: 4 }],
      serviceConversions: [
        {
          service: "Implantes Dentales",
          leads: 4,
          scheduled: 3,
          completed: 3,
          conversionRate: 75,
          estimatedPipelineValue: 12000,
        },
      ],
      serviceTrend: [{ service: "Implantes Dentales", leads: 4 }],
      urgency: { alta: 2, media: 5, baja: 3 },
      trend: {
        daily: [],
        weekly: [],
        monthly: [
          { label: "2026-05", leads: 8, agendadas: 4, completadas: 3, canceladas: 0, noAsistio: 0 },
          {
            label: "2026-06",
            leads: 10,
            agendadas: 6,
            completadas: 4,
            canceladas: 1,
            noAsistio: 0,
          },
        ],
      },
      averageLeadScore: 72,
      leadScoreDistribution: { hot: 2, warm: 5, cold: 3 },
      comparison: {
        leads: { current: 10, previous: 8, changePercent: 25 },
        agendadas: { current: 6, previous: 5, changePercent: 20 },
        completadas: { current: 4, previous: 3, changePercent: 33.3 },
        canceladas: { current: 1, previous: 1, changePercent: 0 },
        conversionRate: { current: 60, previous: 55, changePercent: 9.1 },
      },
    };

    const executive: ExecutiveAnalyticsSnapshot = {
      version: "59.3-v1",
      generatedAt: "2026-06-19T00:00:00.000Z",
      sourceSnapshotVersion: "58.2-v1",
      sourceForecastVersion: "58.5-v1",
      summary: {
        revenueScore: { value: 82, signal: "excellent", drivers: ["Conversión sólida"] },
        growthScore: { value: 68, signal: "healthy", drivers: ["Crecimiento estable"] },
        opportunityIndex: { value: 74, signal: "healthy", drivers: ["Servicios activos"] },
      },
      interpretation: {
        healthStatus: "healthy",
        riskLevel: "low",
        opportunityLevel: "high",
        narrative: "Salud ejecutiva saludable con oportunidades claras.",
        primaryFocus: "Escalar fuente: hero-button",
      },
      priorityActions: [
        {
          title: "Escalar fuente: hero-button",
          category: "opportunity",
          priority: "high",
          rationale: "hero-button muestra conversión alta con volumen relevante.",
          expectedOutcome: "Priorizar recursos hacia el mayor potencial comercial detectado.",
        },
      ],
      rankings: {
        sources: [
          { name: "hero-button", leads: 6, completed: 4, conversionRate: 80, score: 91 },
        ],
        services: [
          {
            name: "Implantes Dentales",
            leads: 4,
            completed: 3,
            conversionRate: 75,
            estimatedPipelineValue: 12000,
            score: 88,
          },
        ],
      },
      alerts: [
        {
          title: "Conversión ejecutiva saludable",
          message: "La conversión se mantiene por encima del umbral ejecutivo.",
          severity: "low",
          recommendedAction: "Mantener monitoreo semanal.",
        },
      ],
      opportunities: [
        {
          title: "Escalar fuente: hero-button",
          description: "hero-button muestra conversión alta con volumen relevante.",
          priority: "high",
          scoreImpact: 80,
        },
      ],
      governance: {
        readOnly: true,
        sourceOfTruth: "Leads",
        revenueType: "estimated",
        limitations: ["Executive Analytics es read-only."],
      },
    };

    mockedFetchRevenueDashboardMetrics.mockResolvedValue(metrics);
    mockedFetchExecutiveAnalytics.mockResolvedValue({ success: true, period: "all", executive });

    render(<DashboardPage />);

    expect(await screen.findByText("Executive Analytics")).toBeDefined();
    expect(await screen.findByText("Revenue Score")).toBeDefined();
    expect(await screen.findByText("Interpretación ejecutiva")).toBeDefined();
    expect(await screen.findByText("Acciones prioritarias")).toBeDefined();
    expect(await screen.findByText("82")).toBeDefined();
    expect(await screen.findByText("Ranking ejecutivo de fuentes")).toBeDefined();
    expect((await screen.findAllByText(/hero-button/)).length).toBeGreaterThan(0);
    expect(await screen.findByText("Puntaje medio de lead")).toBeDefined();
    expect(await screen.findByText("72%")).toBeDefined();
    expect(await screen.findByText("Puntaje de lead caliente")).toBeDefined();
    expect(await screen.findByText("2%")).toBeDefined();
    expect(await screen.findByText("Puntaje de lead templado")).toBeDefined();
    expect(await screen.findByText("5%")).toBeDefined();
    expect(await screen.findByText("Puntaje de lead frío")).toBeDefined();
    expect(await screen.findByText("3%")).toBeDefined();
    expect(await screen.findByText("Leads esperados")).toBeDefined();
    expect(await screen.findByText("Conversiones esperadas")).toBeDefined();
    expect(await screen.findByText("Ingresos esperados")).toBeDefined();
    expect(await screen.findByText("Ingresos proyectados")).toBeDefined();
  });
});
