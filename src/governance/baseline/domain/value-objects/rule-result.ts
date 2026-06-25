import type { ComplianceStatus, RuleSeverity } from "../enums";
import type { RuleIdentifier } from "./rule-identifier";

export interface RuleEvidence {
  readonly evidenceId: string;
  readonly source: string;
  readonly summary: string;
  readonly artifacts: readonly string[];
}

export interface RuleResult {
  readonly rule: RuleIdentifier;
  readonly ruleName: string;
  readonly status: ComplianceStatus;
  readonly severity: RuleSeverity;
  readonly message: string;
  readonly evidence: readonly RuleEvidence[];
  readonly evaluatedAt: string;
}
