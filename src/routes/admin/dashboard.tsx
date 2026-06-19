import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRouteGuard } from "@/components/admin/AdminRouteGuard";
import { KpiCard } from "@/components/admin/KpiCard";
import { TrendChart } from "@/components/admin/TrendChart";
import { ComparisonBadge } from "@/components/admin/ComparisonBadge";
import { PipelineValueCard } from "@/components/admin/PipelineValueCard";
import { ServiceConversionTable } from "@/components/admin/ServiceConversionTable";
import { ServiceTrendChart } from "@/components/admin/ServiceTrendChart";
import { SourceConversionTable } from "@/components/admin/SourceConversionTable";
import { InsightsPanel } from "@/components/admin/InsightsPanel";
import { RecommendationsPanel } from "@/components/admin/RecommendationsPanel";
import { BusinessHealthCard } from "@/components/admin/BusinessHealthCard";
import { BusinessSignals } from "@/components/admin/BusinessSignals";
import { ExecutiveSummary } from "@/components/admin/ExecutiveSummary";
import { GoalInsights } from "@/components/admin/GoalInsights";
import { GoalRiskPanel } from "@/components/admin/GoalRiskPanel";
import { GoalSettingsPanel } from "@/components/admin/GoalSettingsPanel";
import { GoalsOverview } from "@/components/admin/GoalsOverview";
import { ExecutiveAnalyticsPanel } from "@/components/admin/ExecutiveAnalyticsPanel";
import type { CrmDashboardMetrics } from "@/lib/api/crm-metrics";
import { fetchRevenueDashboardMetrics } from "@/lib/api/revenue-dashboard-metrics";
import { fetchExecutiveAnalytics } from "@/lib/api/executive-analytics";
import type { ExecutiveAnalyticsSnapshot } from "@/lib/executive-analytics";
import { getPeriodLabel, type DashboardPeriod } from "@/lib/date-filters";
import {
  currencyFormatter,
  getBestConvertingService,
  getBestConvertingSource,
  getFastestGrowingService,
  getHighestValueService,
} from "@/lib/dashboard-insights";
import { exportDashboardMetricsToCsv } from "@/lib/dashboard-export";
import { generateBusinessInsights } from "@/lib/business-insights";
import { generateCommercialInsights } from "@/lib/commercial-insights";
import { calculateForecast } from "@/lib/forecast-engine";
import {
  calculateBusinessHealthScore,
  calculateBusinessSignals,
  generateExecutiveSummary,
} from "@/lib/business-health";
import { generateBusinessRecommendations } from "@/lib/recommendation-engine";
import {
  calculateConversionForecast,
  calculateExpectedRevenue,
  calculatePipelineValue,
} from "@/lib/commercial-pipeline";
import {
  getDefaultGoals,
  loadGoalSettings,
  saveGoalSettings,
  type GoalSettings,
} from "@/lib/goal-config";
import {
  calculateGoalProgress,
  calculateMonthlyProjection,
  calculateGoalRisk,
  generateGoalInsights,
} from "@/lib/goal-engine";

const PERIODS: Array<{ value: DashboardPeriod; label: string }> = [
  { value: "today", label: "Hoy" },
  { value: "last7days", label: "Últimos 7 días" },
  { value: "last30days", label: "Últimos 30 días" },
  { value: "thisMonth", label: "Este mes" },
  { value: "previousMonth", label: "Mes anterior" },
  { value: "all", label: "Todo" },
] as const;

export function hasDashboardLeads(metrics: CrmDashboardMetrics | null) {
  return (metrics?.totals?.leads ?? 0) > 0;
}

export function shouldReconcileDashboardMetrics(metrics: CrmDashboardMetrics | null) {
  return metrics?.emptyCRM === true && !hasDashboardLeads(metrics);
}

export function shouldShowDashboardEmptyCRM(
  metrics: CrmDashboardMetrics | null,
  loading: boolean,
  reconciling: boolean,
) {
  return !loading && !reconciling && shouldReconcileDashboardMetrics(metrics);
}

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — DentalOperix" },
      {
        name: "description",
        content: "Dashboard administrativo inicial para métricas CRM y conversión.",
      },
    ],
  }),
  component: DashboardPage,
});

