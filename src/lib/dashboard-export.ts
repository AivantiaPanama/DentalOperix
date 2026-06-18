import type { CrmDashboardMetrics } from "./api/crm-metrics";

function escapeCsvCell(value: string | number | boolean | null | undefined) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function formatDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

export function exportDashboardMetricsToCsv(metrics: CrmDashboardMetrics) {
  const rows: string[] = [];
  const row = (cells: Array<string | number | boolean | null | undefined>) =>
    rows.push(cells.map(escapeCsvCell).join(","));

  row(["Dashboard DentalOperix"]);
  row(["Fecha", formatDate(new Date())]);
  row([]);

  row(["KPIs"]);
  row(["Métrica", "Valor"]);
  row(["Leads nuevos", metrics.totals.leads]);
  row(["Citas agendadas", metrics.totals.agendadas]);
  row(["Citas completadas", metrics.totals.completadas]);
  row(["Canceladas", metrics.totals.canceladas]);
  row(["No asistió", metrics.totals.noAsistio]);
  row(["Tasa de conversión (%)", metrics.conversionRate]);
  row(["Tasa de asistencia (%)", metrics.attendanceRate]);
  row(["Pipeline estimado (USD)", metrics.pipelineValue]);
  row([]);

  row(["Fuente de conversión"]);
  row(["Fuente", "Leads", "Convertidos", "Conversión %"]);
  metrics.sourceConversions.forEach((item) => {
    row([item.source, item.leads, item.completed, item.conversionRate]);
  });
  row([]);

  row(["Servicio de conversión"]);
  row(["Servicio", "Leads", "Convertidos", "Conversión %", "Valor potencial estimado"]);
  metrics.serviceConversions.forEach((item) => {
    row([
      item.service,
      item.leads,
      item.completed,
      item.conversionRate,
      item.estimatedPipelineValue,
    ]);
  });
  row([]);

  row(["Tendencia de servicios"]);
  row(["Período", "Servicio", "Leads"]);
  metrics.serviceTrend.forEach((item) => {
    row([item.period ?? "Actual", item.service, item.leads]);
  });

  const csv = "\ufeff" + rows.join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `dentaloperix-dashboard-${formatDate(new Date())}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
