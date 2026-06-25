import type { RuleDefinition } from "../domain";
import type { RuleRegistryPort } from "../ports";

export class RegisterRuleUseCase {
  constructor(private readonly registry: RuleRegistryPort) {}

  execute(rule: RuleDefinition): RuleDefinition {
    this.registry.register(rule);
    return rule;
  }
}
