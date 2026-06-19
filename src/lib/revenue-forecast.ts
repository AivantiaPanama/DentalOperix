import type { RevenueSnapshotV1, RevenueTrendPoint } from "./revenue-intelligence";

export const REVENUE_FORECAST_VERSION = "58.5-v1" as const;
export const REVENUE_FORECAST_HORIZON_DAYS = 30 as const;

export type RevenueForecastDirection = "up" | "stable" | "down" | "insufficient-data";
export type RevenueForecastConfidence = "low" | "medium" | "high";
export type RevenueForecastRiskSeverity = "low" | "medium" | "high";

export type RevenueForecastTrend = {
  metric: "conversion" | "attendance" | "leadVolume";
  direction: RevenueForecastDirection;
  current: number;
  previous: number;
  changePercent: number;
};

export type RevenueForecastRisk = {
  code:
    | "LOW_CONVERSION"
    | "LOW_ATTENDANCE"
    | "HIGH_DROPOFF"
    | "DATA_QUALITY"
    | "INSUFFICIENT_HISTORY";
  severity: RevenueForecastRiskSeverity;
  message: string;
  value: number;
};

export type RevenueExecutiveAlert = {
  title: string;
  message: string;
  severity: RevenueForecastRiskSeverity;
};

export type RevenueForecastSnapshot = {
  version: typeof REVENUE_FORECAST_VERSION;
  generatedAt: string;
  sourceSnapshotVersion: RevenueSnapshotV1["version"];
  forecastHorizonDays: typeof REVENUE_FORECAST_HORIZON_DAYS;
  revenue: {
    currentExpectedRevenue: number;
    expectedRevenue30Days: number;
    projectedPipelineValue30Days: number;
    confidence: RevenueForecastConfidence;
    method: "trend-weighted-estimated-revenue";
  };
  appointments: {
    currentScheduled: number;
    expectedAppointments7Days: number;
    expectedAppointments30Days: number;
    confidence: RevenueForecastConfidence;
    method: "lead-velocity-conversion-rate";
  };
  trends: RevenueForecastTrend[];
  risks: RevenueForecastRisk[];
  alerts: RevenueExecutiveAlert[];
  quality: {
    confidenceScore: number;
    dataPoints: number;
    limitations: string[];
  };
};

function round(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value);
}

function roundPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(1));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getTrendDataPoints(snapshot: RevenueSnapshotV1) {
  if (snapshot.trends.daily.length > 0) return snapshot.trends.daily;
  if (snapshot.trends.weekly.length > 0) return snapshot.trends.weekly;
  return snapshot.trends.monthly;
}

function sumTrend(points: RevenueTrendPoint[]) {
  return points.reduce(
    (acc, point) => ({
      leads: acc.leads + point.leads,
      agendadas: acc.agendadas + point.agendadas,
      completadas: acc.completadas + point.completadas,
      canceladas: acc.canceladas + point.canceladas,
      noAsistio: acc.noAsistio + point.noAsistio,
    }),
    { leads: 0, agendadas: 0, completadas: 0, canceladas: 0, noAsistio: 0 },
  );
}

function calculateRate(numerator: number, denominator: number) {
  if (denominator <= 0) return 0;
  return roundPercent((numerator / denominator) * 100);
}

function calculateChangePercent(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return roundPercent(((current - previous) / previous) * 100);
}

function getDirection(changePercent: number, minimumMeaningfulChange = 5): RevenueForecastDirection {
  if (changePercent >= minimumMeaningfulChange) return "up";
  if (changePercent <= -minimumMeaningfulChange) return "down";
  return "stable";
}

function calculateSplitTrend(
  metric: RevenueForecastTrend["metric"],
  points: RevenueTrendPoint[],
): RevenueForecastTrend {
  if (points.length < 2) {
    return { metric, direction: "insufficient-data", current: 0, previous: 0, changePercent: 0 };
  }

  const midpoint = Math.floor(points.length / 2);
  const previousTotals = sumTrend(points.slice(0, midpoint));
  const currentTotals = sumTrend(points.slice(midpoint));

  let previous = 0;
  let current = 0;

  if (metric === "conversion") {
    previous = calculateRate(previousTotals.agendadas + previousTotals.completadas, previousTotals.leads);
    current = calculateRate(currentTotals.agendadas + currentTotals.completadas, currentTotals.leads);
  }

  if (metric === "attendance") {
    previous = calculateRate(previousTotals.completadas, previousTotals.agendadas + previousTotals.completadas);
    current = calculateRate(currentTotals.completadas, currentTotals.agendadas + currentTotals.completadas);
  }

  if (metric === "leadVolume") {
    previous = previousTotals.leads;
    current = currentTotals.leads;
  }

  const changePercent = calculateChangePercent(current, previous);

  return {
    metric,
    current,
    previous,
    changePercent,
    direction: getDirection(changePercent),
  };
}

function calculateConfidenceScore(snapshot: RevenueSnapshotV1, dataPoints: number) {
  const totalQualityIssues =
    snapshot.quality.missingSource +
    snapshot.quality.missingService +
    snapshot.quality.missingStatus +
    snapshot.quality.unknownStatus;
  const qualityPenalty = snapshot.totals.leads === 0 ? 30 : (totalQualityIssues / snapshot.totals.leads) * 30;
  const historyScore = clamp(dataPoints * 8, 0, 40);
  const volumeScore = clamp(snapshot.totals.leads * 4, 0, 30);
  const conversionScore = snapshot.conversion.leadToAppointmentRate > 0 ? 20 : 0;

  return round(clamp(historyScore + volumeScore + conversionScore - qualityPenalty + 10, 0, 100));
}

