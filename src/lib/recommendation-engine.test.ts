import { describe, expect, it } from "vitest";
import {
  generateBusinessRecommendations,
  type BusinessRecommendation,
} from "./recommendation-engine";
import type { CrmDashboardMetrics } from "@/lib/api/crm-metrics";

const baseMetrics: CrmDashboardMetrics = {
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
  averageLeadScore: 0,
  leadScoreDistribution: { hot: 0, warm: 0, cold: 0 },
  urgency: { alta: 0, media: 0, baja: 0 },
  trend: { daily: [], weekly: [], monthly: [] },
  comparison: {
    leads: { current: 0, previous: 0, changePercent: 0 },
    agendadas: { current: 0, previous: 0, changePercent: 0 },
    completadas: { current: 0, previous: 0, changePercent: 0 },
    canceladas: { current: 0, previous: 0, changePercent: 0 },
    conversionRate: { current: 0, previous: 0, changePercent: 0 },
  },
};

function recommendationById(recommendations: BusinessRecommendation[], id: string) {
  return recommendations.find((recommendation) => recommendation.id === id);
}

describe("generateBusinessRecommendations", () => {
  it("returns no recommendations when no data is available", () => {
    expect(generateBusinessRecommendations(baseMetrics)).toEqual([]);
  });

  it("creates a high priority recommendation when cancelations increase", () => {
    const metrics: CrmDashboardMetrics = {
      ...baseMetrics,
      comparison: {
        ...baseMetrics.comparison,
        canceladas: { current: 5, previous: 2, changePercent: 150 },
      },
    };

    const recommendations = generateBusinessRecommendations(metrics);
    const item = recommendationById(recommendations, "cancelations-increase");

    expect(item).toMatchObject({
      id: "cancelations-increase",
      priority: "high",
      category: "attendance",
      title: "Las cancelaciones aumentaron",
      action: "Revisar recordatorios y confirmaciones de cita.",
    });
  });

  it("creates a medium priority recommendation for the best source when available", () => {
    const metrics: CrmDashboardMetrics = {
      ...baseMetrics,
      sourceConversions: [
        {
          source: "hero-button",
          leads: 10,
          scheduled: 8,
          completed: 6,
          conversionRate: 80,
        },
      ],
    };

    const recommendations = generateBusinessRecommendations(metrics);
    const item = recommendationById(recommendations, "best-converting-source");

    expect(item).toMatchObject({
      id: "best-converting-source",
      priority: "medium",
      category: "marketing",
      title: "hero-button es la fuente con mejor conversión",
      action: "Incrementar inversión y visibilidad en hero-button.",
    });

    expect(item?.action).not.toContain("WhatsApp");
  });

  it("creates a medium priority recommendation for the best service when available", () => {
    const metrics: CrmDashboardMetrics = {
      ...baseMetrics,
      serviceConversions: [
        {
          service: "Ortodoncia",
          leads: 10,
          scheduled: 8,
          completed: 6,
          conversionRate: 75,
          estimatedPipelineValue: 2500,
        },
      ],
    };

    const recommendations = generateBusinessRecommendations(metrics);
    const item = recommendationById(recommendations, "best-converting-service");

    expect(item).toMatchObject({
      id: "best-converting-service",
      priority: "medium",
      category: "services",
      title: "Ortodoncia presenta la mejor conversión",
      action: "Destacar este servicio en campañas y contenido comercial.",
    });
  });

  it("creates a medium priority recommendation for the highest value service when available", () => {
    const metrics: CrmDashboardMetrics = {
      ...baseMetrics,
      serviceConversions: [
        {
          service: "Ortodoncia",
          leads: 10,
          scheduled: 8,
          completed: 6,
          conversionRate: 75,
          estimatedPipelineValue: 2500,
        },
      ],
    };

    const recommendations = generateBusinessRecommendations(metrics);
    const item = recommendationById(recommendations, "highest-value-service");

    expect(item).toMatchObject({
      id: "highest-value-service",
      priority: "medium",
      category: "services",
      title: "Ortodoncia representa la mayor oportunidad económica",
      action: "Priorizar seguimiento de estos leads.",
    });
  });

  it("creates a low priority recommendation for the fastest growing service when available", () => {
    const metrics: CrmDashboardMetrics = {
      ...baseMetrics,
      serviceTrend: [
        { service: "Implantes Dentales", leads: 3, period: "2026-05" },
        { service: "Implantes Dentales", leads: 9, period: "2026-06" },
      ],
    };

    const recommendations = generateBusinessRecommendations(metrics);
    const item = recommendationById(recommendations, "fastest-growing-service");

    expect(item).toMatchObject({
      id: "fastest-growing-service",
      priority: "low",
      category: "marketing",
    });

    expect(item?.title).toContain("Implantes Dentales");
    expect(item?.title).toContain("crecimiento");
    expect(item?.action).toContain("visibilidad");
  });

  it("orders recommendations by priority high, medium, low", () => {
    const metrics: CrmDashboardMetrics = {
      ...baseMetrics,
      comparison: {
        ...baseMetrics.comparison,
        canceladas: { current: 10, previous: 3, changePercent: 233.3 },
      },
      sourceConversions: [
        {
          source: "WhatsApp",
          leads: 10,
          scheduled: 8,
          completed: 6,
          conversionRate: 80,
        },
      ],
      serviceConversions: [
        {
          service: "Ortodoncia",
          leads: 10,
          scheduled: 8,
          completed: 6,
          conversionRate: 75,
          estimatedPipelineValue: 2500,
        },
      ],
      serviceTrend: [
        { service: "Implantes Dentales", leads: 3, period: "2026-05" },
        { service: "Implantes Dentales", leads: 9, period: "2026-06" },
      ],
    };

    const recommendations = generateBusinessRecommendations(metrics);

    expect(recommendations.map((item) => item.priority)).toEqual([
      "high",
      "medium",
      "medium",
      "medium",
      "low",
    ]);
  });

  it("does not create best source or best service recommendations when sample size is insufficient", () => {
    const metrics: CrmDashboardMetrics = {
      ...baseMetrics,
      sourceConversions: [
        {
          source: "Facebook",
          leads: 2,
          scheduled: 1,
          completed: 1,
          conversionRate: 50,
        },
      ],
      serviceConversions: [
        {
          service: "Ortodoncia",
          leads: 2,
          scheduled: 1,
          completed: 1,
          conversionRate: 50,
          estimatedPipelineValue: 1200,
        },
      ],
    };

    const recommendations = generateBusinessRecommendations(metrics);

    expect(recommendationById(recommendations, "best-converting-source")).toBeUndefined();

    expect(recommendationById(recommendations, "best-converting-service")).toBeUndefined();

    expect(recommendationById(recommendations, "highest-value-service")).toBeDefined();
  });
});
