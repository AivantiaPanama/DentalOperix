import type { GovernanceManifest } from "../domain";
import type { ManifestLoaderPort } from "../ports";

export class StaticManifestLoader implements ManifestLoaderPort {
  constructor(private readonly manifest: GovernanceManifest) {}

  load(): GovernanceManifest {
    return this.manifest;
  }
}
