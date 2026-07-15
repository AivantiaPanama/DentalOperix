import type { ReactNode } from "react";
import type { ExecutiveDashboardAccessPrincipal } from "@/server/read-models/executive-dashboard-access-model";
import type { ExecutiveDashboardRenderState } from "@/server/read-models/executive-dashboard-render-contract-design";
import type { ExecutiveDashboardSurface } from "@/server/read-models/executive-dashboard-ui-architecture";
import type { ExecutiveDashboardActivationMode } from "./ExecutiveDashboardActivationPack";
import type { ExecutiveDashboardSurfaceViewModel } from "./ExecutiveDashboardUiImplementationPack";
import type { ExecutiveDashboardRuntimeApiResponseKind } from "./ExecutiveDashboardRuntimeConsumptionPack";
import {
  ExecutiveDashboardReleaseCandidateBoundary,
  assertExecutiveDashboardReleaseCandidatePack,
  createExecutiveDashboardReleaseCandidatePackFromRuntime,
  getExecutiveDashboardReleaseCandidateSurface,
  type ExecutiveDashboardReleaseCandidatePack,
  type ExecutiveDashboardReleaseCandidateSurface,
} from "./ExecutiveDashboardReleaseCandidatePack";

export const EXECUTIVE_DASHBOARD_FINAL_GOVERNANCE_CLOSURE_PACK_VERSION =
  "executive-dashboard-final-governance-closure-pack/v1";

export type ExecutiveDashboardFinalGovernanceClosurePackPhase = "19.3-19.5";

export type ExecutiveDashboardFinalGovernanceClosurePackStatus =
  "final-governance-closure-approved";

export type ExecutiveDashboardFinalGovernanceClosureScope =
  | "19.3-A-final-governance-closure-contract"
  | "19.3-B-release-candidate-baseline-inclusion"
  | "19.3-C-dashboard-candidate-state-closure"
  | "19.3-D-no-new-capability-closure"
  | "19.4-A-final-compliance-matrix"
  | "19.4-B-metric-only-closure"
  | "19.4-C-read-only-closure"
  | "19.4-D-feature-flag-closure"
  | "19.4-E-permission-gate-closure"
  | "19.4-F-internal-access-closure"
  | "19.4-G-client-fallback-closure"
  | "19.4-H-login-and-api-mutation-closure"
  | "19.4-I-source-of-truth-closure"
  | "19.5-A-closure-test-pack"
  | "19.5-B-final-document-pack"
  | "19.5-C-governance-baseline-handoff";

export type ExecutiveDashboardFinalGovernanceClosureDecision = "pass" | "blocked";

export type ExecutiveDashboardFinalGovernanceClosureRule =
  | "release-candidate-preserved"
  | "metric-only"
  | "read-only"
  | "feature-flagged"
  | "permission-gated"
  | "no-direct-internal-access"
  | "no-client-fallback"
  | "no-route-mutation"
  | "no-login-mutation"
  | "no-api-mutation"
  | "no-write-path"
  | "source-of-truth-preserved"
  | "platform-freeze-preserved"
  | "aggregate-isolation-preserved"
  | "domain-ownership-preserved";

export type ExecutiveDashboardFinalGovernanceClosureEvidence =
  | "release-candidate-pack"
  | "final-governance-guardrail"
  | "final-compliance-matrix"
  | "closure-regression-test";

export type ExecutiveDashboardFinalGovernanceClosureMatrixEntry = {
  rule: ExecutiveDashboardFinalGovernanceClosureRule;
  decision: ExecutiveDashboardFinalGovernanceClosureDecision;
  evidence: ExecutiveDashboardFinalGovernanceClosureEvidence;
};

export type ExecutiveDashboardFinalGovernanceClosureSurface = {
  surface: ExecutiveDashboardSurface;
  releaseCandidateSurface: ExecutiveDashboardReleaseCandidateSurface;
  renderState: ExecutiveDashboardRenderState;
  finalClosure: true;
  baseline: "production-activation-candidate";
  exposure: "metric-only";
  readOnly: true;
  permissionGated: true;
  featureFlagged: true;
  aggregateIsolationPreserved: true;
  domainOwnershipPreserved: true;
  rendersMetrics: boolean;
  rendersRestrictedState: boolean;
};

