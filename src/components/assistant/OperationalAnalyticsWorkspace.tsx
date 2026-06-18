import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CalendarClock,
  ClipboardCheck,
  Download,
  FileText,
  RefreshCcw,
  ShieldCheck,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { OperationalAnalyticsReport } from "@/server/reporting/operational-analytics";

type OperationalReportResponse = {
  success?: boolean;
  report?: OperationalAnalyticsReport;
  error?: string;
};

type OperationalReportFilters = {
  from: string;
  to: string;
  status: string;
  priority: string;
  patientStatus: string;
  service: string;
  source: string;
};

const emptyFilters: OperationalReportFilters = {
  from: "",
  to: "",
  status: "",
  priority: "",
  patientStatus: "",
  service: "",
  source: "",
};

const emptyReport: OperationalAnalyticsReport = {
  generatedAt: "",
  scope: "administrative-operational",
  limits: [],
  totals: {
    totalLeads: 0,
    activeLeads: 0,
    contacted: 0,
    followUp: 0,
    discarded: 0,
    highPriority: 0,
    dueFollowUps: 0,
    scheduled: 0,
    totalPatients: 0,
    verifiedPatients: 0,
    pendingVerification: 0,
    incompletePatients: 0,
    averageCompletion: 0,
  },
  rates: {
    contactRate: 0,
    schedulingRate: 0,
    activeRate: 0,
    verificationRate: 0,
  },
  statusBuckets: [],
  serviceBuckets: [],
  recommendation: "La operación no muestra pendientes críticos administrativos en este momento.",
  filters: {},
  source: {
    leadOperations: 0,
    patientAdministrativeProfiles: 0,
  },
};

function statusClass(label: string) {
  const normalized = label.toLowerCase().trim();
  if (normalized === "contactado" || normalized === "verified")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (normalized === "seguimiento" || normalized === "pending-verification")
    return "border-blue-200 bg-blue-50 text-blue-700";
  if (normalized === "descartado") return "border-slate-200 bg-slate-50 text-slate-700";
  return "border-amber-200 bg-amber-50 text-amber-700";
}

function formatGeneratedAt(value: string) {
  if (!value) return "Pendiente de generación";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-PA", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function buildQueryString(filters: OperationalReportFilters, extra?: Record<string, string>) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    const normalized = value.trim();
    if (normalized) params.set(key, normalized);
  });

  Object.entries(extra ?? {}).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const query = params.toString();
  return query ? `?${query}` : "";
}

