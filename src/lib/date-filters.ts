import type { CrmLeadRow } from "@/lib/crm-metrics";

export type DashboardPeriod =
  | "today"
  | "last7days"
  | "last30days"
  | "thisMonth"
  | "previousMonth"
  | "all";

const labels: Record<DashboardPeriod, string> = {
  today: "Hoy",
  last7days: "Últimos 7 días",
  last30days: "Últimos 30 días",
  thisMonth: "Este mes",
  previousMonth: "Mes anterior",
  all: "Todo",
};

const periodValues: DashboardPeriod[] = [
  "today",
  "last7days",
  "last30days",
  "thisMonth",
  "previousMonth",
  "all",
];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function parseLeadDate(value: string | undefined): Date | null {
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

function validPeriod(value: string | null): value is DashboardPeriod {
  return periodValues.includes(value as DashboardPeriod);
}

export function getPeriodLabel(period: DashboardPeriod) {
  return labels[period];
}

function getCurrentPeriodRange(period: DashboardPeriod, now: Date) {
  const today = startOfDay(now);
  let startDate: Date;
  let endDate: Date = today;

  switch (period) {
    case "today":
      startDate = today;
      break;
    case "last7days":
      startDate = addDays(today, -6);
      break;
    case "last30days":
      startDate = addDays(today, -29);
      break;
    case "thisMonth":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case "previousMonth":
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    default:
      return null;
  }

  return { startDate, endDate };
}

export function getPreviousPeriodRange(period: DashboardPeriod, now = new Date()) {
  const today = startOfDay(now);

  switch (period) {
    case "today": {
      const yesterday = addDays(today, -1);
      return { startDate: yesterday, endDate: yesterday };
    }
    case "last7days":
      return { startDate: addDays(today, -13), endDate: addDays(today, -7) };
    case "last30days":
      return { startDate: addDays(today, -59), endDate: addDays(today, -30) };
    case "thisMonth":
      return {
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        endDate: new Date(today.getFullYear(), today.getMonth(), 0),
      };
    case "previousMonth":
      return {
        startDate: new Date(today.getFullYear(), today.getMonth() - 2, 1),
        endDate: new Date(today.getFullYear(), today.getMonth() - 1, 0),
      };
    case "all":
      return null;
    default:
      return null;
  }
}

export function filterLeadsByDateRange(leads: CrmLeadRow[], startDate: Date, endDate: Date) {
  return leads.filter((lead) => {
    const createdAt = parseLeadDate(lead.createdAt ?? lead.date);
    if (!createdAt) return false;
    const createdDate = startOfDay(createdAt);
    return createdDate >= startDate && createdDate <= endDate;
  });
}

export function filterLeadsByPeriod(
  leads: CrmLeadRow[],
  period: DashboardPeriod,
  now = new Date(),
) {
  if (period === "all") return leads;

  const range = getCurrentPeriodRange(period, now);
  if (!range) return leads;

  return filterLeadsByDateRange(leads, range.startDate, range.endDate);
}

export function normalizeDashboardPeriod(value: string | null): DashboardPeriod {
  return validPeriod(value) ? value : "all";
}
