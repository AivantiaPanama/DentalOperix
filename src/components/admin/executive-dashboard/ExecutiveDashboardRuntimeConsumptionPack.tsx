import type { ReactNode } from "react";
import type { ExecutiveDashboardAccessPrincipal } from "@/server/read-models/executive-dashboard-access-model";
import type { ExecutiveDashboardRenderState } from "@/server/read-models/executive-dashboard-render-contract-design";
import type { ExecutiveDashboardSurface } from "@/server/read-models/executive-dashboard-ui-architecture";
import {
  ExecutiveDashboardControlledActivationBoundary,
  assertExecutiveDashboardControlledActivationPack,
  createExecutiveDashboardControlledActivationPack,
  getExecutiveDashboardControlledAccessDecision,
  type ExecutiveDashboardControlledActivationPack,
  type ExecutiveDashboardControlledAccessDecision,
} from "./ExecutiveDashboardControlledActivationPack";
import type { ExecutiveDashboardActivationMode } from "./ExecutiveDashboardActivationPack";
import type { ExecutiveDashboardSurfaceViewModel } from "./ExecutiveDashboardUiImplementationPack";

export const EXECUTIVE_DASHBOARD_RUNTIME_CONSUMPTION_PACK_VERSION =
  "executive-dashboard-runtime-consumption-pack/v1";

export type ExecutiveDashboardRuntimeConsumptionPackPhase = "18.4-18.6";

export type ExecutiveDashboardRuntimeConsumptionPackStatus =
  "approved-runtime-consumption-candidate";

export type ExecutiveDashboardRuntimeConsumptionScope =
  | "18.4-A-runtime-data-consumption-boundary"
  | "18.4-B-contract-bound-request-descriptor"
  | "18.4-C-metric-only-response-descriptor"
  | "18.4-D-no-client-fallback-consumption"
  | "18.4-E-no-transport-implementation"
  | "18.5-A-api-response-to-render-state-mapping"
  | "18.5-B-loading-state-binding"
  | "18.5-C-ready-state-binding"
  | "18.5-D-empty-state-binding"
  | "18.5-E-error-state-binding"
  | "18.5-F-forbidden-state-binding"
  | "18.6-A-runtime-metric-only-governance-tests"
  | "18.6-B-runtime-read-only-governance-tests"
  | "18.6-C-runtime-permission-gated-governance-tests"
  | "18.6-D-no-raw-telemetry-runtime-tests"
  | "18.6-E-no-aggregate-adapter-runtime-tests";

export type ExecutiveDashboardRuntimeConsumptionExposure = "metric-only";

export type ExecutiveDashboardRuntimeApiResponseKind =
  | "pending"
  | "metric-response"
  | "empty-response"
  | "sanitized-error"
  | "access-denied";

export type ExecutiveDashboardRuntimeConsumptionBoundaryMode = "contract-bound-runtime-descriptor";

export type ExecutiveDashboardRuntimeConsumptionRequestDescriptor = {
  surface: ExecutiveDashboardSurface;
  method: "GET";
  allowedContract: "ExecutiveDashboardApiContracts";
  requiredPermission: "executive-observability:read";
  exposure: ExecutiveDashboardRuntimeConsumptionExposure;
  readOnly: true;
  metricOnly: true;
  transportImplementationIncluded: false;
  fetchImplementationIncluded: false;
  clientFallbackAllowed: false;
  rawTelemetryAllowed: false;
  aggregateAccessAllowed: false;
  adapterAccessAllowed: false;
  readSourceAccessAllowed: false;
  readModelDirectAccessAllowed: false;
  writePathAllowed: false;
};

export type ExecutiveDashboardRuntimeConsumptionResponseDescriptor = {
  surface: ExecutiveDashboardSurface;
  kind: ExecutiveDashboardRuntimeApiResponseKind;
  allowedContract: "ExecutiveDashboardApiContracts";
  exposure: ExecutiveDashboardRuntimeConsumptionExposure;
  sanitized: true;
  containsMetricValues: boolean;
  containsRawTelemetry: false;
  containsAggregateState: false;
  containsAdapterState: false;
  triggersClientFallback: false;
  persistsData: false;
  renderState: ExecutiveDashboardRenderState;
};

