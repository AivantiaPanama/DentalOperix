import type { ReactNode } from "react";
import type { ExecutiveDashboardAccessPrincipal } from "@/server/read-models/executive-dashboard-access-model";
import type { ExecutiveDashboardSurface } from "@/server/read-models/executive-dashboard-ui-architecture";
import {
  ExecutiveDashboardActivationBoundary,
  createExecutiveDashboardActivationPack,
  type ExecutiveDashboardActivationMode,
  type ExecutiveDashboardActivationPack,
  type ExecutiveDashboardActivationRouteCandidate,
  assertExecutiveDashboardActivationPack,
} from "./ExecutiveDashboardActivationPack";
import type { ExecutiveDashboardSurfaceViewModel } from "./ExecutiveDashboardUiImplementationPack";

export const EXECUTIVE_DASHBOARD_ADMIN_ROUTE_INTEGRATION_PACK_VERSION =
  "executive-dashboard-admin-route-integration-pack/v1";

export type ExecutiveDashboardAdminRouteIntegrationPackPhase = "17.7";

export type ExecutiveDashboardAdminRouteIntegrationPackStatus =
  "approved-admin-route-integration-candidate";

export type ExecutiveDashboardAdminRouteIntegrationPackScope =
  | "17.7-A-admin-route-candidate-contract"
  | "17.7-B-admin-dashboard-mount-adapter"
  | "17.7-C-feature-flag-gate"
  | "17.7-D-permission-guard-binding"
  | "17.7-E-dashboard-admin-surface-contract"
  | "17.7-F-navigation-registration-candidate"
  | "17.7-G-no-login-mutation-guard"
  | "17.7-H-no-api-mutation-guard"
  | "17.7-I-route-integration-tests"
  | "17.7-J-formal-governance-document";

export type ExecutiveDashboardAdminRouteIntegrationExposure = "metric-only";

export type ExecutiveDashboardAdminNavigationCandidate = {
  surface: ExecutiveDashboardSurface;
  label: "Executive" | "Operational" | "Governance";
  href: ExecutiveDashboardActivationRouteCandidate["candidatePath"];
  parentSurface: "admin-dashboard";
  registrationStatus: "candidate-only";
  requiresFeatureFlag: "EXECUTIVE_DASHBOARD_UI_ENABLED";
  requiresPermission: "executive-observability:read";
  exposure: ExecutiveDashboardAdminRouteIntegrationExposure;
  modifiesExistingNavigation: false;
};

export type ExecutiveDashboardAdminSurfaceContract = {
  surface: ExecutiveDashboardSurface;
  candidatePath: ExecutiveDashboardActivationRouteCandidate["candidatePath"];
  mountId: "executive-dashboard-root" | "operational-dashboard-root" | "governance-dashboard-root";
  activationBoundary: "ExecutiveDashboardActivationBoundary";
  routeImplementationStatus: "candidate-only";
  readOnly: true;
  metricOnly: true;
  featureFlagRequired: true;
  permissionRequired: "executive-observability:read";
  adminLoginMutationAllowed: false;
  apiMutationAllowed: false;
};

export type ExecutiveDashboardAdminRouteMutationGuards = {
  adminLoginModificationIncluded: false;
  adminLoginMutationAllowed: false;
  existingRouteMutationAllowed: false;
  routeTreeMutationAllowed: false;
  apiRouteMutationAllowed: false;
  apiImplementationIncluded: false;
  authImplementationIncluded: false;
  credentialStorageIncluded: false;
  navigationMutationIncluded: false;
  restrictedComponentMutationIncluded: false;
};

