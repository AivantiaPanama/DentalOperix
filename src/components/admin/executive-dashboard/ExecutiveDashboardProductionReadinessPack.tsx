import type { ExecutiveDashboardAccessPrincipal } from "@/server/read-models/executive-dashboard-access-model";
import type { ExecutiveDashboardRenderState } from "@/server/read-models/executive-dashboard-render-contract-design";
import type { ExecutiveDashboardSurface } from "@/server/read-models/executive-dashboard-ui-architecture";
import {
  ExecutiveDashboardAdminMountAdapter,
  assertExecutiveDashboardAdminRouteIntegrationPack,
  createExecutiveDashboardAdminRouteIntegrationPack,
  type ExecutiveDashboardAdminRouteIntegrationPack,
} from "./ExecutiveDashboardAdminRouteIntegrationPack";
import type { ExecutiveDashboardActivationMode } from "./ExecutiveDashboardActivationPack";
import type { ExecutiveDashboardSurfaceViewModel } from "./ExecutiveDashboardUiImplementationPack";

export const EXECUTIVE_DASHBOARD_PRODUCTION_READINESS_PACK_VERSION =
  "executive-dashboard-production-readiness-pack/v1";

export type ExecutiveDashboardProductionReadinessPackPhase = "17.8-18.0";

export type ExecutiveDashboardProductionReadinessPackStatus = "approved-production-readiness-candidate";

export type ExecutiveDashboardProductionReadinessScope =
  | "17.8-A-feature-flag-hardening"
  | "17.8-B-permission-guard-hardening"
  | "17.8-C-render-state-hardening"
  | "17.8-D-no-client-fallback-hardening"
  | "17.8-E-no-raw-telemetry-hardening"
  | "17.8-F-no-aggregate-access-hardening"
  | "17.8-G-no-adapter-access-hardening"
  | "17.8-H-read-only-hardening"
  | "17.8-I-metric-only-hardening"
  | "17.8-J-production-hardening-tests"
  | "17.9-A-admin-release-candidate-contract"
  | "17.9-B-admin-route-candidate-freeze"
  | "17.9-C-navigation-candidate-freeze"
  | "17.9-D-admin-login-isolation"
  | "17.9-E-api-surface-isolation"
  | "17.9-F-feature-flag-release-gate"
  | "17.9-G-permission-release-gate"
  | "17.9-H-read-only-release-gate"
  | "17.9-I-release-candidate-tests"
  | "17.9-J-formal-release-candidate-document"
  | "18.0-A-production-readiness-baseline"
  | "18.0-B-governance-regression-baseline"
  | "18.0-C-adr-015-read-model-governance-check"
  | "18.0-D-adr-016-domain-boundaries-check"
  | "18.0-E-adr-017-fallback-policy-check"
  | "18.0-F-adr-018-observability-foundation-check"
  | "18.0-G-adr-024-executive-observability-check"
  | "18.0-H-leads-source-of-truth-check"
  | "18.0-I-read-model-platform-v2-freeze-check"
  | "18.0-J-formal-production-readiness-document";

export type ExecutiveDashboardProductionReadinessReleaseState =
  | "not-enabled-by-default"
  | "feature-flag-gated"
  | "permission-gated"
  | "release-candidate";

export type ExecutiveDashboardProductionReadinessExposure = "metric-only";

export type ExecutiveDashboardProductionReadinessHardening = {
  featureFlagRequired: "EXECUTIVE_DASHBOARD_UI_ENABLED";
  defaultEnabled: false;
  requiredPermission: "executive-observability:read";
  allowedRenderStates: ExecutiveDashboardRenderState[];
  exposure: ExecutiveDashboardProductionReadinessExposure;
  readOnly: true;
  metricOnly: true;
  clientFallbackAllowed: false;
  rawTelemetryAllowed: false;
  aggregateAccessAllowed: false;
  adapterAccessAllowed: false;
  readSourceAccessAllowed: false;
  readModelDirectAccessAllowed: false;
  writePathAllowed: false;
};

export type ExecutiveDashboardProductionReleaseCandidate = {
  surface: ExecutiveDashboardSurface;
  candidatePath: "/admin/dashboard/executive" | "/admin/dashboard/operational" | "/admin/dashboard/governance";
  releaseState: ExecutiveDashboardProductionReadinessReleaseState;
  routeImplementationStatus: "candidate-only";
  navigationRegistrationStatus: "candidate-only";
  adminLoginMutationAllowed: false;
  apiMutationAllowed: false;
  requiredPermission: "executive-observability:read";
  featureFlagRequired: "EXECUTIVE_DASHBOARD_UI_ENABLED";
  exposure: ExecutiveDashboardProductionReadinessExposure;
  readOnly: true;
};

