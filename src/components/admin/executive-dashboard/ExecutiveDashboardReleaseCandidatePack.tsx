import type { ReactNode } from "react";
import type { ExecutiveDashboardAccessPrincipal } from "@/server/read-models/executive-dashboard-access-model";
import type { ExecutiveDashboardRenderState } from "@/server/read-models/executive-dashboard-render-contract-design";
import type { ExecutiveDashboardSurface } from "@/server/read-models/executive-dashboard-ui-architecture";
import type { ExecutiveDashboardActivationMode } from "./ExecutiveDashboardActivationPack";
import type { ExecutiveDashboardSurfaceViewModel } from "./ExecutiveDashboardUiImplementationPack";
import {
  ExecutiveDashboardRuntimeWiringBoundary,
  assertExecutiveDashboardRuntimeWiringPack,
  createExecutiveDashboardRuntimeWiringPack,
  createExecutiveDashboardRuntimeWiringPackFromRuntime,
  getExecutiveDashboardRuntimeWiringViewBinding,
  type ExecutiveDashboardRuntimeWiringPack,
  type ExecutiveDashboardRuntimeWiringViewBinding,
} from "./ExecutiveDashboardRuntimeWiringPack";
import type { ExecutiveDashboardRuntimeApiResponseKind } from "./ExecutiveDashboardRuntimeConsumptionPack";

export const EXECUTIVE_DASHBOARD_RELEASE_CANDIDATE_PACK_VERSION =
  "executive-dashboard-release-candidate-pack/v1";

export type ExecutiveDashboardReleaseCandidatePackPhase = "19.0-19.2";

export type ExecutiveDashboardReleaseCandidatePackStatus = "approved-release-candidate";

export type ExecutiveDashboardReleaseCandidateScope =
  | "19.0-A-release-candidate-contract"
  | "19.0-B-approved-capability-consolidation"
  | "19.0-C-runtime-wiring-inclusion"
  | "19.0-D-no-new-domain-capability"
  | "19.1-A-governance-matrix"
  | "19.1-B-metric-only-verification"
  | "19.1-C-read-only-verification"
  | "19.1-D-feature-flag-verification"
  | "19.1-E-permission-gate-verification"
  | "19.1-F-no-direct-internal-access-verification"
  | "19.1-G-no-client-fallback-verification"
  | "19.2-A-release-candidate-tests"
  | "19.2-B-document-pack"
  | "19.2-C-production-handoff-checklist"
  | "19.2-D-regression-closure";

export type ExecutiveDashboardReleaseCandidateDecision = "pass" | "blocked";

export type ExecutiveDashboardReleaseCandidateCapability =
  | "runtime-wiring"
  | "runtime-consumption"
  | "controlled-activation"
  | "production-readiness"
  | "admin-route-candidate";

export type ExecutiveDashboardReleaseCandidateMatrixEntry = {
  rule:
    | "metric-only"
    | "read-only"
    | "feature-flagged"
    | "permission-gated"
    | "no-direct-internal-access"
    | "no-client-fallback"
    | "no-route-mutation"
    | "no-login-mutation"
    | "no-api-mutation"
    | "source-of-truth-preserved"
    | "platform-freeze-preserved";
  decision: ExecutiveDashboardReleaseCandidateDecision;
  evidence:
    | "runtime-wiring-view-binding"
    | "release-candidate-guardrail"
    | "approved-dashboard-contract"
    | "governance-regression-test";
};

export type ExecutiveDashboardReleaseCandidateSurface = {
  surface: ExecutiveDashboardSurface;
  binding: ExecutiveDashboardRuntimeWiringViewBinding;
  renderState: ExecutiveDashboardRenderState;
  releaseCandidate: true;
  capability: "dashboard-runtime-view";
  exposure: "metric-only";
  readOnly: true;
  permissionGated: true;
  featureFlagged: true;
  rendersMetrics: boolean;
  rendersRestrictedState: boolean;
};

export type ExecutiveDashboardReleaseCandidateGuardrails = {
  releaseCandidateContractIncluded: true;
  governanceMatrixIncluded: true;
  releaseCandidateTestsIncluded: true;
  documentPackIncluded: true;
  runtimeWiringIncluded: true;
  newDomainCapabilityIncluded: false;
  newDataSourceIncluded: false;
  routeImplementationIncluded: false;
  routeTreeMutationIncluded: false;
  existingRouteMutationIncluded: false;
  adminLoginModificationIncluded: false;
  apiImplementationIncluded: false;
  fetchImplementationIncluded: false;
  transportImplementationIncluded: false;
  persistenceIncluded: false;
  writePathIncluded: false;
  leadWriteIncluded: false;
  clientSideFallbackIncluded: false;
  clientSideAggregationIncluded: false;
  computedHealthIncluded: false;
  directInternalAccessIncluded: false;
  rawTelemetryExposure: false;
  aggregateAccess: false;
  adapterAccess: false;
  readSourceAccess: false;
  readModelDirectAccess: false;
  restrictedComponentMutationIncluded: false;
  metricOnly: true;
  readOnly: true;
  featureFlagged: true;
  permissionGated: true;
  aggregateIsolationPreserved: true;
  domainOwnershipPreserved: true;
  leadsSourceOfTruthPreserved: true;
  readModelPlatformV2ClosedFrozenPreserved: true;
};

