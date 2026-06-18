import type { Permission } from "../../lib/rbac/permissions";
import {
  type ExecutiveDashboardApiContracts,
  type ExecutiveDashboardApiRoute,
  createExecutiveDashboardApiContracts,
} from "./executive-dashboard-api-contracts";
import {
  type ExecutiveDashboardComponentDesign,
  type ExecutiveDashboardWidgetId,
  assertExecutiveDashboardComponentDesign,
  createExecutiveDashboardComponentDesign,
} from "./executive-dashboard-component-design";
import type { ExecutiveDashboardSurface } from "./executive-dashboard-ui-architecture";

export const EXECUTIVE_DASHBOARD_ACCESS_MODEL_VERSION = "executive-dashboard-access-model/v1";

export type ExecutiveDashboardAccessModelPhase = "17.3-D";

export type ExecutiveDashboardAccessModelStatus = "approved-for-future-ui-access-gate";

export type ExecutiveDashboardAccessLevel = "metric-only-read";

export type ExecutiveDashboardAccessDecision = "allow" | "deny";

export type ExecutiveDashboardRequiredPermission = Extract<Permission, "executive-observability:read">;

export type ExecutiveDashboardAccessPrincipal = {
  id: string;
  permissions: readonly Permission[];
};

export type ExecutiveDashboardAccessPolicy = {
  surface: ExecutiveDashboardSurface;
  route: ExecutiveDashboardApiRoute;
  requiredPermission: ExecutiveDashboardRequiredPermission;
  accessLevel: ExecutiveDashboardAccessLevel;
  allowedContract: "ExecutiveDashboardApiContracts";
  allowedWidgetIds: ExecutiveDashboardWidgetId[];
  metricOnly: true;
  uiAccessGateOnly: true;
};

export type ExecutiveDashboardAccessForbiddenDependency =
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
  | "public-api-expansion"
  | "admin-login-credential-storage";

