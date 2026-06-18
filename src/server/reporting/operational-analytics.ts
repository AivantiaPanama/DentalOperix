import type {
  PatientAdministrativeProfile,
  PatientAdministrativeStatus,
} from "@/lib/patients/admin-profile";
import type { LeadOperationsProfile } from "@/server/leads/operations-repository";
import { getReportingReadSource, type ReportingReadSourceMode } from "./read-source";
import {
  LEAD_OPERATION_PRIORITIES,
  LEAD_OPERATIONAL_STATUSES,
  type LeadOperationPriority,
  type LeadOperationalStatus,
} from "@/server/leads/api-validation";

const PATIENT_ADMINISTRATIVE_STATUSES = ["incomplete", "pending-verification", "verified"] as const;

export const OPERATIONAL_REPORT_EXPORT_FORMATS = ["json", "csv"] as const;

export type OperationalReportExportFormat = (typeof OPERATIONAL_REPORT_EXPORT_FORMATS)[number];

type AnalyticsBucket = {
  label: string;
  value: number;
  percentage: number;
};

type ServiceBucket = AnalyticsBucket & {
  key: string;
};

export type OperationalReportFilters = {
  from?: string;
  to?: string;
  status?: LeadOperationalStatus;
  priority?: LeadOperationPriority;
  patientStatus?: PatientAdministrativeStatus;
  service?: string;
  source?: string;
  export?: OperationalReportExportFormat;
};

export type OperationalAnalyticsReport = {
  generatedAt: string;
  scope: "administrative-operational";
  filters: Omit<OperationalReportFilters, "export">;
  limits: string[];
  totals: {
    totalLeads: number;
    activeLeads: number;
    contacted: number;
    followUp: number;
    discarded: number;
    highPriority: number;
    dueFollowUps: number;
    scheduled: number;
    totalPatients: number;
    verifiedPatients: number;
    pendingVerification: number;
    incompletePatients: number;
    averageCompletion: number;
  };
  rates: {
    contactRate: number;
    schedulingRate: number;
    activeRate: number;
    verificationRate: number;
  };
  statusBuckets: AnalyticsBucket[];
  serviceBuckets: ServiceBucket[];
  recommendation: string;
  source: {
    leadOperations: number;
    patientAdministrativeProfiles: number;
    mode?: ReportingReadSourceMode;
    usedReadModel?: boolean;
    fallbackReason?: string;
    checkedReadModelPatients?: number;
  };
};

export class InvalidOperationalReportFiltersError extends Error {}