export type ExecutiveDashboardRuntimeConsumptionBinding = {
  surface: ExecutiveDashboardSurface;
  accessDecision: ExecutiveDashboardControlledAccessDecision;
  request: ExecutiveDashboardRuntimeConsumptionRequestDescriptor;
  response: ExecutiveDashboardRuntimeConsumptionResponseDescriptor;
  renderState: ExecutiveDashboardRenderState;
  allowed: boolean;
};

export type ExecutiveDashboardRuntimeConsumptionGuardrails = {
  runtimeConsumptionBoundaryIncluded: true;
  apiResponseToRenderStateMappingIncluded: true;
  runtimeGovernanceTestsIncluded: true;
  routeImplementationIncluded: false;
  routeTreeMutationIncluded: false;
  existingRouteMutationIncluded: false;
  adminLoginModificationIncluded: false;
  apiImplementationIncluded: false;
  authImplementationIncluded: false;
  credentialStorageIncluded: false;
  transportImplementationIncluded: false;
  fetchImplementationIncluded: false;
  persistenceIncluded: false;
  writePathIncluded: false;
  leadWriteIncluded: false;
  domainLogicIncluded: false;
  fallbackLogicIncluded: false;
  clientSideFallbackIncluded: false;
  clientSideAggregationIncluded: false;
  computedHealthIncluded: false;
  rawTelemetryExposure: false;
  aggregateAccess: false;
  adapterAccess: false;
  readSourceAccess: false;
  readModelDirectAccess: false;
  restrictedComponentMutationIncluded: false;
  metricOnly: true;
  readOnly: true;
  permissionGated: true;
  aggregateIsolationPreserved: true;
  domainOwnershipPreserved: true;
  leadsSourceOfTruthPreserved: true;
  readModelPlatformV2ClosedFrozenPreserved: true;
};

export type ExecutiveDashboardRuntimeConsumptionPack = {
  version: typeof EXECUTIVE_DASHBOARD_RUNTIME_CONSUMPTION_PACK_VERSION;
  phase: ExecutiveDashboardRuntimeConsumptionPackPhase;
  status: ExecutiveDashboardRuntimeConsumptionPackStatus;
  generatedAt: string;
  coveredScopes: ExecutiveDashboardRuntimeConsumptionScope[];
  controlledActivationVersion: ExecutiveDashboardControlledActivationPack["version"];
  mode: ExecutiveDashboardRuntimeConsumptionBoundaryMode;
  bindings: ExecutiveDashboardRuntimeConsumptionBinding[];
  guardrails: ExecutiveDashboardRuntimeConsumptionGuardrails;
  finalResult: "approved-for-runtime-consumption-review";
  nextPhase: "18.7-18.9 Dashboard Runtime Route Enablement Review";
};

export const EXECUTIVE_DASHBOARD_RUNTIME_CONSUMPTION_SCOPES: ExecutiveDashboardRuntimeConsumptionScope[] =
  [
    "18.4-A-runtime-data-consumption-boundary",
    "18.4-B-contract-bound-request-descriptor",
    "18.4-C-metric-only-response-descriptor",
    "18.4-D-no-client-fallback-consumption",
    "18.4-E-no-transport-implementation",
    "18.5-A-api-response-to-render-state-mapping",
    "18.5-B-loading-state-binding",
    "18.5-C-ready-state-binding",
    "18.5-D-empty-state-binding",
    "18.5-E-error-state-binding",
    "18.5-F-forbidden-state-binding",
    "18.6-A-runtime-metric-only-governance-tests",
    "18.6-B-runtime-read-only-governance-tests",
    "18.6-C-runtime-permission-gated-governance-tests",
    "18.6-D-no-raw-telemetry-runtime-tests",
    "18.6-E-no-aggregate-adapter-runtime-tests",
  ];

const RESPONSE_TO_RENDER_STATE: Record<
  ExecutiveDashboardRuntimeApiResponseKind,
  ExecutiveDashboardRenderState
> = {
  pending: "loading",
  "metric-response": "ready",
  "empty-response": "empty",
  "sanitized-error": "error",
  "access-denied": "forbidden",
};

