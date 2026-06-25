import type {
  ComplianceStatus,
  GovernanceEvidence,
  ValidationContext,
  ValidationReport,
  ValidationResult,
} from "../models/governance-models";
import type { IReportGenerator } from "../contracts/governance-contracts";
import { GOVERNANCE_SDK_VERSION } from "../version/governance-version";

const rank: Record<ComplianceStatus, number> = {
  FAIL: 4,
  WARNING: 3,
  PASS: 2,
  NOT_APPLICABLE: 1,
};

export const aggregateComplianceStatus = (results: readonly ValidationResult[]): ComplianceStatus => {
  if (results.length === 0) {
    return "NOT_APPLICABLE";
  }

  return results.reduce<ComplianceStatus>((current, result) => {
    return rank[result.status] > rank[current] ? result.status : current;
  }, "NOT_APPLICABLE");
};

export class ReportBuilder implements IReportGenerator {
  generate(context: ValidationContext, results: readonly ValidationResult[]): ValidationReport {
    return {
      reportId: `${context.programId}-${context.incrementId}-governance-report`,
      sdkVersion: GOVERNANCE_SDK_VERSION,
      context,
      status: aggregateComplianceStatus(results),
      results,
      generatedAt: new Date().toISOString(),
    };
  }
}

export const createEvidence = (params: Omit<GovernanceEvidence, "generatedAt">): GovernanceEvidence => ({
  ...params,
  generatedAt: new Date().toISOString(),
});
