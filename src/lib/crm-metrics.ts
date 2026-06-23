import type { LeadSource } from "./analytics";
import { format, startOfMonth, startOfWeek } from "date-fns";
import { SERVICE_ESTIMATED_VALUE } from "./service-values";
import { normalizeServiceName } from "./text-normalization";

export type CrmLeadStatus =
  | "nuevo"
  | "agendada"
  | "completada"
  | "cancelada"
  | "no asistió"
  | string;

export type CrmLeadRow = {
  id: string;
  createdAt?: string;
  date?: string;
  name: string;
  phone: string;
  email: string;
  treatment: string;
  message: string;
  urgency?: string;
  preferredDate?: string;
  status?: CrmLeadStatus;
  source?: LeadSource | string;
  aiSummary?: string;
  calendarEventId?: string;
  emailSent?: boolean | string;
};

export type TrendPoint = {
  label: string;
  leads: number;
  agendadas: number;
  completadas: number;
  canceladas: number;
  noAsistio: number;
};

export type MetricComparison = {
  current: number;
  previous: number;
  changePercent: number;
};

function parseLeadDate(value?: string) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const isoDateMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDateMatch) {
    const [, year, month, day] = isoDateMatch;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(trimmed);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getLeadDate(row: CrmLeadRow) {
  return parseLeadDate(row.createdAt ?? row.date);
}

function buildTrend(
  rows: CrmLeadRow[],
  groupFn: (date: Date) => Date,
  labelFn: (date: Date) => string,
) {
  const grouped = new Map<number, TrendPoint & { key: number }>();

  rows.forEach((row) => {
    const leadDate = getLeadDate(row);
    if (!leadDate) return;

    const groupStart = groupFn(leadDate);
    const key = groupStart.getTime();
    const existing = grouped.get(key);
    const label = labelFn(groupStart);

    if (!existing) {
      grouped.set(key, {
        key,
        label,
        leads: 0,
        agendadas: 0,
        completadas: 0,
        canceladas: 0,
        noAsistio: 0,
      });
    }

    const entry = grouped.get(key)!;
    entry.leads += 1;
    if (row.status === "agendada") entry.agendadas += 1;
    if (row.status === "completada") entry.completadas += 1;
    if (row.status === "cancelada") entry.canceladas += 1;
    if (row.status === "no asistió") entry.noAsistio += 1;
  });

  return Array.from(grouped.values())
    .sort((a, b) => a.key - b.key)
    .map(({ key, ...item }) => item);
}

export function calculateDailyTrend(rows: CrmLeadRow[]) {
  return buildTrend(
    rows,
    (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    (date) => format(date, "yyyy-MM-dd"),
  );
}

export function calculateWeeklyTrend(rows: CrmLeadRow[]) {
  return buildTrend(
    rows,
    (date) => startOfWeek(date, { weekStartsOn: 1 }),
    (date) => `Semana ${format(date, "yyyy-MM-dd")}`,
  );
}

export function calculateMonthlyTrend(rows: CrmLeadRow[]) {
  return buildTrend(
    rows,
    (date) => startOfMonth(date),
    (date) => format(date, "yyyy-MM"),
  );
}

function formatChangePercent(current: number, previous: number) {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }

  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export function calculatePeriodComparison(currentRows: CrmLeadRow[], previousRows: CrmLeadRow[]) {
  const currentLeads = currentRows.length;
  const previousLeads = previousRows.length;

  const currentScheduled = currentRows.filter(
    (row) => row.status === "agendada" || row.status === "completada",
  ).length;
  const previousScheduled = previousRows.filter(
    (row) => row.status === "agendada" || row.status === "completada",
  ).length;

  const currentCompleted = currentRows.filter((row) => row.status === "completada").length;
  const previousCompleted = previousRows.filter((row) => row.status === "completada").length;

  const currentConversion = calculateConversionRate(currentRows);
  const previousConversion = calculateConversionRate(previousRows);
  const currentCanceladas = currentRows.filter((row) => row.status === "cancelada").length;
  const previousCanceladas = previousRows.filter((row) => row.status === "cancelada").length;

  return {
    leads: {
      current: currentLeads,
      previous: previousLeads,
      changePercent: formatChangePercent(currentLeads, previousLeads),
    },
    agendadas: {
      current: currentScheduled,
      previous: previousScheduled,
      changePercent: formatChangePercent(currentScheduled, previousScheduled),
    },
    completadas: {
      current: currentCompleted,
      previous: previousCompleted,
      changePercent: formatChangePercent(currentCompleted, previousCompleted),
    },
    canceladas: {
      current: currentCanceladas,
      previous: previousCanceladas,
      changePercent: formatChangePercent(currentCanceladas, previousCanceladas),
    },
    conversionRate: {
      current: currentConversion,
      previous: previousConversion,
      changePercent: formatChangePercent(currentConversion, previousConversion),
    },
  };
}

export function calculateConversionRate(rows: CrmLeadRow[]) {
  const total = rows.length;
  if (total === 0) return 0;

  const converted = rows.filter(
    (row) => row.status === "agendada" || row.status === "completada",
  ).length;
  return Number(((converted / total) * 100).toFixed(1));
}

export function calculateAttendanceRate(rows: CrmLeadRow[]) {
  const scheduled = rows.filter(
    (row) => row.status === "agendada" || row.status === "completada",
  ).length;
  if (scheduled === 0) return 0;

  const attended = rows.filter((row) => row.status === "completada").length;
  return Number(((attended / scheduled) * 100).toFixed(1));
}

export type SourcePerformanceItem = {
  source: string;
  leads: number;
  scheduled: number;
  completed: number;
  conversionRate: number;
};

export function calculateSourcePerformance(rows: CrmLeadRow[]) {
  const grouped: Record<string, SourcePerformanceItem> = {};

  rows.forEach((row) => {
    const source = row.source ?? "unknown";
    const entry = grouped[source] ?? {
      source,
      leads: 0,
      scheduled: 0,
      completed: 0,
      conversionRate: 0,
    };

    entry.leads += 1;
    if (row.status === "agendada" || row.status === "completada") {
      entry.scheduled += 1;
    }
    if (row.status === "completada") {
      entry.completed += 1;
    }

    grouped[source] = entry;
  });

  return Object.values(grouped).map((item) => ({
    ...item,
    conversionRate: item.leads === 0 ? 0 : Number(((item.scheduled / item.leads) * 100).toFixed(1)),
  }));
}

export type ServicePerformanceItem = {
  service: string;
  leads: number;
  scheduled: number;
  completed: number;
  conversionRate: number;
};

export type SourceConversionItem = {
  source: string;
  leads: number;
  scheduled: number;
  completed: number;
  conversionRate: number;
};

export type ServiceConversionItem = {
  service: string;
  leads: number;
  scheduled: number;
  completed: number;
  conversionRate: number;
  estimatedPipelineValue: number;
};

export type ServiceTrendPoint = {
  service: string;
  leads: number;
  period?: string;
};

function getServiceEstimatedValue(service?: string) {
  if (!service) return 0;
  return SERVICE_ESTIMATED_VALUE[normalizeServiceName(service)] ?? 0;
}

export function calculateServicePerformance(rows: CrmLeadRow[]) {
  const grouped: Record<string, ServicePerformanceItem> = {};

  rows.forEach((row) => {
    const service = normalizeServiceName(row.treatment);
    const entry = grouped[service] ?? {
      service,
      leads: 0,
      scheduled: 0,
      completed: 0,
      conversionRate: 0,
    };

    entry.leads += 1;
    if (row.status === "agendada" || row.status === "completada") {
      entry.scheduled += 1;
    }
    if (row.status === "completada") {
      entry.completed += 1;
    }

    grouped[service] = entry;
  });

  return Object.values(grouped).map((item) => ({
    ...item,
    conversionRate: item.leads === 0 ? 0 : Number(((item.scheduled / item.leads) * 100).toFixed(1)),
  }));
}

export function calculateMetricComparison(current: number, previous: number): MetricComparison {
  return {
    current,
    previous,
    changePercent: formatChangePercent(current, previous),
  };
}

export function calculateEstimatedPipelineValue(rows: CrmLeadRow[]) {
  return rows.reduce((sum, row) => {
    const status = row.status?.toLowerCase();
    const isActiveLead = status !== "cancelada" && status !== "no asistió";
    if (!isActiveLead) return sum;

    return sum + getServiceEstimatedValue(row.treatment);
  }, 0);
}

export function calculateSourceConversion(rows: CrmLeadRow[]) {
  const grouped: Record<string, SourceConversionItem> = {};

  rows.forEach((row) => {
    const source = row.source ?? "unknown";
    const entry = grouped[source] ?? {
      source,
      leads: 0,
      scheduled: 0,
      completed: 0,
      conversionRate: 0,
    };

    entry.leads += 1;
    if (row.status === "agendada" || row.status === "completada") {
      entry.scheduled += 1;
    }
    if (row.status === "completada") {
      entry.completed += 1;
    }

    grouped[source] = entry;
  });

  return Object.values(grouped).map((item) => ({
    ...item,
    conversionRate: item.leads === 0 ? 0 : Number(((item.scheduled / item.leads) * 100).toFixed(1)),
  }));
}

export function calculateServiceConversion(rows: CrmLeadRow[]) {
  const grouped: Record<string, ServiceConversionItem> = {};

  rows.forEach((row) => {
    const service = normalizeServiceName(row.treatment);
    const entry = grouped[service] ?? {
      service,
      leads: 0,
      scheduled: 0,
      completed: 0,
      conversionRate: 0,
      estimatedPipelineValue: 0,
    };

    entry.leads += 1;
    if (row.status === "agendada" || row.status === "completada") {
      entry.scheduled += 1;
    }
    if (row.status === "completada") {
      entry.completed += 1;
    }
    entry.estimatedPipelineValue += getServiceEstimatedValue(row.treatment);

    grouped[service] = entry;
  });

  return Object.values(grouped)
    .map((item) => ({
      ...item,
      conversionRate:
        item.leads === 0 ? 0 : Number(((item.scheduled / item.leads) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.leads - a.leads);
}

export function calculateServiceTrend(rows: CrmLeadRow[], top = 5) {
  return calculateServiceConversion(rows)
    .slice(0, top)
    .map((item) => ({ service: item.service, leads: item.leads }));
}
