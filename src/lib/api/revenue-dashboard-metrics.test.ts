import { describe, expect, it } from "vitest";
import { mapRevenueSnapshotToCrmDashboardMetrics } from "./revenue-dashboard-metrics";
import type { RevenueSnapshotV1 } from "@/lib/revenue-intelligence";

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

describe("Revenue Dashboard Metrics adapter", () => {
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
});