export type ExecutiveDashboardReleaseCandidatePack = {
  version: typeof EXECUTIVE_DASHBOARD_RELEASE_CANDIDATE_PACK_VERSION;
  phase: ExecutiveDashboardReleaseCandidatePackPhase;
  status: ExecutiveDashboardReleaseCandidatePackStatus;
  generatedAt: string;
  coveredScopes: ExecutiveDashboardReleaseCandidateScope[];
  approvedCapabilities: ExecutiveDashboardReleaseCandidateCapability[];
  runtimeWiringVersion: ExecutiveDashboardRuntimeWiringPack["version"];
  surfaces: ExecutiveDashboardReleaseCandidateSurface[];
  governanceMatrix: ExecutiveDashboardReleaseCandidateMatrixEntry[];
  guardrails: ExecutiveDashboardReleaseCandidateGuardrails;
  releaseCandidateDecision: "approved-for-controlled-production-activation-review";
  nextPhase: "19.3 Dashboard Production Activation Review";
};

export const EXECUTIVE_DASHBOARD_RELEASE_CANDIDATE_SCOPES: ExecutiveDashboardReleaseCandidateScope[] = [
  "19.0-A-release-candidate-contract",
  "19.0-B-approved-capability-consolidation",
  "19.0-C-runtime-wiring-inclusion",
  "19.0-D-no-new-domain-capability",
  "19.1-A-governance-matrix",
  "19.1-B-metric-only-verification",
  "19.1-C-read-only-verification",
  "19.1-D-feature-flag-verification",
  "19.1-E-permission-gate-verification",
  "19.1-F-no-direct-internal-access-verification",
  "19.1-G-no-client-fallback-verification",
  "19.2-A-release-candidate-tests",
  "19.2-B-document-pack",
  "19.2-C-production-handoff-checklist",
  "19.2-D-regression-closure",
];

export const EXECUTIVE_DASHBOARD_RELEASE_CANDIDATE_CAPABILITIES: ExecutiveDashboardReleaseCandidateCapability[] = [
  "runtime-wiring",
  "runtime-consumption",
  "controlled-activation",
  "production-readiness",
  "admin-route-candidate",
];

function createGuardrails(): ExecutiveDashboardReleaseCandidateGuardrails {
  return {
    releaseCandidateContractIncluded: true,
    governanceMatrixIncluded: true,
    releaseCandidateTestsIncluded: true,
    documentPackIncluded: true,
    runtimeWiringIncluded: true,
    newDomainCapabilityIncluded: false,
    newDataSourceIncluded: false,
    routeImplementationIncluded: false,
    routeTreeMutationIncluded: false,
    existingRouteMutationIncluded: false,
    adminLoginModificationIncluded: false,
    apiImplementationIncluded: false,
    fetchImplementationIncluded: false,
    transportImplementationIncluded: false,
    persistenceIncluded: false,
    writePathIncluded: false,
    leadWriteIncluded: false,
    clientSideFallbackIncluded: false,
    clientSideAggregationIncluded: false,
    computedHealthIncluded: false,
    directInternalAccessIncluded: false,
    rawTelemetryExposure: false,
    aggregateAccess: false,
    adapterAccess: false,
    readSourceAccess: false,
    readModelDirectAccess: false,
    restrictedComponentMutationIncluded: false,
    metricOnly: true,
    readOnly: true,
    featureFlagged: true,
    permissionGated: true,
    aggregateIsolationPreserved: true,
    domainOwnershipPreserved: true,
    leadsSourceOfTruthPreserved: true,
    readModelPlatformV2ClosedFrozenPreserved: true,
  };
}

