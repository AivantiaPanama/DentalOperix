import { describe, expect, it } from "vitest";
import {
  ComplianceReportGenerator,
  GovernanceValidationEngine,
  StaticEvidenceProvider,
  ValidatorRegistry,
  type IValidator,
  type ValidationContext,
} from "../index";

const context: ValidationContext = {
  programId: "72.1",
  incrementId: "72.1.2",
  checkedAt: "2026-06-25T00:00:00.000Z",
  baseline: {
    baselineId: "DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE",
    releaseCandidate: true,
    certifiedArchitectures: ["Leads", "Patients", "Ports & Adapters", "Sources of Truth"],
    protectedComponents: ["BookingDialog", "processDentalLead", "FloatingDentalAIChat"],
  },
};

const passingValidator = (validatorId: string): IValidator => ({
  validatorId,
  version: "1.0.0",
  validate: () => ({
    validatorId,
    status: "PASS",
    findings: [],
    evidence: [
      {
        evidenceId: `${validatorId}-evidence`,
        generatedAt: "2026-06-25T00:00:00.000Z",
        source: validatorId,
        summary: "Validator executed",
        artifacts: [],
      },
    ],
  }),
});

describe("Governance Validation Engine", () => {
  it("executes registered validators in deterministic order", async () => {
    const registry = new ValidatorRegistry();
    registry.register(passingValidator("governance-validator-b"));
    registry.register(passingValidator("architecture-validator-a"));

    const engine = new GovernanceValidationEngine(registry);
    const result = await engine.execute(context);

    expect(result.executedValidators).toEqual(["architecture-validator-a", "governance-validator-b"]);
    expect(result.status).toBe("PASS");
    expect(result.report.status).toBe("PASS");
    expect(result.report.results).toHaveLength(2);
  });

  it("aggregates collected evidence with validator evidence", async () => {
    const registry = new ValidatorRegistry();
    registry.register(passingValidator("compliance-validator"));

    const provider = new StaticEvidenceProvider([
      {
        evidenceId: "session-evidence",
        generatedAt: "2026-06-25T00:00:00.000Z",
        source: "governance-validation-engine",
        summary: "Session evidence collected",
        artifacts: ["governance/14-evidence/DENTALOPERIX_72_1_2_EXECUTION_EVIDENCE.md"],
      },
    ]);

    const engine = new GovernanceValidationEngine(registry, provider);
    const result = await engine.execute(context);

    expect(result.evidence.map((item) => item.evidenceId)).toContain("session-evidence");
    expect(result.evidence.map((item) => item.evidenceId)).toContain("compliance-validator-evidence");
  });

  it("returns NOT_APPLICABLE when no validators are registered", async () => {
    const engine = new GovernanceValidationEngine(new ValidatorRegistry());
    const report = await engine.run(context);

    expect(report.status).toBe("NOT_APPLICABLE");
    expect(report.results).toEqual([]);
  });

  it("generates compliance reports through the certified SDK report builder", () => {
    const report = new ComplianceReportGenerator().generate(context, []);

    expect(report.reportId).toBe("72.1-72.1.2-governance-report");
    expect(report.status).toBe("NOT_APPLICABLE");
  });
});