export function mapExecutiveDashboardRuntimeResponseToRenderState(
  kind: ExecutiveDashboardRuntimeApiResponseKind,
): ExecutiveDashboardRenderState {
  return RESPONSE_TO_RENDER_STATE[kind];
}

function createGuardrails(): ExecutiveDashboardRuntimeConsumptionGuardrails {
  return {
    runtimeConsumptionBoundaryIncluded: true,
    apiResponseToRenderStateMappingIncluded: true,
    runtimeGovernanceTestsIncluded: true,
    routeImplementationIncluded: false,
    routeTreeMutationIncluded: false,
    existingRouteMutationIncluded: false,
    adminLoginModificationIncluded: false,
    apiImplementationIncluded: false,
    authImplementationIncluded: false,
    credentialStorageIncluded: false,
    transportImplementationIncluded: false,
    fetchImplementationIncluded: false,
    persistenceIncluded: false,
    writePathIncluded: false,
    leadWriteIncluded: false,
    domainLogicIncluded: false,
    fallbackLogicIncluded: false,
    clientSideFallbackIncluded: false,
    clientSideAggregationIncluded: false,
    computedHealthIncluded: false,
    rawTelemetryExposure: false,
    aggregateAccess: false,
    adapterAccess: false,
    readSourceAccess: false,
    readModelDirectAccess: false,
    restrictedComponentMutationIncluded: false,
    metricOnly: true,
    readOnly: true,
    permissionGated: true,
    aggregateIsolationPreserved: true,
    domainOwnershipPreserved: true,
    leadsSourceOfTruthPreserved: true,
    readModelPlatformV2ClosedFrozenPreserved: true,
  };
}

function createRequestDescriptor(
  surface: ExecutiveDashboardSurface,
): ExecutiveDashboardRuntimeConsumptionRequestDescriptor {
  return {
    surface,
    method: "GET",
    allowedContract: "ExecutiveDashboardApiContracts",
    requiredPermission: "executive-observability:read",
    exposure: "metric-only",
    readOnly: true,
    metricOnly: true,
    transportImplementationIncluded: false,
    fetchImplementationIncluded: false,
    clientFallbackAllowed: false,
    rawTelemetryAllowed: false,
    aggregateAccessAllowed: false,
    adapterAccessAllowed: false,
    readSourceAccessAllowed: false,
    readModelDirectAccessAllowed: false,
    writePathAllowed: false,
  };
}

export function createExecutiveDashboardRuntimeResponseDescriptor({
  surface,
  kind,
}: {
  surface: ExecutiveDashboardSurface;
  kind: ExecutiveDashboardRuntimeApiResponseKind;
}): ExecutiveDashboardRuntimeConsumptionResponseDescriptor {
  const renderState = mapExecutiveDashboardRuntimeResponseToRenderState(kind);

  return {
    surface,
    kind,
    allowedContract: "ExecutiveDashboardApiContracts",
    exposure: "metric-only",
    sanitized: true,
    containsMetricValues: kind === "metric-response",
    containsRawTelemetry: false,
    containsAggregateState: false,
    containsAdapterState: false,
    triggersClientFallback: false,
    persistsData: false,
    renderState,
  };
}