function createGovernanceMatrix(): ExecutiveDashboardReleaseCandidateMatrixEntry[] {
  return [
    { rule: "metric-only", decision: "pass", evidence: "runtime-wiring-view-binding" },
    { rule: "read-only", decision: "pass", evidence: "runtime-wiring-view-binding" },
    { rule: "feature-flagged", decision: "pass", evidence: "release-candidate-guardrail" },
    { rule: "permission-gated", decision: "pass", evidence: "runtime-wiring-view-binding" },
    { rule: "no-direct-internal-access", decision: "pass", evidence: "governance-regression-test" },
    { rule: "no-client-fallback", decision: "pass", evidence: "approved-dashboard-contract" },
    { rule: "no-route-mutation", decision: "pass", evidence: "release-candidate-guardrail" },
    { rule: "no-login-mutation", decision: "pass", evidence: "release-candidate-guardrail" },
    { rule: "no-api-mutation", decision: "pass", evidence: "release-candidate-guardrail" },
    { rule: "source-of-truth-preserved", decision: "pass", evidence: "release-candidate-guardrail" },
    { rule: "platform-freeze-preserved", decision: "pass", evidence: "release-candidate-guardrail" },
  ];
}

function createSurface(binding: ExecutiveDashboardRuntimeWiringViewBinding): ExecutiveDashboardReleaseCandidateSurface {
  return {
    surface: binding.surface,
    binding,
    renderState: binding.viewState,
    releaseCandidate: true,
    capability: "dashboard-runtime-view",
    exposure: "metric-only",
    readOnly: true,
    permissionGated: true,
    featureFlagged: true,
    rendersMetrics: binding.rendersMetrics,
    rendersRestrictedState: binding.rendersRestrictedState,
  };
}

export function createExecutiveDashboardReleaseCandidatePack({
  runtimeWiring = createExecutiveDashboardRuntimeWiringPack(),
  generatedAt = new Date().toISOString(),
}: {
  runtimeWiring?: ExecutiveDashboardRuntimeWiringPack;
  generatedAt?: string;
} = {}): ExecutiveDashboardReleaseCandidatePack {
  assertExecutiveDashboardRuntimeWiringPack(runtimeWiring);

  return {
    version: EXECUTIVE_DASHBOARD_RELEASE_CANDIDATE_PACK_VERSION,
    phase: "19.0-19.2",
    status: "approved-release-candidate",
    generatedAt,
    coveredScopes: EXECUTIVE_DASHBOARD_RELEASE_CANDIDATE_SCOPES,
    approvedCapabilities: EXECUTIVE_DASHBOARD_RELEASE_CANDIDATE_CAPABILITIES,
    runtimeWiringVersion: runtimeWiring.version,
    surfaces: runtimeWiring.viewBindings.map(createSurface),
    governanceMatrix: createGovernanceMatrix(),
    guardrails: createGuardrails(),
    releaseCandidateDecision: "approved-for-controlled-production-activation-review",
    nextPhase: "19.3 Dashboard Production Activation Review",
  };
}

export function assertExecutiveDashboardReleaseCandidatePack(pack: ExecutiveDashboardReleaseCandidatePack): void {
  if (pack.phase !== "19.0-19.2" || pack.status !== "approved-release-candidate") {
    throw new Error("Executive dashboard release candidate pack is not approved.");
  }

  if (pack.coveredScopes.join("|") !== EXECUTIVE_DASHBOARD_RELEASE_CANDIDATE_SCOPES.join("|")) {
    throw new Error("Executive dashboard release candidate pack does not cover the full 19.0-19.2 scope.");
  }

  if (pack.approvedCapabilities.join("|") !== EXECUTIVE_DASHBOARD_RELEASE_CANDIDATE_CAPABILITIES.join("|")) {
    throw new Error("Executive dashboard release candidate capabilities are incomplete.");
  }

  const guardrails = pack.guardrails;
  if (
    !guardrails.releaseCandidateContractIncluded ||
    !guardrails.governanceMatrixIncluded ||
    !guardrails.releaseCandidateTestsIncluded ||
    !guardrails.documentPackIncluded ||
    !guardrails.runtimeWiringIncluded ||
    guardrails.newDomainCapabilityIncluded ||
    guardrails.newDataSourceIncluded ||
    guardrails.routeImplementationIncluded ||
    guardrails.routeTreeMutationIncluded ||
    guardrails.existingRouteMutationIncluded ||
    guardrails.adminLoginModificationIncluded ||
    guardrails.apiImplementationIncluded ||
    guardrails.fetchImplementationIncluded ||
    guardrails.transportImplementationIncluded ||
    guardrails.persistenceIncluded ||
    guardrails.writePathIncluded ||
    guardrails.leadWriteIncluded ||
    guardrails.clientSideFallbackIncluded ||
    guardrails.clientSideAggregationIncluded ||
    guardrails.computedHealthIncluded ||
    guardrails.directInternalAccessIncluded ||
    guardrails.rawTelemetryExposure ||
    guardrails.aggregateAccess ||
    guardrails.adapterAccess ||
    guardrails.readSourceAccess ||
    guardrails.readModelDirectAccess ||
    guardrails.restrictedComponentMutationIncluded ||
    !guardrails.metricOnly ||
    !guardrails.readOnly ||
    !guardrails.featureFlagged ||
    !guardrails.permissionGated ||
    !guardrails.aggregateIsolationPreserved ||
    !guardrails.domainOwnershipPreserved ||
    !guardrails.leadsSourceOfTruthPreserved ||
    !guardrails.readModelPlatformV2ClosedFrozenPreserved
  ) {
    throw new Error("Executive dashboard release candidate guardrails are not satisfied.");
  }

  if (pack.surfaces.length !== 3) {
    throw new Error("Executive dashboard release candidate must cover exactly three dashboard surfaces.");
  }

  if (pack.governanceMatrix.some((entry) => entry.decision !== "pass")) {
    throw new Error("Executive dashboard release candidate governance matrix contains a blocker.");
  }

  for (const surface of pack.surfaces) {
    if (
      !surface.releaseCandidate ||
      surface.capability !== "dashboard-runtime-view" ||
      surface.exposure !== "metric-only" ||
      !surface.readOnly ||
      !surface.permissionGated ||
      !surface.featureFlagged ||
      surface.renderState !== surface.binding.viewState ||
      (surface.rendersMetrics && surface.renderState !== "ready") ||
      (surface.rendersRestrictedState && surface.renderState !== "forbidden")
    ) {
      throw new Error(`Executive dashboard release candidate surface violates governance: ${surface.surface}`);
    }
  }
}

