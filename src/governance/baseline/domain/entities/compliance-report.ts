import type { ComplianceStatus, GovernanceDecision } from "../enums";
import type { BaselineDescriptor } from "./baseline-descriptor";
import type { RuleResult } from "../value-objects/rule-result";

export interface ComplianceReportSummary {
  readonly totalRules: number;
  readonly passed: number;
  readonly warnings: number;
  readonly failed: number;
  readonly coveragePercent: number;
}

export interface ComplianceReport {
  readonly reportId: string;
  readonly baseline: BaselineDescriptor;
  readonly generatedAt: string;
  readonly ruleResults: readonly RuleResult[];
  readonly summary: ComplianceReportSummary;
  readonly overallStatus: ComplianceStatus;
  readonly governanceDecision: GovernanceDecision;
  readonly evidence: readonly string[];
}
