import type { GovernanceManifest } from "./governance-manifest";

export interface ManifestValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

export function validateGovernanceManifest(manifest: GovernanceManifest): ManifestValidationResult {
  const errors: string[] = [];

  if (!manifest.schemaVersion.trim()) errors.push("Manifest schemaVersion is required.");
  if (!manifest.manifestId.trim()) errors.push("Manifest manifestId is required.");
  if (!manifest.baseline.identifier.trim())
    errors.push("Manifest baseline identifier is required.");
  if (!manifest.baseline.version.trim()) errors.push("Manifest baseline version is required.");
  if (manifest.rules.length === 0)
    errors.push("Manifest must contain at least one governance rule.");
  if (!manifest.validationProfile.readOnly)
    errors.push("Governance manifests must be read-only for 72.1.3-I3.");

  const ruleKeys = new Set<string>();
  for (const rule of manifest.rules) {
    const key = `${rule.identifier.value}@${rule.identifier.version}`;
    if (ruleKeys.has(key)) errors.push(`Duplicate rule definition found: ${key}`);
    ruleKeys.add(key);
  }

  return { valid: errors.length === 0, errors };
}