export function createExecutiveDashboardRuntimeConsumptionPack({
  controlledActivation = createExecutiveDashboardControlledActivationPack(),
  responseKind = "pending",
  generatedAt = new Date().toISOString(),
}: {
  controlledActivation?: ExecutiveDashboardControlledActivationPack;
  responseKind?: ExecutiveDashboardRuntimeApiResponseKind;
  generatedAt?: string;
} = {}): ExecutiveDashboardRuntimeConsumptionPack {
  assertExecutiveDashboardControlledActivationPack(controlledActivation);

  const bindings: ExecutiveDashboardRuntimeConsumptionBinding[] =
    controlledActivation.accessDecisions.map((accessDecision) => {
      const effectiveKind: ExecutiveDashboardRuntimeApiResponseKind = accessDecision.allowed
        ? responseKind
        : "access-denied";
      const response = createExecutiveDashboardRuntimeResponseDescriptor({
        surface: accessDecision.surface,
        kind: effectiveKind,
      });

      return {
        surface: accessDecision.surface,
        accessDecision,
        request: createRequestDescriptor(accessDecision.surface),
        response,
        renderState: response.renderState,
        allowed: accessDecision.allowed && response.renderState === "ready",
      };
    });

  return {
    version: EXECUTIVE_DASHBOARD_RUNTIME_CONSUMPTION_PACK_VERSION,
    phase: "18.4-18.6",
    status: "approved-runtime-consumption-candidate",
    generatedAt,
    coveredScopes: EXECUTIVE_DASHBOARD_RUNTIME_CONSUMPTION_SCOPES,
    controlledActivationVersion: controlledActivation.version,
    mode: "contract-bound-runtime-descriptor",
    bindings,
    guardrails: createGuardrails(),
    finalResult: "approved-for-runtime-consumption-review",
    nextPhase: "18.7-18.9 Dashboard Runtime Route Enablement Review",
  };
}

export function assertExecutiveDashboardRuntimeConsumptionPack(
  pack: ExecutiveDashboardRuntimeConsumptionPack,
): void {
  if (pack.phase !== "18.4-18.6" || pack.status !== "approved-runtime-consumption-candidate") {
    throw new Error("Executive dashboard runtime consumption pack is not approved.");
  }

  if (pack.coveredScopes.join("|") !== EXECUTIVE_DASHBOARD_RUNTIME_CONSUMPTION_SCOPES.join("|")) {
    throw new Error(
      "Executive dashboard runtime consumption pack does not cover the full 18.4-18.6 scope.",
    );
  }

  const guardrails = pack.guardrails;
  if (
    !guardrails.runtimeConsumptionBoundaryIncluded ||
    !guardrails.apiResponseToRenderStateMappingIncluded ||
    !guardrails.runtimeGovernanceTestsIncluded ||
    guardrails.routeImplementationIncluded ||
    guardrails.routeTreeMutationIncluded ||
    guardrails.existingRouteMutationIncluded ||
    guardrails.adminLoginModificationIncluded ||
    guardrails.apiImplementationIncluded ||
    guardrails.authImplementationIncluded ||
    guardrails.credentialStorageIncluded ||
    guardrails.transportImplementationIncluded ||
    guardrails.fetchImplementationIncluded ||
    guardrails.persistenceIncluded ||
    guardrails.writePathIncluded ||
    guardrails.leadWriteIncluded ||
    guardrails.domainLogicIncluded ||
    guardrails.fallbackLogicIncluded ||
    guardrails.clientSideFallbackIncluded ||
    guardrails.clientSideAggregationIncluded ||
    guardrails.computedHealthIncluded ||
    guardrails.rawTelemetryExposure ||
    guardrails.aggregateAccess ||
    guardrails.adapterAccess ||
    guardrails.readSourceAccess ||
    guardrails.readModelDirectAccess ||
    guardrails.restrictedComponentMutationIncluded ||
    !guardrails.metricOnly ||
    !guardrails.readOnly ||
    !guardrails.permissionGated ||
    !guardrails.aggregateIsolationPreserved ||
    !guardrails.domainOwnershipPreserved ||
    !guardrails.leadsSourceOfTruthPreserved ||
    !guardrails.readModelPlatformV2ClosedFrozenPreserved
  ) {
    throw new Error("Executive dashboard runtime consumption guardrails are not satisfied.");
  }

  if (pack.bindings.length !== 3) {
    throw new Error(
      "Executive dashboard runtime consumption pack must cover exactly three dashboard surfaces.",
    );
  }

  for (const binding of pack.bindings) {
    if (
      binding.request.method !== "GET" ||
      binding.request.allowedContract !== "ExecutiveDashboardApiContracts" ||
      binding.request.requiredPermission !== "executive-observability:read" ||
      binding.request.exposure !== "metric-only" ||
      !binding.request.readOnly ||
      !binding.request.metricOnly ||
      binding.request.transportImplementationIncluded ||
      binding.request.fetchImplementationIncluded ||
      binding.request.clientFallbackAllowed ||
      binding.request.rawTelemetryAllowed ||
      binding.request.aggregateAccessAllowed ||
      binding.request.adapterAccessAllowed ||
      binding.request.readSourceAccessAllowed ||
      binding.request.readModelDirectAccessAllowed ||
      binding.request.writePathAllowed ||
      binding.response.allowedContract !== "ExecutiveDashboardApiContracts" ||
      binding.response.exposure !== "metric-only" ||
      !binding.response.sanitized ||
      binding.response.containsRawTelemetry ||
      binding.response.containsAggregateState ||
      binding.response.containsAdapterState ||
      binding.response.triggersClientFallback ||
      binding.response.persistsData ||
      binding.renderState !== binding.response.renderState ||
      (!binding.accessDecision.allowed && binding.renderState !== "forbidden")
    ) {
      throw new Error(
        `Executive dashboard runtime consumption binding violates governance: ${binding.surface}`,
      );
    }
  }
}

