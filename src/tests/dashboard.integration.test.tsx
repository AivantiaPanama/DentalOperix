// @vitest-environment jsdom
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardPage } from "@/routes/admin/dashboard";
import type { CrmDashboardMetrics } from "@/lib/api/crm-metrics";
import { fetchRevenueDashboardMetrics } from "@/lib/api/revenue-dashboard-metrics";

vi.mock("@/lib/api/revenue-dashboard-metrics", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api/revenue-dashboard-metrics")>(
    "@/lib/api/revenue-dashboard-metrics",
  );
  return {
    ...actual,
    fetchRevenueDashboardMetrics: vi.fn(),
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

const mockedFetchRevenueDashboardMetrics = fetchRevenueDashboardMetrics as unknown as vi.MockedFunction<
  typeof fetchRevenueDashboardMetrics
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

    mockedFetchRevenueDashboardMetrics.mockResolvedValue(metrics);

    render(<DashboardPage />);

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