function confidenceFromScore(score: number): RevenueForecastConfidence {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

function buildRisks(
  snapshot: RevenueSnapshotV1,
  dataPoints: number,
  confidenceScore: number,
): RevenueForecastRisk[] {
  const risks: RevenueForecastRisk[] = [];
  const dropoffRate = calculateRate(snapshot.totals.cancelled + snapshot.totals.noShow, snapshot.totals.leads);
  const qualityIssues =
    snapshot.quality.missingSource +
    snapshot.quality.missingService +
    snapshot.quality.missingStatus +
    snapshot.quality.unknownStatus;

  if (snapshot.totals.leads > 0 && snapshot.conversion.leadToAppointmentRate < 30) {
    risks.push({
      code: "LOW_CONVERSION",
      severity: "high",
      message: "La conversión Lead → Cita está por debajo del umbral operativo recomendado.",
      value: snapshot.conversion.leadToAppointmentRate,
    });
  }

  if (snapshot.totals.scheduled > 0 && snapshot.conversion.appointmentToAttendanceRate < 50) {
    risks.push({
      code: "LOW_ATTENDANCE",
      severity: "medium",
      message: "La asistencia sobre citas agendadas requiere seguimiento operativo.",
      value: snapshot.conversion.appointmentToAttendanceRate,
    });
  }

  if (dropoffRate >= 25) {
    risks.push({
      code: "HIGH_DROPOFF",
      severity: "medium",
      message: "Cancelaciones y no asistencias representan una proporción relevante del funnel.",
      value: dropoffRate,
    });
  }

  if (qualityIssues > 0) {
    risks.push({
      code: "DATA_QUALITY",
      severity: "low",
      message: "Existen registros con fuente, servicio o estado faltante/no reconocido.",
      value: qualityIssues,
    });
  }

  if (dataPoints < 3 || confidenceScore < 40) {
    risks.push({
      code: "INSUFFICIENT_HISTORY",
      severity: "low",
      message: "El histórico disponible limita la precisión del forecast.",
      value: dataPoints,
    });
  }

  return risks;
}

function buildAlerts(risks: RevenueForecastRisk[], trends: RevenueForecastTrend[]) {
  const alerts: RevenueExecutiveAlert[] = risks.map((risk) => ({
    title: risk.code,
    message: risk.message,
    severity: risk.severity,
  }));

  trends
    .filter((trend) => trend.direction === "down")
    .forEach((trend) => {
      alerts.push({
        title: `Tendencia negativa: ${trend.metric}`,
        message: `${trend.metric} cayó ${Math.abs(trend.changePercent)}% contra el periodo previo comparable.`,
        severity: trend.metric === "leadVolume" ? "medium" : "high",
      });
    });

  return alerts;
}

function buildLimitations(snapshot: RevenueSnapshotV1, dataPoints: number) {
  const limitations: string[] = [
    "Forecast basado en revenue estimado; no representa ingresos reales cobrados.",
    "Modelo determinístico v1 sin aprendizaje automático ni persistencia nueva.",
  ];

  if (dataPoints < 3) {
    limitations.push("Histórico limitado para tendencias robustas.");
  }

  if (snapshot.pipeline.revenueType === "estimated") {
    limitations.push("Pipeline calculado con valores estimados por servicio.");
  }

  return limitations;
}

export function createRevenueForecastSnapshot(
  snapshot: RevenueSnapshotV1,
  generatedAt = new Date().toISOString(),
): RevenueForecastSnapshot {
  const trendDataPoints = getTrendDataPoints(snapshot);
  const dataPoints = trendDataPoints.length;
  const confidenceScore = calculateConfidenceScore(snapshot, dataPoints);
  const confidence = confidenceFromScore(confidenceScore);
  const dailyLeadVelocity = dataPoints > 0 ? snapshot.totals.leads / dataPoints : 0;
  const leadToAppointmentRate = snapshot.conversion.leadToAppointmentRate / 100;
  const pipelinePerDataPoint = dataPoints > 0 ? snapshot.pipeline.estimatedPipelineValue / dataPoints : 0;
  const expectedRevenuePerDataPoint = dataPoints > 0 ? snapshot.pipeline.expectedRevenue / dataPoints : 0;

  const trends: RevenueForecastTrend[] = [
    calculateSplitTrend("conversion", trendDataPoints),
    calculateSplitTrend("attendance", trendDataPoints),
    calculateSplitTrend("leadVolume", trendDataPoints),
  ];
  const risks = buildRisks(snapshot, dataPoints, confidenceScore);
  const alerts = buildAlerts(risks, trends);

  return {
    version: REVENUE_FORECAST_VERSION,
    generatedAt,
    sourceSnapshotVersion: snapshot.version,
    forecastHorizonDays: REVENUE_FORECAST_HORIZON_DAYS,
    revenue: {
      currentExpectedRevenue: snapshot.pipeline.expectedRevenue,
      expectedRevenue30Days: round(expectedRevenuePerDataPoint * REVENUE_FORECAST_HORIZON_DAYS),
      projectedPipelineValue30Days: round(pipelinePerDataPoint * REVENUE_FORECAST_HORIZON_DAYS),
      confidence,
      method: "trend-weighted-estimated-revenue",
    },
    appointments: {
      currentScheduled: snapshot.totals.scheduled,
      expectedAppointments7Days: round(dailyLeadVelocity * 7 * leadToAppointmentRate),
      expectedAppointments30Days: round(dailyLeadVelocity * REVENUE_FORECAST_HORIZON_DAYS * leadToAppointmentRate),
      confidence,
      method: "lead-velocity-conversion-rate",
    },
    trends,
    risks,
    alerts,
    quality: {
      confidenceScore,
      dataPoints,
      limitations: buildLimitations(snapshot, dataPoints),
    },
  };
}
