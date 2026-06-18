import {
  type ExecutiveDashboardIntegrationBoundary,
  type ExecutiveDashboardIntegrationBoundaryDesign,
  assertExecutiveDashboardIntegrationBoundaryDesign,
  createExecutiveDashboardIntegrationBoundaryDesign,
} from "./executive-dashboard-integration-boundary-design";
import type { ExecutiveDashboardSurface } from "./executive-dashboard-ui-architecture";

export const EXECUTIVE_DASHBOARD_RENDER_CONTRACT_DESIGN_VERSION =
  "executive-dashboard-render-contract-design/v1";

export type ExecutiveDashboardRenderContractDesignPhase = "17.3-G";

export type ExecutiveDashboardRenderContractDesignStatus = "approved-for-future-view-model-design";

export type ExecutiveDashboardRenderState = "loading" | "ready" | "empty" | "error" | "forbidden";

export type ExecutiveDashboardRenderContractMode = "metric-only-render-contract";

export type ExecutiveDashboardRenderExposure = "metric-only";

export type ExecutiveDashboardRenderRuntimeStatus = "design-contract-only";

export type ExecutiveDashboardRenderOwnership = "presentation-render-only";

export type ExecutiveDashboardRenderStatePolicy = {
  state: ExecutiveDashboardRenderState;
  description: string;
  allowedDataExposure: ExecutiveDashboardRenderExposure;
  allowedContract: "ExecutiveDashboardApiContracts";
  requiredPermission: "executive-observability:read";
  mayDisplayMetricValues: boolean;
  mayDisplayRawTelemetry: false;
  mayDisplayAggregateState: false;
  mayDisplayAdapterState: false;
  mayTriggerFallback: false;
  mayPersistData: false;
};

export type ExecutiveDashboardSurfaceRenderContract = {
  surface: ExecutiveDashboardSurface;
  route: ExecutiveDashboardIntegrationBoundary["route"];
  method: "GET";
  renderOwnership: ExecutiveDashboardRenderOwnership;
  runtimeStatus: ExecutiveDashboardRenderRuntimeStatus;
  allowedContract: "ExecutiveDashboardApiContracts";
  requiredPermission: "executive-observability:read";
  exposure: ExecutiveDashboardRenderExposure;
  allowedStates: ExecutiveDashboardRenderState[];
  statePolicies: ExecutiveDashboardRenderStatePolicy[];
};

