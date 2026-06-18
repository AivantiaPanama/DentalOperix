import type { BusinessInsight } from "./business-insights";
import type { CrmDashboardMetrics } from "./api/crm-metrics";
import { getBestConvertingService, getBestConvertingSource } from "./dashboard-insights";

const MIN_SAMPLE_SIZE = 5;

export function generateCommercialInsights(metrics: CrmDashboardMetrics): BusinessInsight[] {
  const insights: BusinessInsight[] = [];
  const bestSource = getBestConvertingSource(metrics.sourceConversions);
  const bestService = getBestConvertingService(metrics.serviceConversions);

  const strongSources = metrics.sourceConversions
    .filter((item) => item.leads >= MIN_SAMPLE_SIZE && item.conversionRate >= 60)
    .sort((a, b) => b.conversionRate - a.conversionRate)
    .slice(0, 2);

  const weakSources = metrics.sourceConversions
    .filter((item) => item.leads >= MIN_SAMPLE_SIZE && item.conversionRate <= 30)
    .sort((a, b) => a.conversionRate - b.conversionRate)
    .slice(0, 2);

  if (strongSources.length > 0) {
    strongSources.forEach((source) => {
      insights.push({
        type: "success",
        title: `Fuente fuerte: ${source.source}`,
        message: `La fuente ${source.source} tiene una conversión de ${source.conversionRate}% con ${source.leads} leads.`,
      });
    });
  }

  if (weakSources.length > 0) {
    weakSources.forEach((source) => {
      insights.push({
        type: "warning",
        title: `Fuente débil: ${source.source}`,
        message: `La fuente ${source.source} tiene una conversión baja de ${source.conversionRate}% y puede requerir ajustes.`,
      });
    });
  }

  if (bestService && bestService.leads >= MIN_SAMPLE_SIZE) {
    insights.push({
      type: "success",
      title: `Servicio con potencial: ${bestService.service}`,
      message: `El servicio ${bestService.service} ofrece una combinación sólida de leads y conversión.`,
    });
  }

  const weakService = metrics.serviceConversions
    .filter((item) => item.leads >= MIN_SAMPLE_SIZE && item.conversionRate <= 30)
    .sort((a, b) => a.conversionRate - b.conversionRate)[0];

  if (weakService) {
    insights.push({
      type: "warning",
      title: `Servicio en retroceso: ${weakService.service}`,
      message: `El servicio ${weakService.service} muestra baja conversión (${weakService.conversionRate}%) con suficiente tráfico.`,
    });
  }

  if (!insights.length) {
    insights.push({
      type: "info",
      title: "Insuficiente información comercial",
      message:
        "No hay una muestra comercial robusta para generar insights comerciales adicionales.",
    });
  }

  return insights;
}