export type ExecutiveDashboardProductionReadinessBaseline = {
  adr015ReadModelGovernanceCompliant: true;
  adr016DomainBoundariesCompliant: true;
  adr017FallbackPolicyCompliant: true;
  adr018ObservabilityFoundationCompliant: true;
  adr024ExecutiveObservabilityCompliant: true;
  aggregateIsolationPreserved: true;
  domainOwnershipPreserved: true;
  leadsSourceOfTruthPreserved: true;
  readModelPlatformV2ClosedFrozenPreserved: true;
  metricOnlyResponsesPreserved: true;
  rawTelemetryExposurePrevented: true;
  aggregateAccessPrevented: true;
  adapterAccessPrevented: true;
  clientFallbackPrevented: true;
};

export type ExecutiveDashboardProductionReadinessGuardrails = ExecutiveDashboardProductionReadinessBaseline & {
  productionHardeningIncluded: true;
  adminReleaseCandidateIncluded: true;
  productionReadinessBaselineIncluded: true;
  visualUiExpansionIncluded: false;
  loginModificationIncluded: false;
  authImplementationIncluded: false;
  credentialStorageIncluded: false;
  routeTreeMutationIncluded: false;
  existingRouteMutationIncluded: false;
  apiImplementationIncluded: false;
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
  metricOnly: true;
  readOnly: true;
};

export type ExecutiveDashboardProductionReadinessPack = {
  version: typeof EXECUTIVE_DASHBOARD_PRODUCTION_READINESS_PACK_VERSION;
  phase: ExecutiveDashboardProductionReadinessPackPhase;
  status: ExecutiveDashboardProductionReadinessPackStatus;
  generatedAt: string;
  coveredScopes: ExecutiveDashboardProductionReadinessScope[];
  adminRouteIntegrationVersion: ExecutiveDashboardAdminRouteIntegrationPack["version"];
  hardening: ExecutiveDashboardProductionReadinessHardening;
  releaseCandidates: ExecutiveDashboardProductionReleaseCandidate[];
  baseline: ExecutiveDashboardProductionReadinessBaseline;
  guardrails: ExecutiveDashboardProductionReadinessGuardrails;
  finalResult: "approved-for-controlled-production-readiness-review";
  nextPhase: "18.1 Controlled Dashboard Route Enablement Review";
};

export const EXECUTIVE_DASHBOARD_PRODUCTION_READINESS_SCOPES: ExecutiveDashboardProductionReadinessScope[] = [
  "17.8-A-feature-flag-hardening",
  "17.8-B-permission-guard-hardening",
  "17.8-C-render-state-hardening",
  "17.8-D-no-client-fallback-hardening",
  "17.8-E-no-raw-telemetry-hardening",
  "17.8-F-no-aggregate-access-hardening",
  "17.8-G-no-adapter-access-hardening",
  "17.8-H-read-only-hardening",
  "17.8-I-metric-only-hardening",
  "17.8-J-production-hardening-tests",
  "17.9-A-admin-release-candidate-contract",
  "17.9-B-admin-route-candidate-freeze",
  "17.9-C-navigation-candidate-freeze",
  "17.9-D-admin-login-isolation",
  "17.9-E-api-surface-isolation",
  "17.9-F-feature-flag-release-gate",
  "17.9-G-permission-release-gate",
  "17.9-H-read-only-release-gate",
  "17.9-I-release-candidate-tests",
  "17.9-J-formal-release-candidate-document",
  "18.0-A-production-readiness-baseline",
  "18.0-B-governance-regression-baseline",
  "18.0-C-adr-015-read-model-governance-check",
  "18.0-D-adr-016-domain-boundaries-check",
  "18.0-E-adr-017-fallback-policy-check",
  "18.0-F-adr-018-observability-foundation-check",
  "18.0-G-adr-024-executive-observability-check",
  "18.0-H-leads-source-of-truth-check",
  "18.0-I-read-model-platform-v2-freeze-check",
  "18.0-J-formal-production-readiness-document",
];

const ALLOWED_RENDER_STATES: ExecutiveDashboardRenderState[] = ["loading", "ready", "empty", "error", "forbidden"];

