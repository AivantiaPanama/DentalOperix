import type { Role } from "@/lib/rbac/roles";
import { listLeadOperationsProfiles, type LeadOperationsProfile } from "@/server/leads/operations-repository";
import { listPatientAdministrativeProfiles } from "@/server/patients/admin-repository";
import type { PatientAdministrativeProfile } from "@/lib/patients/admin-profile";
import { listOperationalAuditEvents } from "@/server/audit/operational-audit";

export const OPERATIONAL_NOTIFICATION_TYPES = [
  "lead.follow_up.pending",
  "lead.priority.high",
  "patient.admin_profile.incomplete",
  "patient.profile.verification.pending",
  "audit.activity.recent",
  "report.activity.recent",
] as const;

export type OperationalNotificationType = (typeof OPERATIONAL_NOTIFICATION_TYPES)[number];
export type OperationalNotificationSeverity = "info" | "attention" | "warning";
export type OperationalNotificationAudience = "administrator" | "assistant";

export type OperationalNotification = {
  id: string;
  type: OperationalNotificationType;
  severity: OperationalNotificationSeverity;
  title: string;
  description: string;
  createdAt: string;
  resourceType: "lead" | "patient" | "audit" | "report";
  resourceId?: string;
  audience: OperationalNotificationAudience[];
  metadata?: Record<string, string | number | boolean | null>;
};

export type OperationalNotificationsSummary = {
  total: number;
  attention: number;
  warnings: number;
  generatedAt: string;
};

export type OperationalNotificationsResult = {
  notifications: OperationalNotification[];
  summary: OperationalNotificationsSummary;
};

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export class InvalidOperationalNotificationFiltersError extends Error {}

export type OperationalNotificationFilters = {
  limit: number;
  severity?: OperationalNotificationSeverity;
};

function isOperationalNotificationSeverity(value: string): value is OperationalNotificationSeverity {
  return value === "info" || value === "attention" || value === "warning";
}

export function parseOperationalNotificationFilters(request: Request): OperationalNotificationFilters {
  const url = new URL(request.url);
  const limitParam = url.searchParams.get("limit")?.trim();
  const severity = url.searchParams.get("severity")?.trim();
  const filters: OperationalNotificationFilters = { limit: DEFAULT_LIMIT };

  if (limitParam) {
    const parsedLimit = Number.parseInt(limitParam, 10);
    if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > MAX_LIMIT) {
      throw new InvalidOperationalNotificationFiltersError(`Invalid limit filter. Use 1-${MAX_LIMIT}.`);
    }
    filters.limit = parsedLimit;
  }

  if (severity) {
    if (!isOperationalNotificationSeverity(severity)) {
      throw new InvalidOperationalNotificationFiltersError("Invalid severity filter.");
    }
    filters.severity = severity;
  }

  return filters;
}

function nowIso() {
  return new Date().toISOString();
}

function getLeadDisplayName(leadOperations: LeadOperationsProfile) {
  return leadOperations.lead.name || `Lead ${leadOperations.leadId}`;
}

function shouldFollowUp(leadOperations: LeadOperationsProfile) {
  if (leadOperations.operationalStatus !== "seguimiento") return false;
  if (!leadOperations.nextFollowUpAt) return true;

  const followUpTime = Date.parse(leadOperations.nextFollowUpAt);
  if (Number.isNaN(followUpTime)) return true;
  return followUpTime <= Date.now();
}

function buildLeadNotifications(leadOperations: LeadOperationsProfile[], createdAt: string) {
  const pendingFollowUps = leadOperations.filter(shouldFollowUp).slice(0, 8).map<OperationalNotification>((item) => ({
    id: `lead-follow-up-${item.leadId}`,
    type: "lead.follow_up.pending",
    severity: "attention",
    title: "Seguimiento operativo pendiente",
    description: `${getLeadDisplayName(item)} requiere acompañamiento administrativo sin presión comercial.`,
    createdAt,
    resourceType: "lead",
    resourceId: item.leadId,
    audience: ["administrator", "assistant"],
    metadata: {
      status: item.operationalStatus,
      priority: item.priority,
      nextFollowUpAt: item.nextFollowUpAt || null,
    },
  }));

  const highPriority = leadOperations
    .filter((item) => item.priority === "alta" && item.operationalStatus !== "descartado")
    .slice(0, 5)
    .map<OperationalNotification>((item) => ({
      id: `lead-high-priority-${item.leadId}`,
      type: "lead.priority.high",
      severity: "warning",
      title: "Lead marcado como prioridad alta",
      description: `${getLeadDisplayName(item)} está marcado para atención cuidadosa del equipo operativo.`,
      createdAt,
      resourceType: "lead",
      resourceId: item.leadId,
      audience: ["administrator", "assistant"],
      metadata: {
        status: item.operationalStatus,
        nextFollowUpAt: item.nextFollowUpAt || null,
      },
    }));

  return [...pendingFollowUps, ...highPriority];
}

