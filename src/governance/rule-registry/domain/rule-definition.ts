import type { RuleSeverity } from "../../baseline/domain/enums";
import type { RuleIdentifier } from "../../baseline/domain/value-objects/rule-identifier";
import type { RuleCategory } from "./rule-category";
import type { RuleVersion } from "./rule-version";

export type RuleLifecycleStatus = "draft" | "approved" | "certified" | "deprecated";

export interface RuleEvaluationCriteria {
  readonly summary: string;
  readonly expectedResult: string;
}

export interface RuleDefinition {
  readonly identifier: RuleIdentifier;
  readonly name: string;
  readonly description: string;
  readonly objective: string;
  readonly category: RuleCategory;
  readonly severity: RuleSeverity;
  readonly lifecycleStatus: RuleLifecycleStatus;
  readonly version: RuleVersion;
  readonly evaluationCriteria: RuleEvaluationCriteria;
  readonly requiredEvidence: readonly string[];
  readonly dependencies: readonly RuleIdentifier[];
  readonly metadata?: Readonly<Record<string, string>>;
}

export const createRuleKey = (identifier: RuleIdentifier): string => {
  return `${identifier.value}@${identifier.version}`;
};
