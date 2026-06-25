import type { RuleSeverity } from "../enums";
import type { BaselineDescriptor } from "../entities/baseline-descriptor";
import type { RuleIdentifier } from "../value-objects/rule-identifier";
import type { RuleResult } from "../value-objects/rule-result";

export interface ComplianceRuleContext {
  readonly baseline: BaselineDescriptor;
  readonly executionId: string;
  readonly executedAt: string;
  readonly metadata?: Readonly<Record<string, string>>;
}

export interface ComplianceRule {
  readonly identifier: RuleIdentifier;
  readonly name: string;
  readonly description: string;
  readonly severity: RuleSeverity;
  evaluate(context: ComplianceRuleContext): Promise<RuleResult> | RuleResult;
}
