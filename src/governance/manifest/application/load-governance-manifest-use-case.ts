import type { GovernanceManifest } from "../domain";
import type { ManifestLoaderPort } from "../ports";

export class LoadGovernanceManifestUseCase {
  constructor(private readonly loader: ManifestLoaderPort) {}

  execute(): Promise<GovernanceManifest> | GovernanceManifest {
    return this.loader.load();
  }
}
