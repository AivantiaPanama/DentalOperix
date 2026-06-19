import type { RevenueForecastRiskSeverity } from "./revenue-forecast";
import type { RevenueForecastSnapshot } from "./revenue-forecast";
import type { RevenueServicePerformance, RevenueSnapshotV1, RevenueSourcePerformance } from "./revenue-intelligence";

export const EXECUTIVE_ANALYTICS_VERSION = "59.3-v1" as const;

export type ExecutiveScoreSignal = "excellent" | "healthy" | "watch" | "critical";
export type ExecutivePriority = "low" | "medium" | "high";
export type ExecutiveHealthStatus = "excellent" | "healthy" | "attention-required" | "critical";
export type ExecutiveActionCategory = "conversion" | "attendance" | "pipeline" | "growth" | "data-quality" | "opportunity";

export type ExecutiveScore = {
  value: number;
  signal: ExecutiveScoreSignal;
  drivers: string[];
};

export type ExecutiveRankingItem = {
  name: string;
  leads: number;
  completed: number;
  conversionRate: number;
  estimatedPipelineValue?: number;
  score: number;
};

export type ExecutiveOpportunity = {
  title: string;
  description: string;
  priority: ExecutivePriority;
  scoreImpact: number;
};

export type ExecutiveDecisionAlert = {
  title: string;
  message: string;
  severity: RevenueForecastRiskSeverity;
  recommendedAction: string;
};

export type ExecutivePriorityAction = {
  title: string;
  category: ExecutiveActionCategory;
  priority: ExecutivePriority;
  rationale: string;
  expectedOutcome: string;
};

export type ExecutiveInterpretation = {
  healthStatus: ExecutiveHealthStatus;
  riskLevel: ExecutivePriority;
  opportunityLevel: ExecutivePriority;
  narrative: string;
  primaryFocus: string;
};

export type ExecutiveAnalyticsSnapshot = {
  version: typeof EXECUTIVE_ANALYTICS_VERSION;
  generatedAt: string;
  sourceSnapshotVersion: RevenueSnapshotV1["version"];
  sourceForecastVersion: RevenueForecastSnapshot["version"];
  summary: {
    revenueScore: ExecutiveScore;
    growthScore: ExecutiveScore;
    opportunityIndex: ExecutiveScore;
  };
  interpretation: ExecutiveInterpretation;
  priorityActions: ExecutivePriorityAction[];
  rankings: {
    sources: ExecutiveRankingItem[];
    services: ExecutiveRankingItem[];
  };
  alerts: ExecutiveDecisionAlert[];
  opportunities: ExecutiveOpportunity[];
  governance: {
    readOnly: true;
    sourceOfTruth: "Leads";
    revenueType: RevenueSnapshotV1["pipeline"]["revenueType"];
    limitations: string[];
  };
};

function clamp(value: number, min = 0, max = 100) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function round(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value);
}

function roundOne(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(1));
}

function scoreSignal(value: number): ExecutiveScoreSignal {
  if (value >= 80) return "excellent";
  if (value >= 60) return "healthy";
  if (value >= 40) return "watch";
  return "critical";
}

function buildScore(value: number, drivers: string[]): ExecutiveScore {
  const normalizedValue = round(clamp(value));
  return {
    value: normalizedValue,
    signal: scoreSignal(normalizedValue),
    drivers,
  };
}

function calculateRevenueScore(snapshot: RevenueSnapshotV1, forecast: RevenueForecastSnapshot): ExecutiveScore {
  const conversionComponent = snapshot.conversion.leadToAppointmentRate * 0.35;
  const attendanceComponent = snapshot.conversion.appointmentToAttendanceRate * 0.25;
  const pipelineComponent = snapshot.pipeline.estimatedPipelineValue > 0 ? 20 : 0;
  const confidenceComponent = forecast.quality.confidenceScore * 0.2;
  const value = conversionComponent + attendanceComponent + pipelineComponent + confidenceComponent;

  return buildScore(value, [
    `Conversión Lead → Cita: ${snapshot.conversion.leadToAppointmentRate}%`,
    `Asistencia sobre citas: ${snapshot.conversion.appointmentToAttendanceRate}%`,
    `Pipeline estimado: ${snapshot.pipeline.estimatedPipelineValue}`,
    `Confianza forecast: ${forecast.quality.confidenceScore}/100`,
  ]);
}

