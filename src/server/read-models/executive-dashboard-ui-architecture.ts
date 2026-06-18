import {
  type ExecutiveDashboardApiContracts,
  type ExecutiveDashboardApiRoute,
  createExecutiveDashboardApiContracts,
} from "./executive-dashboard-api-contracts";
import {
  type ExecutiveDashboardUiReadinessAssessment,
  assertExecutiveDashboardUiReadiness,
  createExecutiveDashboardUiReadinessAssessment,
} from "./executive-dashboard-ui-readiness";

export const EXECUTIVE_DASHBOARD_UI_ARCHITECTURE_VERSION = "executive-dashboard-ui-architecture/v1";

export type ExecutiveDashboardUiArchitecturePhase = "17.3-B";

export type ExecutiveDashboardUiArchitectureStatus = "approved-for-component-design";

export type ExecutiveDashboardSurface = "executive" | "operational" | "governance";

export type ExecutiveDashboardUiLayer =
  | "dashboard-shell"
  | "dashboard-client"
  | "dashboard-view-model"
  | "widget-composition"
  | "navigation-model";

export type ExecutiveDashboardUiConsumptionRule = {
  allowedContract: "ExecutiveDashboardApiContracts";
  permissionRequired: "executive-observability:read";
  allowedRoutes: ExecutiveDashboardApiRoute[];
  metricOnly: true;
};

export type ExecutiveDashboardUiForbiddenDependency =
  | "aggregates"
  | "adapters"
  | "raw-telemetry"
  | "read-sources"
  | "read-model-source-provider"
  | "lead-write-paths"
  | "public-api-expansion"
  | "persistence";

export type ExecutiveDashboardUiSurfaceArchitecture = {
  surface: ExecutiveDashboardSurface;
  label: "Executive Dashboard" | "Operational Dashboard" | "Governance Dashboard";
  route: ExecutiveDashboardApiRoute;
  layers: ExecutiveDashboardUiLayer[];
  ownership: "presentation-only";
  consumption: "metric-only-api-contract";
  implementationStatus: "architecture-only";
};

export type ExecutiveDashboardUiArchitectureGuardrails = {
  uiImplementationIncluded: false;
  routeImplementationIncluded: false;
  publicApiIncluded: false;
  persistenceIncluded: false;
  leadWriteIncluded: false;
  aggregateAccess: false;
  adapterAccess: false;
  rawTelemetryExposure: false;
  aggregateIsolationPreserved: true;
  domainOwnershipPreserved: true;
  leadsSourceOfTruthPreserved: true;
  readModelPlatformV2ClosedFrozenPreserved: true;
  allowedConsumption: "executive-dashboard-api-contracts-only";
};

export type ExecutiveDashboardUiArchitectureDesign = {
  version: typeof EXECUTIVE_DASHBOARD_UI_ARCHITECTURE_VERSION;
  phase: ExecutiveDashboardUiArchitecturePhase;
  status: ExecutiveDashboardUiArchitectureStatus;
  generatedAt: string;
  readinessVersion: ExecutiveDashboardUiReadinessAssessment["version"];
  guardrails: ExecutiveDashboardUiArchitectureGuardrails;
  consumptionRule: ExecutiveDashboardUiConsumptionRule;
  surfaces: ExecutiveDashboardUiSurfaceArchitecture[];
  forbiddenDependencies: ExecutiveDashboardUiForbiddenDependency[];
  nextPhase: "17.3-C Dashboard Component Design";
};

const UI_LAYERS: ExecutiveDashboardUiLayer[] = [
  "dashboard-shell",
  "dashboard-client",
  "dashboard-view-model",
  "widget-composition",
  "navigation-model",
];

const FORBIDDEN_DEPENDENCIES: ExecutiveDashboardUiForbiddenDependency[] = [
  "aggregates",
  "adapters",
  "raw-telemetry",
  "read-sources",
  "read-model-source-provider",
  "lead-write-paths",
  "public-api-expansion",
  "persistence",
];