function buildPatientNotifications(patients: PatientAdministrativeProfile[], createdAt: string) {
  const incompleteProfiles = patients
    .filter((patient) => patient.missingFields.length > 0)
    .slice(0, 8)
    .map<OperationalNotification>((patient) => ({
      id: `patient-incomplete-${patient.id}`,
      type: "patient.admin_profile.incomplete",
      severity: "attention",
      title: "Perfil administrativo incompleto",
      description: `${patient.displayName} tiene datos administrativos pendientes de completar.`,
      createdAt,
      resourceType: "patient",
      resourceId: patient.id,
      audience: ["administrator", "assistant"],
      metadata: {
        completionPercentage: patient.completionPercentage,
        missingFields: patient.missingFields.join(", "),
      },
    }));

  const pendingVerification = patients
    .filter((patient) => patient.administrativeStatus === "pending-verification")
    .slice(0, 8)
    .map<OperationalNotification>((patient) => ({
      id: `patient-verification-${patient.id}`,
      type: "patient.profile.verification.pending",
      severity: "info",
      title: "Perfil pendiente de verificación",
      description: `${patient.displayName} está listo para revisión administrativa.`,
      createdAt,
      resourceType: "patient",
      resourceId: patient.id,
      audience: ["administrator", "assistant"],
      metadata: {
        completionPercentage: patient.completionPercentage,
      },
    }));

  return [...incompleteProfiles, ...pendingVerification];
}

async function buildAuditNotifications(createdAt: string) {
  const auditEvents = await listOperationalAuditEvents({ limit: 5 });

  return auditEvents.map<OperationalNotification>((event) => ({
    id: `audit-recent-${event.id}`,
    type: event.resourceType === "report" ? "report.activity.recent" : "audit.activity.recent",
    severity: "info",
    title: event.resourceType === "report" ? "Actividad reciente de reportes" : "Actividad operativa reciente",
    description: `${event.actorName || event.actorEmail || event.actorRole} registró ${event.action}.`,
    createdAt: event.timestamp || createdAt,
    resourceType: event.resourceType === "report" ? "report" : "audit",
    resourceId: event.resourceId,
    audience: ["administrator"],
    metadata: {
      action: event.action,
      actorRole: event.actorRole,
    },
  }));
}

function priorityRank(notification: OperationalNotification) {
  if (notification.severity === "warning") return 0;
  if (notification.severity === "attention") return 1;
  return 2;
}

export async function getOperationalNotifications(
  filters: OperationalNotificationFilters,
  role: Role,
): Promise<OperationalNotificationsResult> {
  const generatedAt = nowIso();
  const [leadOperations, patients, auditNotifications] = await Promise.all([
    listLeadOperationsProfiles(),
    listPatientAdministrativeProfiles(),
    buildAuditNotifications(generatedAt),
  ]);

  const notifications = [
    ...buildLeadNotifications(leadOperations, generatedAt),
    ...buildPatientNotifications(patients, generatedAt),
    ...auditNotifications,
  ]
    .filter((notification) => notification.audience.includes(role as OperationalNotificationAudience))
    .filter((notification) => !filters.severity || notification.severity === filters.severity)
    .sort((a, b) => priorityRank(a) - priorityRank(b) || b.createdAt.localeCompare(a.createdAt))
    .slice(0, filters.limit);

  return {
    notifications,
    summary: {
      total: notifications.length,
      attention: notifications.filter((item) => item.severity === "attention").length,
      warnings: notifications.filter((item) => item.severity === "warning").length,
      generatedAt,
    },
  };
}
