import { beforeEach, describe, expect, it, vi, type MockedFunction } from "vitest";
import { fetchCRMmetrics } from "@/lib/api/crm-metrics";
import { fetchRevenueIntelligence } from "@/lib/api/revenue-intelligence";
import {
  fetchRevenueDashboardMetrics,
  mapRevenueSnapshotToCrmDashboardMetrics,
} from "./revenue-dashboard-metrics";
import type { CrmDashboardMetrics } from "@/lib/api/crm-metrics";
import type { RevenueSnapshotV1 } from "@/lib/revenue-intelligence";

vi.mock("@/lib/api/crm-metrics", () => ({
  fetchCRMmetrics: vi.fn(),
}));

vi.mock("@/lib/api/revenue-intelligence", () => ({
  fetchRevenueIntelligence: vi.fn(),
}));

const snapshot: RevenueSnapshotV1 = {
  version: "58.2-v1",
  totals: {
    leads: 10,
    scheduled: 6,
    completed: 4,
    cancelled: 2,
    noShow: 1,
  },
  conversion: {
    leadToAppointmentRate: 60,
    appointmentToAttendanceRate: 66.7,
    leadToAttendanceRate: 40,
  },
  pipeline: {
    estimatedPipelineValue: 12000,
    expectedRevenue: 7200,
    averageLeadValue: 1200,
    revenueType: "estimated",
  },
  performance: {
    bySource: [
      { source: "chat-widget", leads: 5, scheduled: 3, completed: 2, conversionRate: 60 },
    ],
    byService: [
      {
        service: "Ortodoncia",
        leads: 4,
        scheduled: 3,
        completed: 2,
        conversionRate: 75,
        estimatedPipelineValue: 8000,
      },
    ],
    byStatus: [{ status: "agendada", leads: 2 }],
  },
  trends: {
    daily: [
      { label: "2026-06-19", leads: 2, agendadas: 1, completadas: 1, canceladas: 0, noAsistio: 0 },
    ],
    weekly: [],
    monthly: [],
  },
  quality: {
    missingSource: 0,
    missingService: 0,
    missingStatus: 0,
    unknownStatus: 0,
  },
};

const fallbackMetrics: CrmDashboardMetrics = {
  totals: {
    leads: 3,
    agendadas: 2,
    completadas: 1,
    canceladas: 0,
    noAsistio: 0,
  },
  conversionRate: 66.7,
  attendanceRate: 50,
  pipelineValue: 1500,
  sources: [{ source: "Google", total: 3 }],
  sourceConversions: [
    { source: "Google", leads: 3, scheduled: 2, completed: 1, conversionRate: 66.7 },
  ],
  services: [{ service: "Limpieza", total: 3 }],
  serviceConversions: [
    {
      service: "Limpieza",
      leads: 3,
      scheduled: 2,
      completed: 1,
      conversionRate: 66.7,
      estimatedPipelineValue: 1500,
    },
  ],
  serviceTrend: [{ service: "Limpieza", leads: 3 }],
  urgency: { alta: 0, media: 0, baja: 0 },
  trend: { daily: [], weekly: [], monthly: [] },
  averageLeadScore: 0,
  leadScoreDistribution: { hot: 0, warm: 0, cold: 0 },
  comparison: {
    leads: { current: 3, previous: 0, changePercent: 0 },
    agendadas: { current: 2, previous: 0, changePercent: 0 },
    completadas: { current: 1, previous: 0, changePercent: 0 },
    canceladas: { current: 0, previous: 0, changePercent: 0 },
    conversionRate: { current: 66.7, previous: 0, changePercent: 0 },
  },
  emptyCRM: false,
};

const mockedFetchRevenueIntelligence = fetchRevenueIntelligence as unknown as MockedFunction<
  typeof fetchRevenueIntelligence
>;
const mockedFetchCRMmetrics = fetchCRMmetrics as unknown as MockedFunction<
  typeof fetchCRMmetrics
>;

describe("Revenue Dashboard Metrics adapter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  it("maps RevenueSnapshotV1 to the current dashboard-compatible metrics view", () => {
    const metrics = mapRevenueSnapshotToCrmDashboardMetrics(snapshot);

    expect(metrics.totals).toEqual({
      leads: 10,
      agendadas: 6,
      completadas: 4,
      canceladas: 2,
      noAsistio: 1,
    });
    expect(metrics.conversionRate).toBe(60);
    expect(metrics.attendanceRate).toBe(66.7);
    expect(metrics.pipelineValue).toBe(12000);
    expect(metrics.sourceConversions).toEqual(snapshot.performance.bySource);
    expect(metrics.serviceConversions).toEqual(snapshot.performance.byService);
    expect(metrics.trend.daily).toEqual(snapshot.trends.daily);
    expect(metrics.emptyCRM).toBe(false);
  });

  it("uses Revenue Intelligence as the primary dashboard metrics source", async () => {
    mockedFetchRevenueIntelligence.mockResolvedValue({ success: true, period: "all", snapshot });

    const metrics = await fetchRevenueDashboardMetrics("all");

    expect(mockedFetchRevenueIntelligence).toHaveBeenCalledWith("all");
    expect(mockedFetchCRMmetrics).not.toHaveBeenCalled();
    expect(metrics.totals.leads).toBe(10);
  });

  it("falls back to legacy CRM metrics when Revenue Intelligence is unavailable", async () => {
    mockedFetchRevenueIntelligence.mockRejectedValue(new Error("Revenue 500"));
    mockedFetchCRMmetrics.mockResolvedValue(fallbackMetrics);

    const metrics = await fetchRevenueDashboardMetrics("all");

    expect(mockedFetchRevenueIntelligence).toHaveBeenCalledWith("all");
    expect(mockedFetchCRMmetrics).toHaveBeenCalledWith("all");
    expect(metrics).toBe(fallbackMetrics);
  });
});
