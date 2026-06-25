import { ManifestRuleRegistry } from "../infrastructure";
import type { GovernanceManifest } from "../domain";

export class CreateRuleRegistryFromManifestUseCase {
  execute(manifest: GovernanceManifest): ManifestRuleRegistry {
    return new ManifestRuleRegistry(manifest);
  }
}
