import type { ReactNode } from "react";
import type { Permission } from "@/lib/rbac/permissions";
import type { ExecutiveDashboardApiRoute } from "@/server/read-models/executive-dashboard-api-contracts";
import {
  createExecutiveDashboardAccessModel,
  evaluateExecutiveDashboardAccess,
  type ExecutiveDashboardAccessPrincipal,
} from "@/server/read-models/executive-dashboard-access-model";
import {
  type ExecutiveDashboardUiFoundationPack,
  assertExecutiveDashboardUiFoundationPack,
  createExecutiveDashboardUiFoundationPack,
} from "@/server/read-models/executive-dashboard-ui-foundation-pack";
import type { ExecutiveDashboardSurface } from "@/server/read-models/executive-dashboard-ui-architecture";
import {
  ExecutiveDashboardRenderStateView,
  ExecutiveDashboardShell,
  type ExecutiveDashboardSurfaceViewModel,
  assertExecutiveDashboardUiImplementationPack,
  createExecutiveDashboardUiImplementationPack,
  type ExecutiveDashboardUiImplementationPack,
} from "./ExecutiveDashboardUiImplementationPack";

export const EXECUTIVE_DASHBOARD_ACTIVATION_PACK_VERSION = "executive-dashboard-activation-pack/v1";

export type ExecutiveDashboardActivationPackPhase = "17.6";

export type ExecutiveDashboardActivationPackStatus = "approved-controlled-activation-boundary";

export type ExecutiveDashboardActivationPackScope =
  | "17.6-A-activation-boundary-contract"
  | "17.6-B-dashboard-mount-contract"
  | "17.6-C-permission-gate-binding"
  | "17.6-D-dashboard-route-candidate-model"
  | "17.6-E-admin-surface-isolation-rules"
  | "17.6-F-read-only-activation-rules"
  | "17.6-G-feature-flag-contract"
  | "17.6-H-activation-test-pack"
  | "17.6-I-governance-regression-tests"
  | "17.6-J-formal-readiness-document";

export type ExecutiveDashboardActivationMode = "disabled" | "preview" | "enabled";

export type ExecutiveDashboardActivationExposure = "metric-only";

export type ExecutiveDashboardActivationFeatureFlag = {
  key: "EXECUTIVE_DASHBOARD_UI_ENABLED";
  defaultMode: Extract<ExecutiveDashboardActivationMode, "disabled">;
  allowedModes: ExecutiveDashboardActivationMode[];
  owner: "executive-observability-governance";
  requiresPermission: "executive-observability:read";
  mayBypassPermission: false;
  mayEnableWrites: false;
  mayEnableClientFallback: false;
};

export type ExecutiveDashboardActivationRouteCandidate = {
  surface: ExecutiveDashboardSurface;
  candidatePath:
    | "/admin/dashboard/executive"
    | "/admin/dashboard/operational"
    | "/admin/dashboard/governance";
  apiRoute: ExecutiveDashboardApiRoute;
  routeImplementationIncluded: false;
  modifiesAdminLogin: false;
  modifiesExistingRoutes: false;
  exposure: ExecutiveDashboardActivationExposure;
};

export type ExecutiveDashboardActivationMountContract = {
  surface: ExecutiveDashboardSurface;
  mountId: "executive-dashboard-root" | "operational-dashboard-root" | "governance-dashboard-root";
  sourcePack: "executive-dashboard-ui-implementation-pack/v1";
  requiresFeatureFlag: true;
  requiresPermission: "executive-observability:read";
  readOnly: true;
  exposure: ExecutiveDashboardActivationExposure;
};

export type ExecutiveDashboardActivationPermissionGate = {
  surface: ExecutiveDashboardSurface;
  requiredPermission: "executive-observability:read";
  deniedState: "forbidden";
  allowedState: "mount-presentational-dashboard";
  credentialStorageIncluded: false;
  loginModificationIncluded: false;
};

export type ExecutiveDashboardActivationGuardrails = {
  activationBoundaryIncluded: true;
  routeCandidateModelIncluded: true;
  mountContractIncluded: true;
  featureFlagContractIncluded: true;
  routeImplementationIncluded: false;
  adminLoginModificationIncluded: false;
  existingRouteModificationIncluded: false;
  apiImplementationIncluded: false;
  fetchImplementationIncluded: false;
  transportImplementationIncluded: false;
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
  leadWriteIncluded: false;
  metricOnly: true;
  readOnly: true;
  aggregateIsolationPreserved: true;
  domainOwnershipPreserved: true;
  leadsSourceOfTruthPreserved: true;
  readModelPlatformV2ClosedFrozenPreserved: true;
};

