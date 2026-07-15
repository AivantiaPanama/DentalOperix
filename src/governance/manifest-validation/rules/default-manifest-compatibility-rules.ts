import type { GovernanceManifest } from "../../manifest/domain";
import { createRuleKey } from "../../rule-registry/domain";
import type {
  ManifestCompatibilityRule,
  ManifestValidationContext,
  ManifestValidationIssue,
  ManifestValidationIssueSeverity,
} from "../domain";

const issue = (
  code: string,
  message: string,
  severity: ManifestValidationIssueSeverity,
  path?: string,
  ruleId?: string,
): ManifestValidationIssue => ({ code, message, severity, path, ruleId });

const isBlank = (value: string | undefined): boolean => !value || value.trim().length === 0;

const requiredCapabilityMatrixKeys = [
  "compatibleSdkVersions",
  "compatibleValidationEngineVersions",
  "compatibleRuleRegistryVersions",
  "compatibleBaselineVersions",
] as const;

export const manifestStructureRule: ManifestCompatibilityRule = {
  ruleId: "manifest.structure.required-fields",
  description:
    "Validates required GovernanceManifest structural fields without mutating the manifest.",
  evaluate(manifest: GovernanceManifest): readonly ManifestValidationIssue[] {
    const issues: ManifestValidationIssue[] = [];

    if (isBlank(manifest.schemaVersion)) {
      issues.push(
        issue(
          "MANIFEST_SCHEMA_VERSION_REQUIRED",
          "Manifest schemaVersion is required.",
          "error",
          "schemaVersion",
        ),
      );
    }

    if (isBlank(manifest.manifestId)) {
      issues.push(
        issue("MANIFEST_ID_REQUIRED", "Manifest manifestId is required.", "error", "manifestId"),
      );
    }

    if (isBlank(manifest.metadata.generatedAt)) {
      issues.push(
        issue(
          "MANIFEST_GENERATED_AT_REQUIRED",
          "Manifest metadata.generatedAt is required.",
          "error",
          "metadata.generatedAt",
        ),
      );
    }

    if (isBlank(manifest.metadata.generatedBy)) {
      issues.push(
        issue(
          "MANIFEST_GENERATED_BY_REQUIRED",
          "Manifest metadata.generatedBy is required.",
          "error",
          "metadata.generatedBy",
        ),
      );
    }

    if (isBlank(manifest.metadata.documentationPackage)) {
      issues.push(
        issue(
          "MANIFEST_DOCUMENTATION_PACKAGE_REQUIRED",
          "Manifest metadata.documentationPackage is required.",
          "error",
          "metadata.documentationPackage",
        ),
      );
    }

    if (isBlank(manifest.baseline.identifier)) {
      issues.push(
        issue(
          "MANIFEST_BASELINE_IDENTIFIER_REQUIRED",
          "Manifest baseline.identifier is required.",
          "error",
          "baseline.identifier",
        ),
      );
    }

    if (isBlank(manifest.baseline.version)) {
      issues.push(
        issue(
          "MANIFEST_BASELINE_VERSION_REQUIRED",
          "Manifest baseline.version is required.",
          "error",
          "baseline.version",
        ),
      );
    }

    if (manifest.rules.length === 0) {
      issues.push(
        issue(
          "MANIFEST_RULES_REQUIRED",
          "Manifest must contain at least one governance rule.",
          "error",
          "rules",
        ),
      );
    }

    return issues;
  },
};

export const manifestVersionCompatibilityRule: ManifestCompatibilityRule = {
  ruleId: "manifest.version.compatibility",
  description:
    "Validates declared manifest schema and baseline versions against the approved compatibility context.",
  evaluate(
    manifest: GovernanceManifest,
    context: ManifestValidationContext,
  ): readonly ManifestValidationIssue[] {
    const issues: ManifestValidationIssue[] = [];

    if (!context.supportedSchemaVersions.includes(manifest.schemaVersion)) {
      issues.push(
        issue(
          "MANIFEST_SCHEMA_VERSION_UNSUPPORTED",
          `Manifest schemaVersion '${manifest.schemaVersion}' is not supported by this validator context.`,
          "error",
          "schemaVersion",
        ),
      );
    }

    if (!context.supportedBaselineVersions.includes(manifest.baseline.version)) {
      issues.push(
        issue(
          "MANIFEST_BASELINE_VERSION_UNSUPPORTED",
          `Manifest baseline version '${manifest.baseline.version}' is not supported by this validator context.`,
          "error",
          "baseline.version",
        ),
      );
    }

    if (
      !manifest.compatibilityMatrix.compatibleBaselineVersions.includes(manifest.baseline.version)
    ) {
      issues.push(
        issue(
          "MANIFEST_BASELINE_NOT_DECLARED_COMPATIBLE",
          "Manifest baseline.version must be declared in compatibilityMatrix.compatibleBaselineVersions.",
          "error",
          "compatibilityMatrix.compatibleBaselineVersions",
        ),
      );
    }

    return issues;
  },
};

