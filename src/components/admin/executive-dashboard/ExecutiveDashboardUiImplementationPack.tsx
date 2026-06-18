import type { ReactNode } from "react";
import type { Permission } from "@/lib/rbac/permissions";
import {
  createExecutiveDashboardAccessModel,
  evaluateExecutiveDashboardAccess,
  type ExecutiveDashboardAccessPrincipal,
} from "@/server/read-models/executive-dashboard-access-model";
import type { ExecutiveDashboardWidgetId } from "@/server/read-models/executive-dashboard-component-design";
import type { ExecutiveDashboardRenderState } from "@/server/read-models/executive-dashboard-render-contract-design";
import {
  assertExecutiveDashboardUiFoundationPack,
  createExecutiveDashboardUiFoundationPack,
  type ExecutiveDashboardUiFoundationPack,
} from "@/server/read-models/executive-dashboard-ui-foundation-pack";
import type { ExecutiveDashboardSurface } from "@/server/read-models/executive-dashboard-ui-architecture";

export const EXECUTIVE_DASHBOARD_UI_IMPLEMENTATION_PACK_VERSION =
  "executive-dashboard-ui-implementation-pack/v1";

export type ExecutiveDashboardUiImplementationPackPhase = "17.5";

export type ExecutiveDashboardUiImplementationPackStatus = "approved-presentational-ui-pack";

export type ExecutiveDashboardUiImplementationPackScope =
  | "17.5-A-dashboard-shell-components"
  | "17.5-B-executive-dashboard-view"
  | "17.5-C-operational-dashboard-view"
  | "17.5-D-governance-dashboard-view"
  | "17.5-E-metric-card-components"
  | "17.5-F-render-state-components"
  | "17.5-G-permission-aware-view-guards"
  | "17.5-H-widget-renderer"
  | "17.5-I-dashboard-composition-tests"
  | "17.5-J-governance-regression-tests";

export type ExecutiveDashboardUiImplementationExposure = "metric-only";

export type ExecutiveDashboardMetricCardViewModel = {
  label: string;
  value: string | number;
  description?: string;
};

export type ExecutiveDashboardWidgetViewModel = {
  widgetId: ExecutiveDashboardWidgetId;
  title: string;
  metricCards: ExecutiveDashboardMetricCardViewModel[];
};

export type ExecutiveDashboardSurfaceViewModel = {
  surface: ExecutiveDashboardSurface;
  state: ExecutiveDashboardRenderState;
  principal: ExecutiveDashboardAccessPrincipal;
  widgets: ExecutiveDashboardWidgetViewModel[];
};

export type ExecutiveDashboardUiImplementationGuardrails = {
  presentationalUiIncluded: true;
  routeImplementationIncluded: false;
  apiImplementationIncluded: false;
  fetchImplementationIncluded: false;
  transportImplementationIncluded: false;
  loginModificationIncluded: false;
  credentialStorageIncluded: false;
  persistenceIncluded: false;
  writePathIncluded: false;
  domainLogicIncluded: false;
  fallbackLogicIncluded: false;
  clientSideFallbackIncluded: false;
  clientSideAggregationIncluded: false;
  computedHealthIncluded: false;
  aggregateAccess: false;
  adapterAccess: false;
  readModelDirectAccess: false;
  readSourceAccess: false;
  rawTelemetryExposure: false;
  leadWriteIncluded: false;
  metricOnly: true;
  aggregateIsolationPreserved: true;
  domainOwnershipPreserved: true;
  leadsSourceOfTruthPreserved: true;
  readModelPlatformV2ClosedFrozenPreserved: true;
};

export type ExecutiveDashboardUiImplementationPack = {
  version: typeof EXECUTIVE_DASHBOARD_UI_IMPLEMENTATION_PACK_VERSION;
  phase: ExecutiveDashboardUiImplementationPackPhase;
  status: ExecutiveDashboardUiImplementationPackStatus;
  generatedAt: string;
  coveredScopes: ExecutiveDashboardUiImplementationPackScope[];
  foundationVersion: ExecutiveDashboardUiFoundationPack["version"];
  guardrails: ExecutiveDashboardUiImplementationGuardrails;
  surfaces: ExecutiveDashboardSurface[];
  widgetIds: ExecutiveDashboardWidgetId[];
  allowedRenderStates: ExecutiveDashboardRenderState[];
  exposure: ExecutiveDashboardUiImplementationExposure;
  nextPhase: "17.6 Dashboard Route Binding Pack";
};