export type ExecutiveDashboardActivationPack = {
  version: typeof EXECUTIVE_DASHBOARD_ACTIVATION_PACK_VERSION;
  phase: ExecutiveDashboardActivationPackPhase;
  status: ExecutiveDashboardActivationPackStatus;
  generatedAt: string;
  coveredScopes: ExecutiveDashboardActivationPackScope[];
  foundationVersion: ExecutiveDashboardUiFoundationPack["version"];
  implementationVersion: ExecutiveDashboardUiImplementationPack["version"];
  featureFlag: ExecutiveDashboardActivationFeatureFlag;
  routeCandidates: ExecutiveDashboardActivationRouteCandidate[];
  mountContracts: ExecutiveDashboardActivationMountContract[];
  permissionGates: ExecutiveDashboardActivationPermissionGate[];
  guardrails: ExecutiveDashboardActivationGuardrails;
  nextPhase: "17.7 Dashboard Data Adapter Binding Review";
};

export const EXECUTIVE_DASHBOARD_ACTIVATION_SCOPES: ExecutiveDashboardActivationPackScope[] = [
  "17.6-A-activation-boundary-contract",
  "17.6-B-dashboard-mount-contract",
  "17.6-C-permission-gate-binding",
  "17.6-D-dashboard-route-candidate-model",
  "17.6-E-admin-surface-isolation-rules",
  "17.6-F-read-only-activation-rules",
  "17.6-G-feature-flag-contract",
  "17.6-H-activation-test-pack",
  "17.6-I-governance-regression-tests",
  "17.6-J-formal-readiness-document",
];

const MOUNT_IDS: Record<
  ExecutiveDashboardSurface,
  ExecutiveDashboardActivationMountContract["mountId"]
> = {
  executive: "executive-dashboard-root",
  operational: "operational-dashboard-root",
  governance: "governance-dashboard-root",
};

function createGuardrails(): ExecutiveDashboardActivationGuardrails {
  return {
    activationBoundaryIncluded: true,
    routeCandidateModelIncluded: true,
    mountContractIncluded: true,
    featureFlagContractIncluded: true,
    routeImplementationIncluded: false,
    adminLoginModificationIncluded: false,
    existingRouteModificationIncluded: false,
    apiImplementationIncluded: false,
    fetchImplementationIncluded: false,
    transportImplementationIncluded: false,
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
    leadWriteIncluded: false,
    metricOnly: true,
    readOnly: true,
    aggregateIsolationPreserved: true,
    domainOwnershipPreserved: true,
    leadsSourceOfTruthPreserved: true,
    readModelPlatformV2ClosedFrozenPreserved: true,
  };
}

export function createExecutiveDashboardActivationPack(
  foundation: ExecutiveDashboardUiFoundationPack = createExecutiveDashboardUiFoundationPack(),
  implementation: ExecutiveDashboardUiImplementationPack = createExecutiveDashboardUiImplementationPack(
    foundation,
  ),
  generatedAt = new Date().toISOString(),
): ExecutiveDashboardActivationPack {
  assertExecutiveDashboardUiFoundationPack(foundation);
  assertExecutiveDashboardUiImplementationPack(implementation);

  const accessModel = createExecutiveDashboardAccessModel();

  const routeCandidates: ExecutiveDashboardActivationRouteCandidate[] = foundation.layoutShells.map(
    (layout) => {
      const policy = accessModel.policies.find((candidate) => candidate.surface === layout.surface);

      if (!policy) {
        throw new Error(`Missing activation policy for dashboard surface: ${layout.surface}`);
      }

      return {
        surface: layout.surface,
        candidatePath: layout.path,
        apiRoute: policy.route,
        routeImplementationIncluded: false,
        modifiesAdminLogin: false,
        modifiesExistingRoutes: false,
        exposure: "metric-only",
      };
    },
  );

  return {
    version: EXECUTIVE_DASHBOARD_ACTIVATION_PACK_VERSION,
    phase: "17.6",
    status: "approved-controlled-activation-boundary",
    generatedAt,
    coveredScopes: EXECUTIVE_DASHBOARD_ACTIVATION_SCOPES,
    foundationVersion: foundation.version,
    implementationVersion: implementation.version,
    featureFlag: {
      key: "EXECUTIVE_DASHBOARD_UI_ENABLED",
      defaultMode: "disabled",
      allowedModes: ["disabled", "preview", "enabled"],
      owner: "executive-observability-governance",
      requiresPermission: "executive-observability:read",
      mayBypassPermission: false,
      mayEnableWrites: false,
      mayEnableClientFallback: false,
    },
    routeCandidates,
    mountContracts: implementation.surfaces.map((surface) => ({
      surface,
      mountId: MOUNT_IDS[surface],
      sourcePack: "executive-dashboard-ui-implementation-pack/v1",
      requiresFeatureFlag: true,
      requiresPermission: "executive-observability:read",
      readOnly: true,
      exposure: "metric-only",
    })),
    permissionGates: implementation.surfaces.map((surface) => ({
      surface,
      requiredPermission: "executive-observability:read",
      deniedState: "forbidden",
      allowedState: "mount-presentational-dashboard",
      credentialStorageIncluded: false,
      loginModificationIncluded: false,
    })),
    guardrails: createGuardrails(),
    nextPhase: "17.7 Dashboard Data Adapter Binding Review",
  };
}