export type ExecutiveDashboardAccessModelGuardrails = {
  uiImplementationIncluded: false;
  visualComponentsIncluded: false;
  routeImplementationIncluded: false;
  apiImplementationIncluded: false;
  loginImplementationIncluded: false;
  credentialStorageIncluded: false;
  persistenceIncluded: false;
  domainLogicIncluded: false;
  fallbackLogicIncluded: false;
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

export type ExecutiveDashboardAccessEvaluation = {
  surface: ExecutiveDashboardSurface;
  route: ExecutiveDashboardApiRoute;
  decision: ExecutiveDashboardAccessDecision;
  reason: "permission-present" | "missing-executive-observability-read" | "unknown-surface";
  requiredPermission: ExecutiveDashboardRequiredPermission;
  accessLevel: ExecutiveDashboardAccessLevel;
};

export type ExecutiveDashboardAccessModel = {
  version: typeof EXECUTIVE_DASHBOARD_ACCESS_MODEL_VERSION;
  phase: ExecutiveDashboardAccessModelPhase;
  status: ExecutiveDashboardAccessModelStatus;
  generatedAt: string;
  componentDesignVersion: ExecutiveDashboardComponentDesign["version"];
  guardrails: ExecutiveDashboardAccessModelGuardrails;
  policies: ExecutiveDashboardAccessPolicy[];
  forbiddenDependencies: ExecutiveDashboardAccessForbiddenDependency[];
  nextPhase: "17.3-E Dashboard UI Implementation Gate";
};

const REQUIRED_PERMISSION: ExecutiveDashboardRequiredPermission = "executive-observability:read";

const FORBIDDEN_ACCESS_DEPENDENCIES: ExecutiveDashboardAccessForbiddenDependency[] = [
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
  "public-api-expansion",
  "admin-login-credential-storage",
];

export function createExecutiveDashboardAccessModel(
  contracts: ExecutiveDashboardApiContracts = createExecutiveDashboardApiContracts(),
  componentDesign: ExecutiveDashboardComponentDesign = createExecutiveDashboardComponentDesign(contracts),
  generatedAt = new Date().toISOString(),
): ExecutiveDashboardAccessModel {
  assertExecutiveDashboardComponentDesign(componentDesign);

  const policyRoutes = new Set(componentDesign.panels.map((panel) => panel.route));
  const allowedApiRoutes = new Set(contracts.endpoints.map((endpoint) => endpoint.route));

  const policies: ExecutiveDashboardAccessPolicy[] = componentDesign.panels.map((panel) => {
    if (!allowedApiRoutes.has(panel.route) || !policyRoutes.has(panel.route)) {
      throw new Error(`Executive dashboard access policy route is outside approved API contracts: ${panel.route}`);
    }

    return {
      surface: panel.surface,
      route: panel.route,
      requiredPermission: REQUIRED_PERMISSION,
      accessLevel: "metric-only-read",
      allowedContract: "ExecutiveDashboardApiContracts",
      allowedWidgetIds: panel.widgets,
      metricOnly: true,
      uiAccessGateOnly: true,
    };
  });

  return {
    version: EXECUTIVE_DASHBOARD_ACCESS_MODEL_VERSION,
    phase: "17.3-D",
    status: "approved-for-future-ui-access-gate",
    generatedAt,
    componentDesignVersion: componentDesign.version,
    guardrails: {
      uiImplementationIncluded: false,
      visualComponentsIncluded: false,
      routeImplementationIncluded: false,
      apiImplementationIncluded: false,
      loginImplementationIncluded: false,
      credentialStorageIncluded: false,
      persistenceIncluded: false,
      domainLogicIncluded: false,
      fallbackLogicIncluded: false,
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
    policies,
    forbiddenDependencies: FORBIDDEN_ACCESS_DEPENDENCIES,
    nextPhase: "17.3-E Dashboard UI Implementation Gate",
  };
}

export function evaluateExecutiveDashboardAccess(
  model: ExecutiveDashboardAccessModel,
  principal: ExecutiveDashboardAccessPrincipal,
  surface: ExecutiveDashboardSurface,
): ExecutiveDashboardAccessEvaluation {
  assertExecutiveDashboardAccessModel(model);

  const policy = model.policies.find((candidate) => candidate.surface === surface);

  if (!policy) {
    return {
      surface,
      route: "/api/internal/executive-observability/snapshot",
      decision: "deny",
      reason: "unknown-surface",
      requiredPermission: REQUIRED_PERMISSION,
      accessLevel: "metric-only-read",
    };
  }

  const hasRequiredPermission = principal.permissions.includes(policy.requiredPermission);

  return {
    surface,
    route: policy.route,
    decision: hasRequiredPermission ? "allow" : "deny",
    reason: hasRequiredPermission ? "permission-present" : "missing-executive-observability-read",
    requiredPermission: policy.requiredPermission,
    accessLevel: policy.accessLevel,
  };
}

export function assertExecutiveDashboardAccessModel(model: ExecutiveDashboardAccessModel): void {
  if (model.phase !== "17.3-D" || model.status !== "approved-for-future-ui-access-gate") {
    throw new Error("Executive dashboard access model is not approved for future UI access gate.");
  }

  if (
    model.guardrails.uiImplementationIncluded ||
    model.guardrails.visualComponentsIncluded ||
    model.guardrails.routeImplementationIncluded ||
    model.guardrails.apiImplementationIncluded ||
    model.guardrails.loginImplementationIncluded ||
    model.guardrails.credentialStorageIncluded ||
    model.guardrails.persistenceIncluded ||
    model.guardrails.domainLogicIncluded ||
    model.guardrails.fallbackLogicIncluded ||
    model.guardrails.aggregateAccess ||
    model.guardrails.adapterAccess ||
    model.guardrails.readModelDirectAccess ||
    model.guardrails.rawTelemetryExposure ||
    model.guardrails.leadWriteIncluded ||
    model.guardrails.publicApiExpansionIncluded ||
    !model.guardrails.aggregateIsolationPreserved ||
    !model.guardrails.domainOwnershipPreserved ||
    !model.guardrails.leadsSourceOfTruthPreserved ||
    !model.guardrails.readModelPlatformV2ClosedFrozenPreserved
  ) {
    throw new Error("Executive dashboard access model guardrails are not satisfied.");
  }

  if (model.policies.length !== 3) {
    throw new Error("Executive dashboard access model must define exactly three dashboard policies.");
  }

  const invalidPolicy = model.policies.find(
    (policy) =>
      policy.requiredPermission !== REQUIRED_PERMISSION ||
      policy.accessLevel !== "metric-only-read" ||
      policy.allowedContract !== "ExecutiveDashboardApiContracts" ||
      !policy.metricOnly ||
      !policy.uiAccessGateOnly ||
      policy.allowedWidgetIds.length === 0,
  );

  if (invalidPolicy) {
    throw new Error(`Executive dashboard access policy is outside governance: ${invalidPolicy.surface}`);
  }

  const forbiddenDependency = model.forbiddenDependencies.find(
    (dependency) => !FORBIDDEN_ACCESS_DEPENDENCIES.includes(dependency),
  );

  if (forbiddenDependency) {
    throw new Error(`Executive dashboard access model contains unknown forbidden dependency: ${forbiddenDependency}`);
  }
}
