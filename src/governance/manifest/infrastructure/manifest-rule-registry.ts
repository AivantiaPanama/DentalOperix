import type { BaselineVersion } from "../../baseline/domain";
import type { RuleIdentifier } from "../../baseline/domain";
import type { RuleCategory, RuleDefinition } from "../../rule-registry/domain";
import { InMemoryRuleRegistry } from "../../rule-registry/infrastructure";
import type { RuleRegistryPort } from "../../rule-registry/ports";
import type { GovernanceManifest } from "../domain";
import { validateGovernanceManifest } from "../domain";

export class ManifestRuleRegistry implements RuleRegistryPort {
  private readonly delegate: InMemoryRuleRegistry;

  constructor(private readonly manifest: GovernanceManifest) {
    const validation = validateGovernanceManifest(manifest);

    if (!validation.valid) {
      throw new Error(`Invalid governance manifest: ${validation.errors.join("; ")}`);
    }

    this.delegate = new InMemoryRuleRegistry(manifest.rules);
  }

  getManifest(): GovernanceManifest {
    return this.manifest;
  }

  register(rule: RuleDefinition): void {
    this.delegate.register(rule);
  }

  findById(identifier: RuleIdentifier): RuleDefinition | undefined {
    return this.delegate.findById(identifier);
  }

  list(): readonly RuleDefinition[] {
    return this.delegate.list();
  }

  listByCategory(category: RuleCategory): readonly RuleDefinition[] {
    return this.delegate.listByCategory(category);
  }

  listCompatibleWithBaseline(version: BaselineVersion): readonly RuleDefinition[] {
    return this.delegate.listCompatibleWithBaseline(version);
  }
}
