import type { GovernanceManifest } from "../../manifest/domain";
import type {
  ManifestCompatibilityRule,
  ManifestCompatibilityStatus,
  ManifestValidationContext,
  ManifestValidationIssue,
  ManifestValidationReport,
  ManifestValidationSummary,
} from "../domain";
import { DEFAULT_MANIFEST_COMPATIBILITY_RULES } from "../rules";

export interface ManifestValidationEngineOptions {
  readonly compatibilityRules?: readonly ManifestCompatibilityRule[];
  readonly supportedSchemaVersions?: readonly string[];
  readonly supportedBaselineVersions?: readonly string[];
  readonly requiredGovernanceCapabilities?: readonly string[];
  readonly clock?: () => string;
}

const DEFAULT_SUPPORTED_SCHEMA_VERSIONS = ["1.0.0"] as const;
const DEFAULT_SUPPORTED_BASELINE_VERSIONS = [
  "DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE",
] as const;
const DEFAULT_REQUIRED_GOVERNANCE_CAPABILITIES = [
  "72.1.1",
  "72.1.2",
  "72.1.3-I2",
  "DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE",
] as const;

const summarizeIssues = (issues: readonly ManifestValidationIssue[]): ManifestValidationSummary => {
  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;
  const infoCount = issues.filter((issue) => issue.severity === "info").length;

  return {
    issueCount: issues.length,
    errorCount,
    warningCount,
    infoCount,
  };
};

const resolveCompatibilityStatus = (
  summary: ManifestValidationSummary,
): ManifestCompatibilityStatus => {
  if (summary.errorCount > 0) return "incompatible";
  if (summary.warningCount > 0) return "compatible-with-warnings";
  return "compatible";
};

export class ManifestValidationEngine {
  private readonly compatibilityRules: readonly ManifestCompatibilityRule[];
  private readonly supportedSchemaVersions: readonly string[];
  private readonly supportedBaselineVersions: readonly string[];
  private readonly requiredGovernanceCapabilities: readonly string[];
  private readonly clock: () => string;

  constructor(options: ManifestValidationEngineOptions = {}) {
    this.compatibilityRules = options.compatibilityRules ?? DEFAULT_MANIFEST_COMPATIBILITY_RULES;
    this.supportedSchemaVersions =
      options.supportedSchemaVersions ?? DEFAULT_SUPPORTED_SCHEMA_VERSIONS;
    this.supportedBaselineVersions =
      options.supportedBaselineVersions ?? DEFAULT_SUPPORTED_BASELINE_VERSIONS;
    this.requiredGovernanceCapabilities =
      options.requiredGovernanceCapabilities ?? DEFAULT_REQUIRED_GOVERNANCE_CAPABILITIES;
    this.clock = options.clock ?? (() => new Date().toISOString());
  }

  validate(manifest: GovernanceManifest): ManifestValidationReport {
    const evaluatedAt = this.clock();
    const context: ManifestValidationContext = {
      supportedSchemaVersions: this.supportedSchemaVersions,
      supportedBaselineVersions: this.supportedBaselineVersions,
      requiredGovernanceCapabilities: this.requiredGovernanceCapabilities,
      evaluatedAt,
    };

    const issues = this.compatibilityRules.flatMap((rule) => rule.evaluate(manifest, context));
    const summary = summarizeIssues(issues);
    const compatibilityStatus = resolveCompatibilityStatus(summary);

    return {
      manifestId: manifest.manifestId,
      baselineVersion: manifest.baseline.version,
      compatibilityStatus,
      valid: compatibilityStatus !== "incompatible",
      readOnly: true,
      evaluatedAt,
      summary,
      issues,
    };
  }
}