export function createExecutiveDashboardUiArchitectureDesign(
  contracts: ExecutiveDashboardApiContracts = createExecutiveDashboardApiContracts(),
  readiness: ExecutiveDashboardUiReadinessAssessment = createExecutiveDashboardUiReadinessAssessment(contracts),
  generatedAt = new Date().toISOString(),
): ExecutiveDashboardUiArchitectureDesign {
  assertExecutiveDashboardUiReadiness(readiness);

  return {
    version: EXECUTIVE_DASHBOARD_UI_ARCHITECTURE_VERSION,
    phase: "17.3-B",
    status: "approved-for-component-design",
    generatedAt,
    readinessVersion: readiness.version,
    guardrails: {
      uiImplementationIncluded: false,
      routeImplementationIncluded: false,
      publicApiIncluded: false,
      persistenceIncluded: false,
      leadWriteIncluded: false,
      aggregateAccess: false,
      adapterAccess: false,
      rawTelemetryExposure: false,
      aggregateIsolationPreserved: true,
      domainOwnershipPreserved: true,
      leadsSourceOfTruthPreserved: true,
      readModelPlatformV2ClosedFrozenPreserved: true,
      allowedConsumption: "executive-dashboard-api-contracts-only",
    },
    consumptionRule: {
      allowedContract: "ExecutiveDashboardApiContracts",
      permissionRequired: "executive-observability:read",
      allowedRoutes: contracts.endpoints.map((endpoint) => endpoint.route),
      metricOnly: true,
    },
    surfaces: [
      {
        surface: "executive",
        label: "Executive Dashboard",
        route: "/api/internal/executive-observability/executive",
        layers: UI_LAYERS,
        ownership: "presentation-only",
        consumption: "metric-only-api-contract",
        implementationStatus: "architecture-only",
      },
      {
        surface: "operational",
        label: "Operational Dashboard",
        route: "/api/internal/executive-observability/operational",
        layers: UI_LAYERS,
        ownership: "presentation-only",
        consumption: "metric-only-api-contract",
        implementationStatus: "architecture-only",
      },
      {
        surface: "governance",
        label: "Governance Dashboard",
        route: "/api/internal/executive-observability/governance",
        layers: UI_LAYERS,
        ownership: "presentation-only",
        consumption: "metric-only-api-contract",
        implementationStatus: "architecture-only",
      },
    ],
    forbiddenDependencies: FORBIDDEN_DEPENDENCIES,
    nextPhase: "17.3-C Dashboard Component Design",
  };
}

export function assertExecutiveDashboardUiArchitectureDesign(design: ExecutiveDashboardUiArchitectureDesign): void {
  if (design.phase !== "17.3-B" || design.status !== "approved-for-component-design") {
    throw new Error("Executive dashboard UI architecture design is not approved for component design.");
  }

  if (
    design.guardrails.uiImplementationIncluded ||
    design.guardrails.routeImplementationIncluded ||
    design.guardrails.publicApiIncluded ||
    design.guardrails.persistenceIncluded ||
    design.guardrails.leadWriteIncluded ||
    design.guardrails.aggregateAccess ||
    design.guardrails.adapterAccess ||
    design.guardrails.rawTelemetryExposure ||
    !design.guardrails.aggregateIsolationPreserved ||
    !design.guardrails.domainOwnershipPreserved ||
    !design.guardrails.leadsSourceOfTruthPreserved ||
    !design.guardrails.readModelPlatformV2ClosedFrozenPreserved
  ) {
    throw new Error("Executive dashboard UI architecture guardrails are not satisfied.");
  }

  if (design.consumptionRule.allowedContract !== "ExecutiveDashboardApiContracts") {
    throw new Error("Executive dashboard UI architecture must consume ExecutiveDashboardApiContracts only.");
  }

  if (design.consumptionRule.permissionRequired !== "executive-observability:read" || !design.consumptionRule.metricOnly) {
    throw new Error("Executive dashboard UI architecture must remain permissioned and metric-only.");
  }

  if (design.surfaces.length !== 3) {
    throw new Error("Executive dashboard UI architecture must define exactly three governed dashboard surfaces.");
  }

  const invalidSurface = design.surfaces.find(
    (surface) => surface.ownership !== "presentation-only" || surface.implementationStatus !== "architecture-only",
  );

  if (invalidSurface) {
    throw new Error(`Executive dashboard surface is outside governance: ${invalidSurface.label}`);
  }
}
