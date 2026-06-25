import type { GovernanceManifest } from "../domain";

export interface ManifestLoaderPort {
  load(): Promise<GovernanceManifest> | GovernanceManifest;
}