export type ExecutiveDashboardRenderContractGuardrails = {
  uiImplementationIncluded: false;
  visualComponentsIncluded: false;
  routeImplementationIncluded: false;
  apiImplementationIncluded: false;
  transportImplementationIncluded: false;
  fetchImplementationIncluded: false;
  browserStorageIncluded: false;
  credentialStorageIncluded: false;
  persistenceIncluded: false;
  domainLogicIncluded: false;
  fallbackLogicIncluded: false;
  clientSideFallbackIncluded: false;
  clientSideAggregationIncluded: false;
  computedHealthIncluded: false;
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

export type ExecutiveDashboardRenderContractForbiddenDependency =
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
  | "computed-health"
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

export type ExecutiveDashboardRenderContractDesign = {
  version: typeof EXECUTIVE_DASHBOARD_RENDER_CONTRACT_DESIGN_VERSION;
  phase: ExecutiveDashboardRenderContractDesignPhase;
  status: ExecutiveDashboardRenderContractDesignStatus;
  generatedAt: string;
  integrationBoundaryDesignVersion: ExecutiveDashboardIntegrationBoundaryDesign["version"];
  apiContractVersion: ExecutiveDashboardIntegrationBoundaryDesign["apiContractVersion"];
  mode: ExecutiveDashboardRenderContractMode;
  guardrails: ExecutiveDashboardRenderContractGuardrails;
  renderContracts: ExecutiveDashboardSurfaceRenderContract[];
  forbiddenDependencies: ExecutiveDashboardRenderContractForbiddenDependency[];
  nextPhase: "17.3-H Dashboard View Model Design";
};

export const EXECUTIVE_DASHBOARD_ALLOWED_RENDER_STATES: ExecutiveDashboardRenderState[] = [
  "loading",
  "ready",
  "empty",
  "error",
  "forbidden",
];

const FORBIDDEN_RENDER_CONTRACT_DEPENDENCIES: ExecutiveDashboardRenderContractForbiddenDependency[] = [
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
  "computed-health",
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

function createRenderStatePolicies(): ExecutiveDashboardRenderStatePolicy[] {
  return [
    {
      state: "loading",
      description: "Presentation placeholder while an authorized metric-only request is pending.",
      allowedDataExposure: "metric-only",
      allowedContract: "ExecutiveDashboardApiContracts",
      requiredPermission: "executive-observability:read",
      mayDisplayMetricValues: false,
      mayDisplayRawTelemetry: false,
      mayDisplayAggregateState: false,
      mayDisplayAdapterState: false,
      mayTriggerFallback: false,
      mayPersistData: false,
    },
    {
      state: "ready",
      description: "Presentation of authorized metric-only response values.",
      allowedDataExposure: "metric-only",
      allowedContract: "ExecutiveDashboardApiContracts",
      requiredPermission: "executive-observability:read",
      mayDisplayMetricValues: true,
      mayDisplayRawTelemetry: false,
      mayDisplayAggregateState: false,
      mayDisplayAdapterState: false,
      mayTriggerFallback: false,
      mayPersistData: false,
    },
    {
      state: "empty",
      description: "Presentation of an authorized metric-only response with no displayable metrics.",
      allowedDataExposure: "metric-only",
      allowedContract: "ExecutiveDashboardApiContracts",
      requiredPermission: "executive-observability:read",
      mayDisplayMetricValues: false,
      mayDisplayRawTelemetry: false,
      mayDisplayAggregateState: false,
      mayDisplayAdapterState: false,
      mayTriggerFallback: false,
      mayPersistData: false,
    },
    {
      state: "error",
      description: "Presentation of a sanitized request failure without exposing raw telemetry or internals.",
      allowedDataExposure: "metric-only",
      allowedContract: "ExecutiveDashboardApiContracts",
      requiredPermission: "executive-observability:read",
      mayDisplayMetricValues: false,
      mayDisplayRawTelemetry: false,
      mayDisplayAggregateState: false,
      mayDisplayAdapterState: false,
      mayTriggerFallback: false,
      mayPersistData: false,
    },
    {
      state: "forbidden",
      description: "Presentation of denied access when executive-observability:read is missing.",
      allowedDataExposure: "metric-only",
      allowedContract: "ExecutiveDashboardApiContracts",
      requiredPermission: "executive-observability:read",
      mayDisplayMetricValues: false,
      mayDisplayRawTelemetry: false,
      mayDisplayAggregateState: false,
      mayDisplayAdapterState: false,
      mayTriggerFallback: false,
      mayPersistData: false,
    },
  ];
}

export function createExecutiveDashboardRenderContractDesign(
  integrationBoundaryDesign: ExecutiveDashboardIntegrationBoundaryDesign = createExecutiveDashboardIntegrationBoundaryDesign(),
  generatedAt = new Date().toISOString(),
): ExecutiveDashboardRenderContractDesign {
  assertExecutiveDashboardIntegrationBoundaryDesign(integrationBoundaryDesign);

  const renderContracts: ExecutiveDashboardSurfaceRenderContract[] = integrationBoundaryDesign.boundaries.map((boundary) => ({
    surface: boundary.surface,
    route: boundary.route,
    method: boundary.method,
    renderOwnership: "presentation-render-only",
    runtimeStatus: "design-contract-only",
    allowedContract: boundary.allowedContract,
    requiredPermission: boundary.requiredPermission,
    exposure: boundary.exposure,
    allowedStates: EXECUTIVE_DASHBOARD_ALLOWED_RENDER_STATES,
    statePolicies: createRenderStatePolicies(),
  }));

  return {
    version: EXECUTIVE_DASHBOARD_RENDER_CONTRACT_DESIGN_VERSION,
    phase: "17.3-G",
    status: "approved-for-future-view-model-design",
    generatedAt,
    integrationBoundaryDesignVersion: integrationBoundaryDesign.version,
    apiContractVersion: integrationBoundaryDesign.apiContractVersion,
    mode: "metric-only-render-contract",
    guardrails: {
      uiImplementationIncluded: false,
      visualComponentsIncluded: false,
      routeImplementationIncluded: false,
      apiImplementationIncluded: false,
      transportImplementationIncluded: false,
      fetchImplementationIncluded: false,
      browserStorageIncluded: false,
      credentialStorageIncluded: false,
      persistenceIncluded: false,
      domainLogicIncluded: false,
      fallbackLogicIncluded: false,
      clientSideFallbackIncluded: false,
      clientSideAggregationIncluded: false,
      computedHealthIncluded: false,
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
    renderContracts,
    forbiddenDependencies: FORBIDDEN_RENDER_CONTRACT_DEPENDENCIES,
    nextPhase: "17.3-H Dashboard View Model Design",
  };
}

export function assertExecutiveDashboardRenderContractDesign(design: ExecutiveDashboardRenderContractDesign): void {
  if (design.phase !== "17.3-G" || design.status !== "approved-for-future-view-model-design") {
    throw new Error("Executive dashboard render contract design is not approved for future view model design.");
  }

  if (design.mode !== "metric-only-render-contract") {
    throw new Error("Executive dashboard render contract design must remain metric-only.");
  }

  const guardrails = design.guardrails;
  if (
    guardrails.uiImplementationIncluded ||
    guardrails.visualComponentsIncluded ||
    guardrails.routeImplementationIncluded ||
    guardrails.apiImplementationIncluded ||
    guardrails.transportImplementationIncluded ||
    guardrails.fetchImplementationIncluded ||
    guardrails.browserStorageIncluded ||
    guardrails.credentialStorageIncluded ||
    guardrails.persistenceIncluded ||
    guardrails.domainLogicIncluded ||
    guardrails.fallbackLogicIncluded ||
    guardrails.clientSideFallbackIncluded ||
    guardrails.clientSideAggregationIncluded ||
    guardrails.computedHealthIncluded ||
    guardrails.aggregateAccess ||
    guardrails.adapterAccess ||
    guardrails.readModelDirectAccess ||
    guardrails.rawTelemetryExposure ||
    guardrails.leadWriteIncluded ||
    guardrails.publicApiExpansionIncluded ||
    !guardrails.aggregateIsolationPreserved ||
    !guardrails.domainOwnershipPreserved ||
    !guardrails.leadsSourceOfTruthPreserved ||
    !guardrails.readModelPlatformV2ClosedFrozenPreserved
  ) {
    throw new Error("Executive dashboard render contract guardrails are not satisfied.");
  }

  if (design.renderContracts.length !== 3) {
    throw new Error("Executive dashboard render contract design must define exactly three surface contracts.");
  }

  const invalidContract = design.renderContracts.find(
    (contract) =>
      contract.method !== "GET" ||
      contract.renderOwnership !== "presentation-render-only" ||
      contract.runtimeStatus !== "design-contract-only" ||
      contract.allowedContract !== "ExecutiveDashboardApiContracts" ||
      contract.requiredPermission !== "executive-observability:read" ||
      contract.exposure !== "metric-only" ||
      contract.allowedStates.join("|") !== EXECUTIVE_DASHBOARD_ALLOWED_RENDER_STATES.join("|") ||
      contract.statePolicies.length !== EXECUTIVE_DASHBOARD_ALLOWED_RENDER_STATES.length,
  );

  if (invalidContract) {
    throw new Error(`Executive dashboard render contract is outside governance: ${invalidContract.surface}`);
  }

  const unsafePolicy = design.renderContracts
    .flatMap((contract) => contract.statePolicies.map((policy) => ({ surface: contract.surface, policy })))
    .find(
      ({ policy }) =>
        policy.allowedDataExposure !== "metric-only" ||
        policy.allowedContract !== "ExecutiveDashboardApiContracts" ||
        policy.requiredPermission !== "executive-observability:read" ||
        policy.mayDisplayRawTelemetry ||
        policy.mayDisplayAggregateState ||
        policy.mayDisplayAdapterState ||
        policy.mayTriggerFallback ||
        policy.mayPersistData,
    );

  if (unsafePolicy) {
    throw new Error(`Executive dashboard render state policy is outside governance: ${unsafePolicy.surface}`);
  }
}
