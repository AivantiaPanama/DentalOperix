import type { ReactNode } from "react";
import type { ExecutiveDashboardAccessPrincipal } from "@/server/read-models/executive-dashboard-access-model";
import type { ExecutiveDashboardSurface } from "@/server/read-models/executive-dashboard-ui-architecture";
import {
  ExecutiveDashboardProductionReadinessBoundary,
  assertExecutiveDashboardProductionReadinessPack,
  createExecutiveDashboardProductionReadinessPack,
  type ExecutiveDashboardProductionReadinessPack,
  type ExecutiveDashboardProductionReleaseCandidate,
} from "./ExecutiveDashboardProductionReadinessPack";
import type { ExecutiveDashboardActivationMode } from "./ExecutiveDashboardActivationPack";
import type { ExecutiveDashboardSurfaceViewModel } from "./ExecutiveDashboardUiImplementationPack";

export const EXECUTIVE_DASHBOARD_CONTROLLED_ACTIVATION_PACK_VERSION =
  "executive-dashboard-controlled-activation-pack/v1";

export type ExecutiveDashboardControlledActivationPackPhase = "18.1-18.3";

export type ExecutiveDashboardControlledActivationPackStatus = "approved-controlled-activation-candidate";

export type ExecutiveDashboardControlledActivationScope =
  | "18.1-A-runtime-feature-flag-contract"
  | "18.1-B-runtime-feature-flag-resolution"
  | "18.1-C-disabled-by-default-gate"
  | "18.1-D-no-env-secret-exposure"
  | "18.1-E-feature-flag-governance-tests"
  | "18.2-A-admin-navigation-exposure-contract"
  | "18.2-B-navigation-candidate-filtering"
  | "18.2-C-admin-login-isolation-check"
  | "18.2-D-route-tree-non-mutation-check"
  | "18.2-E-admin-navigation-governance-tests"
  | "18.3-A-permission-gated-access-contract"
  | "18.3-B-forbidden-render-state-binding"
  | "18.3-C-read-only-dashboard-access"
  | "18.3-D-metric-only-dashboard-access"
  | "18.3-E-controlled-activation-regression-tests";

export type ExecutiveDashboardRuntimeFlagName = "EXECUTIVE_DASHBOARD_UI_ENABLED";

export type ExecutiveDashboardRuntimeFlagValue = "enabled" | "disabled";

export type ExecutiveDashboardControlledActivationExposure = "metric-only";

export type ExecutiveDashboardRuntimeFeatureFlag = {
  name: ExecutiveDashboardRuntimeFlagName;
  value: ExecutiveDashboardRuntimeFlagValue;
  defaultValue: "disabled";
  source: "runtime-configuration";
  exposesSecret: false;
  enablesWritePath: false;
};

export type ExecutiveDashboardControlledAdminNavigationEntry = {
  surface: ExecutiveDashboardSurface;
  label: "Executive" | "Operational" | "Governance";
  href: ExecutiveDashboardProductionReleaseCandidate["candidatePath"];
  visible: boolean;
  reason: "feature-flag-disabled" | "permission-missing" | "available";
  requiresFeatureFlag: ExecutiveDashboardRuntimeFlagName;
  requiresPermission: "executive-observability:read";
  registrationStatus: "controlled-candidate";
  mutatesExistingNavigation: false;
  mutatesAdminLogin: false;
  exposure: ExecutiveDashboardControlledActivationExposure;
  readOnly: true;
};