function trendScore(direction: string, changePercent: number) {
  if (direction === "up") return clamp(60 + Math.abs(changePercent), 0, 100);
  if (direction === "down") return clamp(40 - Math.abs(changePercent), 0, 100);
  if (direction === "stable") return 55;
  return 40;
}

function calculateGrowthScore(forecast: RevenueForecastSnapshot): ExecutiveScore {
  const conversionTrend = forecast.trends.find((trend) => trend.metric === "conversion");
  const attendanceTrend = forecast.trends.find((trend) => trend.metric === "attendance");
  const leadVolumeTrend = forecast.trends.find((trend) => trend.metric === "leadVolume");

  const values = [conversionTrend, attendanceTrend, leadVolumeTrend]
    .filter(Boolean)
    .map((trend) => trendScore(trend!.direction, trend!.changePercent));
  const value = values.length === 0 ? 40 : values.reduce((sum, current) => sum + current, 0) / values.length;

  return buildScore(value, [
    `Tendencia conversión: ${conversionTrend?.direction ?? "insufficient-data"}`,
    `Tendencia asistencia: ${attendanceTrend?.direction ?? "insufficient-data"}`,
    `Tendencia volumen leads: ${leadVolumeTrend?.direction ?? "insufficient-data"}`,
  ]);
}

function calculateOpportunityIndex(snapshot: RevenueSnapshotV1, forecast: RevenueForecastSnapshot): ExecutiveScore {
  const sourceDiversity = clamp(snapshot.performance.bySource.length * 12, 0, 30);
  const serviceDiversity = clamp(snapshot.performance.byService.length * 10, 0, 30);
  const forecastUpside = snapshot.pipeline.estimatedPipelineValue > 0 ? 20 : 0;
  const lowRiskBonus = clamp(20 - forecast.risks.length * 4, 0, 20);

  return buildScore(sourceDiversity + serviceDiversity + forecastUpside + lowRiskBonus, [
    `Fuentes activas: ${snapshot.performance.bySource.length}`,
    `Servicios activos: ${snapshot.performance.byService.length}`,
    `Riesgos forecast: ${forecast.risks.length}`,
  ]);
}

function rankSource(source: RevenueSourcePerformance): ExecutiveRankingItem {
  const score = clamp(source.conversionRate * 0.7 + source.completed * 10 + source.leads * 2);
  return {
    name: source.source,
    leads: source.leads,
    completed: source.completed,
    conversionRate: source.conversionRate,
    score: round(score),
  };
}

function rankService(service: RevenueServicePerformance): ExecutiveRankingItem {
  const normalizedPipelineScore = service.estimatedPipelineValue > 0 ? Math.min(30, Math.log10(service.estimatedPipelineValue + 1) * 6) : 0;
  const score = clamp(service.conversionRate * 0.55 + service.completed * 8 + service.leads * 1.5 + normalizedPipelineScore);
  return {
    name: service.service,
    leads: service.leads,
    completed: service.completed,
    conversionRate: service.conversionRate,
    estimatedPipelineValue: service.estimatedPipelineValue,
    score: round(score),
  };
}

function sortRanking(a: ExecutiveRankingItem, b: ExecutiveRankingItem) {
  return b.score - a.score || b.completed - a.completed || b.leads - a.leads || a.name.localeCompare(b.name);
}