function createBaseline(): ExecutiveDashboardProductionReadinessBaseline {
  return {
    adr015ReadModelGovernanceCompliant: true,
    adr016DomainBoundariesCompliant: true,
    adr017FallbackPolicyCompliant: true,
    adr018ObservabilityFoundationCompliant: true,
    adr024ExecutiveObservabilityCompliant: true,
    aggregateIsolationPreserved: true,
    domainOwnershipPreserved: true,
    leadsSourceOfTruthPreserved: true,
    readModelPlatformV2ClosedFrozenPreserved: true,
    metricOnlyResponsesPreserved: true,
    rawTelemetryExposurePrevented: true,
    aggregateAccessPrevented: true,
    adapterAccessPrevented: true,
    clientFallbackPrevented: true,
  };
}

function createGuardrails(): ExecutiveDashboardProductionReadinessGuardrails {
  return {
    ...createBaseline(),
    productionHardeningIncluded: true,
    adminReleaseCandidateIncluded: true,
    productionReadinessBaselineIncluded: true,
    visualUiExpansionIncluded: false,
    loginModificationIncluded: false,
    authImplementationIncluded: false,
    credentialStorageIncluded: false,
    routeTreeMutationIncluded: false,
    existingRouteMutationIncluded: false,
    apiImplementationIncluded: false,
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
    metricOnly: true,
    readOnly: true,
  };
}

export function createExecutiveDashboardProductionReadinessPack(
  adminRouteIntegration: ExecutiveDashboardAdminRouteIntegrationPack = createExecutiveDashboardAdminRouteIntegrationPack(),
  generatedAt = new Date().toISOString(),
): ExecutiveDashboardProductionReadinessPack {
  assertExecutiveDashboardAdminRouteIntegrationPack(adminRouteIntegration);

  const releaseCandidates: ExecutiveDashboardProductionReleaseCandidate[] = adminRouteIntegration.adminSurfaceContracts.map(
    (surface) => ({
      surface: surface.surface,
      candidatePath: surface.candidatePath,
      releaseState: "release-candidate",
      routeImplementationStatus: surface.routeImplementationStatus,
      navigationRegistrationStatus: "candidate-only",
      adminLoginMutationAllowed: false,
      apiMutationAllowed: false,
      requiredPermission: surface.permissionRequired,
      featureFlagRequired: "EXECUTIVE_DASHBOARD_UI_ENABLED",
      exposure: "metric-only",
      readOnly: true,
    }),
  );

  return {
    version: EXECUTIVE_DASHBOARD_PRODUCTION_READINESS_PACK_VERSION,
    phase: "17.8-18.0",
    status: "approved-production-readiness-candidate",
    generatedAt,
    coveredScopes: EXECUTIVE_DASHBOARD_PRODUCTION_READINESS_SCOPES,
    adminRouteIntegrationVersion: adminRouteIntegration.version,
    hardening: {
      featureFlagRequired: "EXECUTIVE_DASHBOARD_UI_ENABLED",
      defaultEnabled: false,
      requiredPermission: "executive-observability:read",
      allowedRenderStates: ALLOWED_RENDER_STATES,
      exposure: "metric-only",
      readOnly: true,
      metricOnly: true,
      clientFallbackAllowed: false,
      rawTelemetryAllowed: false,
      aggregateAccessAllowed: false,
      adapterAccessAllowed: false,
      readSourceAccessAllowed: false,
      readModelDirectAccessAllowed: false,
      writePathAllowed: false,
    },
    releaseCandidates,
    baseline: createBaseline(),
    guardrails: createGuardrails(),
    finalResult: "approved-for-controlled-production-readiness-review",
    nextPhase: "18.1 Controlled Dashboard Route Enablement Review",
  };
}