export function assertExecutiveDashboardActivationPack(
  pack: ExecutiveDashboardActivationPack,
): void {
  if (pack.phase !== "17.6" || pack.status !== "approved-controlled-activation-boundary") {
    throw new Error("Executive dashboard activation pack is not approved.");
  }

  if (pack.coveredScopes.join("|") !== EXECUTIVE_DASHBOARD_ACTIVATION_SCOPES.join("|")) {
    throw new Error("Executive dashboard activation pack does not cover the full 17.6 A/J scope.");
  }

  const guardrails = pack.guardrails;
  if (
    !guardrails.activationBoundaryIncluded ||
    !guardrails.routeCandidateModelIncluded ||
    !guardrails.mountContractIncluded ||
    !guardrails.featureFlagContractIncluded ||
    guardrails.routeImplementationIncluded ||
    guardrails.adminLoginModificationIncluded ||
    guardrails.existingRouteModificationIncluded ||
    guardrails.apiImplementationIncluded ||
    guardrails.fetchImplementationIncluded ||
    guardrails.transportImplementationIncluded ||
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
    guardrails.leadWriteIncluded ||
    !guardrails.metricOnly ||
    !guardrails.readOnly ||
    !guardrails.aggregateIsolationPreserved ||
    !guardrails.domainOwnershipPreserved ||
    !guardrails.leadsSourceOfTruthPreserved ||
    !guardrails.readModelPlatformV2ClosedFrozenPreserved
  ) {
    throw new Error("Executive dashboard activation guardrails are not satisfied.");
  }

  if (
    pack.featureFlag.defaultMode !== "disabled" ||
    pack.featureFlag.requiresPermission !== "executive-observability:read" ||
    pack.featureFlag.mayBypassPermission ||
    pack.featureFlag.mayEnableWrites ||
    pack.featureFlag.mayEnableClientFallback
  ) {
    throw new Error("Executive dashboard activation feature flag is outside governance.");
  }

  if (
    pack.routeCandidates.length !== 3 ||
    pack.mountContracts.length !== 3 ||
    pack.permissionGates.length !== 3
  ) {
    throw new Error(
      "Executive dashboard activation pack must define exactly three surface bindings.",
    );
  }

  const unsafeRoute = pack.routeCandidates.find(
    (route) =>
      route.routeImplementationIncluded ||
      route.modifiesAdminLogin ||
      route.modifiesExistingRoutes ||
      route.exposure !== "metric-only" ||
      !route.candidatePath.startsWith("/admin/dashboard/") ||
      !route.apiRoute.startsWith("/api/internal/executive-observability/"),
  );

  if (unsafeRoute) {
    throw new Error(
      `Executive dashboard activation route is outside governance: ${unsafeRoute.surface}`,
    );
  }

  const unsafeMount = pack.mountContracts.find(
    (mount) =>
      !mount.requiresFeatureFlag ||
      mount.requiresPermission !== "executive-observability:read" ||
      !mount.readOnly,
  );

  if (unsafeMount) {
    throw new Error(
      `Executive dashboard activation mount is outside governance: ${unsafeMount.surface}`,
    );
  }
}

export function isExecutiveDashboardActivationEnabled(
  mode: ExecutiveDashboardActivationMode,
): boolean {
  return mode === "preview" || mode === "enabled";
}

export function canMountExecutiveDashboardSurface(
  pack: ExecutiveDashboardActivationPack,
  principal: ExecutiveDashboardAccessPrincipal,
  surface: ExecutiveDashboardSurface,
  mode: ExecutiveDashboardActivationMode,
): boolean {
  assertExecutiveDashboardActivationPack(pack);

  if (!isExecutiveDashboardActivationEnabled(mode)) {
    return false;
  }

  const decision = evaluateExecutiveDashboardAccess(
    createExecutiveDashboardAccessModel(),
    principal,
    surface,
  );
  return decision.decision === "allow";
}

export function ExecutiveDashboardActivationBoundary({
  mode,
  principal,
  viewModel,
  children,
}: {
  mode: ExecutiveDashboardActivationMode;
  principal: ExecutiveDashboardAccessPrincipal;
  viewModel: ExecutiveDashboardSurfaceViewModel;
  children?: ReactNode;
}) {
  const pack = createExecutiveDashboardActivationPack();

  if (!isExecutiveDashboardActivationEnabled(mode)) {
    return <ExecutiveDashboardRenderStateView state="empty" />;
  }

  if (!canMountExecutiveDashboardSurface(pack, principal, viewModel.surface, mode)) {
    return <ExecutiveDashboardRenderStateView state="forbidden" />;
  }

  return <>{children ?? <ExecutiveDashboardShell viewModel={viewModel} />}</>;
}

export function getExecutiveDashboardActivationPermission(): Extract<
  Permission,
  "executive-observability:read"
> {
  return "executive-observability:read";
}
