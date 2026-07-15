import type { ReactNode } from "react";
import type { ExecutiveDashboardAccessPrincipal } from "@/server/read-models/executive-dashboard-access-model";
import type { ExecutiveDashboardRenderState } from "@/server/read-models/executive-dashboard-render-contract-design";
import type { ExecutiveDashboardSurface } from "@/server/read-models/executive-dashboard-ui-architecture";
import type { ExecutiveDashboardActivationMode } from "./ExecutiveDashboardActivationPack";
import type { ExecutiveDashboardSurfaceViewModel } from "./ExecutiveDashboardUiImplementationPack";
import {
  ExecutiveDashboardRuntimeConsumptionBoundary,
  assertExecutiveDashboardRuntimeConsumptionPack,
  createExecutiveDashboardRuntimeConsumptionPack,
  getExecutiveDashboardRuntimeConsumptionBinding,
  type ExecutiveDashboardRuntimeApiResponseKind,
  type ExecutiveDashboardRuntimeConsumptionBinding,
  type ExecutiveDashboardRuntimeConsumptionPack,
} from "./ExecutiveDashboardRuntimeConsumptionPack";
import { createExecutiveDashboardControlledActivationPack } from "./ExecutiveDashboardControlledActivationPack";

export const EXECUTIVE_DASHBOARD_RUNTIME_WIRING_PACK_VERSION =
  "executive-dashboard-runtime-wiring-pack/v1";

export type ExecutiveDashboardRuntimeWiringPackPhase = "18.7-18.9";

export type ExecutiveDashboardRuntimeWiringPackStatus = "approved-runtime-wiring-candidate";

export type ExecutiveDashboardRuntimeWiringScope =
  | "18.7-A-runtime-wiring-contract"
  | "18.7-B-activation-to-consumption-binding"
  | "18.7-C-consumption-to-render-state-binding"
  | "18.7-D-no-domain-logic-wiring"
  | "18.8-A-dashboard-runtime-view-binding"
  | "18.8-B-executive-runtime-view-binding"
  | "18.8-C-operational-runtime-view-binding"
  | "18.8-D-governance-runtime-view-binding"
  | "18.8-E-presentational-only-view-bridge"
  | "18.9-A-runtime-wiring-metric-only-tests"
  | "18.9-B-runtime-wiring-read-only-tests"
  | "18.9-C-runtime-wiring-permission-gated-tests"
  | "18.9-D-no-direct-internal-access-tests"
  | "18.9-E-no-client-fallback-wiring-tests"
  | "18.9-F-no-route-login-api-mutation-tests";

export type ExecutiveDashboardRuntimeWiringMode = "declarative-runtime-view-binding";

export type ExecutiveDashboardRuntimeWiringExposure = "metric-only";

export type ExecutiveDashboardRuntimeWiringViewBinding = {
  surface: ExecutiveDashboardSurface;
  runtimeBinding: ExecutiveDashboardRuntimeConsumptionBinding;
  viewState: ExecutiveDashboardRenderState;
  viewBridge: "runtime-consumption-boundary";
  allowedContract: "ExecutiveDashboardApiContracts";
  exposure: ExecutiveDashboardRuntimeWiringExposure;
  readOnly: true;
  metricOnly: true;
  permissionGated: true;
  rendersMetrics: boolean;
  rendersRestrictedState: boolean;
  routeMutationAllowed: false;
  loginMutationAllowed: false;
  apiMutationAllowed: false;
  fetchImplementationIncluded: false;
  transportImplementationIncluded: false;
  clientFallbackAllowed: false;
  aggregateAccessAllowed: false;
  adapterAccessAllowed: false;
  readSourceAccessAllowed: false;
  readModelDirectAccessAllowed: false;
  rawTelemetryAllowed: false;
};