export function DashboardPage() {
  const [metrics, setMetrics] = useState<CrmDashboardMetrics | null>(null);
  const [executiveAnalytics, setExecutiveAnalytics] = useState<ExecutiveAnalyticsSnapshot | null>(null);
  const [period, setPeriod] = useState<DashboardPeriod>("all");
  const [loading, setLoading] = useState(true);
  const [reconcilingMetrics, setReconcilingMetrics] = useState(false);
  const [executiveLoading, setExecutiveLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [executiveError, setExecutiveError] = useState<string | null>(null);
  const [goalSettings, setGoalSettings] = useState<GoalSettings>(getDefaultGoals());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const metricsRequestId = useRef(0);

  const loadMetrics = async (selectedPeriod: string) => {
    const requestId = metricsRequestId.current + 1;
    metricsRequestId.current = requestId;
    setLoading(true);
    setReconcilingMetrics(false);

    try {
      const initialMetrics = await fetchRevenueDashboardMetrics(selectedPeriod);
      let nextMetrics = initialMetrics;

      if (shouldReconcileDashboardMetrics(initialMetrics)) {
        setReconcilingMetrics(true);
        try {
          const reconciledMetrics = await fetchRevenueDashboardMetrics(selectedPeriod);
          if (hasDashboardLeads(reconciledMetrics) || !shouldReconcileDashboardMetrics(reconciledMetrics)) {
            nextMetrics = reconciledMetrics;
          }
        } catch (reconciliationError) {
          console.warn("Dashboard metrics reconciliation failed; keeping initial snapshot.", reconciliationError);
        }
      }

      if (metricsRequestId.current !== requestId) return;
      setMetrics(nextMetrics);
      setError(null);
    } catch (fetchError) {
      if (metricsRequestId.current !== requestId) return;
      console.error(fetchError);
      setError(fetchError instanceof Error ? fetchError.message : "Error al cargar métricas CRM.");
    } finally {
      if (metricsRequestId.current === requestId) {
        setReconcilingMetrics(false);
        setLoading(false);
      }
    }
  };


  const loadExecutiveAnalytics = (selectedPeriod: string) => {
    setExecutiveLoading(true);
    fetchExecutiveAnalytics(selectedPeriod)
      .then((data) => {
        setExecutiveAnalytics(data.executive);
        setExecutiveError(null);
      })
      .catch((fetchError) => {
        console.error(fetchError);
        setExecutiveAnalytics(null);
        setExecutiveError(
          fetchError instanceof Error ? fetchError.message : "Error al cargar Executive Analytics.",
        );
      })
      .finally(() => setExecutiveLoading(false));
  };

  const selectedTrend = metrics
    ? period === "all"
      ? metrics.trend.monthly
      : period === "thisMonth" || period === "previousMonth"
        ? metrics.trend.weekly
        : metrics.trend.daily
    : [];

  useEffect(() => {
    void loadMetrics(period);
    loadExecutiveAnalytics(period);
  }, [period]);

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      const settings = await loadGoalSettings();
      if (isMounted) {
        setGoalSettings(settings);
      }
    };

    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatCurrency = (value: number) => currencyFormatter.format(value);

  const today = new Date();
  const daysElapsed = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const bestService = metrics ? getBestConvertingService(metrics.serviceConversions) : null;
  const bestSource = metrics ? getBestConvertingSource(metrics.sourceConversions) : null;
  const highestValueService = metrics ? getHighestValueService(metrics.serviceConversions) : null;
  const fastestGrowingService = metrics ? getFastestGrowingService(metrics.serviceTrend) : null;
  const businessInsights = metrics ? generateBusinessInsights(metrics) : [];
  const commercialInsights = metrics ? generateCommercialInsights(metrics) : [];
  const businessRecommendations = metrics ? generateBusinessRecommendations(metrics) : [];
  const businessHealth = metrics ? calculateBusinessHealthScore(metrics) : null;
  const businessSignals = metrics ? calculateBusinessSignals(metrics) : [];
  const executiveSummary = metrics ? generateExecutiveSummary(metrics) : [];
  const forecast = metrics ? calculateForecast(metrics) : null;
  const commercialPipelineValue = metrics ? calculatePipelineValue(metrics) : 0;
  const projectedRevenue = metrics ? calculateExpectedRevenue(metrics) : 0;
  const conversionForecast = metrics ? calculateConversionForecast(metrics) : 0;

  const goals = goalSettings;

  const handleSaveGoals = async (nextSettings: GoalSettings) => {
    setGoalSettings(nextSettings);
    await saveGoalSettings(nextSettings);
  };

  const goalProjection = metrics
    ? calculateMonthlyProjection(
        metrics.totals.leads,
        metrics.totals.agendadas,
        metrics.pipelineValue,
        daysElapsed,
        daysInMonth,
      )
    : null;

  const goalProgress = metrics
    ? {
        leads: calculateGoalProgress(metrics.totals.leads, goals.monthlyLeadsGoal),
        conversion: calculateGoalProgress(metrics.conversionRate, goals.conversionGoal),
        attendance: calculateGoalProgress(metrics.attendanceRate, goals.attendanceGoal),
        pipelineValue: calculateGoalProgress(metrics.pipelineValue, goals.pipelineValueGoal),
      }
    : null;

  const goalRisk =
    metrics && goalProjection
      ? calculateGoalRisk(goalProjection, goals, metrics.conversionRate, metrics.attendanceRate)
      : null;

  const goalInsights =
    metrics && goalProgress && goalProjection
      ? generateGoalInsights(goalProgress, goalProjection, goals)
      : [];

  const shouldShowEmptyCRM = shouldShowDashboardEmptyCRM(metrics, loading, reconcilingMetrics);

  return (
    <AdminRouteGuard>
      <AdminLayout>
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Admin CRM</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-deep">
                Dashboard de métricas
              </h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Visión ejecutiva del CRM desde Revenue Intelligence.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Periodo actual: {getPeriodLabel(period)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {PERIODS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setPeriod(item.value)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                    period === item.value
                      ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "border-border bg-white text-muted-foreground hover:border-primary hover:text-deep"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => metrics && exportDashboardMetricsToCsv(metrics)}
                className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary hover:text-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                Exportar CSV
              </button>
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary hover:text-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                Configurar Metas
              </button>
              <a
                href="/admin/automation"
                aria-label="Ir a Automatizaciones"
                className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary hover:text-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                Automatizaciones
              </a>
            </div>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-border bg-white p-10 text-center text-lg font-medium text-muted-foreground shadow-soft">
              {reconcilingMetrics ? "Validando métricas reales del CRM..." : "Cargando métricas de Revenue Intelligence..."}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-destructive bg-destructive/10 p-10 text-center text-lg font-medium text-destructive shadow-soft">
              {error}
            </div>
          ) : metrics ? (
            <>
              {shouldShowEmptyCRM ? (
                <div className="rounded-3xl border border-border bg-slate-50 p-6 text-center text-sm font-medium text-muted-foreground shadow-soft">
                  <p>Aún no existen registros en el CRM.</p>
                  <p className="mt-2 text-base text-deep">
                    Las métricas aparecerán cuando se registren pacientes.
                  </p>
                </div>
              ) : null}

              <ExecutiveAnalyticsPanel
                executive={executiveAnalytics}
                loading={executiveLoading}
                error={executiveError}
              />

              {businessInsights.length > 0 ? (
                <div className="mb-6">
                  <InsightsPanel insights={businessInsights} />
                </div>
              ) : null}

              {commercialInsights.length > 0 ? (
                <div className="mb-6">
                  <InsightsPanel insights={commercialInsights} />
                </div>
              ) : null}

              <div className="mb-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                      Objetivos del Mes
                    </p>
                    <h2 className="text-2xl font-semibold text-deep">Gestión por objetivos</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Proyección final para {daysInMonth} días.
                  </p>
                </div>
                {goalProgress ? (
                  <GoalsOverview
                    leads={goalProgress.leads}
                    conversion={goalProgress.conversion}
                    attendance={goalProgress.attendance}
                    pipelineValue={goalProgress.pipelineValue}
                  />
                ) : null}
              </div>

              <div className="mb-6 grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
                  <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                    Proyección Fin de Mes
                  </p>
                  <div className="mt-5 space-y-4 text-sm text-muted-foreground">
                    {goalProjection ? (
                      <>
                        <p>
                          Leads proyectados:{" "}
                          <span className="font-semibold text-deep">
                            {goalProjection.projectedLeads.toLocaleString()}
                          </span>
                        </p>
                        <p>
                          Citas proyectadas:{" "}
                          <span className="font-semibold text-deep">
                            {goalProjection.projectedAppointments.toLocaleString()}
                          </span>
                        </p>
                        <p>
                          Valor potencial proyectado:{" "}
                          <span className="font-semibold text-deep">
                            {formatCurrency(goalProjection.projectedPipelineValue)}
                          </span>
                        </p>
                      </>
                    ) : (
                      <p>No hay datos suficientes para proyectar el fin de mes.</p>
                    )}
                  </div>
                </div>
                <GoalInsights insights={goalInsights} />
              </div>

              {goalRisk ? (
                <div className="mb-6">
                  <GoalRiskPanel risk={goalRisk} />
                </div>
              ) : null}

              <GoalSettingsPanel
                open={settingsOpen}
                settings={goalSettings}
                onOpenChange={setSettingsOpen}
                onSave={handleSaveGoals}
              />

              <div className="mb-6 grid gap-6 xl:grid-cols-3">
                {businessHealth ? <BusinessHealthCard health={businessHealth} /> : null}
                <BusinessSignals signals={businessSignals} />
                <ExecutiveSummary summary={executiveSummary} />
              </div>

              <div className="mb-6">
                <RecommendationsPanel recommendations={businessRecommendations} />
              </div>

              <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                      Resumen rápido
                    </p>
                    <h2 className="text-2xl font-semibold text-deep">Métricas clave</h2>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-4">
                  <KpiCard label="Leads nuevos" value={metrics.totals.leads.toString()} />
                  <KpiCard
                    label="Conversión total"
                    value={`${metrics.conversionRate}%`}
                    footer={
                      <ComparisonBadge
                        label="vs período anterior"
                        changePercent={metrics.comparison.conversionRate?.changePercent ?? 0}
                      />
                    }
                  />
                  <KpiCard label="Puntaje medio de lead" value={`${metrics.averageLeadScore}%`} />
                  <PipelineValueCard totalValue={metrics.pipelineValue} />
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <KpiCard
                  label="Servicio con mayor conversión"
                  value={
                    bestService
                      ? `${bestService.service} (${bestService.conversionRate}%)`
                      : "Sin datos disponibles"
                  }
                />
                <KpiCard
                  label="Fuente con mayor conversión"
                  value={
                    bestSource
                      ? `${bestSource.source} (${bestSource.conversionRate}%)`
                      : "Sin datos disponibles"
                  }
                />
                <KpiCard
                  label="Pipeline comercial"
                  value={formatCurrency(commercialPipelineValue)}
                  footer={
                    <span className="text-sm text-muted-foreground">
                      Valor actual de oportunidades
                    </span>
                  }
                />
                <KpiCard
                  label="Forecast de conversión"
                  value={`${conversionForecast}%`}
                  footer={
                    <span className="text-sm text-muted-foreground">
                      Proyección ajustada de conversión
                    </span>
                  }
                />
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <KpiCard
                  label="Ingresos proyectados"
                  value={formatCurrency(projectedRevenue)}
                  footer={
                    <span className="text-sm text-muted-foreground">
                      Pipeline x conversión actual
                    </span>
                  }
                />
                <KpiCard
                  label="Leads esperados"
                  value={forecast?.expectedLeads.toString() ?? "0"}
                />
                <KpiCard
                  label="Conversiones esperadas"
                  value={forecast?.expectedConversions.toString() ?? "0"}
                />
                <KpiCard
                  label="Ingresos esperados"
                  value={formatCurrency(forecast?.expectedRevenue ?? 0)}
                />
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <KpiCard
                  label="Servicio con mayor crecimiento"
                  value={
                    fastestGrowingService
                      ? `${fastestGrowingService.service}`
                      : "Sin datos disponibles"
                  }
                  footer={
                    fastestGrowingService ? (
                      <span className="text-sm text-muted-foreground">
                        {fastestGrowingService.growthPercent >= 0 ? "+" : ""}
                        {fastestGrowingService.growthPercent.toFixed(1)}%
                      </span>
                    ) : null
                  }
                />
                <KpiCard
                  label="Puntaje de lead caliente"
                  value={`${metrics.leadScoreDistribution.hot}%`}
                  footer={<span className="text-sm text-muted-foreground">Leads hot en CRM</span>}
                />
                <KpiCard
                  label="Puntaje de lead templado"
                  value={`${metrics.leadScoreDistribution.warm}%`}
                  footer={<span className="text-sm text-muted-foreground">Leads warm en CRM</span>}
                />
                <KpiCard
                  label="Puntaje de lead frío"
                  value={`${metrics.leadScoreDistribution.cold}%`}
                  footer={<span className="text-sm text-muted-foreground">Leads cold en CRM</span>}
                />
              </div>

              <div className="mt-10 grid gap-6 lg:grid-cols-3">
                <ServiceConversionTable items={metrics.serviceConversions} />
                <SourceConversionTable items={metrics.sourceConversions} />
                <ServiceTrendChart data={metrics.serviceTrend} />
              </div>

              <div className="mt-10 grid gap-6 lg:grid-cols-2">
                <TrendChart data={selectedTrend} title="Tendencia de leads" />
                <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
                  <h2 className="text-xl font-semibold text-deep">
                    Comparativo vs periodo anterior
                  </h2>
                  <div className="mt-6 space-y-4">
                    <KpiCard
                      label="Leads nuevos"
                      value={metrics.totals.leads.toString()}
                      footer={
                        <ComparisonBadge
                          label="vs período anterior"
                          changePercent={metrics.comparison.leads.changePercent}
                        />
                      }
                    />
                    <KpiCard
                      label="Citas agendadas"
                      value={metrics.totals.agendadas.toString()}
                      footer={
                        <ComparisonBadge
                          label="vs período anterior"
                          changePercent={metrics.comparison.agendadas.changePercent}
                        />
                      }
                    />
                    <KpiCard
                      label="Citas completadas"
                      value={metrics.totals.completadas.toString()}
                      footer={
                        <ComparisonBadge
                          label="vs período anterior"
                          changePercent={metrics.comparison.completadas.changePercent}
                        />
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
                  <h2 className="text-xl font-semibold text-deep">Conversión por fuente</h2>
                  <div className="mt-6 space-y-4">
                    {metrics.sourceConversions.slice(0, 5).map((source) => (
                      <div
                        key={source.source}
                        className="flex items-center justify-between rounded-2xl border border-border/80 p-4"
                      >
                        <div>
                          <p className="font-medium text-deep">{source.source}</p>
                          <p className="text-sm text-muted-foreground">{source.leads} leads</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-deep">
                          {source.conversionRate}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
                  <h2 className="text-xl font-semibold text-deep">Top servicios por pipeline</h2>
                  <div className="mt-6 space-y-4">
                    {metrics.serviceConversions.slice(0, 5).map((service) => (
                      <div
                        key={service.service}
                        className="rounded-2xl border border-border/80 p-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-medium text-deep">{service.service}</p>
                            <p className="text-sm text-muted-foreground">
                              {service.leads} leads • {service.conversionRate}% conversión
                            </p>
                          </div>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-deep">
                            {formatCurrency(service.estimatedPipelineValue)}
                          </span>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${Math.min(service.conversionRate, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-border bg-white p-6 shadow-soft">
                <h2 className="text-xl font-semibold text-deep">Servicios con más leads</h2>
                <div className="mt-6 space-y-4">
                  {metrics.serviceTrend.map((item) => (
                    <div
                      key={item.service}
                      className="flex items-center justify-between rounded-2xl border border-border/80 p-4"
                    >
                      <div>
                        <p className="font-medium text-deep">{item.service}</p>
                        <p className="text-sm text-muted-foreground">Leads: {item.leads}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </AdminLayout>
    </AdminRouteGuard>
  );
}
