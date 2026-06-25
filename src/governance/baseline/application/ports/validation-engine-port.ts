import type { ComplianceRule, ComplianceRuleContext } from "../../domain/rules/compliance-rule";
import type { RuleResult } from "../../domain/value-objects/rule-result";

export interface ValidationEnginePort {
  execute(rule: ComplianceRule, context: ComplianceRuleContext): Promise<RuleResult> | RuleResult;
  executeAll(rules: readonly ComplianceRule[], context: ComplianceRuleContext): Promise<readonly RuleResult[]> | readonly RuleResult[];
}
