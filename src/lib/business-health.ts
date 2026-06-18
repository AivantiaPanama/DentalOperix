import type { CrmDashboardMetrics } from "@/lib/api/crm-metrics";
import { getBestConvertingSource, getHighestValueService } from "./dashboard-insights";

export type BusinessHealthScore = {
  score: number;
  status: "excellent" | "good" | "warning" | "critical";
};

export type BusinessSignal = {
  category: "conversion" | "attendance" | "cancelations" | "growth";
  status: "green" | "yellow" | "red";
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function mapScoreToStatus(score: number): BusinessHealthScore["status"] {
  if (score >= 90) return "excellent";
  if (score >= 75) return "good";
  if (score >= 50) return "warning";
  return "critical";
}

function calculateTrendScore(metrics: CrmDashboardMetrics) {
  const trend = metrics.trend.monthly;
  if (trend.length < 2) {
    return 50;
  }

  const last = trend[trend.length - 1];
  const previous = trend[trend.length - 2];
  const change =
    previous.leads === 0
      ? last.leads > 0
        ? 100
        : 0
      : ((last.leads - previous.leads) / previous.leads) * 100;
  const normalized = 50 + change / 2;
  return clamp(normalized, 0, 100);
}

export function calculateVolumeScore(leads: number) {
  const score = Math.min(100, Math.sqrt(leads) * 20);
  return clamp(score, 0, 100);
}

function calculateCancelationsScore(metrics: CrmDashboardMetrics) {
  const totalLeads = Math.max(metrics.totals.leads, 1);
  const cancelRate = metrics.totals.canceladas / totalLeads;
  const score = 100 - cancelRate * 200;
  return clamp(score, 0, 100);
}

export function calculateBusinessHealthScore(metrics: CrmDashboardMetrics): BusinessHealthScore {
  const conversionScore = clamp(metrics.conversionRate, 0, 100);
  const attendanceScore = clamp(metrics.attendanceRate, 0, 100);
  const cancelationsScore = calculateCancelationsScore(metrics);
  const growthScore = calculateTrendScore(metrics);
  const volumeScore = calculateVolumeScore(metrics.totals.leads);

  const weightedScore =
    conversionScore * 0.3 +
    attendanceScore * 0.25 +
    cancelationsScore * 0.2 +
    growthScore * 0.15 +
    volumeScore * 0.1;

  const score = Math.round(clamp(weightedScore, 0, 100));
  return {
    score,
    status: mapScoreToStatus(score),
  };
}

export function calculateBusinessSignals(metrics: CrmDashboardMetrics): BusinessSignal[] {
  const signals: BusinessSignal[] = [];

  const conversionStatus =
    metrics.conversionRate >= 75 ? "green" : metrics.conversionRate >= 50 ? "yellow" : "red";
  signals.push({ category: "conversion", status: conversionStatus });

  const attendanceStatus =
    metrics.attendanceRate >= 80 ? "green" : metrics.attendanceRate >= 60 ? "yellow" : "red";
  signals.push({ category: "attendance", status: attendanceStatus });

  const cancelationsChanged =
    metrics.comparison.canceladas.current > metrics.comparison.canceladas.previous
      ? metrics.comparison.canceladas.changePercent > 10
        ? "red"
        : "yellow"
      : "green";
  signals.push({ category: "cancelations", status: cancelationsChanged });

  const growth = calculateTrendScore(metrics);
  const growthStatus = growth >= 60 ? "green" : growth >= 45 ? "yellow" : "red";
  signals.push({ category: "growth", status: growthStatus });

  return signals;
}

function formatPercent(value: number) {
  if (value === 0) return "0%";
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function generateExecutiveSummary(metrics: CrmDashboardMetrics): string[] {
  const lines: string[] = [];

  if (metrics.totals.leads === 0) {
    return ["No se registraron leads durante este período."];
  }

  lines.push(`Durante este período se registraron ${metrics.totals.leads} leads.`);

  const conversionChange = metrics.comparison.conversionRate.changePercent;
  if (conversionChange > 0) {
    lines.push(`La conversión aumentó ${formatPercent(conversionChange)}.`);
  } else if (conversionChange < 0) {
    lines.push(`La conversión disminuyó ${formatPercent(conversionChange)}.`);
  } else {
    lines.push("La conversión se mantuvo estable.");
  }

  const bestSource = getBestConvertingSource(metrics.sourceConversions);
  if (bestSource) {
    lines.push(`${bestSource.source} fue la fuente con mejor desempeño.`);
  } else {
    lines.push("No hay una fuente líder con muestra suficiente.");
  }

  const highestValueService = getHighestValueService(metrics.serviceConversions);
  if (highestValueService) {
    lines.push(`${highestValueService.service} representó la mayor oportunidad económica.`);
  } else {
    lines.push("No hay un servicio con suficiente valor para destacar.");
  }

  const cancelationsChange =
    metrics.comparison.canceladas.current - metrics.comparison.canceladas.previous;
  if (cancelationsChange > 0) {
    lines.push("Las cancelaciones aumentaron respecto al periodo anterior.");
  } else if (cancelationsChange < 0) {
    lines.push("Las cancelaciones disminuyeron respecto al periodo anterior.");
  } else {
    lines.push("Las cancelaciones se mantuvieron estables.");
  }

  return lines;
}
