import {
  type ExecutiveDashboardApiContracts,
  type ExecutiveDashboardApiRoute,
  createExecutiveDashboardApiContracts,
} from "./executive-dashboard-api-contracts";
import {
  type ExecutiveDashboardUiArchitectureDesign,
  assertExecutiveDashboardUiArchitectureDesign,
  createExecutiveDashboardUiArchitectureDesign,
  type ExecutiveDashboardSurface,
} from "./executive-dashboard-ui-architecture";

export const EXECUTIVE_DASHBOARD_COMPONENT_DESIGN_VERSION = "executive-dashboard-component-design/v1";

export type ExecutiveDashboardComponentDesignPhase = "17.3-C";

export type ExecutiveDashboardComponentDesignStatus = "approved-for-future-ui-implementation";

export type ExecutiveDashboardWidgetExposure = "metric-only";

export type ExecutiveDashboardWidgetImplementationStatus = "component-contract-only";

export type ExecutiveDashboardMetricSource =
  | "PlatformHealthMetric"
  | "DomainHealthMetric"
  | "AggregateHealthMetric"
  | "GovernanceHealthMetric";

export type ExecutiveDashboardWidgetId =
  | "platform-health-widget"
  | "aggregate-health-summary-widget"
  | "domain-health-overview-widget"
  | "executive-governance-summary-widget"
  | "domain-health-matrix-widget"
  | "operational-status-widget"
  | "domain-trend-summary-widget"
  | "governance-health-widget"
  | "adr-compliance-widget"
  | "isolation-status-widget"
  | "read-model-freeze-status-widget";

export type ExecutiveDashboardComponentForbiddenDependency =
  | "aggregates"
  | "adapters"
  | "raw-telemetry"
  | "read-sources"
  | "read-model-source-provider"
  | "read-model-direct-access"
  | "lead-write-paths"
  | "persistence"
  | "domain-logic"
  | "fallback-logic";

export type ExecutiveDashboardWidgetContract = {
  id: ExecutiveDashboardWidgetId;
  label: string;
  surface: ExecutiveDashboardSurface;
  route: ExecutiveDashboardApiRoute;
  requiredContract: "ExecutiveDashboardApiContracts";
  permissionRequired: "executive-observability:read";
  metricSources: ExecutiveDashboardMetricSource[];
  exposure: ExecutiveDashboardWidgetExposure;
  implementationStatus: ExecutiveDashboardWidgetImplementationStatus;
  presentationResponsibility: "render-governed-metrics-only";
  forbiddenDependencies: ExecutiveDashboardComponentForbiddenDependency[];
};

export type ExecutiveDashboardPanelComposition = {
  surface: ExecutiveDashboardSurface;
  label: "Executive Dashboard" | "Operational Dashboard" | "Governance Dashboard";
  route: ExecutiveDashboardApiRoute;
  widgets: ExecutiveDashboardWidgetId[];
  compositionStatus: "design-only";
  allowedContract: "ExecutiveDashboardApiContracts";
};

export type ExecutiveDashboardComponentDesignGuardrails = {
  uiImplementationIncluded: false;
  visualComponentsIncluded: false;
  routeImplementationIncluded: false;
  apiImplementationIncluded: false;
  persistenceIncluded: false;
  domainLogicIncluded: false;
  fallbackLogicIncluded: false;
  aggregateAccess: false;
  adapterAccess: false;
  readModelDirectAccess: false;
  rawTelemetryExposure: false;
  leadWriteIncluded: false;
  aggregateIsolationPreserved: true;
  domainOwnershipPreserved: true;
  leadsSourceOfTruthPreserved: true;
  readModelPlatformV2ClosedFrozenPreserved: true;
};

export type ExecutiveDashboardComponentDesign = {
  version: typeof EXECUTIVE_DASHBOARD_COMPONENT_DESIGN_VERSION;
  phase: ExecutiveDashboardComponentDesignPhase;
  status: ExecutiveDashboardComponentDesignStatus;
  generatedAt: string;
  architectureVersion: ExecutiveDashboardUiArchitectureDesign["version"];
  guardrails: ExecutiveDashboardComponentDesignGuardrails;
  panels: ExecutiveDashboardPanelComposition[];
  widgets: ExecutiveDashboardWidgetContract[];
  nextPhase: "17.3-D Dashboard UI Implementation Readiness Gate";
};

