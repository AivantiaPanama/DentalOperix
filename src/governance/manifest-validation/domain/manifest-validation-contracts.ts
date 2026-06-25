import type { GovernanceManifest } from "../../manifest/domain";

export type ManifestValidationIssueSeverity = "info" | "warning" | "error";

export interface ManifestValidationIssue {
  readonly code: string;
  readonly message: string;
  readonly severity: ManifestValidationIssueSeverity;
  readonly path?: string;
  readonly ruleId?: string;
}

export type ManifestCompatibilityStatus =
  | "compatible"
  | "compatible-with-warnings"
  | "incompatible";

export interface ManifestValidationSummary {
  readonly issueCount: number;
  readonly errorCount: number;
  readonly warningCount: number;
  readonly infoCount: number;
}

export interface ManifestValidationReport {
  readonly manifestId: string;
  readonly baselineVersion: string;
  readonly compatibilityStatus: ManifestCompatibilityStatus;
  readonly valid: boolean;
  readonly readOnly: true;
  readonly evaluatedAt: string;
  readonly summary: ManifestValidationSummary;
  readonly issues: readonly ManifestValidationIssue[];
}

export interface ManifestValidationContext {
  readonly supportedSchemaVersions: readonly string[];
  readonly supportedBaselineVersions: readonly string[];
  readonly requiredGovernanceCapabilities: readonly string[];
  readonly evaluatedAt: string;
}

export interface ManifestCompatibilityRule {
  readonly ruleId: string;
  readonly description: string;
  evaluate(
    manifest: GovernanceManifest,
    context: ManifestValidationContext,
  ): readonly ManifestValidationIssue[];
}