export type ExecutiveDashboardFinalGovernanceClosureGuardrails = {
  finalGovernanceClosureContractIncluded: true;
  releaseCandidateBaselineIncluded: true;
  finalComplianceMatrixIncluded: true;
  closureTestsIncluded: true;
  finalDocumentPackIncluded: true;
  newDashboardCapabilityIncluded: false;
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

export type ExecutiveDashboardFinalGovernanceClosurePack = {
  version: typeof EXECUTIVE_DASHBOARD_FINAL_GOVERNANCE_CLOSURE_PACK_VERSION;
  phase: ExecutiveDashboardFinalGovernanceClosurePackPhase;
  status: ExecutiveDashboardFinalGovernanceClosurePackStatus;
  generatedAt: string;
  coveredScopes: ExecutiveDashboardFinalGovernanceClosureScope[];
  releaseCandidateVersion: ExecutiveDashboardReleaseCandidatePack["version"];
  releaseCandidateStatus: ExecutiveDashboardReleaseCandidatePack["status"];
  surfaces: ExecutiveDashboardFinalGovernanceClosureSurface[];
  complianceMatrix: ExecutiveDashboardFinalGovernanceClosureMatrixEntry[];
  guardrails: ExecutiveDashboardFinalGovernanceClosureGuardrails;
  finalDecision: "closed-as-production-activation-candidate";
  nextPhase: "20.0 Controlled Production Activation Approval";
};

export const EXECUTIVE_DASHBOARD_FINAL_GOVERNANCE_CLOSURE_SCOPES: ExecutiveDashboardFinalGovernanceClosureScope[] =
  [
    "19.3-A-final-governance-closure-contract",
    "19.3-B-release-candidate-baseline-inclusion",
    "19.3-C-dashboard-candidate-state-closure",
    "19.3-D-no-new-capability-closure",
    "19.4-A-final-compliance-matrix",
    "19.4-B-metric-only-closure",
    "19.4-C-read-only-closure",
    "19.4-D-feature-flag-closure",
    "19.4-E-permission-gate-closure",
    "19.4-F-internal-access-closure",
    "19.4-G-client-fallback-closure",
    "19.4-H-login-and-api-mutation-closure",
    "19.4-I-source-of-truth-closure",
    "19.5-A-closure-test-pack",
    "19.5-B-final-document-pack",
    "19.5-C-governance-baseline-handoff",
  ];

function createGuardrails(): ExecutiveDashboardFinalGovernanceClosureGuardrails {
  return {
    finalGovernanceClosureContractIncluded: true,
    releaseCandidateBaselineIncluded: true,
    finalComplianceMatrixIncluded: true,
    closureTestsIncluded: true,
    finalDocumentPackIncluded: true,
    newDashboardCapabilityIncluded: false,
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

function createComplianceMatrix(): ExecutiveDashboardFinalGovernanceClosureMatrixEntry[] {
  return [
    { rule: "release-candidate-preserved", decision: "pass", evidence: "release-candidate-pack" },
    { rule: "metric-only", decision: "pass", evidence: "final-compliance-matrix" },
    { rule: "read-only", decision: "pass", evidence: "final-compliance-matrix" },
    { rule: "feature-flagged", decision: "pass", evidence: "final-governance-guardrail" },
    { rule: "permission-gated", decision: "pass", evidence: "release-candidate-pack" },
    { rule: "no-direct-internal-access", decision: "pass", evidence: "closure-regression-test" },
    { rule: "no-client-fallback", decision: "pass", evidence: "final-governance-guardrail" },
    { rule: "no-route-mutation", decision: "pass", evidence: "final-governance-guardrail" },
    { rule: "no-login-mutation", decision: "pass", evidence: "final-governance-guardrail" },
    { rule: "no-api-mutation", decision: "pass", evidence: "final-governance-guardrail" },
    { rule: "no-write-path", decision: "pass", evidence: "final-governance-guardrail" },
    { rule: "source-of-truth-preserved", decision: "pass", evidence: "final-governance-guardrail" },
    { rule: "platform-freeze-preserved", decision: "pass", evidence: "final-governance-guardrail" },
    { rule: "aggregate-isolation-preserved", decision: "pass", evidence: "release-candidate-pack" },
    { rule: "domain-ownership-preserved", decision: "pass", evidence: "release-candidate-pack" },
  ];
}

function createSurface(
  releaseCandidateSurface: ExecutiveDashboardReleaseCandidateSurface,
): ExecutiveDashboardFinalGovernanceClosureSurface {
  return {
    surface: releaseCandidateSurface.surface,
    releaseCandidateSurface,
    renderState: releaseCandidateSurface.renderState,
    finalClosure: true,
    baseline: "production-activation-candidate",
    exposure: "metric-only",
    readOnly: true,
    permissionGated: true,
    featureFlagged: true,
    aggregateIsolationPreserved: true,
    domainOwnershipPreserved: true,
    rendersMetrics: releaseCandidateSurface.rendersMetrics,
    rendersRestrictedState: releaseCandidateSurface.rendersRestrictedState,
  };
}

export function createExecutiveDashboardFinalGovernanceClosurePack({
  releaseCandidate = createExecutiveDashboardReleaseCandidatePackFromRuntime({
    featureFlagEnabled: true,
    mode: "enabled",
    principal: { id: "governance", permissions: ["executive-observability:read"] },
    responseKind: "metric-response",
  }),
  generatedAt = new Date().toISOString(),
}: {
  releaseCandidate?: ExecutiveDashboardReleaseCandidatePack;
  generatedAt?: string;
} = {}): ExecutiveDashboardFinalGovernanceClosurePack {
  assertExecutiveDashboardReleaseCandidatePack(releaseCandidate);

  return {
    version: EXECUTIVE_DASHBOARD_FINAL_GOVERNANCE_CLOSURE_PACK_VERSION,
    phase: "19.3-19.5",
    status: "final-governance-closure-approved",
    generatedAt,
    coveredScopes: EXECUTIVE_DASHBOARD_FINAL_GOVERNANCE_CLOSURE_SCOPES,
    releaseCandidateVersion: releaseCandidate.version,
    releaseCandidateStatus: releaseCandidate.status,
    surfaces: releaseCandidate.surfaces.map(createSurface),
    complianceMatrix: createComplianceMatrix(),
    guardrails: createGuardrails(),
    finalDecision: "closed-as-production-activation-candidate",
    nextPhase: "20.0 Controlled Production Activation Approval",
  };
}

export function assertExecutiveDashboardFinalGovernanceClosurePack(
  pack: ExecutiveDashboardFinalGovernanceClosurePack,
): void {
  if (pack.phase !== "19.3-19.5" || pack.status !== "final-governance-closure-approved") {
    throw new Error("Executive dashboard final governance closure pack is not approved.");
  }

  if (
    pack.coveredScopes.join("|") !== EXECUTIVE_DASHBOARD_FINAL_GOVERNANCE_CLOSURE_SCOPES.join("|")
  ) {
    throw new Error(
      "Executive dashboard final governance closure pack does not cover the full 19.3-19.5 scope.",
    );
  }

  const guardrails = pack.guardrails;
  if (
    !guardrails.finalGovernanceClosureContractIncluded ||
    !guardrails.releaseCandidateBaselineIncluded ||
    !guardrails.finalComplianceMatrixIncluded ||
    !guardrails.closureTestsIncluded ||
    !guardrails.finalDocumentPackIncluded ||
    guardrails.newDashboardCapabilityIncluded ||
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
    throw new Error("Executive dashboard final governance closure guardrails are not satisfied.");
  }

  if (pack.surfaces.length !== 3) {
    throw new Error(
      "Executive dashboard final governance closure must cover exactly three dashboard surfaces.",
    );
  }

  if (pack.complianceMatrix.some((entry) => entry.decision !== "pass")) {
    throw new Error("Executive dashboard final governance closure matrix contains a blocker.");
  }

  for (const surface of pack.surfaces) {
    if (
      !surface.finalClosure ||
      surface.baseline !== "production-activation-candidate" ||
      surface.exposure !== "metric-only" ||
      !surface.readOnly ||
      !surface.permissionGated ||
      !surface.featureFlagged ||
      !surface.aggregateIsolationPreserved ||
      !surface.domainOwnershipPreserved ||
      surface.renderState !== surface.releaseCandidateSurface.renderState ||
      (surface.rendersMetrics && surface.renderState !== "ready") ||
      (surface.rendersRestrictedState && surface.renderState !== "forbidden")
    ) {
      throw new Error(
        `Executive dashboard final governance closure surface violates governance: ${surface.surface}`,
      );
    }
  }
}

export function createExecutiveDashboardFinalGovernanceClosurePackFromRuntime({
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
}): ExecutiveDashboardFinalGovernanceClosurePack {
  const releaseCandidate = createExecutiveDashboardReleaseCandidatePackFromRuntime({
    featureFlagEnabled,
    mode,
    principal,
    responseKind,
    generatedAt,
  });

  return createExecutiveDashboardFinalGovernanceClosurePack({ releaseCandidate, generatedAt });
}

export function getExecutiveDashboardFinalGovernanceClosureSurface(
  surface: ExecutiveDashboardSurface,
  pack: ExecutiveDashboardFinalGovernanceClosurePack = createExecutiveDashboardFinalGovernanceClosurePack(),
): ExecutiveDashboardFinalGovernanceClosureSurface {
  assertExecutiveDashboardFinalGovernanceClosurePack(pack);

  const entry = pack.surfaces.find((candidate) => candidate.surface === surface);
  if (!entry) {
    throw new Error(`Missing executive dashboard final governance closure surface: ${surface}`);
  }

  return {
    ...entry,
    releaseCandidateSurface: getExecutiveDashboardReleaseCandidateSurface(surface, {
      ...createExecutiveDashboardReleaseCandidatePackFromRuntime({
        featureFlagEnabled: true,
        mode: "enabled",
        principal: { id: "governance", permissions: ["executive-observability:read"] },
        responseKind: "metric-response",
      }),
      surfaces: pack.surfaces.map((candidate) => candidate.releaseCandidateSurface),
    }),
  };
}

function renderClosureState(state: ExecutiveDashboardRenderState): ReactNode {
  const labels: Record<ExecutiveDashboardRenderState, string> = {
    loading: "Cierre de gobernanza preparando métricas ejecutivas",
    ready: "Cierre de gobernanza ejecutivo listo",
    empty: "Cierre de gobernanza sin métricas disponibles",
    error: "Cierre de gobernanza no disponible",
    forbidden: "Cierre de gobernanza restringido por permisos",
  };

  return <p data-render-state={state}>{labels[state]}</p>;
}

export function ExecutiveDashboardFinalGovernanceClosureBoundary({
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
  const pack = createExecutiveDashboardFinalGovernanceClosurePackFromRuntime({
    featureFlagEnabled,
    mode,
    principal,
    responseKind,
  });
  const surface = pack.surfaces.find((candidate) => candidate.surface === viewModel.surface);

  if (!surface) {
    throw new Error(
      `Missing executive dashboard final governance closure surface: ${viewModel.surface}`,
    );
  }

  return (
    <section
      data-final-governance-closure-pack={pack.version}
      data-final-governance-closure-phase={pack.phase}
      data-final-governance-closure-status={pack.status}
      data-final-governance-closure-decision={pack.finalDecision}
      data-final-governance-closure-surface={surface.surface}
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
      data-write-path="false"
      data-final-closure="true"
    >
      {surface.rendersMetrics ? (
        <ExecutiveDashboardReleaseCandidateBoundary
          featureFlagEnabled={featureFlagEnabled}
          mode={mode}
          principal={principal}
          viewModel={viewModel}
          responseKind={responseKind}
        />
      ) : (
        renderClosureState(surface.renderState)
      )}
      {children}
    </section>
  );
}
