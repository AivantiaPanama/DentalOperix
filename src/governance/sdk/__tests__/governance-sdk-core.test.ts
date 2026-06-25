import { describe, expect, it } from "vitest";
import {
  GOVERNANCE_SDK_VERSION,
  ReportBuilder,
  StaticEvidenceProvider,
  ValidatorRegistry,
  aggregateComplianceStatus,
  createEvidence,
  determineVersionPolicy,
  type IValidator,
  type ValidationContext,
} from "../index";

const context: ValidationContext = {
  programId: "72.1",
  incrementId: "72.1.1",
  checkedAt: "2026-06-24T00:00:00.000Z",
  baseline: {
    baselineId: "DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE",
    releaseCandidate: true,
    certifiedArchitectures: ["Leads", "Patients", "Sources of Truth", "Ports & Adapters"],
    protectedComponents: [
      "BookingDialog",
      "processDentalLead",
      "/api/leads/create",
      "Calendar",
      "Gmail",
      "FloatingDentalAIChat",
      "Home",
      "siteServices.ts",
    ],
  },
};

const passValidator: IValidator = {
  validatorId: "baseline-compatibility-validator",
  version: GOVERNANCE_SDK_VERSION,
  validate: () => ({
    validatorId: "baseline-compatibility-validator",
    status: "PASS",
    findings: [],
    evidence: [],
  }),
};

describe("Governance SDK Core 72.1.1", () => {
  it("registers validators and exposes an immutable descriptor", () => {
    const registry = new ValidatorRegistry();

    registry.register(passValidator);

    expect(registry.get("baseline-compatibility-validator")).toBe(passValidator);
    expect(registry.list()).toHaveLength(1);
    expect(registry.describe()).toEqual({
      registryId: "governance-sdk-validator-registry",
      sdkVersion: "1.0.0",
      registeredValidators: ["baseline-compatibility-validator"],
    });
  });

  it("rejects duplicate validators to preserve deterministic governance execution", () => {
    const registry = new ValidatorRegistry();

    registry.register(passValidator);

    expect(() => registry.register(passValidator)).toThrow("Validator already registered");
  });

  it("aggregates validation status using the most severe result", () => {
    expect(
      aggregateComplianceStatus([
        { validatorId: "a", status: "PASS", findings: [], evidence: [] },
        { validatorId: "b", status: "WARNING", findings: [], evidence: [] },
        { validatorId: "c", status: "FAIL", findings: [], evidence: [] },
      ]),
    ).toBe("FAIL");
  });

  it("builds audit-ready validation reports with SDK version and baseline context", () => {
    const validationResult = {
      validatorId: "baseline-compatibility-validator",
      status: "PASS" as const,
      findings: [],
      evidence: [],
    };
    const report = new ReportBuilder().generate(context, [validationResult]);

    expect(report.reportId).toBe("72.1-72.1.1-governance-report");
    expect(report.sdkVersion).toBe(GOVERNANCE_SDK_VERSION);
    expect(report.context.baseline.baselineId).toBe("DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE");
    expect(report.status).toBe("PASS");
  });

  it("collects static evidence without touching functional runtime components", () => {
    const evidence = createEvidence({
      evidenceId: "72.1.1-sdk-core-evidence",
      source: "Governance SDK Core tests",
      summary: "SDK contracts, registry, reporting, versioning, and evidence primitives validated.",
      artifacts: ["src/governance/sdk/index.ts", "src/governance/sdk/__tests__/governance-sdk-core.test.ts"],
    });

    const provider = new StaticEvidenceProvider([evidence]);

    expect(provider.collect(context)).toEqual([evidence]);
  });

  it("enforces SemVer governance policy for public contract changes", () => {
    expect(determineVersionPolicy("major")).toMatchObject({
      requiresADR: true,
      requiresGARBReview: true,
    });
    expect(determineVersionPolicy("minor")).toMatchObject({
      requiresADR: false,
      requiresGARBReview: false,
    });
    expect(determineVersionPolicy("patch")).toMatchObject({
      requiresADR: false,
      requiresGARBReview: false,
    });
  });
});
