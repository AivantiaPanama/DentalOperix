import {
  type ExecutiveDashboardDataClientDesign,
  type ExecutiveDashboardDataClientEndpointBinding,
  assertExecutiveDashboardDataClientDesign,
  createExecutiveDashboardDataClientDesign,
} from "./executive-dashboard-data-client-design";
import type { ExecutiveDashboardSurface } from "./executive-dashboard-ui-architecture";

export const EXECUTIVE_DASHBOARD_INTEGRATION_BOUNDARY_DESIGN_VERSION =
  "executive-dashboard-integration-boundary-design/v1";

export type ExecutiveDashboardIntegrationBoundaryDesignPhase = "17.3-F";

export type ExecutiveDashboardIntegrationBoundaryDesignStatus =
  "approved-for-future-view-model-design";

export type ExecutiveDashboardIntegrationBoundaryLayer =
  | "dashboard-shell-boundary"
  | "access-gate-boundary"
  | "data-client-boundary"
  | "api-contract-boundary";

export type ExecutiveDashboardIntegrationBoundaryMode = "metric-only-contract-boundary";

export type ExecutiveDashboardIntegrationBoundaryExposure = "metric-only";

export type ExecutiveDashboardIntegrationBoundaryRuntimeStatus = "design-contract-only";

export type ExecutiveDashboardIntegrationBoundaryForbiddenDependency =
  | "aggregates"
  | "adapters"
  | "raw-telemetry"
  | "read-sources"
  | "read-model-source-provider"
  | "read-model-direct-access"
  | "lead-write-paths"
  | "persistence"
  | "domain-logic"
  | "fallback-logic"
  | "public-api-expansion"
  | "admin-login-credential-storage"
  | "browser-storage"
  | "credential-forwarding"
  | "client-side-aggregation"
  | "client-side-fallback"
  | "transport-implementation"
  | "fetch-implementation"
  | "route-implementation"
  | "visual-ui-implementation";

export type ExecutiveDashboardIntegrationBoundary = {
  surface: ExecutiveDashboardSurface;
  layers: ExecutiveDashboardIntegrationBoundaryLayer[];
  route: ExecutiveDashboardDataClientEndpointBinding["route"];
  method: "GET";
  requiredPermission: "executive-observability:read";
  allowedContract: "ExecutiveDashboardApiContracts";
  exposure: ExecutiveDashboardIntegrationBoundaryExposure;
  dataClientMode: ExecutiveDashboardDataClientDesign["mode"];
  runtimeStatus: ExecutiveDashboardIntegrationBoundaryRuntimeStatus;
  boundaryOwnership: "presentation-integration-only";
  fallbackOwnership: "server-read-platform-only";
};

export type ExecutiveDashboardIntegrationBoundaryGuardrails = {
  uiImplementationIncluded: false;
  visualComponentsIncluded: false;
  routeImplementationIncluded: false;
  apiImplementationIncluded: false;
  transportImplementationIncluded: false;
  fetchImplementationIncluded: false;
  browserStorageIncluded: false;
  credentialStorageIncluded: false;
  credentialForwardingIncluded: false;
  persistenceIncluded: false;
  domainLogicIncluded: false;
  fallbackLogicIncluded: false;
  clientSideFallbackIncluded: false;
  clientSideAggregationIncluded: false;
  aggregateAccess: false;
  adapterAccess: false;
  readModelDirectAccess: false;
  rawTelemetryExposure: false;
  leadWriteIncluded: false;
  publicApiExpansionIncluded: false;
  aggregateIsolationPreserved: true;
  domainOwnershipPreserved: true;
  leadsSourceOfTruthPreserved: true;
  readModelPlatformV2ClosedFrozenPreserved: true;
};

export type ExecutiveDashboardIntegrationBoundaryDesign = {
  version: typeof EXECUTIVE_DASHBOARD_INTEGRATION_BOUNDARY_DESIGN_VERSION;
  phase: ExecutiveDashboardIntegrationBoundaryDesignPhase;
  status: ExecutiveDashboardIntegrationBoundaryDesignStatus;
  generatedAt: string;
  dataClientDesignVersion: ExecutiveDashboardDataClientDesign["version"];
  accessModelVersion: ExecutiveDashboardDataClientDesign["accessModelVersion"];
  apiContractVersion: ExecutiveDashboardDataClientDesign["apiContractVersion"];
  mode: ExecutiveDashboardIntegrationBoundaryMode;
  guardrails: ExecutiveDashboardIntegrationBoundaryGuardrails;
  boundaries: ExecutiveDashboardIntegrationBoundary[];
  forbiddenDependencies: ExecutiveDashboardIntegrationBoundaryForbiddenDependency[];
  nextPhase: "17.3-G Dashboard View Model Design";
};

const BOUNDARY_LAYERS: ExecutiveDashboardIntegrationBoundaryLayer[] = [
  "dashboard-shell-boundary",
  "access-gate-boundary",
  "data-client-boundary",
  "api-contract-boundary",
];

const FORBIDDEN_INTEGRATION_BOUNDARY_DEPENDENCIES: ExecutiveDashboardIntegrationBoundaryForbiddenDependency[] =
  [
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
    "public-api-expansion",
    "admin-login-credential-storage",
    "browser-storage",
    "credential-forwarding",
    "client-side-aggregation",
    "client-side-fallback",
    "transport-implementation",
    "fetch-implementation",
    "route-implementation",
    "visual-ui-implementation",
  ];