function buildAlerts(snapshot: RevenueSnapshotV1, forecast: RevenueForecastSnapshot): ExecutiveDecisionAlert[] {
  const alerts: ExecutiveDecisionAlert[] = forecast.alerts.map((alert) => ({
    title: alert.title,
    message: alert.message,
    severity: alert.severity,
    recommendedAction:
      alert.severity === "high"
        ? "Revisar esta métrica en comité operativo y asignar responsable de corrección."
        : "Monitorear la tendencia y validar si requiere acción operativa.",
  }));

  if (snapshot.conversion.leadToAppointmentRate < 40 && snapshot.totals.leads > 0) {
    alerts.push({
      title: "Conversión ejecutiva en observación",
      message: `Lead → Cita se encuentra en ${snapshot.conversion.leadToAppointmentRate}%.`,
      severity: "medium",
      recommendedAction: "Auditar tiempos de respuesta, calidad de seguimiento y fuentes con baja conversión.",
    });
  }

  if (snapshot.quality.missingSource + snapshot.quality.missingService + snapshot.quality.unknownStatus > 0) {
    alerts.push({
      title: "Calidad de datos ejecutiva",
      message: "Existen registros incompletos que pueden afectar rankings y lectura ejecutiva.",
      severity: "low",
      recommendedAction: "Completar fuente, servicio y estado en los leads afectados antes del siguiente corte.",
    });
  }

  return alerts.slice(0, 8);
}

function buildOpportunities(snapshot: RevenueSnapshotV1): ExecutiveOpportunity[] {
  const opportunities: ExecutiveOpportunity[] = [];
  const topSource = [...snapshot.performance.bySource].sort((a, b) => b.conversionRate - a.conversionRate || b.leads - a.leads)[0];
  const topService = [...snapshot.performance.byService].sort((a, b) => b.estimatedPipelineValue - a.estimatedPipelineValue || b.conversionRate - a.conversionRate)[0];
  const underusedSource = [...snapshot.performance.bySource]
    .filter((source) => source.leads > 0 && source.conversionRate >= snapshot.conversion.leadToAppointmentRate)
    .sort((a, b) => a.leads - b.leads)[0];

  if (topSource) {
    opportunities.push({
      title: `Escalar fuente: ${topSource.source}`,
      description: `${topSource.source} muestra conversión de ${topSource.conversionRate}% con ${topSource.leads} leads.`,
      priority: topSource.conversionRate >= 60 ? "high" : "medium",
      scoreImpact: roundOne(topSource.conversionRate),
    });
  }

  if (topService) {
    opportunities.push({
      title: `Priorizar servicio: ${topService.service}`,
      description: `${topService.service} concentra pipeline estimado de ${topService.estimatedPipelineValue}.`,
      priority: topService.estimatedPipelineValue > 0 ? "high" : "medium",
      scoreImpact: round(clamp(topService.conversionRate + Math.min(20, topService.completed * 5))),
    });
  }

  if (underusedSource && underusedSource.leads <= Math.max(2, snapshot.totals.leads * 0.2)) {
    opportunities.push({
      title: `Fuente subutilizada: ${underusedSource.source}`,
      description: `${underusedSource.source} supera o iguala la conversión promedio, pero tiene bajo volumen relativo.`,
      priority: "medium",
      scoreImpact: roundOne(underusedSource.conversionRate - snapshot.conversion.leadToAppointmentRate),
    });
  }

  if (snapshot.totals.noShow > 0) {
    opportunities.push({
      title: "Reducir no-shows",
      description: `${snapshot.totals.noShow} leads aparecen como no asistió; reducirlos mejora revenue esperado sin aumentar captación.`,
      priority: "medium",
      scoreImpact: snapshot.totals.noShow,
    });
  }

  return opportunities.slice(0, 6);
}

function highestPriority(priorities: ExecutivePriority[], fallback: ExecutivePriority): ExecutivePriority {
  if (priorities.includes("high")) return "high";
  if (priorities.includes("medium")) return "medium";
  if (priorities.includes("low")) return "low";
  return fallback;
}

