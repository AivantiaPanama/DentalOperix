import {
  type ExecutiveDashboardAccessModel,
  assertExecutiveDashboardAccessModel,
  createExecutiveDashboardAccessModel,
} from "./executive-dashboard-access-model";
import {
  type ExecutiveDashboardComponentDesign,
  type ExecutiveDashboardWidgetId,
  assertExecutiveDashboardComponentDesign,
  createExecutiveDashboardComponentDesign,
} from "./executive-dashboard-component-design";
import {
  type ExecutiveDashboardDataClientDesign,
  assertExecutiveDashboardDataClientDesign,
  createExecutiveDashboardDataClientDesign,
} from "./executive-dashboard-data-client-design";
import {
  type ExecutiveDashboardRenderContractDesign,
  type ExecutiveDashboardRenderState,
  assertExecutiveDashboardRenderContractDesign,
  createExecutiveDashboardRenderContractDesign,
} from "./executive-dashboard-render-contract-design";
import type { ExecutiveDashboardSurface } from "./executive-dashboard-ui-architecture";

export const EXECUTIVE_DASHBOARD_UI_FOUNDATION_PACK_VERSION = "executive-dashboard-ui-foundation-pack/v1";

export type ExecutiveDashboardUiFoundationPackPhase = "17.4";

export type ExecutiveDashboardUiFoundationPackStatus = "approved-foundation-pack-contracts-only";

export type ExecutiveDashboardUiFoundationPackScope =
  | "17.4-A-layout-shell-contract"
  | "17.4-B-routing-boundary-contract"
  | "17.4-C-navigation-model"
  | "17.4-D-widget-registry"
  | "17.4-E-widget-composition-runtime-contract"
  | "17.4-F-render-state-mapping"
  | "17.4-G-access-guard-integration"
  | "17.4-H-data-client-binding"
  | "17.4-I-empty-error-forbidden-ux-contracts"
  | "17.4-J-governance-test-pack";

export type ExecutiveDashboardUiFoundationLayoutRegion = "header" | "navigation" | "content" | "status";

export type ExecutiveDashboardUiFoundationSurfacePath =
  | "/admin/dashboard/executive"
  | "/admin/dashboard/operational"
  | "/admin/dashboard/governance";

export type ExecutiveDashboardUiFoundationExposure = "metric-only";

export type ExecutiveDashboardUiFoundationRuntimeStatus = "foundation-contract-only";

export type ExecutiveDashboardUiFoundationLayoutShell = {
  surface: ExecutiveDashboardSurface;
  path: ExecutiveDashboardUiFoundationSurfacePath;
  regions: ExecutiveDashboardUiFoundationLayoutRegion[];
  runtimeStatus: ExecutiveDashboardUiFoundationRuntimeStatus;
  implementationIncluded: false;
  allowedContract: "ExecutiveDashboardApiContracts";
  exposure: ExecutiveDashboardUiFoundationExposure;
};

export type ExecutiveDashboardUiFoundationNavigationItem = {
  surface: ExecutiveDashboardSurface;
  label: "Executive Dashboard" | "Operational Dashboard" | "Governance Dashboard";
  path: ExecutiveDashboardUiFoundationSurfacePath;
  requiredPermission: "executive-observability:read";
  exposure: ExecutiveDashboardUiFoundationExposure;
};

export type ExecutiveDashboardUiFoundationWidgetRegistryEntry = {
  widgetId: ExecutiveDashboardWidgetId;
  surface: ExecutiveDashboardSurface;
  allowedContract: "ExecutiveDashboardApiContracts";
  requiredPermission: "executive-observability:read";
  exposure: ExecutiveDashboardUiFoundationExposure;
  visualImplementationIncluded: false;
  domainLogicIncluded: false;
  fallbackLogicIncluded: false;
};

export type ExecutiveDashboardUiFoundationCompositionRuntime = {
  surface: ExecutiveDashboardSurface;
  path: ExecutiveDashboardUiFoundationSurfacePath;
  widgetIds: ExecutiveDashboardWidgetId[];
  renderStates: ExecutiveDashboardRenderState[];
  compositionMode: "declarative-metric-only";
  runtimeStatus: ExecutiveDashboardUiFoundationRuntimeStatus;
};

export type ExecutiveDashboardUiFoundationAccessGuardBinding = {
  surface: ExecutiveDashboardSurface;
  requiredPermission: "executive-observability:read";
  accessLevel: "metric-only-read";
  guardSource: "executive-dashboard-access-model/v1";
  credentialStorageIncluded: false;
};