const FORBIDDEN_COMPONENT_DEPENDENCIES: ExecutiveDashboardComponentForbiddenDependency[] = [
  "aggregates",
  "adapters",
  "raw-telemetry",
  "read-sources",
  "read-model-source-provider",
  "read-model-direct-access",
  "lead-write-paths",
  "persistence",
  "domain-logic",
  "fallback-logic",
];

function widget(
  id: ExecutiveDashboardWidgetId,
  label: string,
  surface: ExecutiveDashboardSurface,
  route: ExecutiveDashboardApiRoute,
  metricSources: ExecutiveDashboardMetricSource[],
): ExecutiveDashboardWidgetContract {
  return {
    id,
    label,
    surface,
    route,
    requiredContract: "ExecutiveDashboardApiContracts",
    permissionRequired: "executive-observability:read",
    metricSources,
    exposure: "metric-only",
    implementationStatus: "component-contract-only",
    presentationResponsibility: "render-governed-metrics-only",
    forbiddenDependencies: FORBIDDEN_COMPONENT_DEPENDENCIES,
  };
}

export function createExecutiveDashboardComponentDesign(
  contracts: ExecutiveDashboardApiContracts = createExecutiveDashboardApiContracts(),
  architecture: ExecutiveDashboardUiArchitectureDesign = createExecutiveDashboardUiArchitectureDesign(contracts),
  generatedAt = new Date().toISOString(),
): ExecutiveDashboardComponentDesign {
  assertExecutiveDashboardUiArchitectureDesign(architecture);

  const executiveRoute: ExecutiveDashboardApiRoute = "/api/internal/executive-observability/executive";
  const operationalRoute: ExecutiveDashboardApiRoute = "/api/internal/executive-observability/operational";
  const governanceRoute: ExecutiveDashboardApiRoute = "/api/internal/executive-observability/governance";

  return {
    version: EXECUTIVE_DASHBOARD_COMPONENT_DESIGN_VERSION,
    phase: "17.3-C",
    status: "approved-for-future-ui-implementation",
    generatedAt,
    architectureVersion: architecture.version,
    guardrails: {
      uiImplementationIncluded: false,
      visualComponentsIncluded: false,
      routeImplementationIncluded: false,
      apiImplementationIncluded: false,
      persistenceIncluded: false,
      domainLogicIncluded: false,
      fallbackLogicIncluded: false,
      aggregateAccess: false,
      adapterAccess: false,
      readModelDirectAccess: false,
      rawTelemetryExposure: false,
      leadWriteIncluded: false,
      aggregateIsolationPreserved: true,
      domainOwnershipPreserved: true,
      leadsSourceOfTruthPreserved: true,
      readModelPlatformV2ClosedFrozenPreserved: true,
    },
    panels: [
      {
        surface: "executive",
        label: "Executive Dashboard",
        route: executiveRoute,
        widgets: [
          "platform-health-widget",
          "aggregate-health-summary-widget",
          "domain-health-overview-widget",
          "executive-governance-summary-widget",
        ],
        compositionStatus: "design-only",
        allowedContract: "ExecutiveDashboardApiContracts",
      },
      {
        surface: "operational",
        label: "Operational Dashboard",
        route: operationalRoute,
        widgets: ["domain-health-matrix-widget", "operational-status-widget", "domain-trend-summary-widget"],
        compositionStatus: "design-only",
        allowedContract: "ExecutiveDashboardApiContracts",
      },
      {
        surface: "governance",
        label: "Governance Dashboard",
        route: governanceRoute,
        widgets: [
          "governance-health-widget",
          "adr-compliance-widget",
          "isolation-status-widget",
          "read-model-freeze-status-widget",
        ],
        compositionStatus: "design-only",
        allowedContract: "ExecutiveDashboardApiContracts",
      },
    ],
    widgets: [
      widget("platform-health-widget", "Platform Health", "executive", executiveRoute, ["PlatformHealthMetric"]),
      widget("aggregate-health-summary-widget", "Aggregate Health Summary", "executive", executiveRoute, [
        "AggregateHealthMetric",
      ]),
      widget("domain-health-overview-widget", "Domain Health Overview", "executive", executiveRoute, [
        "DomainHealthMetric",
      ]),
      widget("executive-governance-summary-widget", "Executive Governance Summary", "executive", executiveRoute, [
        "GovernanceHealthMetric",
      ]),
      widget("domain-health-matrix-widget", "Domain Health Matrix", "operational", operationalRoute, [
        "DomainHealthMetric",
      ]),
      widget("operational-status-widget", "Operational Status", "operational", operationalRoute, [
        "AggregateHealthMetric",
        "DomainHealthMetric",
      ]),
      widget("domain-trend-summary-widget", "Domain Trend Summary", "operational", operationalRoute, [
        "DomainHealthMetric",
      ]),
      widget("governance-health-widget", "Governance Health", "governance", governanceRoute, [
        "GovernanceHealthMetric",
      ]),
      widget("adr-compliance-widget", "ADR Compliance", "governance", governanceRoute, ["GovernanceHealthMetric"]),
      widget("isolation-status-widget", "Isolation Status", "governance", governanceRoute, ["GovernanceHealthMetric"]),
      widget("read-model-freeze-status-widget", "Read Model Freeze Status", "governance", governanceRoute, [
        "GovernanceHealthMetric",
      ]),
    ],
    nextPhase: "17.3-D Dashboard UI Implementation Readiness Gate",
  };
}

