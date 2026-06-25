import type { GovernanceManifest } from "../domain";
import { validateGovernanceManifest } from "../domain";
import type { ManifestParserPort } from "../ports";

export class JsonManifestParser implements ManifestParserPort {
  parse(source: string): GovernanceManifest {
    const parsed = JSON.parse(source) as GovernanceManifest;
    const validation = validateGovernanceManifest(parsed);

    if (!validation.valid) {
      throw new Error(`Invalid governance manifest: ${validation.errors.join("; ")}`);
    }

    return parsed;
  }
}
