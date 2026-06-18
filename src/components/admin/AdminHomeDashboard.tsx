import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  ClipboardList,
  LineChart,
  RefreshCcw,
  Settings,
  Target,
  Users,
  Workflow,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchCRMmetrics, type CrmDashboardMetrics } from "@/lib/api/crm-metrics";
import { OperationalNotificationsPanel } from "@/components/operations/OperationalNotificationsPanel";
import { OperationalKpisPanel } from "@/components/operations/OperationalKpisPanel";
import { OperationalDataQualityPanel } from "@/components/operations/OperationalDataQualityPanel";
import { currencyFormatter } from "@/lib/dashboard-insights";
import { getDefaultGoals, loadGoalSettings, type GoalSettings } from "@/lib/goal-config";
import type { MockLead } from "@/lib/mock/leads";

type LeadsResponse = {
  leads?: MockLead[];
  fallback?: boolean;
  message?: string;
  error?: string;
};

type AutomationMetrics = {
  totalRuns: number;
  dryRuns: number;
  realRuns: number;
  successfulRuns: number;
  partialRuns: number;
  failedRuns: number;
  generated: number;
  sent: number;
  skipped: number;
  failed: number;
};

type AutomationRun = {
  id: string;
  timestamp: string;
  flow: string;
  dryRun: boolean;
  generated: number;
  sent: number;
  skipped: number;
  failed: number;
  actionCount: number;
  errors: string;
  status: "success" | "partial" | "failure";
};

type AutomationHistoryResponse = {
  success: boolean;
  records?: AutomationRun[];
  error?: string;
};

type AdminHomeState = {
  metrics: CrmDashboardMetrics | null;
  leads: MockLead[];
  goals: GoalSettings;
  automationMetrics: AutomationMetrics | null;
  fallbackLeads: boolean;
};

const emptyState: AdminHomeState = {
  metrics: null,
  leads: [],
  goals: getDefaultGoals(),
  automationMetrics: null,
  fallbackLeads: false,
};

const moduleCards = [
  {
    title: "Dashboard CRM",
    description: "Métricas, tendencias, objetivos y análisis comercial completo.",
    to: "/admin/dashboard",
    icon: LineChart,
  },
  {
    title: "Leads y CRM",
    description: "Consulta el pipeline desde Google Sheets y estado operativo de pacientes.",
    to: "/admin/dashboard",
    icon: Users,
  },
  {
    title: "Automatizaciones",
    description: "Ejecuta followups, revisa historial y audita envíos automatizados.",
    to: "/admin/automation",
    icon: Workflow,
  },
  {
    title: "Configuración",
    description: "Preparado para metas, usuarios, permisos y parámetros administrativos.",
    to: "/admin/dashboard",
    icon: Settings,
  },
] as const;

function percent(value: number | undefined) {
  return `${Number(value ?? 0).toFixed(1)}%`;
}

function formatDate(value: string) {
  if (!value) return "Pendiente";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-PA", { dateStyle: "medium" }).format(date);
}

function statusTone(status: MockLead["status"]) {
  if (status === "agendada" || status === "completada") return "bg-emerald-50 text-emerald-700";
  if (status === "cancelada" || status === "no asistió") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
}

function calculateAutomationMetrics(records: AutomationRun[] = []): AutomationMetrics {
  return records.reduce<AutomationMetrics>(
    (metrics, record) => {
      metrics.totalRuns += 1;
      if (record.dryRun) metrics.dryRuns += 1;
      else metrics.realRuns += 1;
      if (record.status === "success") metrics.successfulRuns += 1;
      else if (record.status === "partial") metrics.partialRuns += 1;
      else metrics.failedRuns += 1;
      metrics.generated += record.generated;
      metrics.sent += record.sent;
      metrics.skipped += record.skipped;
      metrics.failed += record.failed;
      return metrics;
    },
    {
      totalRuns: 0,
      dryRuns: 0,
      realRuns: 0,
      successfulRuns: 0,
      partialRuns: 0,
      failedRuns: 0,
      generated: 0,
      sent: 0,
      skipped: 0,
      failed: 0,
    },
  );
}