function healthFromScores(revenueScore: ExecutiveScore, growthScore: ExecutiveScore, alerts: ExecutiveDecisionAlert[]): ExecutiveHealthStatus {
  if (alerts.some((alert) => alert.severity === "high") || revenueScore.value < 35) return "critical";
  if (revenueScore.value < 55 || growthScore.value < 45 || alerts.some((alert) => alert.severity === "medium")) {
    return "attention-required";
  }
  if (revenueScore.value >= 80 && growthScore.value >= 60) return "excellent";
  return "healthy";
}

function buildInterpretation(
  revenueSnapshot: RevenueSnapshotV1,
  forecastSnapshot: RevenueForecastSnapshot,
  revenueScore: ExecutiveScore,
  growthScore: ExecutiveScore,
  opportunityIndex: ExecutiveScore,
  alerts: ExecutiveDecisionAlert[],
  opportunities: ExecutiveOpportunity[],
): ExecutiveInterpretation {
  const healthStatus = healthFromScores(revenueScore, growthScore, alerts);
  const riskLevel = highestPriority(
    alerts.map((alert) => (alert.severity === "high" ? "high" : alert.severity === "medium" ? "medium" : "low")),
    "low",
  );
  const opportunityLevel = highestPriority(opportunities.map((opportunity) => opportunity.priority), "low");
  const topOpportunity = opportunities[0]?.title ?? "mantener monitoreo de Revenue Intelligence";
  const topRisk = alerts[0]?.title ?? "sin riesgos ejecutivos críticos";
  const primaryFocus = riskLevel === "high" || riskLevel === "medium" ? topRisk : topOpportunity;

  const narrative =
    revenueSnapshot.totals.leads === 0
      ? "No hay volumen suficiente de leads para una interpretación ejecutiva robusta; conservar monitoreo read-only hasta contar con datos operativos."
      : `Salud ejecutiva ${healthStatus}; revenue score ${revenueScore.value}/100, growth score ${growthScore.value}/100 y confianza forecast ${forecastSnapshot.quality.confidenceScore}/100.`;

  return {
    healthStatus,
    riskLevel,
    opportunityLevel: opportunityIndex.value >= 65 ? opportunityLevel : opportunityLevel === "high" ? "medium" : opportunityLevel,
    narrative,
    primaryFocus,
  };
}

