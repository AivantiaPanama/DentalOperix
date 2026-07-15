import type { Permission } from "../../lib/rbac/permissions";
import {
  type ExecutiveDashboardApiContracts,
  type ExecutiveDashboardApiRoute,
  createExecutiveDashboardApiContracts,
} from "./executive-dashboard-api-contracts";
import {
  type ExecutiveDashboardAccessEvaluation,
  type ExecutiveDashboardAccessModel,
  type ExecutiveDashboardAccessPrincipal,
  assertExecutiveDashboardAccessModel,
  createExecutiveDashboardAccessModel,
  evaluateExecutiveDashboardAccess,
} from "./executive-dashboard-access-model";
import type { ExecutiveDashboardSurface } from "./executive-dashboard-ui-architecture";

export const EXECUTIVE_DASHBOARD_DATA_CLIENT_DESIGN_VERSION =
  "executive-dashboard-data-client-design/v1";

export type ExecutiveDashboardDataClientDesignPhase = "17.3-E";

export type ExecutiveDashboardDataClientDesignStatus =
  "approved-for-future-dashboard-client-implementation";

export type ExecutiveDashboardDataClientMode = "contract-bound-metric-read";

export type ExecutiveDashboardDataClientTransportStatus = "transport-contract-only";

export type ExecutiveDashboardDataClientPermission = Extract<
  Permission,
  "executive-observability:read"
>;

export type ExecutiveDashboardDataClientExposure = "metric-only";

export type ExecutiveDashboardDataClientRequestStatus =
  | "approved-request-descriptor"
  | "denied-request-descriptor";

export type ExecutiveDashboardDataClientForbiddenDependency =
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
  | "admin-login-credential-storage"
  | "browser-storage"
  | "credential-forwarding"
  | "client-side-aggregation";

export type ExecutiveDashboardDataClientEndpointBinding = {
  surface: ExecutiveDashboardSurface;
  route: ExecutiveDashboardApiRoute;
  method: "GET";
  requiredPermission: ExecutiveDashboardDataClientPermission;
  allowedContract: "ExecutiveDashboardApiContracts";
  accessModelVersion: ExecutiveDashboardAccessModel["version"];
  responseExposure: ExecutiveDashboardDataClientExposure;
  transportStatus: ExecutiveDashboardDataClientTransportStatus;
  clientComputation: "projection-free-display-mapping-only";
};