export type ExecutiveDashboardControlledAccessDecision = {
  surface: ExecutiveDashboardSurface;
  mode: ExecutiveDashboardActivationMode;
  featureFlag: ExecutiveDashboardRuntimeFeatureFlag;
  requiredPermission: "executive-observability:read";
  allowed: boolean;
  renderState: "ready" | "forbidden";
  reason: "feature-flag-disabled" | "permission-missing" | "available";
  exposure: ExecutiveDashboardControlledActivationExposure;
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

export type ExecutiveDashboardControlledActivationGuardrails = {
  runtimeFeatureFlagWiringIncluded: true;
  adminNavigationExposureIncluded: true;
  permissionGatedAccessIncluded: true;
  defaultEnabled: false;
  featureFlagRequired: ExecutiveDashboardRuntimeFlagName;
  requiredPermission: "executive-observability:read";
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
  aggregateIsolationPreserved: true;
  domainOwnershipPreserved: true;
  leadsSourceOfTruthPreserved: true;
  readModelPlatformV2ClosedFrozenPreserved: true;
};

export type ExecutiveDashboardControlledActivationPack = {
  version: typeof EXECUTIVE_DASHBOARD_CONTROLLED_ACTIVATION_PACK_VERSION;
  phase: ExecutiveDashboardControlledActivationPackPhase;
  status: ExecutiveDashboardControlledActivationPackStatus;
  generatedAt: string;
  coveredScopes: ExecutiveDashboardControlledActivationScope[];
  productionReadinessVersion: ExecutiveDashboardProductionReadinessPack["version"];
  runtimeFeatureFlag: ExecutiveDashboardRuntimeFeatureFlag;
  navigationEntries: ExecutiveDashboardControlledAdminNavigationEntry[];
  accessDecisions: ExecutiveDashboardControlledAccessDecision[];
  guardrails: ExecutiveDashboardControlledActivationGuardrails;
  finalResult: "approved-for-controlled-admin-dashboard-activation";
  nextPhase: "18.4-18.6 Dashboard Runtime Data Binding Review";
};

export const EXECUTIVE_DASHBOARD_CONTROLLED_ACTIVATION_SCOPES: ExecutiveDashboardControlledActivationScope[] = [
  "18.1-A-runtime-feature-flag-contract",
  "18.1-B-runtime-feature-flag-resolution",
  "18.1-C-disabled-by-default-gate",
  "18.1-D-no-env-secret-exposure",
  "18.1-E-feature-flag-governance-tests",
  "18.2-A-admin-navigation-exposure-contract",
  "18.2-B-navigation-candidate-filtering",
  "18.2-C-admin-login-isolation-check",
  "18.2-D-route-tree-non-mutation-check",
  "18.2-E-admin-navigation-governance-tests",
  "18.3-A-permission-gated-access-contract",
  "18.3-B-forbidden-render-state-binding",
  "18.3-C-read-only-dashboard-access",
  "18.3-D-metric-only-dashboard-access",
  "18.3-E-controlled-activation-regression-tests",
];

const SURFACE_LABELS: Record<ExecutiveDashboardSurface, ExecutiveDashboardControlledAdminNavigationEntry["label"]> = {
  executive: "Executive",
  operational: "Operational",
  governance: "Governance",
};

function hasExecutiveDashboardPermission(principal: ExecutiveDashboardAccessPrincipal): boolean {
  return principal.permissions.includes("executive-observability:read");
}

export function resolveExecutiveDashboardRuntimeFeatureFlag(
  enabled: boolean,
): ExecutiveDashboardRuntimeFeatureFlag {
  return {
    name: "EXECUTIVE_DASHBOARD_UI_ENABLED",
    value: enabled ? "enabled" : "disabled",
    defaultValue: "disabled",
    source: "runtime-configuration",
    exposesSecret: false,
    enablesWritePath: false,
  };
}

function createGuardrails(): ExecutiveDashboardControlledActivationGuardrails {
  return {
    runtimeFeatureFlagWiringIncluded: true,
    adminNavigationExposureIncluded: true,
    permissionGatedAccessIncluded: true,
    defaultEnabled: false,
    featureFlagRequired: "EXECUTIVE_DASHBOARD_UI_ENABLED",
    requiredPermission: "executive-observability:read",
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
    aggregateIsolationPreserved: true,
    domainOwnershipPreserved: true,
    leadsSourceOfTruthPreserved: true,
    readModelPlatformV2ClosedFrozenPreserved: true,
  };
}

function createAccessDecision(
  candidate: ExecutiveDashboardProductionReleaseCandidate,
  mode: ExecutiveDashboardActivationMode,
  principal: ExecutiveDashboardAccessPrincipal,
  featureFlag: ExecutiveDashboardRuntimeFeatureFlag,
): ExecutiveDashboardControlledAccessDecision {
  const featureFlagEnabled = featureFlag.value === "enabled" && mode === "enabled";
  const permissionGranted = hasExecutiveDashboardPermission(principal);
  const allowed = featureFlagEnabled && permissionGranted;

  return {
    surface: candidate.surface,
    mode,
    featureFlag,
    requiredPermission: "executive-observability:read",
    allowed,
    renderState: allowed ? "ready" : "forbidden",
    reason: !featureFlagEnabled ? "feature-flag-disabled" : permissionGranted ? "available" : "permission-missing",
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
  };
}

export function createExecutiveDashboardControlledActivationPack({
  productionReadiness = createExecutiveDashboardProductionReadinessPack(),
  featureFlagEnabled = false,
  principal = { id: "system", permissions: [] },
  mode = "enabled",
  generatedAt = new Date().toISOString(),
}: {
  productionReadiness?: ExecutiveDashboardProductionReadinessPack;
  featureFlagEnabled?: boolean;
  principal?: ExecutiveDashboardAccessPrincipal;
  mode?: ExecutiveDashboardActivationMode;
  generatedAt?: string;
} = {}): ExecutiveDashboardControlledActivationPack {
  assertExecutiveDashboardProductionReadinessPack(productionReadiness);

  const runtimeFeatureFlag = resolveExecutiveDashboardRuntimeFeatureFlag(featureFlagEnabled);
  const accessDecisions = productionReadiness.releaseCandidates.map((candidate) =>
    createAccessDecision(candidate, mode, principal, runtimeFeatureFlag),
  );

  return {
    version: EXECUTIVE_DASHBOARD_CONTROLLED_ACTIVATION_PACK_VERSION,
    phase: "18.1-18.3",
    status: "approved-controlled-activation-candidate",
    generatedAt,
    coveredScopes: EXECUTIVE_DASHBOARD_CONTROLLED_ACTIVATION_SCOPES,
    productionReadinessVersion: productionReadiness.version,
    runtimeFeatureFlag,
    navigationEntries: productionReadiness.releaseCandidates.map((candidate) => {
      const decision = accessDecisions.find((entry) => entry.surface === candidate.surface);
      if (!decision) {
        throw new Error(`Missing executive dashboard controlled access decision: ${candidate.surface}`);
      }

      return {
        surface: candidate.surface,
        label: SURFACE_LABELS[candidate.surface],
        href: candidate.candidatePath,
        visible: decision.allowed,
        reason: decision.reason,
        requiresFeatureFlag: "EXECUTIVE_DASHBOARD_UI_ENABLED",
        requiresPermission: "executive-observability:read",
        registrationStatus: "controlled-candidate",
        mutatesExistingNavigation: false,
        mutatesAdminLogin: false,
        exposure: "metric-only",
        readOnly: true,
      };
    }),
    accessDecisions,
    guardrails: createGuardrails(),
    finalResult: "approved-for-controlled-admin-dashboard-activation",
    nextPhase: "18.4-18.6 Dashboard Runtime Data Binding Review",
  };
}

export function assertExecutiveDashboardControlledActivationPack(
  pack: ExecutiveDashboardControlledActivationPack,
): void {
  if (pack.phase !== "18.1-18.3" || pack.status !== "approved-controlled-activation-candidate") {
    throw new Error("Executive dashboard controlled activation pack is not approved.");
  }

  if (pack.coveredScopes.join("|") !== EXECUTIVE_DASHBOARD_CONTROLLED_ACTIVATION_SCOPES.join("|")) {
    throw new Error("Executive dashboard controlled activation pack does not cover the full 18.1-18.3 scope.");
  }

  if (
    pack.runtimeFeatureFlag.name !== "EXECUTIVE_DASHBOARD_UI_ENABLED" ||
    pack.runtimeFeatureFlag.defaultValue !== "disabled" ||
    pack.runtimeFeatureFlag.exposesSecret ||
    pack.runtimeFeatureFlag.enablesWritePath
  ) {
    throw new Error("Executive dashboard runtime feature flag violates governance.");
  }

  if (pack.navigationEntries.length !== 3 || pack.accessDecisions.length !== 3) {
    throw new Error("Executive dashboard controlled activation must cover exactly three dashboard surfaces.");
  }

  const guardrails = pack.guardrails;
  if (
    !guardrails.runtimeFeatureFlagWiringIncluded ||
    !guardrails.adminNavigationExposureIncluded ||
    !guardrails.permissionGatedAccessIncluded ||
    guardrails.defaultEnabled ||
    guardrails.featureFlagRequired !== "EXECUTIVE_DASHBOARD_UI_ENABLED" ||
    guardrails.requiredPermission !== "executive-observability:read" ||
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
    !guardrails.aggregateIsolationPreserved ||
    !guardrails.domainOwnershipPreserved ||
    !guardrails.leadsSourceOfTruthPreserved ||
    !guardrails.readModelPlatformV2ClosedFrozenPreserved
  ) {
    throw new Error("Executive dashboard controlled activation guardrails are not satisfied.");
  }

  for (const entry of pack.navigationEntries) {
    if (
      entry.registrationStatus !== "controlled-candidate" ||
      entry.requiresFeatureFlag !== "EXECUTIVE_DASHBOARD_UI_ENABLED" ||
      entry.requiresPermission !== "executive-observability:read" ||
      entry.mutatesExistingNavigation ||
      entry.mutatesAdminLogin ||
      entry.exposure !== "metric-only" ||
      !entry.readOnly ||
      !entry.href.startsWith("/admin/dashboard/")
    ) {
      throw new Error(`Executive dashboard controlled navigation violates governance: ${entry.surface}`);
    }
  }

  for (const decision of pack.accessDecisions) {
    if (
      decision.requiredPermission !== "executive-observability:read" ||
      decision.exposure !== "metric-only" ||
      !decision.readOnly ||
      !decision.metricOnly ||
      decision.clientFallbackAllowed ||
      decision.rawTelemetryAllowed ||
      decision.aggregateAccessAllowed ||
      decision.adapterAccessAllowed ||
      decision.readSourceAccessAllowed ||
      decision.readModelDirectAccessAllowed ||
      decision.writePathAllowed ||
      (decision.allowed && decision.renderState !== "ready") ||
      (!decision.allowed && decision.renderState !== "forbidden")
    ) {
      throw new Error(`Executive dashboard controlled access decision violates governance: ${decision.surface}`);
    }
  }
}

export function getExecutiveDashboardControlledAdminNavigationEntries(
  pack: ExecutiveDashboardControlledActivationPack = createExecutiveDashboardControlledActivationPack(),
): ExecutiveDashboardControlledAdminNavigationEntry[] {
  assertExecutiveDashboardControlledActivationPack(pack);
  return pack.navigationEntries.map((entry) => ({ ...entry }));
}

export function getExecutiveDashboardControlledAccessDecision(
  surface: ExecutiveDashboardSurface,
  pack: ExecutiveDashboardControlledActivationPack = createExecutiveDashboardControlledActivationPack(),
): ExecutiveDashboardControlledAccessDecision {
  assertExecutiveDashboardControlledActivationPack(pack);

  const decision = pack.accessDecisions.find((entry) => entry.surface === surface);
  if (!decision) {
    throw new Error(`Missing executive dashboard controlled access decision: ${surface}`);
  }

  return { ...decision, featureFlag: { ...decision.featureFlag } };
}

export function ExecutiveDashboardControlledActivationBoundary({
  featureFlagEnabled,
  mode,
  principal,
  viewModel,
  children,
}: {
  featureFlagEnabled: boolean;
  mode: ExecutiveDashboardActivationMode;
  principal: ExecutiveDashboardAccessPrincipal;
  viewModel: ExecutiveDashboardSurfaceViewModel;
  children?: ReactNode;
}) {
  const pack = createExecutiveDashboardControlledActivationPack({ featureFlagEnabled, principal, mode });
  const decision = getExecutiveDashboardControlledAccessDecision(viewModel.surface, pack);

  return (
    <section
      data-controlled-activation-pack={pack.version}
      data-controlled-phase={pack.phase}
      data-controlled-status={pack.status}
      data-controlled-surface={decision.surface}
      data-feature-flag={decision.featureFlag.name}
      data-feature-flag-value={decision.featureFlag.value}
      data-permission={decision.requiredPermission}
      data-access-allowed={String(decision.allowed)}
      data-render-state={decision.renderState}
      data-access-reason={decision.reason}
      data-exposure={decision.exposure}
      data-read-only="true"
      data-metric-only="true"
      data-route-mutation="false"
      data-login-mutation="false"
      data-api-mutation="false"
    >
      {decision.allowed ? (
        <ExecutiveDashboardProductionReadinessBoundary mode={mode} principal={principal} viewModel={viewModel} />
      ) : (
        <p data-render-state="forbidden">Acceso restringido a observabilidad ejecutiva</p>
      )}
      {children}
    </section>
  );
}
