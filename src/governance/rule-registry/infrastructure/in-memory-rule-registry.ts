import type { BaselineVersion } from "../../baseline/domain/value-objects/baseline-version";
import type { RuleIdentifier } from "../../baseline/domain/value-objects/rule-identifier";
import type { RuleCategory, RuleDefinition } from "../domain";
import { createRuleKey } from "../domain";
import type { RuleRegistryPort } from "../ports";

export class InMemoryRuleRegistry implements RuleRegistryPort {
  private readonly rules = new Map<string, RuleDefinition>();

  constructor(initialRules: readonly RuleDefinition[] = []) {
    for (const rule of initialRules) {
      this.register(rule);
    }
  }

  register(rule: RuleDefinition): void {
    const key = createRuleKey(rule.identifier);

    if (!rule.identifier.value.trim()) {
      throw new Error("Rule identifier value is required.");
    }

    if (!rule.identifier.version.trim()) {
      throw new Error("Rule identifier version is required.");
    }

    if (this.rules.has(key)) {
      throw new Error(`Rule already registered: ${key}`);
    }

    this.rules.set(key, rule);
  }

  findById(identifier: RuleIdentifier): RuleDefinition | undefined {
    return this.rules.get(createRuleKey(identifier));
  }

  list(): readonly RuleDefinition[] {
    return this.sortRules([...this.rules.values()]);
  }

  listByCategory(category: RuleCategory): readonly RuleDefinition[] {
    return this.sortRules(this.list().filter((rule) => rule.category === category));
  }

  listCompatibleWithBaseline(version: BaselineVersion): readonly RuleDefinition[] {
    return this.sortRules(
      this.list().filter((rule) => rule.version.compatibleBaselineVersions.includes(version.value)),
    );
  }

  private sortRules(rules: readonly RuleDefinition[]): readonly RuleDefinition[] {
    return [...rules].sort((left, right) => {
      const leftKey = createRuleKey(left.identifier);
      const rightKey = createRuleKey(right.identifier);

      return leftKey.localeCompare(rightKey);
    });
  }
}