export function assertExecutiveDashboardProductionReadinessPack(pack: ExecutiveDashboardProductionReadinessPack): void {
  if (pack.phase !== "17.8-18.0" || pack.status !== "approved-production-readiness-candidate") {
    throw new Error("Executive dashboard production readiness pack is not approved.");
  }

  if (pack.coveredScopes.join("|") !== EXECUTIVE_DASHBOARD_PRODUCTION_READINESS_SCOPES.join("|")) {
    throw new Error("Executive dashboard production readiness pack does not cover the full 17.8-18.0 scope.");
  }

  if (pack.releaseCandidates.length !== 3) {
    throw new Error("Executive dashboard production readiness pack must define exactly three release candidates.");
  }

  const hardening = pack.hardening;
  if (
    hardening.featureFlagRequired !== "EXECUTIVE_DASHBOARD_UI_ENABLED" ||
    hardening.defaultEnabled ||
    hardening.requiredPermission !== "executive-observability:read" ||
    hardening.exposure !== "metric-only" ||
    !hardening.readOnly ||
    !hardening.metricOnly ||
    hardening.clientFallbackAllowed ||
    hardening.rawTelemetryAllowed ||
    hardening.aggregateAccessAllowed ||
    hardening.adapterAccessAllowed ||
    hardening.readSourceAccessAllowed ||
    hardening.readModelDirectAccessAllowed ||
    hardening.writePathAllowed
  ) {
    throw new Error("Executive dashboard production hardening violates governance.");
  }

  if (hardening.allowedRenderStates.join("|") !== ALLOWED_RENDER_STATES.join("|")) {
    throw new Error("Executive dashboard production hardening must preserve the render state contract.");
  }

  const baseline = pack.baseline;
  const guardrails = pack.guardrails;
  if (
    !baseline.adr015ReadModelGovernanceCompliant ||
    !baseline.adr016DomainBoundariesCompliant ||
    !baseline.adr017FallbackPolicyCompliant ||
    !baseline.adr018ObservabilityFoundationCompliant ||
    !baseline.adr024ExecutiveObservabilityCompliant ||
    !baseline.aggregateIsolationPreserved ||
    !baseline.domainOwnershipPreserved ||
    !baseline.leadsSourceOfTruthPreserved ||
    !baseline.readModelPlatformV2ClosedFrozenPreserved ||
    !baseline.metricOnlyResponsesPreserved ||
    !baseline.rawTelemetryExposurePrevented ||
    !baseline.aggregateAccessPrevented ||
    !baseline.adapterAccessPrevented ||
    !baseline.clientFallbackPrevented ||
    !guardrails.productionHardeningIncluded ||
    !guardrails.adminReleaseCandidateIncluded ||
    !guardrails.productionReadinessBaselineIncluded ||
    guardrails.visualUiExpansionIncluded ||
    guardrails.loginModificationIncluded ||
    guardrails.authImplementationIncluded ||
    guardrails.credentialStorageIncluded ||
    guardrails.routeTreeMutationIncluded ||
    guardrails.existingRouteMutationIncluded ||
    guardrails.apiImplementationIncluded ||
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
    !guardrails.metricOnly ||
    !guardrails.readOnly
  ) {
    throw new Error("Executive dashboard production readiness guardrails are not satisfied.");
  }

  for (const candidate of pack.releaseCandidates) {
    if (
      candidate.releaseState !== "release-candidate" ||
      candidate.routeImplementationStatus !== "candidate-only" ||
      candidate.navigationRegistrationStatus !== "candidate-only" ||
      candidate.adminLoginMutationAllowed ||
      candidate.apiMutationAllowed ||
      candidate.requiredPermission !== "executive-observability:read" ||
      candidate.featureFlagRequired !== "EXECUTIVE_DASHBOARD_UI_ENABLED" ||
      candidate.exposure !== "metric-only" ||
      !candidate.readOnly
    ) {
      throw new Error(`Executive dashboard production release candidate violates governance: ${candidate.surface}`);
    }
  }
}

export function getExecutiveDashboardProductionReleaseCandidates(
  pack: ExecutiveDashboardProductionReadinessPack = createExecutiveDashboardProductionReadinessPack(),
): ExecutiveDashboardProductionReleaseCandidate[] {
  assertExecutiveDashboardProductionReadinessPack(pack);
  return pack.releaseCandidates.map((candidate) => ({ ...candidate }));
}

export function ExecutiveDashboardProductionReadinessBoundary({
  mode,
  principal,
  viewModel,
}: {
  mode: ExecutiveDashboardActivationMode;
  principal: ExecutiveDashboardAccessPrincipal;
  viewModel: ExecutiveDashboardSurfaceViewModel;
}) {
  const pack = createExecutiveDashboardProductionReadinessPack();
  const candidate = pack.releaseCandidates.find((releaseCandidate) => releaseCandidate.surface === viewModel.surface);

  if (!candidate) {
    throw new Error(`Missing executive dashboard production release candidate: ${viewModel.surface}`);
  }

  return (
    <section
      data-production-readiness-pack={pack.version}
      data-production-phase={pack.phase}
      data-production-status={pack.status}
      data-production-surface={candidate.surface}
      data-production-path={candidate.candidatePath}
      data-release-state={candidate.releaseState}
      data-feature-flag={candidate.featureFlagRequired}
      data-permission={candidate.requiredPermission}
      data-exposure={candidate.exposure}
      data-read-only="true"
      data-route-implementation={candidate.routeImplementationStatus}
      data-login-mutation="false"
      data-api-mutation="false"
    >
      <ExecutiveDashboardAdminMountAdapter mode={mode} principal={principal} viewModel={viewModel} />
    </section>
  );
}
