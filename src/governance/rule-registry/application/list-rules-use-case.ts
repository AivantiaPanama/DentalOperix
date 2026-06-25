import type { BaselineVersion } from "../../baseline/domain/value-objects/baseline-version";
import type { RuleCategory, RuleDefinition } from "../domain";
import type { RuleRegistryPort } from "../ports";

export interface ListRulesQuery {
  readonly category?: RuleCategory;
  readonly compatibleWithBaseline?: BaselineVersion;
}

export class ListRulesUseCase {
  constructor(private readonly registry: RuleRegistryPort) {}

  execute(query: ListRulesQuery = {}): readonly RuleDefinition[] {
    if (query.compatibleWithBaseline) {
      return this.registry.listCompatibleWithBaseline(query.compatibleWithBaseline);
    }

    if (query.category) {
      return this.registry.listByCategory(query.category);
    }

    return this.registry.list();
  }
}