export const EXECUTIVE_DASHBOARD_UI_IMPLEMENTATION_SCOPES: ExecutiveDashboardUiImplementationPackScope[] = [
  "17.5-A-dashboard-shell-components",
  "17.5-B-executive-dashboard-view",
  "17.5-C-operational-dashboard-view",
  "17.5-D-governance-dashboard-view",
  "17.5-E-metric-card-components",
  "17.5-F-render-state-components",
  "17.5-G-permission-aware-view-guards",
  "17.5-H-widget-renderer",
  "17.5-I-dashboard-composition-tests",
  "17.5-J-governance-regression-tests",
];

function createGuardrails(): ExecutiveDashboardUiImplementationGuardrails {
  return {
    presentationalUiIncluded: true,
    routeImplementationIncluded: false,
    apiImplementationIncluded: false,
    fetchImplementationIncluded: false,
    transportImplementationIncluded: false,
    loginModificationIncluded: false,
    credentialStorageIncluded: false,
    persistenceIncluded: false,
    writePathIncluded: false,
    domainLogicIncluded: false,
    fallbackLogicIncluded: false,
    clientSideFallbackIncluded: false,
    clientSideAggregationIncluded: false,
    computedHealthIncluded: false,
    aggregateAccess: false,
    adapterAccess: false,
    readModelDirectAccess: false,
    readSourceAccess: false,
    rawTelemetryExposure: false,
    leadWriteIncluded: false,
    metricOnly: true,
    aggregateIsolationPreserved: true,
    domainOwnershipPreserved: true,
    leadsSourceOfTruthPreserved: true,
    readModelPlatformV2ClosedFrozenPreserved: true,
  };
}

export function createExecutiveDashboardUiImplementationPack(
  foundation: ExecutiveDashboardUiFoundationPack = createExecutiveDashboardUiFoundationPack(),
  generatedAt = new Date().toISOString(),
): ExecutiveDashboardUiImplementationPack {
  assertExecutiveDashboardUiFoundationPack(foundation);

  return {
    version: EXECUTIVE_DASHBOARD_UI_IMPLEMENTATION_PACK_VERSION,
    phase: "17.5",
    status: "approved-presentational-ui-pack",
    generatedAt,
    coveredScopes: EXECUTIVE_DASHBOARD_UI_IMPLEMENTATION_SCOPES,
    foundationVersion: foundation.version,
    guardrails: createGuardrails(),
    surfaces: foundation.layoutShells.map((layout) => layout.surface),
    widgetIds: foundation.widgetRegistry.map((widget) => widget.widgetId),
    allowedRenderStates: ["loading", "ready", "empty", "error", "forbidden"],
    exposure: "metric-only",
    nextPhase: "17.6 Dashboard Route Binding Pack",
  };
}

export function assertExecutiveDashboardUiImplementationPack(pack: ExecutiveDashboardUiImplementationPack): void {
  if (pack.phase !== "17.5" || pack.status !== "approved-presentational-ui-pack") {
    throw new Error("Executive dashboard UI implementation pack is not approved.");
  }

  if (pack.coveredScopes.join("|") !== EXECUTIVE_DASHBOARD_UI_IMPLEMENTATION_SCOPES.join("|")) {
    throw new Error("Executive dashboard UI implementation pack does not cover the full 17.5 A/J scope.");
  }

  const guardrails = pack.guardrails;
  if (
    !guardrails.presentationalUiIncluded ||
    guardrails.routeImplementationIncluded ||
    guardrails.apiImplementationIncluded ||
    guardrails.fetchImplementationIncluded ||
    guardrails.transportImplementationIncluded ||
    guardrails.loginModificationIncluded ||
    guardrails.credentialStorageIncluded ||
    guardrails.persistenceIncluded ||
    guardrails.writePathIncluded ||
    guardrails.domainLogicIncluded ||
    guardrails.fallbackLogicIncluded ||
    guardrails.clientSideFallbackIncluded ||
    guardrails.clientSideAggregationIncluded ||
    guardrails.computedHealthIncluded ||
    guardrails.aggregateAccess ||
    guardrails.adapterAccess ||
    guardrails.readModelDirectAccess ||
    guardrails.readSourceAccess ||
    guardrails.rawTelemetryExposure ||
    guardrails.leadWriteIncluded ||
    !guardrails.metricOnly ||
    !guardrails.aggregateIsolationPreserved ||
    !guardrails.domainOwnershipPreserved ||
    !guardrails.leadsSourceOfTruthPreserved ||
    !guardrails.readModelPlatformV2ClosedFrozenPreserved
  ) {
    throw new Error("Executive dashboard UI implementation guardrails are not satisfied.");
  }

  if (pack.surfaces.length !== 3 || pack.widgetIds.length !== 11 || pack.exposure !== "metric-only") {
    throw new Error("Executive dashboard UI implementation pack has incomplete metric-only coverage.");
  }
}