export const manifestReadOnlyRule: ManifestCompatibilityRule = {
  ruleId: "manifest.readonly.enforcement",
  description:
    "Ensures the manifest validation profile remains read-only for certified governance boundaries.",
  evaluate(manifest: GovernanceManifest): readonly ManifestValidationIssue[] {
    if (manifest.validationProfile.readOnly) return [];

    return [
      issue(
        "MANIFEST_PROFILE_MUST_BE_READONLY",
        "Governance manifests must declare validationProfile.readOnly as true.",
        "error",
        "validationProfile.readOnly",
      ),
    ];
  },
};

export const manifestCompatibilityMatrixRule: ManifestCompatibilityRule = {
  ruleId: "manifest.compatibility-matrix.required-capabilities",
  description:
    "Validates compatibility matrix declarations for SDK, validation engine, rule registry, and baseline versions.",
  evaluate(
    manifest: GovernanceManifest,
    context: ManifestValidationContext,
  ): readonly ManifestValidationIssue[] {
    const issues: ManifestValidationIssue[] = [];

    for (const key of requiredCapabilityMatrixKeys) {
      if (manifest.compatibilityMatrix[key].length === 0) {
        issues.push(
          issue(
            "MANIFEST_COMPATIBILITY_DECLARATION_REQUIRED",
            `Manifest compatibilityMatrix.${key} must declare at least one compatible version.`,
            "error",
            `compatibilityMatrix.${key}`,
          ),
        );
      }
    }

    for (const capability of context.requiredGovernanceCapabilities) {
      const supported =
        manifest.compatibilityMatrix.compatibleSdkVersions.includes(capability) ||
        manifest.compatibilityMatrix.compatibleValidationEngineVersions.includes(capability) ||
        manifest.compatibilityMatrix.compatibleRuleRegistryVersions.includes(capability) ||
        manifest.compatibilityMatrix.compatibleBaselineVersions.includes(capability);

      if (!supported) {
        issues.push(
          issue(
            "MANIFEST_REQUIRED_CAPABILITY_MISSING",
            `Required governance capability '${capability}' is not declared in the manifest compatibility matrix.`,
            "error",
            "compatibilityMatrix",
          ),
        );
      }
    }

    return issues;
  },
};

export const manifestRuleDefinitionRule: ManifestCompatibilityRule = {
  ruleId: "manifest.rules.required-fields",
  description:
    "Validates rule definitions embedded in the manifest without executing governance rules.",
  evaluate(manifest: GovernanceManifest): readonly ManifestValidationIssue[] {
    const issues: ManifestValidationIssue[] = [];

    manifest.rules.forEach((rule, index) => {
      const path = `rules[${index}]`;
      const ruleKey = createRuleKey(rule.identifier);

      if (isBlank(rule.identifier.value)) {
        issues.push(
          issue(
            "MANIFEST_RULE_IDENTIFIER_REQUIRED",
            "Rule identifier.value is required.",
            "error",
            `${path}.identifier.value`,
            ruleKey,
          ),
        );
      }

      if (isBlank(rule.identifier.version)) {
        issues.push(
          issue(
            "MANIFEST_RULE_IDENTIFIER_VERSION_REQUIRED",
            "Rule identifier.version is required.",
            "error",
            `${path}.identifier.version`,
            ruleKey,
          ),
        );
      }

      if (isBlank(rule.name)) {
        issues.push(
          issue(
            "MANIFEST_RULE_NAME_REQUIRED",
            "Rule name is required.",
            "error",
            `${path}.name`,
            ruleKey,
          ),
        );
      }

      if (isBlank(rule.description)) {
        issues.push(
          issue(
            "MANIFEST_RULE_DESCRIPTION_REQUIRED",
            "Rule description is required.",
            "error",
            `${path}.description`,
            ruleKey,
          ),
        );
      }

      if (isBlank(rule.objective)) {
        issues.push(
          issue(
            "MANIFEST_RULE_OBJECTIVE_REQUIRED",
            "Rule objective is required.",
            "error",
            `${path}.objective`,
            ruleKey,
          ),
        );
      }

      if (isBlank(rule.evaluationCriteria.summary)) {
        issues.push(
          issue(
            "MANIFEST_RULE_EVALUATION_SUMMARY_REQUIRED",
            "Rule evaluationCriteria.summary is required.",
            "error",
            `${path}.evaluationCriteria.summary`,
            ruleKey,
          ),
        );
      }

      if (isBlank(rule.evaluationCriteria.expectedResult)) {
        issues.push(
          issue(
            "MANIFEST_RULE_EXPECTED_RESULT_REQUIRED",
            "Rule evaluationCriteria.expectedResult is required.",
            "error",
            `${path}.evaluationCriteria.expectedResult`,
            ruleKey,
          ),
        );
      }

      if (isBlank(rule.version.value)) {
        issues.push(
          issue(
            "MANIFEST_RULE_VERSION_REQUIRED",
            "Rule version.value is required.",
            "error",
            `${path}.version.value`,
            ruleKey,
          ),
        );
      }

      if (rule.requiredEvidence.length === 0) {
        issues.push(
          issue(
            "MANIFEST_RULE_EVIDENCE_REQUIRED",
            "Rule requiredEvidence must declare at least one evidence artifact.",
            "error",
            `${path}.requiredEvidence`,
            ruleKey,
          ),
        );
      }
    });

    return issues;
  },
};

