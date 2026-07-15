import { listOperationalAuditEvents } from "@/server/audit/operational-audit";
import type { LeadOperationsProfile } from "@/server/leads/operations-repository";
import { getOperationalKpisReadSource, type OperationalKpisReadSourceMode } from "./read-source";
import type { PatientAdministrativeProfile } from "@/lib/patients/admin-profile";

export type OperationalKpiMetric = {
  label: string;
  value: number;
  detail: string;
};

export type OperationalKpiTrend = {
  label: string;
  value: number;
  percentage: number;
};

export type OperationalExecutiveKpis = {
  generatedAt: string;
  scope: "administrative-operational";
  limits: string[];
  leads: {
    total: number;
    active: number;
    pending: number;
    closed: number;
    highPriority: number;
    dueFollowUps: number;
    conversionRate: number;
  };
  patients: {
    total: number;
    verified: number;
    pendingVerification: number;
    incomplete: number;
    verificationRate: number;
    averageCompletion: number;
  };
  audit: {
    eventsLast30Days: number;
    patientUpdates: number;
    leadUpdates: number;
    reportViews: number;
    reportExports: number;
  };
  reports: {
    generated: number;
    csvExports: number;
    jsonViews: number;
  };
  health: {
    score: number;
    status: "stable" | "attention" | "watch";
    summary: string;
    recommendations: string[];
  };
  source: {
    leadOperations: number;
    patientAdministrativeProfiles: number;
    mode?: OperationalKpisReadSourceMode;
    usedReadModel?: boolean;
    fallbackReason?: string;
    checkedReadModelPatients?: number;
  };
  trends: {
    leadStatus: OperationalKpiTrend[];
    patientStatus: OperationalKpiTrend[];
    activity: OperationalKpiTrend[];
  };
};

