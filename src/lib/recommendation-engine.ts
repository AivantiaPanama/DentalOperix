import type { CrmDashboardMetrics } from "@/lib/api/crm-metrics";
import {
  getBestConvertingService,
  getBestConvertingSource,
  getFastestGrowingService,
  getHighestValueService,
} from "./dashboard-insights";

export type BusinessRecommendation = {
  id: string;
  priority: "high" | "medium" | "low";
  category: "marketing" | "conversion" | "attendance" | "services" | "operations" | "commercial";
  title: string;
  description: string;
  action: string;
};

const PRIORITY_ORDER: Record<BusinessRecommendation["priority"], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function generateBusinessRecommendations(
  metrics: CrmDashboardMetrics,
): BusinessRecommendation[] {
  const recommendations: BusinessRecommendation[] = [];
  const bestService = getBestConvertingService(metrics.serviceConversions);
  const bestSource = getBestConvertingSource(metrics.sourceConversions);
  const highestValueService = getHighestValueService(metrics.serviceConversions);
  const fastestGrowingService = getFastestGrowingService(metrics.serviceTrend);

  const cancelationsIncreased =
    metrics.comparison.canceladas.current > metrics.comparison.canceladas.previous ||
    metrics.comparison.canceladas.changePercent > 10;

  if (cancelationsIncreased) {
    recommendations.push({
      id: "cancelations-increase",
      priority: "high",
      category: "attendance",
      title: "Las cancelaciones aumentaron",
      description: "Las cancelaciones aumentaron respecto al período anterior.",
      action: "Revisar recordatorios y confirmaciones de cita.",
    });
  }

  if (bestSource) {
    recommendations.push({
      id: "best-converting-source",
      priority: "medium",
      category: "marketing",
      title: `${bestSource.source} es la fuente con mejor conversión`,
      description: `${bestSource.source} es actualmente la fuente con mejor conversión.`,
      action: `Incrementar inversión y visibilidad en ${bestSource.source}.`,
    });
  }

  if (bestService) {
    recommendations.push({
      id: "best-converting-service",
      priority: "medium",
      category: "services",
      title: `${bestService.service} presenta la mejor conversión`,
      description: `${bestService.service} presenta la mejor conversión.`,
      action: "Destacar este servicio en campañas y contenido comercial.",
    });
  }

  if (highestValueService) {
    recommendations.push({
      id: "highest-value-service",
      priority: "medium",
      category: "services",
      title: `${highestValueService.service} representa la mayor oportunidad económica`,
      description: `${highestValueService.service} representa la mayor oportunidad económica.`,
      action: "Priorizar seguimiento de estos leads.",
    });
  }

  if (metrics.urgency.alta > 0 && metrics.conversionRate < 80) {
    recommendations.push({
      id: "hot-leads-recovery",
      priority: "high",
      category: "commercial",
      title: "Recuperar leads calientes sin seguimiento",
      description: `Hay ${metrics.urgency.alta} leads de alta urgencia con potencial de conversión.`,
      action: "Priorizar seguimiento manual para estos leads calientes.",
    });
  }

  if (metrics.comparison.conversionRate.changePercent < 0) {
    recommendations.push({
      id: "conversion-decline",
      priority: "high",
      category: "commercial",
      title: "Atacar caída de conversión",
      description: "La conversión muestra una tendencia negativa respecto al periodo anterior.",
      action: "Revisar campañas y procesos de calificación para recuperar la efectividad.",
    });
  }

  if (fastestGrowingService) {
    recommendations.push({
      id: "fastest-growing-service",
      priority: "low",
      category: "marketing",
      title: `${fastestGrowingService.service} muestra crecimiento sostenido`,
      description: `${fastestGrowingService.service} muestra crecimiento sostenido.`,
      action: `Evaluar aumentar visibilidad y promoción de ${fastestGrowingService.service}.`,
    });
  }

  return recommendations.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
}