export function assertExecutiveDashboardComponentDesign(design: ExecutiveDashboardComponentDesign): void {
  if (design.phase !== "17.3-C" || design.status !== "approved-for-future-ui-implementation") {
    throw new Error("Executive dashboard component design is not approved for future UI implementation.");
  }

  if (
    design.guardrails.uiImplementationIncluded ||
    design.guardrails.visualComponentsIncluded ||
    design.guardrails.routeImplementationIncluded ||
    design.guardrails.apiImplementationIncluded ||
    design.guardrails.persistenceIncluded ||
    design.guardrails.domainLogicIncluded ||
    design.guardrails.fallbackLogicIncluded ||
    design.guardrails.aggregateAccess ||
    design.guardrails.adapterAccess ||
    design.guardrails.readModelDirectAccess ||
    design.guardrails.rawTelemetryExposure ||
    design.guardrails.leadWriteIncluded ||
    !design.guardrails.aggregateIsolationPreserved ||
    !design.guardrails.domainOwnershipPreserved ||
    !design.guardrails.leadsSourceOfTruthPreserved ||
    !design.guardrails.readModelPlatformV2ClosedFrozenPreserved
  ) {
    throw new Error("Executive dashboard component design guardrails are not satisfied.");
  }

  if (design.panels.length !== 3) {
    throw new Error("Executive dashboard component design must define exactly three panels.");
  }

  const widgetIds = new Set(design.widgets.map((widgetContract) => widgetContract.id));
  const missingWidget = design.panels
    .flatMap((panel) => panel.widgets)
    .find((widgetId) => !widgetIds.has(widgetId));

  if (missingWidget) {
    throw new Error(`Executive dashboard panel references unknown widget: ${missingWidget}`);
  }

  const invalidWidget = design.widgets.find(
    (widgetContract) =>
      widgetContract.requiredContract !== "ExecutiveDashboardApiContracts" ||
      widgetContract.permissionRequired !== "executive-observability:read" ||
      widgetContract.exposure !== "metric-only" ||
      widgetContract.implementationStatus !== "component-contract-only" ||
      widgetContract.presentationResponsibility !== "render-governed-metrics-only" ||
      widgetContract.forbiddenDependencies.length !== FORBIDDEN_COMPONENT_DEPENDENCIES.length,
  );

  if (invalidWidget) {
    throw new Error(`Executive dashboard widget is outside governance: ${invalidWidget.id}`);
  }
}