export function createExecutiveDashboardIntegrationBoundaryDesign(
  dataClientDesign: ExecutiveDashboardDataClientDesign = createExecutiveDashboardDataClientDesign(),
  generatedAt = new Date().toISOString(),
): ExecutiveDashboardIntegrationBoundaryDesign {
  assertExecutiveDashboardDataClientDesign(dataClientDesign);

  const boundaries: ExecutiveDashboardIntegrationBoundary[] = dataClientDesign.endpointBindings.map(
    (binding) => ({
      surface: binding.surface,
      layers: BOUNDARY_LAYERS,
      route: binding.route,
      method: binding.method,
      requiredPermission: binding.requiredPermission,
      allowedContract: binding.allowedContract,
      exposure: binding.responseExposure,
      dataClientMode: dataClientDesign.mode,
      runtimeStatus: "design-contract-only",
      boundaryOwnership: "presentation-integration-only",
      fallbackOwnership: "server-read-platform-only",
    }),
  );

  return {
    version: EXECUTIVE_DASHBOARD_INTEGRATION_BOUNDARY_DESIGN_VERSION,
    phase: "17.3-F",
    status: "approved-for-future-view-model-design",
    generatedAt,
    dataClientDesignVersion: dataClientDesign.version,
    accessModelVersion: dataClientDesign.accessModelVersion,
    apiContractVersion: dataClientDesign.apiContractVersion,
    mode: "metric-only-contract-boundary",
    guardrails: {
      uiImplementationIncluded: false,
      visualComponentsIncluded: false,
      routeImplementationIncluded: false,
      apiImplementationIncluded: false,
      transportImplementationIncluded: false,
      fetchImplementationIncluded: false,
      browserStorageIncluded: false,
      credentialStorageIncluded: false,
      credentialForwardingIncluded: false,
      persistenceIncluded: false,
      domainLogicIncluded: false,
      fallbackLogicIncluded: false,
      clientSideFallbackIncluded: false,
      clientSideAggregationIncluded: false,
      aggregateAccess: false,
      adapterAccess: false,
      readModelDirectAccess: false,
      rawTelemetryExposure: false,
      leadWriteIncluded: false,
      publicApiExpansionIncluded: false,
      aggregateIsolationPreserved: true,
      domainOwnershipPreserved: true,
      leadsSourceOfTruthPreserved: true,
      readModelPlatformV2ClosedFrozenPreserved: true,
    },
    boundaries,
    forbiddenDependencies: FORBIDDEN_INTEGRATION_BOUNDARY_DEPENDENCIES,
    nextPhase: "17.3-G Dashboard View Model Design",
  };
}

export function assertExecutiveDashboardIntegrationBoundaryDesign(
  design: ExecutiveDashboardIntegrationBoundaryDesign,
): void {
  if (design.phase !== "17.3-F" || design.status !== "approved-for-future-view-model-design") {
    throw new Error(
      "Executive dashboard integration boundary design is not approved for future view model design.",
    );
  }

  if (
    design.guardrails.uiImplementationIncluded ||
    design.guardrails.visualComponentsIncluded ||
    design.guardrails.routeImplementationIncluded ||
    design.guardrails.apiImplementationIncluded ||
    design.guardrails.transportImplementationIncluded ||
    design.guardrails.fetchImplementationIncluded ||
    design.guardrails.browserStorageIncluded ||
    design.guardrails.credentialStorageIncluded ||
    design.guardrails.credentialForwardingIncluded ||
    design.guardrails.persistenceIncluded ||
    design.guardrails.domainLogicIncluded ||
    design.guardrails.fallbackLogicIncluded ||
    design.guardrails.clientSideFallbackIncluded ||
    design.guardrails.clientSideAggregationIncluded ||
    design.guardrails.aggregateAccess ||
    design.guardrails.adapterAccess ||
    design.guardrails.readModelDirectAccess ||
    design.guardrails.rawTelemetryExposure ||
    design.guardrails.leadWriteIncluded ||
    design.guardrails.publicApiExpansionIncluded ||
    !design.guardrails.aggregateIsolationPreserved ||
    !design.guardrails.domainOwnershipPreserved ||
    !design.guardrails.leadsSourceOfTruthPreserved ||
    !design.guardrails.readModelPlatformV2ClosedFrozenPreserved
  ) {
    throw new Error("Executive dashboard integration boundary guardrails are not satisfied.");
  }

  if (design.mode !== "metric-only-contract-boundary") {
    throw new Error(
      "Executive dashboard integration boundary must remain metric-only and contract-bound.",
    );
  }

  if (design.boundaries.length !== 3) {
    throw new Error(
      "Executive dashboard integration boundary design must define exactly three governed boundaries.",
    );
  }

  const invalidBoundary = design.boundaries.find(
    (boundary) =>
      boundary.method !== "GET" ||
      boundary.requiredPermission !== "executive-observability:read" ||
      boundary.allowedContract !== "ExecutiveDashboardApiContracts" ||
      boundary.exposure !== "metric-only" ||
      boundary.dataClientMode !== "contract-bound-metric-read" ||
      boundary.runtimeStatus !== "design-contract-only" ||
      boundary.boundaryOwnership !== "presentation-integration-only" ||
      boundary.fallbackOwnership !== "server-read-platform-only",
  );

  if (invalidBoundary) {
    throw new Error(
      `Executive dashboard integration boundary is outside governance: ${invalidBoundary.surface}`,
    );
  }

  const forbiddenDependency = design.forbiddenDependencies.find(
    (dependency) => !FORBIDDEN_INTEGRATION_BOUNDARY_DEPENDENCIES.includes(dependency),
  );

  if (forbiddenDependency) {
    throw new Error(
      `Executive dashboard integration boundary contains unknown forbidden dependency: ${forbiddenDependency}`,
    );
  }
}