export function hasExecutiveDashboardPermission(permissions: readonly Permission[]): boolean {
  return permissions.includes("executive-observability:read");
}

export function ExecutiveDashboardRenderStateView({ state }: { state: ExecutiveDashboardRenderState }) {
  const labels: Record<ExecutiveDashboardRenderState, string> = {
    loading: "Cargando métricas ejecutivas",
    ready: "Métricas ejecutivas listas",
    empty: "Sin métricas ejecutivas disponibles",
    error: "No fue posible cargar métricas ejecutivas",
    forbidden: "Acceso restringido a observabilidad ejecutiva",
  };

  return <p data-render-state={state}>{labels[state]}</p>;
}

export function ExecutiveDashboardMetricCard({ metric }: { metric: ExecutiveDashboardMetricCardViewModel }) {
  return (
    <article className="rounded-2xl border border-border bg-white p-4 shadow-sm" data-exposure="metric-only">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{metric.label}</p>
      <p className="mt-3 text-3xl font-bold text-deep">{metric.value}</p>
      {metric.description ? <p className="mt-2 text-sm text-muted-foreground">{metric.description}</p> : null}
    </article>
  );
}

export function ExecutiveDashboardWidget({ widget }: { widget: ExecutiveDashboardWidgetViewModel }) {
  return (
    <section className="rounded-3xl border border-border bg-slate-50 p-5" data-widget-id={widget.widgetId}>
      <h3 className="text-lg font-semibold text-deep">{widget.title}</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {widget.metricCards.map((metric) => (
          <ExecutiveDashboardMetricCard key={`${widget.widgetId}-${metric.label}`} metric={metric} />
        ))}
      </div>
    </section>
  );
}

export function ExecutiveDashboardWidgetRenderer({
  state,
  widgets,
}: {
  state: ExecutiveDashboardRenderState;
  widgets: ExecutiveDashboardWidgetViewModel[];
}) {
  if (state !== "ready") {
    return <ExecutiveDashboardRenderStateView state={state} />;
  }

  if (widgets.length === 0) {
    return <ExecutiveDashboardRenderStateView state="empty" />;
  }

  return (
    <div className="grid gap-5">
      {widgets.map((widget) => (
        <ExecutiveDashboardWidget key={widget.widgetId} widget={widget} />
      ))}
    </div>
  );
}

export function ExecutiveDashboardPermissionGuard({
  principal,
  surface,
  children,
}: {
  principal: ExecutiveDashboardAccessPrincipal;
  surface: ExecutiveDashboardSurface;
  children: ReactNode;
}) {
  const decision = evaluateExecutiveDashboardAccess(createExecutiveDashboardAccessModel(), principal, surface);

  if (decision.decision !== "allow") {
    return <ExecutiveDashboardRenderStateView state="forbidden" />;
  }

  return <>{children}</>;
}

const surfaceTitles: Record<ExecutiveDashboardSurface, string> = {
  executive: "Executive Dashboard",
  operational: "Operational Dashboard",
  governance: "Governance Dashboard",
};

export function ExecutiveDashboardShell({ viewModel }: { viewModel: ExecutiveDashboardSurfaceViewModel }) {
  return (
    <ExecutiveDashboardPermissionGuard principal={viewModel.principal} surface={viewModel.surface}>
      <main className="rounded-3xl border border-border bg-white p-6 shadow-soft" data-surface={viewModel.surface}>
        <header className="flex flex-col gap-2 border-b border-border pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Metric-only dashboard</p>
          <h2 className="text-2xl font-bold text-deep">{surfaceTitles[viewModel.surface]}</h2>
        </header>
        <div className="mt-6">
          <ExecutiveDashboardWidgetRenderer state={viewModel.state} widgets={viewModel.widgets} />
        </div>
      </main>
    </ExecutiveDashboardPermissionGuard>
  );
}

export function ExecutiveDashboardView(props: Omit<ExecutiveDashboardSurfaceViewModel, "surface">) {
  return <ExecutiveDashboardShell viewModel={{ ...props, surface: "executive" }} />;
}

export function OperationalDashboardView(props: Omit<ExecutiveDashboardSurfaceViewModel, "surface">) {
  return <ExecutiveDashboardShell viewModel={{ ...props, surface: "operational" }} />;
}

export function GovernanceDashboardView(props: Omit<ExecutiveDashboardSurfaceViewModel, "surface">) {
  return <ExecutiveDashboardShell viewModel={{ ...props, surface: "governance" }} />;
}