export type ExecutiveDashboardDataClientGuardrails = {
  uiImplementationIncluded: false;
  visualComponentsIncluded: false;
  routeImplementationIncluded: false;
  apiImplementationIncluded: false;
  transportImplementationIncluded: false;
  fetchImplementationIncluded: false;
  browserStorageIncluded: false;
  credentialStorageIncluded: false;
  credentialForwardingIncluded: false;
  persistenceIncluded: false;
  domainLogicIncluded: false;
  fallbackLogicIncluded: false;
  clientSideAggregationIncluded: false;
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

export type ExecutiveDashboardDataClientDesign = {
  version: typeof EXECUTIVE_DASHBOARD_DATA_CLIENT_DESIGN_VERSION;
  phase: ExecutiveDashboardDataClientDesignPhase;
  status: ExecutiveDashboardDataClientDesignStatus;
  generatedAt: string;
  apiContractVersion: string;
  accessModelVersion: ExecutiveDashboardAccessModel["version"];
  mode: ExecutiveDashboardDataClientMode;
  guardrails: ExecutiveDashboardDataClientGuardrails;
  endpointBindings: ExecutiveDashboardDataClientEndpointBinding[];
  forbiddenDependencies: ExecutiveDashboardDataClientForbiddenDependency[];
  nextPhase: "17.3-F Dashboard View Model Design";
};

export type ExecutiveDashboardDataClientRequestDescriptor = {
  surface: ExecutiveDashboardSurface;
  route: ExecutiveDashboardApiRoute;
  method: "GET";
  status: ExecutiveDashboardDataClientRequestStatus;
  access: ExecutiveDashboardAccessEvaluation;
  allowedContract: "ExecutiveDashboardApiContracts";
  responseExposure: ExecutiveDashboardDataClientExposure;
  transportStatus: ExecutiveDashboardDataClientTransportStatus;
};

const REQUIRED_PERMISSION: ExecutiveDashboardDataClientPermission = "executive-observability:read";

const FORBIDDEN_DATA_CLIENT_DEPENDENCIES: ExecutiveDashboardDataClientForbiddenDependency[] = [
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
  "browser-storage",
  "credential-forwarding",
  "client-side-aggregation",
];

export function createExecutiveDashboardDataClientDesign(
  contracts: ExecutiveDashboardApiContracts = createExecutiveDashboardApiContracts(),
  accessModel: ExecutiveDashboardAccessModel = createExecutiveDashboardAccessModel(contracts),
  generatedAt = new Date().toISOString(),
): ExecutiveDashboardDataClientDesign {
  assertExecutiveDashboardAccessModel(accessModel);

  const approvedContractRoutes = new Set(contracts.endpoints.map((endpoint) => endpoint.route));

  const endpointBindings: ExecutiveDashboardDataClientEndpointBinding[] = accessModel.policies.map(
    (policy) => {
      if (!approvedContractRoutes.has(policy.route)) {
        throw new Error(
          `Executive dashboard data client route is outside approved API contracts: ${policy.route}`,
        );
      }

      return {
        surface: policy.surface,
        route: policy.route,
        method: "GET",
        requiredPermission: REQUIRED_PERMISSION,
        allowedContract: "ExecutiveDashboardApiContracts",
        accessModelVersion: accessModel.version,
        responseExposure: "metric-only",
        transportStatus: "transport-contract-only",
        clientComputation: "projection-free-display-mapping-only",
      };
    },
  );

  return {
    version: EXECUTIVE_DASHBOARD_DATA_CLIENT_DESIGN_VERSION,
    phase: "17.3-E",
    status: "approved-for-future-dashboard-client-implementation",
    generatedAt,
    apiContractVersion: contracts.responses.snapshot.version,
    accessModelVersion: accessModel.version,
    mode: "contract-bound-metric-read",
    guardrails: {
      uiImplementationIncluded: false,
      visualComponentsIncluded: false,
      routeImplementationIncluded: false,
      apiImplementationIncluded: false,
      transportImplementationIncluded: false,
      fetchImplementationIncluded: false,
      browserStorageIncluded: false,
      credentialStorageIncluded: false,
      credentialForwardingIncluded: false,
      persistenceIncluded: false,
      domainLogicIncluded: false,
      fallbackLogicIncluded: false,
      clientSideAggregationIncluded: false,
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
    endpointBindings,
    forbiddenDependencies: FORBIDDEN_DATA_CLIENT_DEPENDENCIES,
    nextPhase: "17.3-F Dashboard View Model Design",
  };
}

export function createExecutiveDashboardDataClientRequestDescriptor(
  design: ExecutiveDashboardDataClientDesign,
  accessModel: ExecutiveDashboardAccessModel,
  principal: ExecutiveDashboardAccessPrincipal,
  surface: ExecutiveDashboardSurface,
): ExecutiveDashboardDataClientRequestDescriptor {
  assertExecutiveDashboardDataClientDesign(design);
  assertExecutiveDashboardAccessModel(accessModel);

  const binding = design.endpointBindings.find((candidate) => candidate.surface === surface);
  const access = evaluateExecutiveDashboardAccess(accessModel, principal, surface);

  if (!binding || access.decision === "deny") {
    return {
      surface,
      route: access.route,
      method: "GET",
      status: "denied-request-descriptor",
      access,
      allowedContract: "ExecutiveDashboardApiContracts",
      responseExposure: "metric-only",
      transportStatus: "transport-contract-only",
    };
  }

  return {
    surface: binding.surface,
    route: binding.route,
    method: binding.method,
    status: "approved-request-descriptor",
    access,
    allowedContract: binding.allowedContract,
    responseExposure: binding.responseExposure,
    transportStatus: binding.transportStatus,
  };
}

export function assertExecutiveDashboardDataClientDesign(
  design: ExecutiveDashboardDataClientDesign,
): void {
  if (
    design.phase !== "17.3-E" ||
    design.status !== "approved-for-future-dashboard-client-implementation"
  ) {
    throw new Error(
      "Executive dashboard data client design is not approved for future dashboard client implementation.",
    );
  }

  if (
    design.guardrails.uiImplementationIncluded ||
    design.guardrails.visualComponentsIncluded ||
    design.guardrails.routeImplementationIncluded ||
    design.guardrails.apiImplementationIncluded ||
    design.guardrails.transportImplementationIncluded ||
    design.guardrails.fetchImplementationIncluded ||
    design.guardrails.browserStorageIncluded ||
    design.guardrails.credentialStorageIncluded ||
    design.guardrails.credentialForwardingIncluded ||
    design.guardrails.persistenceIncluded ||
    design.guardrails.domainLogicIncluded ||
    design.guardrails.fallbackLogicIncluded ||
    design.guardrails.clientSideAggregationIncluded ||
    design.guardrails.aggregateAccess ||
    design.guardrails.adapterAccess ||
    design.guardrails.readModelDirectAccess ||
    design.guardrails.rawTelemetryExposure ||
    design.guardrails.leadWriteIncluded ||
    design.guardrails.publicApiExpansionIncluded ||
    !design.guardrails.aggregateIsolationPreserved ||
    !design.guardrails.domainOwnershipPreserved ||
    !design.guardrails.leadsSourceOfTruthPreserved ||
    !design.guardrails.readModelPlatformV2ClosedFrozenPreserved
  ) {
    throw new Error("Executive dashboard data client design guardrails are not satisfied.");
  }

  if (design.mode !== "contract-bound-metric-read") {
    throw new Error(
      "Executive dashboard data client must remain contract-bound and metric-read only.",
    );
  }

  if (design.endpointBindings.length !== 3) {
    throw new Error(
      "Executive dashboard data client design must define exactly three dashboard endpoint bindings.",
    );
  }

  const invalidBinding = design.endpointBindings.find(
    (binding) =>
      binding.method !== "GET" ||
      binding.requiredPermission !== REQUIRED_PERMISSION ||
      binding.allowedContract !== "ExecutiveDashboardApiContracts" ||
      binding.responseExposure !== "metric-only" ||
      binding.transportStatus !== "transport-contract-only" ||
      binding.clientComputation !== "projection-free-display-mapping-only",
  );

  if (invalidBinding) {
    throw new Error(
      `Executive dashboard data client binding is outside governance: ${invalidBinding.surface}`,
    );
  }

  const forbiddenDependency = design.forbiddenDependencies.find(
    (dependency) => !FORBIDDEN_DATA_CLIENT_DEPENDENCIES.includes(dependency),
  );

  if (forbiddenDependency) {
    throw new Error(
      `Executive dashboard data client contains unknown forbidden dependency: ${forbiddenDependency}`,
    );
  }
}