export type ExecutiveDashboardUiFoundationDataClientBinding = {
  surface: ExecutiveDashboardSurface;
  route: string;
  method: "GET";
  bindingSource: "executive-dashboard-data-client-design/v1";
  transportImplementationIncluded: false;
  fetchImplementationIncluded: false;
  clientSideFallbackIncluded: false;
  responseExposure: ExecutiveDashboardUiFoundationExposure;
};

export type ExecutiveDashboardUiFoundationUxStateContract = {
  state: Extract<ExecutiveDashboardRenderState, "empty" | "error" | "forbidden">;
  sanitized: true;
  mayDisplayRawTelemetry: false;
  mayDisplayAggregateState: false;
  mayDisplayAdapterState: false;
  mayTriggerFallback: false;
  exposure: ExecutiveDashboardUiFoundationExposure;
};

export type ExecutiveDashboardUiFoundationGuardrails = {
  uiProductImplementationIncluded: false;
  visualComponentsIncluded: false;
  routeImplementationIncluded: false;
  apiImplementationIncluded: false;
  transportImplementationIncluded: false;
  fetchImplementationIncluded: false;
  browserStorageIncluded: false;
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
  publicApiExpansionIncluded: false;
  adminLoginModificationIncluded: false;
  leadWriteIncluded: false;
  aggregateIsolationPreserved: true;
  domainOwnershipPreserved: true;
  leadsSourceOfTruthPreserved: true;
  readModelPlatformV2ClosedFrozenPreserved: true;
};

export type ExecutiveDashboardUiFoundationForbiddenDependency =
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
  | "admin-login-modification"
  | "admin-login-credential-storage"
  | "browser-storage"
  | "credential-forwarding"
  | "client-side-aggregation"
  | "client-side-fallback"
  | "transport-implementation"
  | "fetch-implementation"
  | "route-implementation"
  | "visual-ui-implementation";

export type ExecutiveDashboardUiFoundationPack = {
  version: typeof EXECUTIVE_DASHBOARD_UI_FOUNDATION_PACK_VERSION;
  phase: ExecutiveDashboardUiFoundationPackPhase;
  status: ExecutiveDashboardUiFoundationPackStatus;
  generatedAt: string;
  coveredScopes: ExecutiveDashboardUiFoundationPackScope[];
  componentDesignVersion: ExecutiveDashboardComponentDesign["version"];
  accessModelVersion: ExecutiveDashboardAccessModel["version"];
  dataClientDesignVersion: ExecutiveDashboardDataClientDesign["version"];
  renderContractDesignVersion: ExecutiveDashboardRenderContractDesign["version"];
  guardrails: ExecutiveDashboardUiFoundationGuardrails;
  layoutShells: ExecutiveDashboardUiFoundationLayoutShell[];
  navigation: ExecutiveDashboardUiFoundationNavigationItem[];
  widgetRegistry: ExecutiveDashboardUiFoundationWidgetRegistryEntry[];
  compositionRuntime: ExecutiveDashboardUiFoundationCompositionRuntime[];
  accessGuardBindings: ExecutiveDashboardUiFoundationAccessGuardBinding[];
  dataClientBindings: ExecutiveDashboardUiFoundationDataClientBinding[];
  uxStateContracts: ExecutiveDashboardUiFoundationUxStateContract[];
  forbiddenDependencies: ExecutiveDashboardUiFoundationForbiddenDependency[];
  nextPhase: "17.5 Executive Dashboard UI Implementation Pack";
};

export const EXECUTIVE_DASHBOARD_UI_FOUNDATION_SCOPES: ExecutiveDashboardUiFoundationPackScope[] = [
  "17.4-A-layout-shell-contract",
  "17.4-B-routing-boundary-contract",
  "17.4-C-navigation-model",
  "17.4-D-widget-registry",
  "17.4-E-widget-composition-runtime-contract",
  "17.4-F-render-state-mapping",
  "17.4-G-access-guard-integration",
  "17.4-H-data-client-binding",
  "17.4-I-empty-error-forbidden-ux-contracts",
  "17.4-J-governance-test-pack",
];

const SURFACE_PATHS: Record<ExecutiveDashboardSurface, ExecutiveDashboardUiFoundationSurfacePath> = {
  executive: "/admin/dashboard/executive",
  operational: "/admin/dashboard/operational",
  governance: "/admin/dashboard/governance",
};

