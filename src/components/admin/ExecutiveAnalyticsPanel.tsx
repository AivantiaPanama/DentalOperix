import type {
  ExecutiveAnalyticsSnapshot,
  ExecutiveDecisionAlert,
  ExecutiveOpportunity,
  ExecutivePriorityAction,
  ExecutiveRankingItem,
  ExecutiveScore,
} from "@/lib/executive-analytics";

const signalLabels: Record<ExecutiveScore["signal"], string> = {
  excellent: "Excelente",
  healthy: "Saludable",
  watch: "En observación",
  critical: "Crítico",
};

const severityLabels: Record<ExecutiveDecisionAlert["severity"], string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
};

const priorityLabels: Record<ExecutiveOpportunity["priority"], string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

const healthLabels: Record<ExecutiveAnalyticsSnapshot["interpretation"]["healthStatus"], string> = {
  excellent: "Excelente",
  healthy: "Saludable",
  "attention-required": "Requiere atención",
  critical: "Crítico",
};

const categoryLabels: Record<ExecutivePriorityAction["category"], string> = {
  conversion: "Conversión",
  attendance: "Asistencia",
  pipeline: "Pipeline",
  growth: "Crecimiento",
  "data-quality": "Calidad de datos",
  opportunity: "Oportunidad",
};

function ScoreCard({ label, score }: { label: string; score: ExecutiveScore }) {
  return (
    <div className="rounded-2xl border border-border bg-slate-50 p-5">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-4xl font-bold text-deep">{score.value}</p>
        <span className="rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-muted-foreground">
          {signalLabels[score.signal]}
        </span>
      </div>
      <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
        {score.drivers.slice(0, 3).map((driver) => (
          <li key={driver}>• {driver}</li>
        ))}
      </ul>
    </div>
  );
}

function RankingList({ title, items }: { title: string; items: ExecutiveRankingItem[] }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <h3 className="text-base font-semibold text-deep">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.length > 0 ? (
          items.slice(0, 5).map((item, index) => (
            <div
              key={`${title}-${item.name}`}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <div>
                <p className="font-semibold text-deep">
                  {index + 1}. {item.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.leads} leads · {item.completed} completados · {item.conversionRate}%
                  conversión
                </p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {item.score}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Sin datos suficientes para ranking ejecutivo.
          </p>
        )}
      </div>
    </div>
  );
}

export function ExecutiveAnalyticsPanel({
  executive,
  loading,
  error,
}: {
  executive: ExecutiveAnalyticsSnapshot | null;
  loading: boolean;
  error: string | null;
}) {
  return (
    <section className="mb-6 rounded-3xl border border-border bg-white p-6 shadow-soft">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            Executive Analytics
          </p>
          <h2 className="text-2xl font-semibold text-deep">Panel ejecutivo</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Lectura ejecutiva derivada de Revenue Intelligence y Revenue Forecasting.
          </p>
        </div>
        {executive ? (
          <p className="text-xs text-muted-foreground">
            Versión {executive.version} · Source of Truth: {executive.governance.sourceOfTruth}
          </p>
        ) : null}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-slate-50 p-5 text-sm font-medium text-muted-foreground">
          Cargando Executive Analytics...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-medium text-amber-800">
          Executive Analytics no está disponible temporalmente: {error}
        </div>
      ) : executive ? (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-slate-50 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Interpretación ejecutiva
                </p>
                <h3 className="mt-2 text-xl font-semibold text-deep">
                  {healthLabels[executive.interpretation.healthStatus]}
                </h3>
                <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                  {executive.interpretation.narrative}
                </p>
              </div>
              <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3 lg:min-w-[360px]">
                <span className="rounded-full border border-border bg-white px-3 py-2">
                  Riesgo: {priorityLabels[executive.interpretation.riskLevel]}
                </span>
                <span className="rounded-full border border-border bg-white px-3 py-2">
                  Oportunidad: {priorityLabels[executive.interpretation.opportunityLevel]}
                </span>
                <span className="rounded-full border border-border bg-white px-3 py-2">
                  Foco: {executive.interpretation.primaryFocus}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <ScoreCard label="Revenue Score" score={executive.summary.revenueScore} />
            <ScoreCard label="Growth Score" score={executive.summary.growthScore} />
            <ScoreCard label="Opportunity Index" score={executive.summary.opportunityIndex} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <RankingList title="Ranking ejecutivo de fuentes" items={executive.rankings.sources} />
            <RankingList
              title="Ranking ejecutivo de servicios"
              items={executive.rankings.services}
            />
          </div>

          <div className="rounded-2xl border border-border bg-slate-50 p-5">
            <h3 className="text-base font-semibold text-deep">Acciones prioritarias</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {executive.priorityActions.length > 0 ? (
                executive.priorityActions.slice(0, 4).map((action) => (
                  <div
                    key={`${action.title}-${action.category}`}
                    className="rounded-xl bg-white p-4 text-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-deep">{action.title}</p>
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                        {priorityLabels[action.priority]}
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      {categoryLabels[action.category]}
                    </p>
                    <p className="mt-2 text-muted-foreground">{action.rationale}</p>
                    <p className="mt-2 text-xs font-medium text-deep">{action.expectedOutcome}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay acciones prioritarias activas.
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-deep">Alertas ejecutivas</h3>
              <div className="mt-4 space-y-3">
                {executive.alerts.length > 0 ? (
                  executive.alerts.slice(0, 4).map((alert) => (
                    <div
                      key={`${alert.title}-${alert.message}`}
                      className="rounded-xl bg-white p-4 text-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-semibold text-deep">{alert.title}</p>
                        <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                          {severityLabels[alert.severity]}
                        </span>
                      </div>
                      <p className="mt-2 text-muted-foreground">{alert.message}</p>
                      <p className="mt-2 text-xs font-medium text-deep">
                        {alert.recommendedAction}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No hay alertas ejecutivas activas.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-deep">Oportunidades ejecutivas</h3>
              <div className="mt-4 space-y-3">
                {executive.opportunities.length > 0 ? (
                  executive.opportunities.slice(0, 4).map((opportunity) => (
                    <div
                      key={`${opportunity.title}-${opportunity.description}`}
                      className="rounded-xl bg-white p-4 text-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-semibold text-deep">{opportunity.title}</p>
                        <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                          {priorityLabels[opportunity.priority]}
                        </span>
                      </div>
                      <p className="mt-2 text-muted-foreground">{opportunity.description}</p>
                      <p className="mt-2 text-xs font-medium text-deep">
                        Impacto estimado: {opportunity.scoreImpact}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No hay oportunidades ejecutivas detectadas.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
