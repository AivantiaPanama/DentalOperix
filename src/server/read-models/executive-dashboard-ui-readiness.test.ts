import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it } from "vitest";
import { readObservabilityProvider } from "./read-observability-provider";
import { createExecutiveDashboardApiContracts } from "./executive-dashboard-api-contracts";
import {
  EXECUTIVE_DASHBOARD_UI_READINESS_VERSION,
  assertExecutiveDashboardUiReadiness,
  createExecutiveDashboardUiReadinessAssessment,
} from "./executive-dashboard-ui-readiness";

const uiReadinessSource = readFileSync(
  fileURLToPath(new URL("./executive-dashboard-ui-readiness.ts", import.meta.url)),
  "utf8",
);

describe("17.3-A executive dashboard UI readiness assessment", () => {
  beforeEach(() => {
    readObservabilityProvider.clearBufferedEvents();
    readObservabilityProvider.setSink(undefined);
  });

  it("marks the governed dashboard surface as ready for UI design without implementing UI", () => {
    const assessment = createExecutiveDashboardUiReadinessAssessment(
      createExecutiveDashboardApiContracts(undefined, "2026-01-01T00:00:00.000Z"),
      "2026-01-01T00:00:00.000Z",
    );

    expect(assessment).toMatchObject({
      version: EXECUTIVE_DASHBOARD_UI_READINESS_VERSION,
      phase: "17.3-A",
      status: "ready-for-ui-design",
      designBoundary: {
        uiImplementationIncluded: false,
        routeImplementationIncluded: false,
        publicApiIncluded: false,
        persistenceIncluded: false,
        leadWriteIncluded: false,
      },
    });
    expect(() => assertExecutiveDashboardUiReadiness(assessment)).not.toThrow();
  });

  it("validates metric-only contracts, permission scope, and forbidden access guarantees", () => {
    readObservabilityProvider.trackAggregate({
      consumerName: "Executive UI Readiness Guard",
      domain: "Finance",
      aggregate: "FinanceAggregateReadService",
      success: true,
      recordCount: 2,
      diagnostics: {
        rawTelemetry: [{ id: "raw-event" }],
        adapters: ["must-not-leak"],
        readModels: ["must-not-leak"],
        invoices: [{ id: "INV-1" }],
      },
    });
    readObservabilityProvider.trackRead({
      consumerName: "Executive UI Readiness Guard",
      domain: "Finance",
      aggregate: "FinanceAggregateReadService",
      source: "ReadModel",
      recordCount: 2,
    });

    const assessment = createExecutiveDashboardUiReadinessAssessment();
    const serialized = JSON.stringify(assessment);

    expect(assessment.governance).toEqual({
      contractsAvailable: true,
      permissionRequired: "executive-observability:read",
      metricOnlyResponses: true,
      rawTelemetryExposure: false,
      aggregateAccess: false,
      adapterAccess: false,
      aggregateIsolationPreserved: true,
      domainOwnershipPreserved: true,
      leadsSourceOfTruthPreserved: true,
      readModelPlatformV2ClosedFrozenPreserved: true,
    });
    expect(serialized).not.toContain("raw-event");
    expect(serialized).not.toContain("diagnostics");
    expect(serialized).not.toContain("must-not-leak");
    expect(serialized).not.toContain("readModels");
    expect(serialized).not.toContain("INV-1");
  });

  it("identifies executive, operational, and governance dashboard candidates from API contracts only", () => {
    const assessment = createExecutiveDashboardUiReadinessAssessment();

    expect(assessment.dashboardCandidates).toEqual([
      {
        candidate: "Executive Dashboard",
        audience: "executive",
        sourceRoute: "/api/internal/executive-observability/executive",
        metricFamilies: ["platform", "domain"],
        readiness: "ready-for-ui-design",
        allowedConsumption: "executive-dashboard-api-contracts-only",
      },
      {
        candidate: "Operational Dashboard",
        audience: "operational",
        sourceRoute: "/api/internal/executive-observability/operational",
        metricFamilies: ["aggregate"],
        readiness: "ready-for-ui-design",
        allowedConsumption: "executive-dashboard-api-contracts-only",
      },
      {
        candidate: "Governance Dashboard",
        audience: "governance",
        sourceRoute: "/api/internal/executive-observability/governance",
        metricFamilies: ["governance"],
        readiness: "ready-for-ui-design",
        allowedConsumption: "executive-dashboard-api-contracts-only",
      },
    ]);
    expect(assessment.validation.dashboardCandidateCount).toBe(3);
  });

  it("validates ADR-015, ADR-016, ADR-017, ADR-018, and ADR-024 compliance", () => {
    const assessment = createExecutiveDashboardUiReadinessAssessment();

    expect(assessment.adrValidation).toEqual({
      "ADR-015": "compliant",
      "ADR-016": "compliant",
      "ADR-017": "compliant",
      "ADR-018": "compliant",
      "ADR-024": "compliant",
    });
    expect(assessment.validation.forbiddenAccessValidated).toBe(true);
    expect(assessment.validation.frozenReadModelPlatformValidated).toBe(true);
  });

  it("does not import aggregates, adapters, read model source provider, routes, UI, or lead write paths", () => {
    expect(uiReadinessSource).toContain("./executive-dashboard-api-contracts");
    expect(uiReadinessSource).toContain("./executive-dashboard-contracts");
    expect(uiReadinessSource).not.toMatch(/from\s+["'].+aggregate-read-service["']/);
    expect(uiReadinessSource).not.toMatch(/from\s+["'].+read-adapter["']/);
    expect(uiReadinessSource).not.toMatch(/from\s+["'].+read-model-source-provider["']/);
    expect(uiReadinessSource).not.toMatch(/from\s+["'].+components\//);
    expect(uiReadinessSource).not.toMatch(/from\s+["'].+routes\//);
    expect(uiReadinessSource).not.toMatch(/createFileRoute|createServerFileRoute|route\(/);
    expect(uiReadinessSource).not.toMatch(/processDentalLead|\/api\/leads\/create|BookingDialog|siteServices/);
  });
});
