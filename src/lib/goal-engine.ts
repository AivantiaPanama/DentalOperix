import type { CrmDashboardMetrics } from "./api/crm-metrics";
import { currencyFormatter } from "./dashboard-insights";

export type BusinessGoals = {
  monthlyLeadsGoal: number;
  conversionGoal: number;
  attendanceGoal: number;
  pipelineValueGoal: number;
};

export type GoalProgress = {
  current: number;
  target: number;
  progressPercent: number;
  remaining: number;
  status: "on-track" | "warning" | "at-risk";
};

export type GoalProjection = {
  projectedLeads: number;
  projectedAppointments: number;
  projectedPipelineValue: number;
};

export type GoalRisk = {
  leads: boolean;
  conversion: boolean;
  attendance: boolean;
  pipelineValue: boolean;
};

export type GoalInsights = string[];

function getStatusFromProgress(progressPercent: number): GoalProgress["status"] {
  if (progressPercent >= 90) return "on-track";
  if (progressPercent >= 70) return "warning";
  return "at-risk";
}

export function calculateGoalProgress(current: number, target: number): GoalProgress {
  const safeTarget = Math.max(target, 1);
  const progressPercent = Math.min(100, Math.max(0, (current / safeTarget) * 100));
  return {
    current,
    target,
    progressPercent,
    remaining: Math.max(0, target - current),
    status: getStatusFromProgress(progressPercent),
  };
}

export function calculateMonthlyProjection(
  currentLeads: number,
  currentAppointments: number,
  currentPipelineValue: number,
  daysElapsed: number,
  daysInMonth: number,
): GoalProjection {
  const safeDaysElapsed = Math.max(daysElapsed, 1);
  const growthFactor = daysInMonth / safeDaysElapsed;
  return {
    projectedLeads: Math.round(currentLeads * growthFactor),
    projectedAppointments: Math.round(currentAppointments * growthFactor),
    projectedPipelineValue: Math.round(currentPipelineValue * growthFactor),
  };
}

export function calculateGoalRisk(
  projection: GoalProjection,
  goals: BusinessGoals,
  currentConversion: number,
  currentAttendance: number,
): GoalRisk {
  return {
    leads: projection.projectedLeads < goals.monthlyLeadsGoal,
    conversion: currentConversion < goals.conversionGoal,
    attendance: currentAttendance < goals.attendanceGoal,
    pipelineValue: projection.projectedPipelineValue < goals.pipelineValueGoal,
  };
}

export function generateGoalInsights(
  progress: {
    leads: GoalProgress;
    conversion: GoalProgress;
    attendance: GoalProgress;
    pipelineValue: GoalProgress;
  },
  projection: GoalProjection,
  goals: BusinessGoals,
): GoalInsights {
  const insights: GoalInsights = [];

  if (progress.leads.status === "on-track") {
    insights.push("✅ La meta mensual de leads se alcanzará si se mantiene la tendencia actual.");
  } else if (progress.leads.status === "warning") {
    insights.push(
      "⚠️ La meta mensual de leads está en advertencia; conviene mantener la intensidad comercial.",
    );
  } else {
    insights.push("🔴 La meta mensual de leads está en riesgo si no se ajusta la captación.");
  }

  if (progress.conversion.status === "on-track") {
    insights.push("✅ La conversión actual está alineada con la meta establecida.");
  } else if (progress.conversion.status === "warning") {
    insights.push("⚠️ La conversión proyectada está por debajo de la meta establecida.");
  } else {
    insights.push("🔴 La conversión está en riesgo y requiere atención inmediata.");
  }

  if (progress.attendance.status === "on-track") {
    insights.push("✅ La asistencia se mantiene dentro de los márgenes esperados.");
  } else if (progress.attendance.status === "warning") {
    insights.push("⚠️ La asistencia está en advertencia; mejora el recordatorio de citas.");
  } else {
    insights.push("🔴 La asistencia está en riesgo y puede afectar el cierre de tratamientos.");
  }

  if (progress.pipelineValue.status === "on-track") {
    insights.push("✅ El valor potencial proyectado está camino a la meta mensual.");
  } else if (progress.pipelineValue.status === "warning") {
    insights.push("⚠️ El valor potencial proyectado no alcanzará el objetivo mensual.");
  } else {
    insights.push(
      "🔴 El valor potencial proyectado está en riesgo de no cumplir el objetivo mensual.",
    );
  }

  if (projection.projectedLeads < goals.monthlyLeadsGoal) {
    insights.push(
      `⚠️ Proyección de leads para fin de mes: ${projection.projectedLeads}. Objetivo: ${goals.monthlyLeadsGoal}.`,
    );
  }

  if (projection.projectedPipelineValue < goals.pipelineValueGoal) {
    insights.push(
      `⚠️ Proyección de valor potencial para fin de mes: ${currencyFormatter.format(
        projection.projectedPipelineValue,
      )}. Objetivo: ${currencyFormatter.format(goals.pipelineValueGoal)}.`,
    );
  }

  return insights;
}
