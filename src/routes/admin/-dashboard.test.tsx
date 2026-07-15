import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  DashboardPage,
  shouldReconcileDashboardMetrics,
  shouldShowDashboardEmptyCRM,
} from "./dashboard";

import type { CrmDashboardMetrics } from "@/lib/api/crm-metrics";

vi.mock("@/components/site/SiteLayout", () => ({
  SiteLayout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));



const createMetrics = (
  overrides: Partial<CrmDashboardMetrics> = {},
): CrmDashboardMetrics => ({
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
  averageLeadScore: 0,
  leadScoreDistribution: {
    hot: 0,
    warm: 0,
    cold: 0,
  },
  comparison: {
    leads: { current: 0, previous: 0, changePercent: 0 },
    agendadas: { current: 0, previous: 0, changePercent: 0 },
    completadas: { current: 0, previous: 0, changePercent: 0 },
    canceladas: { current: 0, previous: 0, changePercent: 0 },
    conversionRate: { current: 0, previous: 0, changePercent: 0 },
  },
  emptyCRM: false,
  ...overrides,
});

describe("Admin dashboard", () => {
  it("renders the admin dashboard page shell with initial loading state", () => {
    const html = renderToStaticMarkup(<DashboardPage />);

    expect(html).toContain("Admin CRM");
    expect(html).toContain("Dashboard de métricas");
    expect(html).toContain("Cargando métricas de Revenue Intelligence...");
  });

  it("renders the goal settings action button", () => {
    const html = renderToStaticMarkup(<DashboardPage />);

    expect(html).toContain("Configurar Metas");
  });

  it("does not show the empty CRM state when metrics contain leads", () => {
    const metrics = createMetrics({
      emptyCRM: true,
      totals: { leads: 18, agendadas: 14, completadas: 0, canceladas: 0, noAsistio: 0 },
    });

    expect(shouldShowDashboardEmptyCRM(metrics, false, false)).toBe(false);
  });

  it("shows the empty CRM state only after loading and with no leads", () => {
    const metrics = createMetrics({
      emptyCRM: true,
      totals: { leads: 0, agendadas: 0, completadas: 0, canceladas: 0, noAsistio: 0 },
    });

    expect(shouldShowDashboardEmptyCRM(metrics, true, false)).toBe(false);
    expect(shouldShowDashboardEmptyCRM(metrics, false, true)).toBe(false);
    expect(shouldShowDashboardEmptyCRM(metrics, false, false)).toBe(true);
  });

  it("reconciles only empty snapshots without leads", () => {
    const emptyMetrics = createMetrics({
      emptyCRM: true,
      totals: { leads: 0, agendadas: 0, completadas: 0, canceladas: 0, noAsistio: 0 },
    });
    const realMetrics = createMetrics({
      emptyCRM: false,
      totals: { leads: 18, agendadas: 14, completadas: 0, canceladas: 0, noAsistio: 0 },
    });

    expect(shouldReconcileDashboardMetrics(emptyMetrics)).toBe(true);
    expect(shouldReconcileDashboardMetrics(realMetrics)).toBe(false);
  });
});
