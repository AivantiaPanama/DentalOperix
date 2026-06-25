import type { BaselineVersion } from "../../domain/value-objects/baseline-version";
import type { RuleIdentifier } from "../../domain/value-objects/rule-identifier";
import type { ComplianceRule } from "../../domain/rules/compliance-rule";

export interface ComplianceRuleRegistryPort {
  get(rule: RuleIdentifier): ComplianceRule | undefined;
  list(): readonly ComplianceRule[];
  listCompatibleWithBaseline(version: BaselineVersion): readonly ComplianceRule[];
}