function buildCsvReport(report: OperationalAnalyticsReport) {
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

function downloadTextFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function OperationalAnalyticsWorkspace() {
  const [report, setReport] = useState<OperationalAnalyticsReport>(emptyReport);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OperationalReportFilters>(emptyFilters);

  const updateFilter = (key: keyof OperationalReportFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const loadAnalyticsData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/reports/operational${buildQueryString(filters)}`, {
        credentials: "same-origin",
      });
      const payload = (await response.json()) as OperationalReportResponse;

      if (!response.ok || !payload.success || !payload.report) {
        throw new Error(payload.error ?? "No se pudo cargar el reporte operativo.");
      }

      setReport(payload.report);
    } catch (loadError) {
      setReport(emptyReport);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudieron cargar los indicadores operativos.",
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void loadAnalyticsData();
  }, [loadAnalyticsData]);

  const exportCsv = () => {
    downloadTextFile(
      "dentaloperix-reporte-operativo.csv",
      buildCsvReport(report),
      "text/csv;charset=utf-8",
    );
  };

  const exportJson = () => {
    downloadTextFile(
      "dentaloperix-reporte-operativo.json",
      `${JSON.stringify(report, null, 2)}\n`,
      "application/json;charset=utf-8",
    );
  };

  const resetFilters = () => {
    setFilters(emptyFilters);
  };

  return (
    <Card className="shadow-soft">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>Reporting operativo</CardTitle>
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
              FASE 14.4-C
            </Badge>
          </div>
          <CardDescription>
            Indicadores administrativos centralizados con filtros operativos y exportación
            endurecida. No incluye métricas clínicas ni financieras.
          </CardDescription>
          <p className="mt-2 text-xs text-muted-foreground">
            Generado: {formatGeneratedAt(report.generatedAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={exportCsv}
            disabled={loading || Boolean(error)}
          >
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={exportJson}
            disabled={loading || Boolean(error)}
          >
            <FileText className="mr-2 h-4 w-4" />
            JSON
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void loadAnalyticsData()}
            disabled={loading}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>No se pudieron cargar los indicadores</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <section className="rounded-2xl border border-border bg-background/70 p-4">
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-semibold text-deep">Filtros del reporte</p>
              <p className="text-sm text-muted-foreground">
                Aplican solo a información administrativa y operativa.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetFilters}
                disabled={loading}
              >
                Limpiar
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => void loadAnalyticsData()}
                disabled={loading}
              >
                Aplicar filtros
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="space-y-1 text-sm">
              <span className="font-medium text-deep">Desde</span>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                type="date"
                value={filters.from}
                onChange={(event) => updateFilter("from", event.target.value)}
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-deep">Hasta</span>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                type="date"
                value={filters.to}
                onChange={(event) => updateFilter("to", event.target.value)}
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-deep">Estado lead</span>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={filters.status}
                onChange={(event) => updateFilter("status", event.target.value)}
              >
                <option value="">Todos</option>
                <option value="nuevo">Nuevo</option>
                <option value="contactado">Contactado</option>
                <option value="seguimiento">Seguimiento</option>
                <option value="descartado">Descartado</option>
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-deep">Prioridad</span>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={filters.priority}
                onChange={(event) => updateFilter("priority", event.target.value)}
              >
                <option value="">Todas</option>
                <option value="baja">Baja</option>
                <option value="normal">Normal</option>
                <option value="alta">Alta</option>
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-deep">Estado paciente</span>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={filters.patientStatus}
                onChange={(event) => updateFilter("patientStatus", event.target.value)}
              >
                <option value="">Todos</option>
                <option value="incomplete">Incompleto</option>
                <option value="pending-verification">Pendiente verificación</option>
                <option value="verified">Verificado</option>
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-deep">Servicio</span>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={filters.service}
                maxLength={80}
                placeholder="Ortodoncia"
                onChange={(event) => updateFilter("service", event.target.value)}
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-deep">Fuente</span>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={filters.source}
                maxLength={80}
                placeholder="web"
                onChange={(event) => updateFilter("source", event.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-muted-foreground">Leads activos</p>
              <UsersRound className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 text-3xl font-bold text-deep">
              {loading ? "..." : report.totals.activeLeads}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {report.rates.activeRate}% de leads no descartados.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-muted-foreground">Tasa de contacto</p>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 text-3xl font-bold text-deep">
              {loading ? "..." : `${report.rates.contactRate}%`}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {report.totals.contacted} lead(s) marcados como contactados.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-muted-foreground">Seguimientos vencidos</p>
              <CalendarClock className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 text-3xl font-bold text-deep">
              {loading ? "..." : report.totals.dueFollowUps}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              revisión amable, sin presión comercial.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-muted-foreground">
                Verificación administrativa
              </p>
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 text-3xl font-bold text-deep">
              {loading ? "..." : `${report.rates.verificationRate}%`}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {report.totals.verifiedPatients} perfil(es) verificados.
            </p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-background/70 p-4">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <BarChart3 className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-deep">Embudo operativo</p>
                  <p className="text-sm text-muted-foreground">
                    Lectura administrativa, no financiera ni clínica.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-deep">Leads con cita registrada</span>
                    <span className="text-muted-foreground">{report.rates.schedulingRate}%</span>
                  </div>
                  <Progress value={report.rates.schedulingRate} />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-deep">Perfiles completos promedio</span>
                    <span className="text-muted-foreground">
                      {report.totals.averageCompletion}%
                    </span>
                  </div>
                  <Progress value={report.totals.averageCompletion} />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-deep">Pacientes verificados</span>
                    <span className="text-muted-foreground">{report.rates.verificationRate}%</span>
                  </div>
                  <Progress value={report.rates.verificationRate} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background/70 p-4">
              <p className="font-semibold text-deep">Distribución por estado operativo</p>
              <div className="mt-4 space-y-3">
                {report.statusBuckets.map((bucket) => (
                  <div key={bucket.label}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <Badge variant="outline" className={statusClass(bucket.label)}>
                        {bucket.label}
                      </Badge>
                      <span className="text-muted-foreground">
                        {bucket.value} · {bucket.percentage}%
                      </span>
                    </div>
                    <Progress value={bucket.percentage} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <ClipboardCheck className="mt-1 h-4 w-4 text-primary" />
                <div>
                  <p className="font-semibold text-deep">Lectura recomendada</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {report.recommendation}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background/70 p-4">
              <p className="font-semibold text-deep">Servicios con más actividad</p>
              <div className="mt-4 space-y-3">
                {report.serviceBuckets.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No hay actividad suficiente para mostrar distribución.
                  </p>
                ) : null}
                {report.serviceBuckets.map((bucket) => (
                  <div key={bucket.key}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span className="line-clamp-1 font-medium text-deep">{bucket.label}</span>
                      <span className="text-muted-foreground">{bucket.value}</span>
                    </div>
                    <Progress value={bucket.percentage} />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background/70 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-1 h-4 w-4 text-primary" />
                <div>
                  <p className="font-semibold text-deep">Límites de la fase</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Esta vista no crea citas, no modifica Calendar, no envía Gmail y no usa datos
                    clínicos.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </CardContent>
    </Card>
  );
}