export function AdminHomeDashboard() {
  const [state, setState] = useState<AdminHomeState>(emptyState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const [metricsResult, leadsResult, goalsResult, automationResult] = await Promise.allSettled([
        fetchCRMmetrics("thisMonth"),
        fetch("/api/leads/list", { credentials: "same-origin" }).then(async (response) => {
          const payload = (await response.json()) as LeadsResponse;
          if (!response.ok) throw new Error(payload.error ?? "No se pudieron cargar leads.");
          return payload;
        }),
        loadGoalSettings(),
        fetch("/api/followups/history", { credentials: "same-origin" }).then(async (response) => {
          const payload = (await response.json()) as AutomationHistoryResponse;
          if (!response.ok || !payload.success) {
            throw new Error(payload.error ?? "No se pudo cargar automatización.");
          }
          return payload;
        }),
      ]);

      const metrics = metricsResult.status === "fulfilled" ? metricsResult.value : null;
      const leadsPayload = leadsResult.status === "fulfilled" ? leadsResult.value : null;
      const goals = goalsResult.status === "fulfilled" ? goalsResult.value : getDefaultGoals();
      const automation = automationResult.status === "fulfilled" ? automationResult.value : null;

      setState({
        metrics,
        leads: leadsPayload?.leads ?? [],
        fallbackLeads: Boolean(leadsPayload?.fallback),
        goals,
        automationMetrics: automation ? calculateAutomationMetrics(automation.records ?? []) : null,
      });

      const failures = [metricsResult, leadsResult, goalsResult, automationResult].filter(
        (result) => result.status === "rejected",
      );
      setError(failures.length ? "Algunos módulos no pudieron cargar datos en este momento." : null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const recentLeads = useMemo(() => state.leads.slice(0, 5), [state.leads]);
  const scheduledToday = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return state.leads.filter((lead) => lead.preferredDate?.startsWith(today)).length;
  }, [state.leads]);

  const metrics = state.metrics;
  const conversionGoalProgress = metrics
    ? Math.min(100, Math.round((metrics.conversionRate / state.goals.conversionGoal) * 100))
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Administración</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-deep">
            Dashboard administrativo
          </h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Vista ejecutiva para operación, CRM, objetivos y automatizaciones. Esta pantalla usa
            APIs ya protegidas por permisos RBAC.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => void loadDashboard()} disabled={loading}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
          <Button asChild>
            <Link to="/admin/dashboard">
              Ver análisis completo <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {error ? (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800">
          {error} La navegación administrativa sigue disponible.
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-3xl border border-border bg-white p-10 text-center text-lg font-medium text-muted-foreground shadow-soft">
          Cargando resumen administrativo...
        </div>
      ) : (
        <>
          <OperationalNotificationsPanel />
          <OperationalKpisPanel />
          <OperationalDataQualityPanel />

          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Leads del mes</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-deep">{metrics?.totals.leads ?? state.leads.length}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Meta mensual: {state.goals.monthlyLeadsGoal} leads
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Conversión</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-deep">{percent(metrics?.conversionRate)}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {conversionGoalProgress}% de la meta configurada
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pipeline</CardTitle>
                <Target className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-deep">
                  {currencyFormatter.format(metrics?.pipelineValue ?? 0)}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Meta: {currencyFormatter.format(state.goals.pipelineValueGoal)}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Agenda hoy</CardTitle>
                <CalendarDays className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-deep">{scheduledToday}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Basado en fecha preferida de leads disponibles
                </p>
              </CardContent>
            </Card>
          </section>

          <section id="leads" className="mt-6 scroll-mt-24 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
            <Card className="shadow-soft">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>Leads recientes</CardTitle>
                  <CardDescription>
                    Últimos registros disponibles para seguimiento administrativo.
                  </CardDescription>
                </div>
                {state.fallbackLeads ? <Badge variant="secondary">Datos demo</Badge> : null}
              </CardHeader>
              <CardContent>
                {recentLeads.length ? (
                  <div className="divide-y divide-border rounded-2xl border border-border">
                    {recentLeads.map((lead) => (
                      <div key={lead.id} className="grid gap-3 p-4 md:grid-cols-[1.2fr_1fr_auto] md:items-center">
                        <div>
                          <p className="font-semibold text-deep">{lead.name}</p>
                          <p className="text-sm text-muted-foreground">{lead.email} · {lead.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-deep">{lead.treatment}</p>
                          <p className="text-xs text-muted-foreground">Preferencia: {formatDate(lead.preferredDate)}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                    Aún no hay leads disponibles para mostrar.
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Automatizaciones</CardTitle>
                  <CardDescription>Estado operativo del módulo de followups.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-secondary/50 p-4">
                      <p className="text-xs text-muted-foreground">Ejecuciones</p>
                      <p className="mt-1 text-2xl font-bold text-deep">
                        {state.automationMetrics?.totalRuns ?? 0}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-secondary/50 p-4">
                      <p className="text-xs text-muted-foreground">Enviados</p>
                      <p className="mt-1 text-2xl font-bold text-deep">
                        {state.automationMetrics?.sent ?? 0}
                      </p>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/admin/automation">Abrir automatizaciones</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Módulos administrativos</CardTitle>
                  <CardDescription>Accesos preparados para operación administrativa.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {moduleCards.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.title}
                        to={item.to}
                        className="flex items-start gap-3 rounded-2xl border border-border p-4 transition hover:border-primary hover:bg-secondary/30"
                      >
                        <span className="mt-1 grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block font-semibold text-deep">{item.title}</span>
                          <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                            {item.description}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </section>

          <section id="objetivos" className="mt-6 scroll-mt-24 grid gap-6 lg:grid-cols-3">
            <Card className="shadow-soft lg:col-span-2">
              <CardHeader>
                <CardTitle>Estado de objetivos</CardTitle>
                <CardDescription>Lectura rápida de metas configuradas para administración.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border p-4">
                  <p className="text-sm text-muted-foreground">Leads mensuales</p>
                  <p className="mt-1 text-xl font-bold text-deep">{state.goals.monthlyLeadsGoal}</p>
                </div>
                <div className="rounded-2xl border border-border p-4">
                  <p className="text-sm text-muted-foreground">Conversión objetivo</p>
                  <p className="mt-1 text-xl font-bold text-deep">{percent(state.goals.conversionGoal)}</p>
                </div>
                <div className="rounded-2xl border border-border p-4">
                  <p className="text-sm text-muted-foreground">Asistencia objetivo</p>
                  <p className="mt-1 text-xl font-bold text-deep">{percent(state.goals.attendanceGoal)}</p>
                </div>
                <div className="rounded-2xl border border-border p-4">
                  <p className="text-sm text-muted-foreground">Pipeline objetivo</p>
                  <p className="mt-1 text-xl font-bold text-deep">
                    {currencyFormatter.format(state.goals.pipelineValueGoal)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card id="configuracion" className="scroll-mt-24 shadow-soft">
              <CardHeader>
                <CardTitle>Arquitectura protegida</CardTitle>
                <CardDescription>Recordatorio operativo de FASE 14.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-3 rounded-2xl bg-secondary/40 p-4">
                  <ClipboardList className="mt-0.5 h-4 w-4 text-primary" />
                  <p>BookingDialog sigue siendo el único flujo público autorizado para citas.</p>
                </div>
                <div className="flex gap-3 rounded-2xl bg-secondary/40 p-4">
                  <Workflow className="mt-0.5 h-4 w-4 text-primary" />
                  <p>CRM, Calendar y Gmail permanecen sin cambios en esta iteración.</p>
                </div>
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}