function percentage(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function isScheduledStatus(value: string | undefined) {
  const normalized = (value ?? "").toLowerCase().trim();
  return normalized === "agendada" || normalized === "confirmada" || normalized === "completada";
}

function isDueFollowUp(leadOperations: LeadOperationsProfile) {
  if (leadOperations.operationalStatus !== "seguimiento") return false;
  if (!leadOperations.nextFollowUpAt) return true;

  const followUpTime = Date.parse(leadOperations.nextFollowUpAt);
  return Number.isNaN(followUpTime) || followUpTime <= Date.now();
}

function countPatientsByStatus(
  patients: PatientAdministrativeProfile[],
  status: PatientAdministrativeProfile["administrativeStatus"],
) {
  return patients.filter((patient) => patient.administrativeStatus === status).length;
}

function buildHealthSummary(params: {
  dueFollowUps: number;
  pendingVerification: number;
  incompletePatients: number;
  verificationRate: number;
  conversionRate: number;
}): OperationalExecutiveKpis["health"] {
  const risks = [params.dueFollowUps, params.pendingVerification, params.incompletePatients].filter(
    (value) => value > 0,
  ).length;
  const score = Math.max(
    0,
    Math.min(
      100,
      70 +
        Math.round(params.verificationRate * 0.15) +
        Math.round(params.conversionRate * 0.15) -
        params.dueFollowUps * 4 -
        params.pendingVerification * 2 -
        params.incompletePatients * 2,
    ),
  );

  const status: OperationalExecutiveKpis["health"]["status"] =
    score >= 80 && risks === 0 ? "stable" : score >= 60 ? "attention" : "watch";
  const recommendations: string[] = [];

  if (params.dueFollowUps > 0) {
    recommendations.push(
      "Revisar seguimientos vencidos con acompañamiento claro y sin presión comercial.",
    );
  }
  if (params.pendingVerification > 0) {
    recommendations.push("Priorizar verificación administrativa de perfiles listos para revisión.");
  }
  if (params.incompletePatients > 0) {
    recommendations.push(
      "Completar datos administrativos faltantes antes de escalar nuevos procesos.",
    );
  }
  if (!recommendations.length) {
    recommendations.push(
      "Mantener monitoreo operativo y revisar tendencias antes de abrir nuevas fases.",
    );
  }

  return {
    score,
    status,
    summary:
      status === "stable"
        ? "La operación muestra estabilidad administrativa y trazabilidad suficiente."
        : "La operación requiere seguimiento administrativo focalizado en pendientes internos.",
    recommendations,
  };
}

export function buildOperationalExecutiveKpis(params: {
  leadOperations: LeadOperationsProfile[];
  patients: PatientAdministrativeProfile[];
  auditEvents: Awaited<ReturnType<typeof listOperationalAuditEvents>>;
  generatedAt?: string;
  sourceDiagnostics?: {
    mode: OperationalKpisReadSourceMode;
    usedReadModel: boolean;
    fallbackReason?: string;
    checkedReadModelPatients: number;
  };
}): OperationalExecutiveKpis {
  const leadOperations = params.leadOperations;
  const patients = params.patients;
  const auditEvents = params.auditEvents;

  const totalLeads = leadOperations.length;
  const closedLeads = leadOperations.filter(
    (lead) => lead.operationalStatus === "descartado",
  ).length;
  const activeLeads = totalLeads - closedLeads;
  const pendingLeads = leadOperations.filter(
    (lead) => lead.operationalStatus === "nuevo" || lead.operationalStatus === "seguimiento",
  ).length;
  const highPriority = leadOperations.filter(
    (lead) => lead.priority === "alta" && lead.operationalStatus !== "descartado",
  ).length;
  const dueFollowUps = leadOperations.filter(isDueFollowUp).length;
  const scheduled = leadOperations.filter((lead) => isScheduledStatus(lead.lead.status)).length;

  const verifiedPatients = countPatientsByStatus(patients, "verified");
  const pendingVerification = countPatientsByStatus(patients, "pending-verification");
  const incompletePatients = countPatientsByStatus(patients, "incomplete");
  const averageCompletion = patients.length
    ? Math.round(
        patients.reduce((sum, patient) => sum + patient.completionPercentage, 0) / patients.length,
      )
    : 0;

  const patientUpdates = auditEvents.filter(
    (event) =>
      event.action === "patient.admin_profile.updated" ||
      event.action === "patient.profile.verified",
  ).length;
  const leadUpdates = auditEvents.filter(
    (event) => event.action === "lead.operations.updated",
  ).length;
  const reportViews = auditEvents.filter(
    (event) => event.action === "report.operational.viewed",
  ).length;
  const reportExports = auditEvents.filter(
    (event) => event.action === "report.operational.exported",
  ).length;
  const conversionRate = percentage(scheduled, totalLeads);
  const verificationRate = percentage(verifiedPatients, patients.length);

  const health = buildHealthSummary({
    dueFollowUps,
    pendingVerification,
    incompletePatients,
    verificationRate,
    conversionRate,
  });

  return {
    generatedAt: params.generatedAt ?? new Date().toISOString(),
    scope: "administrative-operational",
    limits: [
      "No crea citas.",
      "No modifica Calendar.",
      "No envía Gmail.",
      "No usa información clínica.",
      "No contiene diagnósticos ni tratamientos clínicos.",
    ],
    leads: {
      total: totalLeads,
      active: activeLeads,
      pending: pendingLeads,
      closed: closedLeads,
      highPriority,
      dueFollowUps,
      conversionRate,
    },
    patients: {
      total: patients.length,
      verified: verifiedPatients,
      pendingVerification,
      incomplete: incompletePatients,
      verificationRate,
      averageCompletion,
    },
    audit: {
      eventsLast30Days: auditEvents.length,
      patientUpdates,
      leadUpdates,
      reportViews,
      reportExports,
    },
    reports: {
      generated: reportViews + reportExports,
      csvExports: reportExports,
      jsonViews: reportViews,
    },
    health,
    source: {
      leadOperations: leadOperations.length,
      patientAdministrativeProfiles: patients.length,
      ...(params.sourceDiagnostics
        ? {
            mode: params.sourceDiagnostics.mode,
            usedReadModel: params.sourceDiagnostics.usedReadModel,
            ...(params.sourceDiagnostics.fallbackReason
              ? { fallbackReason: params.sourceDiagnostics.fallbackReason }
              : {}),
            checkedReadModelPatients: params.sourceDiagnostics.checkedReadModelPatients,
          }
        : {}),
    },
    trends: {
      leadStatus: [
        { label: "Activos", value: activeLeads, percentage: percentage(activeLeads, totalLeads) },
        {
          label: "Pendientes",
          value: pendingLeads,
          percentage: percentage(pendingLeads, totalLeads),
        },
        { label: "Cerrados", value: closedLeads, percentage: percentage(closedLeads, totalLeads) },
      ],
      patientStatus: [
        { label: "Verificados", value: verifiedPatients, percentage: verificationRate },
        {
          label: "Pendientes",
          value: pendingVerification,
          percentage: percentage(pendingVerification, patients.length),
        },
        {
          label: "Incompletos",
          value: incompletePatients,
          percentage: percentage(incompletePatients, patients.length),
        },
      ],
      activity: [
        {
          label: "Pacientes",
          value: patientUpdates,
          percentage: percentage(patientUpdates, auditEvents.length),
        },
        {
          label: "Leads",
          value: leadUpdates,
          percentage: percentage(leadUpdates, auditEvents.length),
        },
        {
          label: "Reportes",
          value: reportViews + reportExports,
          percentage: percentage(reportViews + reportExports, auditEvents.length),
        },
      ],
    },
  };
}

function thirtyDaysAgoIso() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString();
}

export async function getOperationalExecutiveKpis(): Promise<OperationalExecutiveKpis> {
  const [source, auditEvents] = await Promise.all([
    getOperationalKpisReadSource(),
    listOperationalAuditEvents({ limit: 250, from: thirtyDaysAgoIso() }),
  ]);

  return buildOperationalExecutiveKpis({
    leadOperations: source.leadOperations,
    patients: source.patients,
    auditEvents,
    sourceDiagnostics: {
      mode: source.mode,
      usedReadModel: source.diagnostics.usedReadModel,
      ...(source.diagnostics.fallbackReason
        ? { fallbackReason: source.diagnostics.fallbackReason }
        : {}),
      checkedReadModelPatients: source.diagnostics.checkedReadModelPatients,
    },
  });
}
