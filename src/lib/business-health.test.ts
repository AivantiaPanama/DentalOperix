import { describe, expect, it } from "vitest";
import {
  calculateBusinessHealthScore,
  calculateBusinessSignals,
  calculateVolumeScore,
  generateExecutiveSummary,
} from "./business-health";
import type { CrmDashboardMetrics } from "./api/crm-metrics";

const baseMetrics: CrmDashboardMetrics = {
  totals: {
    leads: 100,
    agendadas: 70,
    completadas: 60,
    canceladas: 5,
    noAsistio: 5,
  },
  pipelineValue: 120000,
  conversionRate: 88,
  attendanceRate: 85,
  sources: [],
  sourceConversions: [],
  services: [],
  serviceConversions: [],
  serviceTrend: [],
  urgency: { alta: 0, media: 0, baja: 0 },
  trend: {
    daily: [],
    weekly: [],
    monthly: [
      { label: "2026-04", leads: 90, agendadas: 65, completadas: 55, canceladas: 3, noAsistio: 2 },
      { label: "2026-05", leads: 100, agendadas: 70, completadas: 60, canceladas: 5, noAsistio: 5 },
    ],
  },
  comparison: {
    leads: { current: 100, previous: 95, changePercent: 5.3 },
    agendadas: { current: 70, previous: 65, changePercent: 7.7 },
    completadas: { current: 60, previous: 57, changePercent: 5.3 },
    canceladas: { current: 5, previous: 3, changePercent: 66.7 },
    conversionRate: { current: 88, previous: 85, changePercent: 3.5 },
  },
  emptyCRM: false,
};

describe("business health helpers", () => {
  it("returns healthy status for strong metrics", () => {
    const health = calculateBusinessHealthScore(baseMetrics);
    expect(health.score).toBeGreaterThanOrEqual(75);
    expect(health.status).toBe("good");
  });

  it("returns warning status for weak attendance and conversions", () => {
    const metrics: CrmDashboardMetrics = {
      ...baseMetrics,
      conversionRate: 38,
      attendanceRate: 68,
      comparison: {
        leads: { current: 100, previous: 105, changePercent: -4.8 },
        agendadas: { current: 68, previous: 75, changePercent: -9.3 },
        completadas: { current: 50, previous: 55, changePercent: -9.1 },
        canceladas: { current: 8, previous: 5, changePercent: 60 },
        conversionRate: { current: 38, previous: 46, changePercent: -17.4 },
      },
    };
    const health = calculateBusinessHealthScore(metrics);
    expect(health.status).toBe("warning");
    expect(health.score).toBeLessThan(75);
  });

  it("returns a cancellation signal when cancelations rise sharply", () => {
    const metrics: CrmDashboardMetrics = {
      ...baseMetrics,
      conversionRate: 68,
      attendanceRate: 75,
      totals: {
        ...baseMetrics.totals,
        canceladas: 10,
      },
      comparison: {
        leads: { current: 100, previous: 110, changePercent: -9.1 },
        agendadas: { current: 75, previous: 80, changePercent: -6.3 },
        completadas: { current: 55, previous: 60, changePercent: -8.3 },
        canceladas: { current: 10, previous: 4, changePercent: 150 },
        conversionRate: { current: 68, previous: 72, changePercent: -5.6 },
      },
    };

    const signals = calculateBusinessSignals(metrics);
    expect(signals).toContainEqual({ category: "cancelations", status: "red" });

    const summary = generateExecutiveSummary(metrics);
    expect(summary).toContain("Las cancelaciones aumentaron respecto al periodo anterior.");
  });

  it("calculates volume score with a soft normalization", () => {
    expect(calculateVolumeScore(1)).toBeCloseTo(20);
    expect(calculateVolumeScore(4)).toBeCloseTo(40);
    expect(calculateVolumeScore(9)).toBeCloseTo(60);
    expect(calculateVolumeScore(16)).toBeCloseTo(80);
    expect(calculateVolumeScore(25)).toBeCloseTo(100);
    expect(calculateVolumeScore(100)).toBeCloseTo(100);
  });

  it("returns summary lines as string[]", () => {
    const summary = generateExecutiveSummary(baseMetrics);
    expect(Array.isArray(summary)).toBe(true);
    expect(summary.length).toBeGreaterThan(0);
    expect(summary).toContain(
      `Durante este período se registraron ${baseMetrics.totals.leads} leads.`,
    );
  });

  it("returns a fallback line when no leads are present", () => {
    const metrics: CrmDashboardMetrics = {
      ...baseMetrics,
      totals: {
        ...baseMetrics.totals,
        leads: 0,
        agendadas: 0,
        completadas: 0,
        canceladas: 0,
        noAsistio: 0,
      },
      comparison: {
        leads: { current: 0, previous: 0, changePercent: 0 },
        agendadas: { current: 0, previous: 0, changePercent: 0 },
        completadas: { current: 0, previous: 0, changePercent: 0 },
        canceladas: { current: 0, previous: 0, changePercent: 0 },
        conversionRate: { current: 0, previous: 0, changePercent: 0 },
      },
    };

    const summary = generateExecutiveSummary(metrics);
    expect(summary).toEqual(["No se registraron leads durante este período."]);
  });
});
