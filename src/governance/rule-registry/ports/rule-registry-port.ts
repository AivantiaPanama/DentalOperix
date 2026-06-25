import type { RuleIdentifier } from "../../baseline/domain/value-objects/rule-identifier";
import type { BaselineVersion } from "../../baseline/domain/value-objects/baseline-version";
import type { RuleCategory, RuleDefinition } from "../domain";

export interface RuleRegistryPort {
  register(rule: RuleDefinition): void;
  findById(identifier: RuleIdentifier): RuleDefinition | undefined;
  list(): readonly RuleDefinition[];
  listByCategory(category: RuleCategory): readonly RuleDefinition[];
  listCompatibleWithBaseline(version: BaselineVersion): readonly RuleDefinition[];
}
