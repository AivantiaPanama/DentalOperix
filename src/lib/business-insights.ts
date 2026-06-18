import type { CrmDashboardMetrics } from "@/lib/api/crm-metrics";
import {
  getBestConvertingService,
  getBestConvertingSource,
  getFastestGrowingService,
} from "./dashboard-insights";

export type BusinessInsight = {
  type: "success" | "warning" | "info";
  title: string;
  message: string;
};

export function generateBusinessInsights(metrics: CrmDashboardMetrics): BusinessInsight[] {
  const insights: BusinessInsight[] = [];
  const bestService = getBestConvertingService(metrics.serviceConversions);
  const bestSource = getBestConvertingSource(metrics.sourceConversions);
  const fastestGrowing = getFastestGrowingService(metrics.serviceTrend);

  const conversionDeclined = metrics.comparison.conversionRate.changePercent < -10;
  const cancelationsIncreased =
    metrics.comparison.canceladas.current > metrics.comparison.canceladas.previous;

  if (cancelationsIncreased) {
    insights.push({
      type: "warning",
      title: "Cancelaciones en aumento",
      message: "⚠️ Las cancelaciones aumentaron respecto al período anterior.",
    });
  }

  if (conversionDeclined) {
    insights.push({
      type: "warning",
      title: "Conversión en descenso",
      message:
        "⚠️ La conversión disminuyó respecto al periodo anterior. Optimiza el embudo para recuperar rendimiento.",
    });
  }

  if (bestService && bestSource) {
    insights.push({
      type: "success",
      title: "Servicio con mejor conversión",
      message: `⭐ ${bestService.service} es el servicio con mejor conversión.`,
    });

    insights.push({
      type: "success",
      title: "Fuente con mejor conversión",
      message: `⭐ ${bestSource.source} es la fuente con mejor conversión.`,
    });
  } else {
    insights.push({
      type: "info",
      title: "Muestra insuficiente",
      message: "Aún no existe suficiente información para determinar tendencias confiables.",
    });
  }

  if (fastestGrowing) {
    insights.push({
      type: "info",
      title: "Servicio con mayor crecimiento",
      message: `📈 ${fastestGrowing.service} muestra la mayor tendencia de crecimiento.`,
    });
  }

  return insights;
}