export type ExecutiveDashboardAdminRouteIntegrationGuardrails =
  ExecutiveDashboardAdminRouteMutationGuards & {
    adminRouteCandidateContractIncluded: true;
    adminDashboardMountAdapterIncluded: true;
    featureFlagGateIncluded: true;
    permissionGuardBindingIncluded: true;
    dashboardAdminSurfaceContractIncluded: true;
    navigationRegistrationCandidateIncluded: true;
    routeImplementationIncluded: false;
    fetchImplementationIncluded: false;
    transportImplementationIncluded: false;
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

export type ExecutiveDashboardAdminRouteIntegrationPack = {
  version: typeof EXECUTIVE_DASHBOARD_ADMIN_ROUTE_INTEGRATION_PACK_VERSION;
  phase: ExecutiveDashboardAdminRouteIntegrationPackPhase;
  status: ExecutiveDashboardAdminRouteIntegrationPackStatus;
  generatedAt: string;
  coveredScopes: ExecutiveDashboardAdminRouteIntegrationPackScope[];
  activationVersion: ExecutiveDashboardActivationPack["version"];
  routeCandidates: ExecutiveDashboardActivationRouteCandidate[];
  navigationCandidates: ExecutiveDashboardAdminNavigationCandidate[];
  adminSurfaceContracts: ExecutiveDashboardAdminSurfaceContract[];
  mutationGuards: ExecutiveDashboardAdminRouteMutationGuards;
  guardrails: ExecutiveDashboardAdminRouteIntegrationGuardrails;
  nextPhase: "17.8 Executive Dashboard Data Fetch Boundary Review";
};

export const EXECUTIVE_DASHBOARD_ADMIN_ROUTE_INTEGRATION_SCOPES: ExecutiveDashboardAdminRouteIntegrationPackScope[] =
  [
    "17.7-A-admin-route-candidate-contract",
    "17.7-B-admin-dashboard-mount-adapter",
    "17.7-C-feature-flag-gate",
    "17.7-D-permission-guard-binding",
    "17.7-E-dashboard-admin-surface-contract",
    "17.7-F-navigation-registration-candidate",
    "17.7-G-no-login-mutation-guard",
    "17.7-H-no-api-mutation-guard",
    "17.7-I-route-integration-tests",
    "17.7-J-formal-governance-document",
  ];

const SURFACE_LABELS: Record<
  ExecutiveDashboardSurface,
  ExecutiveDashboardAdminNavigationCandidate["label"]
> = {
  executive: "Executive",
  operational: "Operational",
  governance: "Governance",
};

const SURFACE_MOUNT_IDS: Record<
  ExecutiveDashboardSurface,
  ExecutiveDashboardAdminSurfaceContract["mountId"]
> = {
  executive: "executive-dashboard-root",
  operational: "operational-dashboard-root",
  governance: "governance-dashboard-root",
};

function createMutationGuards(): ExecutiveDashboardAdminRouteMutationGuards {
  return {
    adminLoginModificationIncluded: false,
    adminLoginMutationAllowed: false,
    existingRouteMutationAllowed: false,
    routeTreeMutationAllowed: false,
    apiRouteMutationAllowed: false,
    apiImplementationIncluded: false,
    authImplementationIncluded: false,
    credentialStorageIncluded: false,
    navigationMutationIncluded: false,
    restrictedComponentMutationIncluded: false,
  };
}

function createGuardrails(): ExecutiveDashboardAdminRouteIntegrationGuardrails {
  return {
    ...createMutationGuards(),
    adminRouteCandidateContractIncluded: true,
    adminDashboardMountAdapterIncluded: true,
    featureFlagGateIncluded: true,
    permissionGuardBindingIncluded: true,
    dashboardAdminSurfaceContractIncluded: true,
    navigationRegistrationCandidateIncluded: true,
    routeImplementationIncluded: false,
    fetchImplementationIncluded: false,
    transportImplementationIncluded: false,
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

export function createExecutiveDashboardAdminRouteIntegrationPack(
  activation: ExecutiveDashboardActivationPack = createExecutiveDashboardActivationPack(),
  generatedAt = new Date().toISOString(),
): ExecutiveDashboardAdminRouteIntegrationPack {
  assertExecutiveDashboardActivationPack(activation);

  const routeCandidates = activation.routeCandidates.map((candidate) => ({ ...candidate }));

  return {
    version: EXECUTIVE_DASHBOARD_ADMIN_ROUTE_INTEGRATION_PACK_VERSION,
    phase: "17.7",
    status: "approved-admin-route-integration-candidate",
    generatedAt,
    coveredScopes: EXECUTIVE_DASHBOARD_ADMIN_ROUTE_INTEGRATION_SCOPES,
    activationVersion: activation.version,
    routeCandidates,
    navigationCandidates: routeCandidates.map((candidate) => ({
      surface: candidate.surface,
      label: SURFACE_LABELS[candidate.surface],
      href: candidate.candidatePath,
      parentSurface: "admin-dashboard",
      registrationStatus: "candidate-only",
      requiresFeatureFlag: "EXECUTIVE_DASHBOARD_UI_ENABLED",
      requiresPermission: "executive-observability:read",
      exposure: "metric-only",
      modifiesExistingNavigation: false,
    })),
    adminSurfaceContracts: routeCandidates.map((candidate) => ({
      surface: candidate.surface,
      candidatePath: candidate.candidatePath,
      mountId: SURFACE_MOUNT_IDS[candidate.surface],
      activationBoundary: "ExecutiveDashboardActivationBoundary",
      routeImplementationStatus: "candidate-only",
      readOnly: true,
      metricOnly: true,
      featureFlagRequired: true,
      permissionRequired: "executive-observability:read",
      adminLoginMutationAllowed: false,
      apiMutationAllowed: false,
    })),
    mutationGuards: createMutationGuards(),
    guardrails: createGuardrails(),
    nextPhase: "17.8 Executive Dashboard Data Fetch Boundary Review",
  };
}

export function assertExecutiveDashboardAdminRouteIntegrationPack(
  pack: ExecutiveDashboardAdminRouteIntegrationPack,
): void {
  if (pack.phase !== "17.7" || pack.status !== "approved-admin-route-integration-candidate") {
    throw new Error("Executive dashboard admin route integration pack is not approved.");
  }

  if (
    pack.coveredScopes.join("|") !== EXECUTIVE_DASHBOARD_ADMIN_ROUTE_INTEGRATION_SCOPES.join("|")
  ) {
    throw new Error(
      "Executive dashboard admin route integration pack does not cover the full 17.7 A/J scope.",
    );
  }

  const guardrails = pack.guardrails;
  if (
    !guardrails.adminRouteCandidateContractIncluded ||
    !guardrails.adminDashboardMountAdapterIncluded ||
    !guardrails.featureFlagGateIncluded ||
    !guardrails.permissionGuardBindingIncluded ||
    !guardrails.dashboardAdminSurfaceContractIncluded ||
    !guardrails.navigationRegistrationCandidateIncluded ||
    guardrails.adminLoginModificationIncluded ||
    guardrails.adminLoginMutationAllowed ||
    guardrails.existingRouteMutationAllowed ||
    guardrails.routeTreeMutationAllowed ||
    guardrails.apiRouteMutationAllowed ||
    guardrails.apiImplementationIncluded ||
    guardrails.authImplementationIncluded ||
    guardrails.credentialStorageIncluded ||
    guardrails.navigationMutationIncluded ||
    guardrails.restrictedComponentMutationIncluded ||
    guardrails.routeImplementationIncluded ||
    guardrails.fetchImplementationIncluded ||
    guardrails.transportImplementationIncluded ||
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
    throw new Error("Executive dashboard admin route integration guardrails are not satisfied.");
  }

  if (
    pack.routeCandidates.length !== 3 ||
    pack.navigationCandidates.length !== 3 ||
    pack.adminSurfaceContracts.length !== 3
  ) {
    throw new Error(
      "Executive dashboard admin route integration pack must define exactly three admin surfaces.",
    );
  }

  for (const route of pack.routeCandidates) {
    if (
      route.routeImplementationIncluded ||
      route.modifiesAdminLogin ||
      route.modifiesExistingRoutes ||
      route.exposure !== "metric-only" ||
      !route.candidatePath.startsWith("/admin/dashboard/") ||
      !route.apiRoute.startsWith("/api/internal/executive-observability/")
    ) {
      throw new Error(
        `Executive dashboard route candidate violates admin integration governance: ${route.surface}`,
      );
    }
  }

  for (const navigation of pack.navigationCandidates) {
    if (
      navigation.registrationStatus !== "candidate-only" ||
      navigation.requiresFeatureFlag !== "EXECUTIVE_DASHBOARD_UI_ENABLED" ||
      navigation.requiresPermission !== "executive-observability:read" ||
      navigation.exposure !== "metric-only" ||
      navigation.modifiesExistingNavigation
    ) {
      throw new Error(
        `Executive dashboard navigation candidate violates governance: ${navigation.surface}`,
      );
    }
  }

  for (const surface of pack.adminSurfaceContracts) {
    if (
      surface.routeImplementationStatus !== "candidate-only" ||
      !surface.readOnly ||
      !surface.metricOnly ||
      !surface.featureFlagRequired ||
      surface.permissionRequired !== "executive-observability:read" ||
      surface.adminLoginMutationAllowed ||
      surface.apiMutationAllowed
    ) {
      throw new Error(
        `Executive dashboard admin surface contract violates governance: ${surface.surface}`,
      );
    }
  }
}

export function getExecutiveDashboardAdminNavigationCandidates(
  pack: ExecutiveDashboardAdminRouteIntegrationPack = createExecutiveDashboardAdminRouteIntegrationPack(),
): ExecutiveDashboardAdminNavigationCandidate[] {
  assertExecutiveDashboardAdminRouteIntegrationPack(pack);
  return pack.navigationCandidates.map((candidate) => ({ ...candidate }));
}

export function getExecutiveDashboardAdminSurfaceContract(
  surface: ExecutiveDashboardSurface,
  pack: ExecutiveDashboardAdminRouteIntegrationPack = createExecutiveDashboardAdminRouteIntegrationPack(),
): ExecutiveDashboardAdminSurfaceContract {
  assertExecutiveDashboardAdminRouteIntegrationPack(pack);

  const contract = pack.adminSurfaceContracts.find((candidate) => candidate.surface === surface);
  if (!contract) {
    throw new Error(`Missing executive dashboard admin surface contract: ${surface}`);
  }

  return { ...contract };
}

export function ExecutiveDashboardAdminMountAdapter({
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
  const contract = getExecutiveDashboardAdminSurfaceContract(viewModel.surface);

  return (
    <section
      data-admin-dashboard-surface={contract.surface}
      data-admin-dashboard-path={contract.candidatePath}
      data-admin-dashboard-registration="candidate-only"
      data-feature-flag="EXECUTIVE_DASHBOARD_UI_ENABLED"
      data-permission="executive-observability:read"
      data-exposure="metric-only"
      data-read-only="true"
      data-mount-id={contract.mountId}
    >
      <ExecutiveDashboardActivationBoundary mode={mode} principal={principal} viewModel={viewModel}>
        {children}
      </ExecutiveDashboardActivationBoundary>
    </section>
  );
}