export function createExecutiveDashboardReleaseCandidatePackFromRuntime({
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
}): ExecutiveDashboardReleaseCandidatePack {
  const runtimeWiring = createExecutiveDashboardRuntimeWiringPackFromRuntime({
    featureFlagEnabled,
    mode,
    principal,
    responseKind,
    generatedAt,
  });

  return createExecutiveDashboardReleaseCandidatePack({ runtimeWiring, generatedAt });
}

export function getExecutiveDashboardReleaseCandidateSurface(
  surface: ExecutiveDashboardSurface,
  pack: ExecutiveDashboardReleaseCandidatePack = createExecutiveDashboardReleaseCandidatePack(),
): ExecutiveDashboardReleaseCandidateSurface {
  assertExecutiveDashboardReleaseCandidatePack(pack);

  const entry = pack.surfaces.find((candidate) => candidate.surface === surface);
  if (!entry) {
    throw new Error(`Missing executive dashboard release candidate surface: ${surface}`);
  }

  return {
    ...entry,
    binding: getExecutiveDashboardRuntimeWiringViewBinding(surface, {
      ...createExecutiveDashboardRuntimeWiringPack(),
      viewBindings: pack.surfaces.map((candidate) => candidate.binding),
    }),
  };
}

function renderReleaseCandidateState(state: ExecutiveDashboardRenderState): ReactNode {
  const labels: Record<ExecutiveDashboardRenderState, string> = {
    loading: "Release candidate preparando métricas ejecutivas",
    ready: "Release candidate ejecutivo listo",
    empty: "Release candidate sin métricas disponibles",
    error: "Release candidate no disponible",
    forbidden: "Release candidate restringido por permisos",
  };

  return <p data-render-state={state}>{labels[state]}</p>;
}

export function ExecutiveDashboardReleaseCandidateBoundary({
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
  const pack = createExecutiveDashboardReleaseCandidatePackFromRuntime({
    featureFlagEnabled,
    mode,
    principal,
    responseKind,
  });
  const surface = pack.surfaces.find((candidate) => candidate.surface === viewModel.surface);

  if (!surface) {
    throw new Error(`Missing executive dashboard release candidate surface: ${viewModel.surface}`);
  }

  return (
    <section
      data-release-candidate-pack={pack.version}
      data-release-candidate-phase={pack.phase}
      data-release-candidate-status={pack.status}
      data-release-candidate-decision={pack.releaseCandidateDecision}
      data-release-candidate-surface={surface.surface}
      data-render-state={surface.renderState}
      data-renders-metrics={String(surface.rendersMetrics)}
      data-exposure={surface.exposure}
      data-read-only="true"
      data-metric-only="true"
      data-feature-flagged="true"
      data-permission-gated="true"
      data-direct-internal-access="false"
      data-client-fallback="false"
      data-route-mutation="false"
      data-login-mutation="false"
      data-api-mutation="false"
      data-release-candidate="true"
    >
      {surface.rendersMetrics ? (
        <ExecutiveDashboardRuntimeWiringBoundary
          featureFlagEnabled={featureFlagEnabled}
          mode={mode}
          principal={principal}
          viewModel={viewModel}
          responseKind={responseKind}
        />
      ) : (
        renderReleaseCandidateState(surface.renderState)
      )}
      {children}
    </section>
  );
}