const FORBIDDEN_FOUNDATION_DEPENDENCIES: ExecutiveDashboardUiFoundationForbiddenDependency[] = [
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
  "admin-login-modification",
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

function createGuardrails(): ExecutiveDashboardUiFoundationGuardrails {
  return {
    uiProductImplementationIncluded: false,
    visualComponentsIncluded: false,
    routeImplementationIncluded: false,
    apiImplementationIncluded: false,
    transportImplementationIncluded: false,
    fetchImplementationIncluded: false,
    browserStorageIncluded: false,
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
    publicApiExpansionIncluded: false,
    adminLoginModificationIncluded: false,
    leadWriteIncluded: false,
    aggregateIsolationPreserved: true,
    domainOwnershipPreserved: true,
    leadsSourceOfTruthPreserved: true,
    readModelPlatformV2ClosedFrozenPreserved: true,
  };
}

export function createExecutiveDashboardUiFoundationPack(
  componentDesign: ExecutiveDashboardComponentDesign = createExecutiveDashboardComponentDesign(),
  accessModel: ExecutiveDashboardAccessModel = createExecutiveDashboardAccessModel(undefined, componentDesign),
  dataClientDesign: ExecutiveDashboardDataClientDesign = createExecutiveDashboardDataClientDesign(undefined, accessModel),
  renderContractDesign: ExecutiveDashboardRenderContractDesign = createExecutiveDashboardRenderContractDesign(),
  generatedAt = new Date().toISOString(),
): ExecutiveDashboardUiFoundationPack {
  assertExecutiveDashboardComponentDesign(componentDesign);
  assertExecutiveDashboardAccessModel(accessModel);
  assertExecutiveDashboardDataClientDesign(dataClientDesign);
  assertExecutiveDashboardRenderContractDesign(renderContractDesign);

  const layoutShells: ExecutiveDashboardUiFoundationLayoutShell[] = componentDesign.panels.map((panel) => ({
    surface: panel.surface,
    path: SURFACE_PATHS[panel.surface],
    regions: ["header", "navigation", "content", "status"],
    runtimeStatus: "foundation-contract-only",
    implementationIncluded: false,
    allowedContract: "ExecutiveDashboardApiContracts",
    exposure: "metric-only",
  }));

  const navigation: ExecutiveDashboardUiFoundationNavigationItem[] = componentDesign.panels.map((panel) => ({
    surface: panel.surface,
    label: panel.label,
    path: SURFACE_PATHS[panel.surface],
    requiredPermission: "executive-observability:read",
    exposure: "metric-only",
  }));

  const widgetRegistry: ExecutiveDashboardUiFoundationWidgetRegistryEntry[] = componentDesign.widgets.map((widgetContract) => ({
    widgetId: widgetContract.id,
    surface: widgetContract.surface,
    allowedContract: widgetContract.requiredContract,
    requiredPermission: widgetContract.permissionRequired,
    exposure: widgetContract.exposure,
    visualImplementationIncluded: false,
    domainLogicIncluded: false,
    fallbackLogicIncluded: false,
  }));

  const compositionRuntime: ExecutiveDashboardUiFoundationCompositionRuntime[] = componentDesign.panels.map((panel) => ({
    surface: panel.surface,
    path: SURFACE_PATHS[panel.surface],
    widgetIds: panel.widgets,
    renderStates: ["loading", "ready", "empty", "error", "forbidden"],
    compositionMode: "declarative-metric-only",
    runtimeStatus: "foundation-contract-only",
  }));

  const accessGuardBindings: ExecutiveDashboardUiFoundationAccessGuardBinding[] = accessModel.policies.map((policy) => ({
    surface: policy.surface,
    requiredPermission: policy.requiredPermission,
    accessLevel: policy.accessLevel,
    guardSource: "executive-dashboard-access-model/v1",
    credentialStorageIncluded: false,
  }));

  const dataClientBindings: ExecutiveDashboardUiFoundationDataClientBinding[] = dataClientDesign.endpointBindings.map((binding) => ({
    surface: binding.surface,
    route: binding.route,
    method: binding.method,
    bindingSource: "executive-dashboard-data-client-design/v1",
    transportImplementationIncluded: false,
    fetchImplementationIncluded: false,
    clientSideFallbackIncluded: false,
    responseExposure: binding.responseExposure,
  }));

  return {
    version: EXECUTIVE_DASHBOARD_UI_FOUNDATION_PACK_VERSION,
    phase: "17.4",
    status: "approved-foundation-pack-contracts-only",
    generatedAt,
    coveredScopes: EXECUTIVE_DASHBOARD_UI_FOUNDATION_SCOPES,
    componentDesignVersion: componentDesign.version,
    accessModelVersion: accessModel.version,
    dataClientDesignVersion: dataClientDesign.version,
    renderContractDesignVersion: renderContractDesign.version,
    guardrails: createGuardrails(),
    layoutShells,
    navigation,
    widgetRegistry,
    compositionRuntime,
    accessGuardBindings,
    dataClientBindings,
    uxStateContracts: ["empty", "error", "forbidden"].map((state) => ({
      state: state as Extract<ExecutiveDashboardRenderState, "empty" | "error" | "forbidden">,
      sanitized: true,
      mayDisplayRawTelemetry: false,
      mayDisplayAggregateState: false,
      mayDisplayAdapterState: false,
      mayTriggerFallback: false,
      exposure: "metric-only",
    })),
    forbiddenDependencies: FORBIDDEN_FOUNDATION_DEPENDENCIES,
    nextPhase: "17.5 Executive Dashboard UI Implementation Pack",
  };
}

export function assertExecutiveDashboardUiFoundationPack(pack: ExecutiveDashboardUiFoundationPack): void {
  if (pack.phase !== "17.4" || pack.status !== "approved-foundation-pack-contracts-only") {
    throw new Error("Executive dashboard UI foundation pack is not approved as a contracts-only foundation.");
  }

  if (pack.coveredScopes.join("|") !== EXECUTIVE_DASHBOARD_UI_FOUNDATION_SCOPES.join("|")) {
    throw new Error("Executive dashboard UI foundation pack does not cover the full 17.4 A/J scope.");
  }

  const guardrails = pack.guardrails;
  if (
    guardrails.uiProductImplementationIncluded ||
    guardrails.visualComponentsIncluded ||
    guardrails.routeImplementationIncluded ||
    guardrails.apiImplementationIncluded ||
    guardrails.transportImplementationIncluded ||
    guardrails.fetchImplementationIncluded ||
    guardrails.browserStorageIncluded ||
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
    guardrails.publicApiExpansionIncluded ||
    guardrails.adminLoginModificationIncluded ||
    guardrails.leadWriteIncluded ||
    !guardrails.aggregateIsolationPreserved ||
    !guardrails.domainOwnershipPreserved ||
    !guardrails.leadsSourceOfTruthPreserved ||
    !guardrails.readModelPlatformV2ClosedFrozenPreserved
  ) {
    throw new Error("Executive dashboard UI foundation guardrails are not satisfied.");
  }

  if (
    pack.layoutShells.length !== 3 ||
    pack.navigation.length !== 3 ||
    pack.compositionRuntime.length !== 3 ||
    pack.accessGuardBindings.length !== 3 ||
    pack.dataClientBindings.length !== 3 ||
    pack.widgetRegistry.length !== 11
  ) {
    throw new Error("Executive dashboard UI foundation pack has incomplete surface or widget coverage.");
  }

  const unsafeLayout = pack.layoutShells.find(
    (layout) =>
      layout.runtimeStatus !== "foundation-contract-only" ||
      layout.implementationIncluded ||
      layout.allowedContract !== "ExecutiveDashboardApiContracts" ||
      layout.exposure !== "metric-only",
  );
  if (unsafeLayout) {
    throw new Error(`Executive dashboard UI foundation layout is outside governance: ${unsafeLayout.surface}`);
  }

  const unsafeWidget = pack.widgetRegistry.find(
    (widget) =>
      widget.allowedContract !== "ExecutiveDashboardApiContracts" ||
      widget.requiredPermission !== "executive-observability:read" ||
      widget.exposure !== "metric-only" ||
      widget.visualImplementationIncluded ||
      widget.domainLogicIncluded ||
      widget.fallbackLogicIncluded,
  );
  if (unsafeWidget) {
    throw new Error(`Executive dashboard UI foundation widget is outside governance: ${unsafeWidget.widgetId}`);
  }

  const unsafeBinding = pack.dataClientBindings.find(
    (binding) =>
      binding.method !== "GET" ||
      binding.bindingSource !== "executive-dashboard-data-client-design/v1" ||
      binding.transportImplementationIncluded ||
      binding.fetchImplementationIncluded ||
      binding.clientSideFallbackIncluded ||
      binding.responseExposure !== "metric-only",
  );
  if (unsafeBinding) {
    throw new Error(`Executive dashboard UI foundation data binding is outside governance: ${unsafeBinding.surface}`);
  }

  const unsafeUxState = pack.uxStateContracts.find(
    (state) =>
      !state.sanitized ||
      state.mayDisplayRawTelemetry ||
      state.mayDisplayAggregateState ||
      state.mayDisplayAdapterState ||
      state.mayTriggerFallback ||
      state.exposure !== "metric-only",
  );
  if (unsafeUxState) {
    throw new Error(`Executive dashboard UI foundation UX state is outside governance: ${unsafeUxState.state}`);
  }
}