function buildPriorityActions(
  snapshot: RevenueSnapshotV1,
  forecast: RevenueForecastSnapshot,
  alerts: ExecutiveDecisionAlert[],
  opportunities: ExecutiveOpportunity[],
): ExecutivePriorityAction[] {
  const actions: ExecutivePriorityAction[] = [];

  if (snapshot.totals.leads > 0 && snapshot.conversion.leadToAppointmentRate < 45) {
    actions.push({
      title: "Elevar conversión Lead → Cita",
      category: "conversion",
      priority: "high",
      rationale: `Conversión actual: ${snapshot.conversion.leadToAppointmentRate}%.`,
      expectedOutcome: "Incrementar citas sin aumentar inversión de captación.",
    });
  }

  if (snapshot.totals.scheduled > 0 && snapshot.conversion.appointmentToAttendanceRate < 65) {
    actions.push({
      title: "Mejorar asistencia a citas",
      category: "attendance",
      priority: "medium",
      rationale: `Attendance actual: ${snapshot.conversion.appointmentToAttendanceRate}%.`,
      expectedOutcome: "Reducir no-shows y proteger revenue esperado.",
    });
  }

  if (forecast.risks.some((risk) => risk.code === "DATA_QUALITY")) {
    actions.push({
      title: "Corregir calidad de datos ejecutiva",
      category: "data-quality",
      priority: "medium",
      rationale: "Existen registros incompletos o no reconocidos en el snapshot.",
      expectedOutcome: "Mejorar confiabilidad de rankings, forecast y decisiones ejecutivas.",
    });
  }

  const negativeTrend = forecast.trends.find((trend) => trend.direction === "down");
  if (negativeTrend) {
    actions.push({
      title: `Revisar tendencia negativa: ${negativeTrend.metric}`,
      category: "growth",
      priority: negativeTrend.metric === "leadVolume" ? "medium" : "high",
      rationale: `${negativeTrend.metric} cayó ${Math.abs(negativeTrend.changePercent)}% contra el periodo previo comparable.`,
      expectedOutcome: "Detener deterioro temprano antes de afectar metas mensuales.",
    });
  }

  opportunities.slice(0, 2).forEach((opportunity) => {
    actions.push({
      title: opportunity.title,
      category: "opportunity",
      priority: opportunity.priority,
      rationale: opportunity.description,
      expectedOutcome: "Priorizar recursos hacia el mayor potencial comercial detectado.",
    });
  });

  if (snapshot.totals.leads === 0 && actions.length === 0) {
    actions.push({
      title: "Validar disponibilidad de datos operativos",
      category: "data-quality",
      priority: "low",
      rationale: "El snapshot no contiene leads; Executive Analytics conserva modo read-only y no asume persistencia adicional.",
      expectedOutcome: "Confirmar que la captura operativa esté disponible antes de tomar decisiones ejecutivas.",
    });
  }

  if (alerts.length === 0 && actions.length === 0) {
    actions.push({
      title: "Mantener cadencia ejecutiva semanal",
      category: "pipeline",
      priority: "low",
      rationale: "No se detectan riesgos ejecutivos relevantes en el snapshot actual.",
      expectedOutcome: "Conservar visibilidad ejecutiva sin introducir cambios operativos innecesarios.",
    });
  }

  return actions
    .sort((a, b) => {
      const weight = { high: 3, medium: 2, low: 1 } as const;
      return weight[b.priority] - weight[a.priority] || a.title.localeCompare(b.title);
    })
    .slice(0, 6);
}

export function createExecutiveAnalyticsSnapshot(
  revenueSnapshot: RevenueSnapshotV1,
  forecastSnapshot: RevenueForecastSnapshot,
  generatedAt = new Date().toISOString(),
): ExecutiveAnalyticsSnapshot {
  const revenueScore = calculateRevenueScore(revenueSnapshot, forecastSnapshot);
  const growthScore = calculateGrowthScore(forecastSnapshot);
  const opportunityIndex = calculateOpportunityIndex(revenueSnapshot, forecastSnapshot);
  const rankings = {
    sources: revenueSnapshot.performance.bySource.map(rankSource).sort(sortRanking).slice(0, 10),
    services: revenueSnapshot.performance.byService.map(rankService).sort(sortRanking).slice(0, 10),
  };
  const alerts = buildAlerts(revenueSnapshot, forecastSnapshot);
  const opportunities = buildOpportunities(revenueSnapshot);
  const interpretation = buildInterpretation(
    revenueSnapshot,
    forecastSnapshot,
    revenueScore,
    growthScore,
    opportunityIndex,
    alerts,
    opportunities,
  );
  const priorityActions = buildPriorityActions(revenueSnapshot, forecastSnapshot, alerts, opportunities);

  return {
    version: EXECUTIVE_ANALYTICS_VERSION,
    generatedAt,
    sourceSnapshotVersion: revenueSnapshot.version,
    sourceForecastVersion: forecastSnapshot.version,
    summary: {
      revenueScore,
      growthScore,
      opportunityIndex,
    },
    interpretation,
    priorityActions,
    rankings,
    alerts,
    opportunities,
    governance: {
      readOnly: true,
      sourceOfTruth: "Leads",
      revenueType: revenueSnapshot.pipeline.revenueType,
      limitations: [
        "Executive Analytics consume RevenueSnapshotV1 y RevenueForecastSnapshot; no escribe datos maestros.",
        "Scores ejecutivos son indicadores derivados para priorización, no registros financieros oficiales.",
        "59.3 agrega interpretación ejecutiva y acciones prioritarias sin persistencia nueva.",
      ],
    },
  };
}