function percentage(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function normalizeValue(value: string | undefined | null): string {
  return (value ?? "").trim();
}

function normalizeText(value: string | undefined | null): string {
  return normalizeValue(value).toLowerCase();
}

function safeDate(value: string | undefined | null) {
  const normalized = normalizeValue(value);
  if (!normalized) return null;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function safeDayRange(value: string, endOfDay: boolean) {
  const date = safeDate(value);
  if (!date) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    date.setHours(endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0);
  }

  return date;
}

function isDueFollowUp(value: string) {
  const date = safeDate(value);
  if (!date) return false;

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date.getTime() <= today.getTime();
}

function leadAppointmentStatus(leadOperations: LeadOperationsProfile) {
  return normalizeText(leadOperations.lead.status);
}

function treatmentKey(value: string | undefined) {
  const normalized = normalizeValue(value);
  return normalized || "Servicio por definir";
}

function operationalStatusLabel(status: string) {
  if (status === "contactado") return "Contactado";
  if (status === "seguimiento") return "Seguimiento";
  if (status === "descartado") return "Descartado";
  return "Nuevo";
}

function buildStatusBuckets(leadOperations: LeadOperationsProfile[]): AnalyticsBucket[] {
  const total = leadOperations.length;
  const statuses = ["nuevo", "contactado", "seguimiento", "descartado"];

  return statuses.map((status) => {
    const value = leadOperations.filter((item) => item.operationalStatus === status).length;
    return {
      label: operationalStatusLabel(status),
      value,
      percentage: percentage(value, total),
    };
  });
}

function buildServiceBuckets(leadOperations: LeadOperationsProfile[]): ServiceBucket[] {
  const total = leadOperations.length;
  const grouped = leadOperations.reduce<Record<string, number>>((accumulator, item) => {
    const key = treatmentKey(item.lead.treatment);
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(grouped)
    .map(([key, value]) => ({ key, label: key, value, percentage: percentage(value, total) }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "es"))
    .slice(0, 5);
}

function buildRecommendationSummary(params: {
  dueFollowUps: number;
  pendingVerification: number;
  highPriority: number;
}) {
  if (params.dueFollowUps > 0) {
    return `${params.dueFollowUps} seguimiento(s) requieren revisión administrativa hoy o antes.`;
  }

  if (params.pendingVerification > 0) {
    return `${params.pendingVerification} perfil(es) pueden avanzar con verificación administrativa.`;
  }

  if (params.highPriority > 0) {
    return `${params.highPriority} lead(s) de prioridad alta conviene revisar con acompañamiento claro.`;
  }

  return "La operación no muestra pendientes críticos administrativos en este momento.";
}

function getLeadReportDate(item: LeadOperationsProfile): Date | null {
  return (
    safeDate(item.lead.createdAt) ?? safeDate(item.lead.preferredDate) ?? safeDate(item.updatedAt)
  );
}

function getPatientReportDate(patient: PatientAdministrativeProfile): Date | null {
  return (
    safeDate(patient.createdAt) ?? safeDate(patient.updatedAt) ?? safeDate(patient.preferredDate)
  );
}

function matchesDateRange(date: Date | null, filters: Omit<OperationalReportFilters, "export">) {
  if (!filters.from && !filters.to) return true;
  if (!date) return false;

  const from = filters.from ? safeDayRange(filters.from, false) : null;
  const to = filters.to ? safeDayRange(filters.to, true) : null;

  if (from && date.getTime() < from.getTime()) return false;
  if (to && date.getTime() > to.getTime()) return false;
  return true;
}

function matchesTextFilter(value: string | undefined, filter: string | undefined) {
  const normalizedFilter = normalizeText(filter);
  if (!normalizedFilter) return true;
  return normalizeText(value).includes(normalizedFilter);
}

function filterLeadOperations(
  leadOperations: LeadOperationsProfile[],
  filters: Omit<OperationalReportFilters, "export">,
) {
  return leadOperations.filter((item) => {
    if (!matchesDateRange(getLeadReportDate(item), filters)) return false;
    if (filters.status && item.operationalStatus !== filters.status) return false;
    if (filters.priority && item.priority !== filters.priority) return false;
    if (!matchesTextFilter(item.lead.treatment, filters.service)) return false;
    if (!matchesTextFilter(item.lead.source, filters.source)) return false;
    return true;
  });
}

function filterPatients(
  patients: PatientAdministrativeProfile[],
  filters: Omit<OperationalReportFilters, "export">,
) {
  return patients.filter((patient) => {
    if (!matchesDateRange(getPatientReportDate(patient), filters)) return false;
    if (filters.patientStatus && patient.administrativeStatus !== filters.patientStatus)
      return false;
    if (!matchesTextFilter(patient.treatmentInterest, filters.service)) return false;
    if (!matchesTextFilter(patient.source, filters.source)) return false;
    return true;
  });
}

function ensureDateFilter(value: string | undefined, field: string) {
  if (!value) return;
  if (!safeDate(value)) {
    throw new InvalidOperationalReportFiltersError(
      `El filtro ${field} debe tener una fecha válida.`,
    );
  }
}

function ensureEnumFilter<T extends readonly string[]>(
  value: string | undefined,
  allowed: T,
  field: string,
): T[number] | undefined {
  if (!value) return undefined;
  if (!allowed.includes(value)) {
    throw new InvalidOperationalReportFiltersError(
      `El filtro ${field} debe ser uno de: ${allowed.join(", ")}.`,
    );
  }
  return value as T[number];
}

function ensureTextFilter(value: string | undefined, field: string) {
  const normalized = normalizeValue(value);
  if (!normalized) return undefined;
  if (normalized.length > 80) {
    throw new InvalidOperationalReportFiltersError(
      `El filtro ${field} no puede exceder 80 caracteres.`,
    );
  }
  return normalized;
}

export function parseOperationalReportFilters(request: Request): OperationalReportFilters {
  const searchParams = new URL(request.url).searchParams;
  const from = normalizeValue(searchParams.get("from"));
  const to = normalizeValue(searchParams.get("to"));

  ensureDateFilter(from, "from");
  ensureDateFilter(to, "to");

  const fromDate = from ? safeDayRange(from, false) : null;
  const toDate = to ? safeDayRange(to, true) : null;
  if (fromDate && toDate && fromDate.getTime() > toDate.getTime()) {
    throw new InvalidOperationalReportFiltersError(
      "El filtro from no puede ser posterior al filtro to.",
    );
  }

  const exportFormat = ensureEnumFilter(
    normalizeValue(searchParams.get("export")),
    OPERATIONAL_REPORT_EXPORT_FORMATS,
    "export",
  );

  return {
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
    status: ensureEnumFilter(
      normalizeValue(searchParams.get("status")),
      LEAD_OPERATIONAL_STATUSES,
      "status",
    ),
    priority: ensureEnumFilter(
      normalizeValue(searchParams.get("priority")),
      LEAD_OPERATION_PRIORITIES,
      "priority",
    ),
    patientStatus: ensureEnumFilter(
      normalizeValue(searchParams.get("patientStatus")),
      PATIENT_ADMINISTRATIVE_STATUSES,
      "patientStatus",
    ),
    service: ensureTextFilter(searchParams.get("service") ?? undefined, "service"),
    source: ensureTextFilter(searchParams.get("source") ?? undefined, "source"),
    export: exportFormat,
  };
}

function toAppliedFilters(
  filters: OperationalReportFilters,
): Omit<OperationalReportFilters, "export"> {
  const { export: _export, ...appliedFilters } = filters;
  return appliedFilters;
}

export function buildOperationalAnalyticsReport(params: {
  leadOperations: LeadOperationsProfile[];
  patients: PatientAdministrativeProfile[];
  filters?: Omit<OperationalReportFilters, "export">;
  generatedAt?: string;
  sourceDiagnostics?: {
    mode: ReportingReadSourceMode;
    usedReadModel: boolean;
    fallbackReason?: string;
    checkedReadModelPatients: number;
  };
}): OperationalAnalyticsReport {
  const filters = params.filters ?? {};
  const leadOperations = filterLeadOperations(params.leadOperations, filters);
  const patients = filterPatients(params.patients, filters);
  const totalLeads = leadOperations.length;
  const contacted = leadOperations.filter((item) => item.operationalStatus === "contactado").length;
  const followUp = leadOperations.filter((item) => item.operationalStatus === "seguimiento").length;
  const discarded = leadOperations.filter((item) => item.operationalStatus === "descartado").length;
  const highPriority = leadOperations.filter((item) => item.priority === "alta").length;
  const dueFollowUps = leadOperations.filter(
    (item) => item.operationalStatus === "seguimiento" && isDueFollowUp(item.nextFollowUpAt),
  ).length;
  const scheduled = leadOperations.filter((item) => {
    const status = leadAppointmentStatus(item);
    return status === "agendada" || status === "confirmada" || status === "completada";
  }).length;
  const verifiedPatients = patients.filter(
    (patient) => patient.administrativeStatus === "verified",
  ).length;
  const pendingVerification = patients.filter(
    (patient) => patient.administrativeStatus === "pending-verification",
  ).length;
  const incompletePatients = patients.filter(
    (patient) => patient.administrativeStatus === "incomplete",
  ).length;
  const averageCompletion = patients.length
    ? Math.round(
        patients.reduce((sum, patient) => sum + patient.completionPercentage, 0) / patients.length,
      )
    : 0;

  const recommendation = buildRecommendationSummary({
    dueFollowUps,
    pendingVerification,
    highPriority,
  });

  return {
    generatedAt: params.generatedAt ?? new Date().toISOString(),
    scope: "administrative-operational",
    filters,
    limits: [
      "No crea citas.",
      "No modifica Calendar.",
      "No envía Gmail.",
      "No usa información clínica.",
      "No contiene métricas financieras.",
    ],
    totals: {
      totalLeads,
      activeLeads: totalLeads - discarded,
      contacted,
      followUp,
      discarded,
      highPriority,
      dueFollowUps,
      scheduled,
      totalPatients: patients.length,
      verifiedPatients,
      pendingVerification,
      incompletePatients,
      averageCompletion,
    },
    rates: {
      contactRate: percentage(contacted, totalLeads),
      schedulingRate: percentage(scheduled, totalLeads),
      activeRate: percentage(totalLeads - discarded, totalLeads),
      verificationRate: percentage(verifiedPatients, patients.length),
    },
    statusBuckets: buildStatusBuckets(leadOperations),
    serviceBuckets: buildServiceBuckets(leadOperations),
    recommendation,
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
  };
}

export function buildOperationalReportCsv(report: OperationalAnalyticsReport) {
  const rows = [
    ["Métrica", "Valor"],
    ["Generado", report.generatedAt],
    ["Desde", report.filters.from ?? ""],
    ["Hasta", report.filters.to ?? ""],
    ["Estado operativo", report.filters.status ?? ""],
    ["Prioridad", report.filters.priority ?? ""],
    ["Estado administrativo paciente", report.filters.patientStatus ?? ""],
    ["Servicio", report.filters.service ?? ""],
    ["Fuente", report.filters.source ?? ""],
    ["Leads activos", String(report.totals.activeLeads)],
    ["Leads totales", String(report.totals.totalLeads)],
    ["Tasa de contacto", `${report.rates.contactRate}%`],
    ["Seguimientos vencidos", String(report.totals.dueFollowUps)],
    ["Verificación administrativa", `${report.rates.verificationRate}%`],
    ["Pacientes verificados", String(report.totals.verifiedPatients)],
    ["Perfiles pendientes de verificación", String(report.totals.pendingVerification)],
    ["Recomendación", report.recommendation],
  ];

  return rows
    .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

export async function getOperationalAnalyticsReport(
  filters: OperationalReportFilters = {},
): Promise<OperationalAnalyticsReport> {
  const source = await getReportingReadSource();

  return buildOperationalAnalyticsReport({
    leadOperations: source.leadOperations,
    patients: source.patients,
    filters: toAppliedFilters(filters),
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
