import {
  calculateAttendanceRate,
  calculateConversionRate,
  calculateDailyTrend,
  calculateEstimatedPipelineValue,
  calculateMonthlyTrend,
  calculateServiceConversion,
  calculateSourceConversion,
  calculateWeeklyTrend,
  type CrmLeadRow,
  type TrendPoint,
} from "./crm-metrics";
import { normalizeDisplayText, normalizeServiceName } from "./text-normalization";

export const REVENUE_INTELLIGENCE_VERSION = "58.2-v1" as const;

export type RevenueLeadStatus = "nuevo" | "agendada" | "completada" | "cancelada" | "no asistió";

export type RevenueStatusDistribution = {
  status: RevenueLeadStatus | "unknown";
  leads: number;
};

export type RevenueSourcePerformance = {
  source: string;
  leads: number;
  scheduled: number;
  completed: number;
  conversionRate: number;
};

export type RevenueServicePerformance = {
  service: string;
  leads: number;
  scheduled: number;
  completed: number;
  conversionRate: number;
  estimatedPipelineValue: number;
};

export type RevenueTrendPoint = TrendPoint;

export type RevenueQualityReport = {
  missingSource: number;
  missingService: number;
  missingStatus: number;
  unknownStatus: number;
};

export type RevenueSnapshotV1 = {
  version: typeof REVENUE_INTELLIGENCE_VERSION;
  totals: {
    leads: number;
    scheduled: number;
    completed: number;
    cancelled: number;
    noShow: number;
  };
  conversion: {
    leadToAppointmentRate: number;
    appointmentToAttendanceRate: number;
    leadToAttendanceRate: number;
  };
  pipeline: {
    estimatedPipelineValue: number;
    expectedRevenue: number;
    averageLeadValue: number;
    revenueType: "estimated";
  };
  performance: {
    bySource: RevenueSourcePerformance[];
    byService: RevenueServicePerformance[];
    byStatus: RevenueStatusDistribution[];
  };
  trends: {
    daily: RevenueTrendPoint[];
    weekly: RevenueTrendPoint[];
    monthly: RevenueTrendPoint[];
  };
  quality: RevenueQualityReport;
};

const KNOWN_REVENUE_STATUSES: RevenueLeadStatus[] = [
  "nuevo",
  "agendada",
  "completada",
  "cancelada",
  "no asistió",
];

function roundPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(1));
}

function normalizeStatus(status?: string): RevenueLeadStatus | "unknown" {
  const normalized = status?.toString().trim().toLowerCase();
  if (!normalized) return "unknown";
  if (normalized === "no asistio") return "no asistió";
  if (KNOWN_REVENUE_STATUSES.includes(normalized as RevenueLeadStatus)) {
    return normalized as RevenueLeadStatus;
  }
  return "unknown";
}

function normalizeLeadRows(rows: CrmLeadRow[]): CrmLeadRow[] {
  return rows.map((row) => {
    const status = normalizeStatus(row.status?.toString());
    return {
      ...row,
      status,
      source: normalizeDisplayText(row.source) || "unknown",
      treatment: normalizeServiceName(row.treatment),
    };
  });
}

function calculateQuality(rows: CrmLeadRow[]): RevenueQualityReport {
  return rows.reduce(
    (acc, row) => {
      if (!normalizeDisplayText(row.source)) acc.missingSource += 1;
      if (!normalizeDisplayText(row.treatment)) acc.missingService += 1;
      if (!row.status?.toString().trim()) {
        acc.missingStatus += 1;
      } else if (normalizeStatus(row.status.toString()) === "unknown") {
        acc.unknownStatus += 1;
      }
      return acc;
    },
    { missingSource: 0, missingService: 0, missingStatus: 0, unknownStatus: 0 },
  );
}

function calculateStatusDistribution(rows: CrmLeadRow[]): RevenueStatusDistribution[] {
  const distribution = new Map<RevenueLeadStatus | "unknown", number>();

  rows.forEach((row) => {
    const status = normalizeStatus(row.status?.toString());
    distribution.set(status, (distribution.get(status) ?? 0) + 1);
  });

  return Array.from(distribution.entries()).map(([status, leads]) => ({ status, leads }));
}

export function createRevenueSnapshotV1(rows: CrmLeadRow[]): RevenueSnapshotV1 {
  const normalizedRows = normalizeLeadRows(rows);
  const totalLeads = normalizedRows.length;
  const completed = normalizedRows.filter((row) => row.status === "completada").length;
  const scheduledOnly = normalizedRows.filter((row) => row.status === "agendada").length;
  const scheduled = scheduledOnly + completed;
  const cancelled = normalizedRows.filter((row) => row.status === "cancelada").length;
  const noShow = normalizedRows.filter((row) => row.status === "no asistió").length;
  const estimatedPipelineValue = calculateEstimatedPipelineValue(normalizedRows);
  const leadToAppointmentRate = calculateConversionRate(normalizedRows);
  const expectedRevenue = Math.round(estimatedPipelineValue * (leadToAppointmentRate / 100));

  return {
    version: REVENUE_INTELLIGENCE_VERSION,
    totals: {
      leads: totalLeads,
      scheduled,
      completed,
      cancelled,
      noShow,
    },
    conversion: {
      leadToAppointmentRate,
      appointmentToAttendanceRate: calculateAttendanceRate(normalizedRows),
      leadToAttendanceRate: totalLeads === 0 ? 0 : roundPercent((completed / totalLeads) * 100),
    },
    pipeline: {
      estimatedPipelineValue,
      expectedRevenue,
      averageLeadValue: totalLeads === 0 ? 0 : Math.round(estimatedPipelineValue / totalLeads),
      revenueType: "estimated",
    },
    performance: {
      bySource: calculateSourceConversion(normalizedRows),
      byService: calculateServiceConversion(normalizedRows),
      byStatus: calculateStatusDistribution(rows),
    },
    trends: {
      daily: calculateDailyTrend(normalizedRows),
      weekly: calculateWeeklyTrend(normalizedRows),
      monthly: calculateMonthlyTrend(normalizedRows),
    },
    quality: calculateQuality(rows),
  };
}
