import type { GovernanceManifest } from "../domain";

export interface ManifestParserPort {
  parse(source: string): GovernanceManifest;
}