export const manifestDuplicateRuleIdentifierRule: ManifestCompatibilityRule = {
  ruleId: "manifest.rules.duplicate-identifiers",
  description: "Detects duplicate rule identifiers in a manifest before registry adaptation.",
  evaluate(manifest: GovernanceManifest): readonly ManifestValidationIssue[] {
    const issues: ManifestValidationIssue[] = [];
    const seenRuleKeys = new Set<string>();

    manifest.rules.forEach((rule, index) => {
      const ruleKey = createRuleKey(rule.identifier);
      if (seenRuleKeys.has(ruleKey)) {
        issues.push(
          issue(
            "MANIFEST_DUPLICATE_RULE_IDENTIFIER",
            `Duplicate rule definition found in manifest: ${ruleKey}.`,
            "error",
            `rules[${index}].identifier`,
            ruleKey,
          ),
        );
      }
      seenRuleKeys.add(ruleKey);
    });

    return issues;
  },
};

export const manifestAllowedRuleStatusRule: ManifestCompatibilityRule = {
  ruleId: "manifest.rules.allowed-lifecycle-status",
  description: "Validates manifest rule lifecycle status against the manifest validation profile.",
  evaluate(manifest: GovernanceManifest): readonly ManifestValidationIssue[] {
    const allowedStatuses = manifest.validationProfile.requiredRuleStatuses;
    if (allowedStatuses.length === 0) {
      return [
        issue(
          "MANIFEST_REQUIRED_RULE_STATUSES_MISSING",
          "Manifest validationProfile.requiredRuleStatuses must declare at least one allowed rule status.",
          "error",
          "validationProfile.requiredRuleStatuses",
        ),
      ];
    }

    return manifest.rules.flatMap((rule, index) => {
      if (allowedStatuses.includes(rule.lifecycleStatus)) return [];

      return [
        issue(
          "MANIFEST_RULE_STATUS_NOT_ALLOWED",
          `Rule lifecycleStatus '${rule.lifecycleStatus}' is not allowed by the manifest validation profile.`,
          "error",
          `rules[${index}].lifecycleStatus`,
          createRuleKey(rule.identifier),
        ),
      ];
    });
  },
};

export const manifestRuleDependencyRule: ManifestCompatibilityRule = {
  ruleId: "manifest.rules.dependency-references",
  description:
    "Validates that rule dependency references resolve to rules declared in the same manifest.",
  evaluate(manifest: GovernanceManifest): readonly ManifestValidationIssue[] {
    const declaredRuleKeys = new Set(manifest.rules.map((rule) => createRuleKey(rule.identifier)));

    return manifest.rules.flatMap((rule, ruleIndex) => {
      const sourceRuleKey = createRuleKey(rule.identifier);

      return rule.dependencies.flatMap((dependency, dependencyIndex) => {
        const dependencyKey = createRuleKey(dependency);
        if (declaredRuleKeys.has(dependencyKey)) return [];

        return [
          issue(
            "MANIFEST_RULE_DEPENDENCY_UNRESOLVED",
            `Rule dependency '${dependencyKey}' is not declared in the manifest.`,
            "error",
            `rules[${ruleIndex}].dependencies[${dependencyIndex}]`,
            sourceRuleKey,
          ),
        ];
      });
    });
  },
};

export const DEFAULT_MANIFEST_COMPATIBILITY_RULES: readonly ManifestCompatibilityRule[] = [
  manifestStructureRule,
  manifestVersionCompatibilityRule,
  manifestReadOnlyRule,
  manifestCompatibilityMatrixRule,
  manifestRuleDefinitionRule,
  manifestDuplicateRuleIdentifierRule,
  manifestAllowedRuleStatusRule,
  manifestRuleDependencyRule,
] as const;