export function getExecutiveDashboardRuntimeConsumptionBinding(
  surface: ExecutiveDashboardSurface,
  pack: ExecutiveDashboardRuntimeConsumptionPack = createExecutiveDashboardRuntimeConsumptionPack(),
): ExecutiveDashboardRuntimeConsumptionBinding {
  assertExecutiveDashboardRuntimeConsumptionPack(pack);

  const binding = pack.bindings.find((entry) => entry.surface === surface);
  if (!binding) {
    throw new Error(`Missing executive dashboard runtime consumption binding: ${surface}`);
  }

  return {
    ...binding,
    accessDecision: {
      ...binding.accessDecision,
      featureFlag: { ...binding.accessDecision.featureFlag },
    },
    request: { ...binding.request },
    response: { ...binding.response },
  };
}

function renderRuntimeState(state: ExecutiveDashboardRenderState): ReactNode {
  const labels: Record<ExecutiveDashboardRenderState, string> = {
    loading: "Cargando métricas ejecutivas",
    ready: "Métricas ejecutivas listas",
    empty: "Sin métricas ejecutivas disponibles",
    error: "No fue posible cargar métricas ejecutivas",
    forbidden: "Acceso restringido a observabilidad ejecutiva",
  };

  return <p data-render-state={state}>{labels[state]}</p>;
}

export function ExecutiveDashboardRuntimeConsumptionBoundary({
  featureFlagEnabled,
  mode,
  principal,
  viewModel,
  responseKind,
  children,
}: {
  featureFlagEnabled: boolean;
  mode: ExecutiveDashboardActivationMode;
  principal: ExecutiveDashboardAccessPrincipal;
  viewModel: ExecutiveDashboardSurfaceViewModel;
  responseKind: ExecutiveDashboardRuntimeApiResponseKind;
  children?: ReactNode;
}) {
  const controlledActivation = createExecutiveDashboardControlledActivationPack({
    featureFlagEnabled,
    mode,
    principal,
  });
  const pack = createExecutiveDashboardRuntimeConsumptionPack({
    controlledActivation,
    responseKind,
  });
  const binding = getExecutiveDashboardRuntimeConsumptionBinding(viewModel.surface, pack);

  return (
    <section
      data-runtime-consumption-pack={pack.version}
      data-runtime-phase={pack.phase}
      data-runtime-status={pack.status}
      data-runtime-surface={binding.surface}
      data-runtime-mode={pack.mode}
      data-runtime-response-kind={binding.response.kind}
      data-render-state={binding.renderState}
      data-access-allowed={String(binding.accessDecision.allowed)}
      data-allowed-contract={binding.request.allowedContract}
      data-permission={binding.request.requiredPermission}
      data-exposure={binding.request.exposure}
      data-read-only="true"
      data-metric-only="true"
      data-client-fallback="false"
      data-raw-telemetry="false"
      data-aggregate-access="false"
      data-adapter-access="false"
    >
      {binding.allowed ? (
        <ExecutiveDashboardControlledActivationBoundary
          featureFlagEnabled={featureFlagEnabled}
          mode={mode}
          principal={principal}
          viewModel={viewModel}
        />
      ) : (
        renderRuntimeState(binding.renderState)
      )}
      {children}
    </section>
  );
}