export type ExecutiveDashboardRuntimeWiringGuardrails = {
  runtimeWiringContractIncluded: true;
  dashboardRuntimeViewBindingIncluded: true;
  wiringGovernanceTestsIncluded: true;
  declarativeCompositionOnly: true;
  routeImplementationIncluded: false;
  routeTreeMutationIncluded: false;
  existingRouteMutationIncluded: false;
  adminLoginModificationIncluded: false;
  apiImplementationIncluded: false;
  authImplementationIncluded: false;
  credentialStorageIncluded: false;
  fetchImplementationIncluded: false;
  transportImplementationIncluded: false;
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

export type ExecutiveDashboardRuntimeWiringPack = {
  version: typeof EXECUTIVE_DASHBOARD_RUNTIME_WIRING_PACK_VERSION;
  phase: ExecutiveDashboardRuntimeWiringPackPhase;
  status: ExecutiveDashboardRuntimeWiringPackStatus;
  generatedAt: string;
  coveredScopes: ExecutiveDashboardRuntimeWiringScope[];
  runtimeConsumptionVersion: ExecutiveDashboardRuntimeConsumptionPack["version"];
  mode: ExecutiveDashboardRuntimeWiringMode;
  viewBindings: ExecutiveDashboardRuntimeWiringViewBinding[];
  guardrails: ExecutiveDashboardRuntimeWiringGuardrails;
  finalResult: "approved-for-controlled-runtime-wiring-review";
  nextPhase: "19.0 Dashboard Controlled Release Review";
};

export const EXECUTIVE_DASHBOARD_RUNTIME_WIRING_SCOPES: ExecutiveDashboardRuntimeWiringScope[] = [
  "18.7-A-runtime-wiring-contract",
  "18.7-B-activation-to-consumption-binding",
  "18.7-C-consumption-to-render-state-binding",
  "18.7-D-no-domain-logic-wiring",
  "18.8-A-dashboard-runtime-view-binding",
  "18.8-B-executive-runtime-view-binding",
  "18.8-C-operational-runtime-view-binding",
  "18.8-D-governance-runtime-view-binding",
  "18.8-E-presentational-only-view-bridge",
  "18.9-A-runtime-wiring-metric-only-tests",
  "18.9-B-runtime-wiring-read-only-tests",
  "18.9-C-runtime-wiring-permission-gated-tests",
  "18.9-D-no-direct-internal-access-tests",
  "18.9-E-no-client-fallback-wiring-tests",
  "18.9-F-no-route-login-api-mutation-tests",
];

function createGuardrails(): ExecutiveDashboardRuntimeWiringGuardrails {
  return {
    runtimeWiringContractIncluded: true,
    dashboardRuntimeViewBindingIncluded: true,
    wiringGovernanceTestsIncluded: true,
    declarativeCompositionOnly: true,
    routeImplementationIncluded: false,
    routeTreeMutationIncluded: false,
    existingRouteMutationIncluded: false,
    adminLoginModificationIncluded: false,
    apiImplementationIncluded: false,
    authImplementationIncluded: false,
    credentialStorageIncluded: false,
    fetchImplementationIncluded: false,
    transportImplementationIncluded: false,
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

function createViewBinding(
  runtimeBinding: ExecutiveDashboardRuntimeConsumptionBinding,
): ExecutiveDashboardRuntimeWiringViewBinding {
  return {
    surface: runtimeBinding.surface,
    runtimeBinding,
    viewState: runtimeBinding.renderState,
    viewBridge: "runtime-consumption-boundary",
    allowedContract: runtimeBinding.request.allowedContract,
    exposure: "metric-only",
    readOnly: true,
    metricOnly: true,
    permissionGated: true,
    rendersMetrics: runtimeBinding.allowed && runtimeBinding.renderState === "ready",
    rendersRestrictedState: runtimeBinding.renderState === "forbidden",
    routeMutationAllowed: false,
    loginMutationAllowed: false,
    apiMutationAllowed: false,
    fetchImplementationIncluded: false,
    transportImplementationIncluded: false,
    clientFallbackAllowed: false,
    aggregateAccessAllowed: false,
    adapterAccessAllowed: false,
    readSourceAccessAllowed: false,
    readModelDirectAccessAllowed: false,
    rawTelemetryAllowed: false,
  };
}

export function createExecutiveDashboardRuntimeWiringPack({
  runtimeConsumption = createExecutiveDashboardRuntimeConsumptionPack(),
  generatedAt = new Date().toISOString(),
}: {
  runtimeConsumption?: ExecutiveDashboardRuntimeConsumptionPack;
  generatedAt?: string;
} = {}): ExecutiveDashboardRuntimeWiringPack {
  assertExecutiveDashboardRuntimeConsumptionPack(runtimeConsumption);

  return {
    version: EXECUTIVE_DASHBOARD_RUNTIME_WIRING_PACK_VERSION,
    phase: "18.7-18.9",
    status: "approved-runtime-wiring-candidate",
    generatedAt,
    coveredScopes: EXECUTIVE_DASHBOARD_RUNTIME_WIRING_SCOPES,
    runtimeConsumptionVersion: runtimeConsumption.version,
    mode: "declarative-runtime-view-binding",
    viewBindings: runtimeConsumption.bindings.map(createViewBinding),
    guardrails: createGuardrails(),
    finalResult: "approved-for-controlled-runtime-wiring-review",
    nextPhase: "19.0 Dashboard Controlled Release Review",
  };
}

export function assertExecutiveDashboardRuntimeWiringPack(
  pack: ExecutiveDashboardRuntimeWiringPack,
): void {
  if (pack.phase !== "18.7-18.9" || pack.status !== "approved-runtime-wiring-candidate") {
    throw new Error("Executive dashboard runtime wiring pack is not approved.");
  }

  if (pack.coveredScopes.join("|") !== EXECUTIVE_DASHBOARD_RUNTIME_WIRING_SCOPES.join("|")) {
    throw new Error(
      "Executive dashboard runtime wiring pack does not cover the full 18.7-18.9 scope.",
    );
  }

  const guardrails = pack.guardrails;
  if (
    !guardrails.runtimeWiringContractIncluded ||
    !guardrails.dashboardRuntimeViewBindingIncluded ||
    !guardrails.wiringGovernanceTestsIncluded ||
    !guardrails.declarativeCompositionOnly ||
    guardrails.routeImplementationIncluded ||
    guardrails.routeTreeMutationIncluded ||
    guardrails.existingRouteMutationIncluded ||
    guardrails.adminLoginModificationIncluded ||
    guardrails.apiImplementationIncluded ||
    guardrails.authImplementationIncluded ||
    guardrails.credentialStorageIncluded ||
    guardrails.fetchImplementationIncluded ||
    guardrails.transportImplementationIncluded ||
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
    throw new Error("Executive dashboard runtime wiring guardrails are not satisfied.");
  }

  if (pack.viewBindings.length !== 3) {
    throw new Error(
      "Executive dashboard runtime wiring must cover exactly three dashboard surfaces.",
    );
  }

  for (const binding of pack.viewBindings) {
    if (
      binding.viewBridge !== "runtime-consumption-boundary" ||
      binding.allowedContract !== "ExecutiveDashboardApiContracts" ||
      binding.exposure !== "metric-only" ||
      !binding.readOnly ||
      !binding.metricOnly ||
      !binding.permissionGated ||
      binding.routeMutationAllowed ||
      binding.loginMutationAllowed ||
      binding.apiMutationAllowed ||
      binding.fetchImplementationIncluded ||
      binding.transportImplementationIncluded ||
      binding.clientFallbackAllowed ||
      binding.aggregateAccessAllowed ||
      binding.adapterAccessAllowed ||
      binding.readSourceAccessAllowed ||
      binding.readModelDirectAccessAllowed ||
      binding.rawTelemetryAllowed ||
      binding.viewState !== binding.runtimeBinding.renderState ||
      (binding.rendersMetrics && binding.viewState !== "ready") ||
      (binding.rendersRestrictedState && binding.viewState !== "forbidden")
    ) {
      throw new Error(
        `Executive dashboard runtime wiring binding violates governance: ${binding.surface}`,
      );
    }
  }
}

export function getExecutiveDashboardRuntimeWiringViewBinding(
  surface: ExecutiveDashboardSurface,
  pack: ExecutiveDashboardRuntimeWiringPack = createExecutiveDashboardRuntimeWiringPack(),
): ExecutiveDashboardRuntimeWiringViewBinding {
  assertExecutiveDashboardRuntimeWiringPack(pack);

  const binding = pack.viewBindings.find((entry) => entry.surface === surface);
  if (!binding) {
    throw new Error(`Missing executive dashboard runtime wiring binding: ${surface}`);
  }

  return {
    ...binding,
    runtimeBinding: {
      ...binding.runtimeBinding,
      accessDecision: {
        ...binding.runtimeBinding.accessDecision,
        featureFlag: { ...binding.runtimeBinding.accessDecision.featureFlag },
      },
      request: { ...binding.runtimeBinding.request },
      response: { ...binding.runtimeBinding.response },
    },
  };
}

export function createExecutiveDashboardRuntimeWiringPackFromRuntime({
  featureFlagEnabled,
  mode,
  principal,
  responseKind,
  generatedAt,
}: {
  featureFlagEnabled: boolean;
  mode: ExecutiveDashboardActivationMode;
  principal: ExecutiveDashboardAccessPrincipal;
  responseKind: ExecutiveDashboardRuntimeApiResponseKind;
  generatedAt?: string;
}): ExecutiveDashboardRuntimeWiringPack {
  const controlledActivation = createExecutiveDashboardControlledActivationPack({
    featureFlagEnabled,
    mode,
    principal,
  });
  const runtimeConsumption = createExecutiveDashboardRuntimeConsumptionPack({
    controlledActivation,
    responseKind,
    generatedAt,
  });

  return createExecutiveDashboardRuntimeWiringPack({ runtimeConsumption, generatedAt });
}

function renderRuntimeWiringState(state: ExecutiveDashboardRenderState): ReactNode {
  const labels: Record<ExecutiveDashboardRenderState, string> = {
    loading: "Preparando dashboard ejecutivo",
    ready: "Dashboard ejecutivo conectado",
    empty: "Dashboard ejecutivo sin métricas disponibles",
    error: "Dashboard ejecutivo no disponible",
    forbidden: "Dashboard ejecutivo restringido por permisos",
  };

  return <p data-render-state={state}>{labels[state]}</p>;
}

export function ExecutiveDashboardRuntimeWiringBoundary({
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
  const pack = createExecutiveDashboardRuntimeWiringPackFromRuntime({
    featureFlagEnabled,
    mode,
    principal,
    responseKind,
  });
  const binding = getExecutiveDashboardRuntimeWiringViewBinding(viewModel.surface, pack);

  return (
    <section
      data-runtime-wiring-pack={pack.version}
      data-runtime-wiring-phase={pack.phase}
      data-runtime-wiring-status={pack.status}
      data-runtime-wiring-mode={pack.mode}
      data-runtime-surface={binding.surface}
      data-runtime-view-bridge={binding.viewBridge}
      data-render-state={binding.viewState}
      data-renders-metrics={String(binding.rendersMetrics)}
      data-renders-restricted-state={String(binding.rendersRestrictedState)}
      data-allowed-contract={binding.allowedContract}
      data-exposure={binding.exposure}
      data-read-only="true"
      data-metric-only="true"
      data-permission-gated="true"
      data-client-fallback="false"
      data-route-mutation="false"
      data-login-mutation="false"
      data-api-mutation="false"
      data-raw-telemetry="false"
      data-aggregate-access="false"
      data-adapter-access="false"
      data-read-source-access="false"
    >
      {binding.rendersMetrics ? (
        <ExecutiveDashboardRuntimeConsumptionBoundary
          featureFlagEnabled={featureFlagEnabled}
          mode={mode}
          principal={principal}
          viewModel={viewModel}
          responseKind={responseKind}
        />
      ) : (
        renderRuntimeWiringState(binding.viewState)
      )}
      {children}
    </section>
  );
}
