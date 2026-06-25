import type { RuleIdentifier } from "../../baseline/domain/value-objects/rule-identifier";
import type { RuleDefinition } from "../domain";
import type { RuleRegistryPort } from "../ports";

export class FindRuleByIdUseCase {
  constructor(private readonly registry: RuleRegistryPort) {}

  execute(identifier: RuleIdentifier): RuleDefinition | undefined {
    return this.registry.findById(identifier);
  }
}
