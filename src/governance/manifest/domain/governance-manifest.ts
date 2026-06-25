import type { BaselineCertificationStatus, BaselineReleaseType } from "../../baseline/domain";
import type { RuleDefinition } from "../../rule-registry/domain";

export interface ManifestMetadata {
  readonly generatedAt: string;
  readonly generatedBy: string;
  readonly documentationPackage: string;
  readonly notes?: readonly string[];
}

export interface ManifestBaselineMetadata {
  readonly identifier: string;
  readonly version: string;
  readonly label?: string;
  readonly releaseType: BaselineReleaseType;
  readonly certificationStatus: BaselineCertificationStatus;
}

export interface ManifestCompatibilityMatrix {
  readonly compatibleSdkVersions: readonly string[];
  readonly compatibleValidationEngineVersions: readonly string[];
  readonly compatibleRuleRegistryVersions: readonly string[];
  readonly compatibleBaselineVersions: readonly string[];
}

export interface ManifestValidationProfile {
  readonly profileId: string;
  readonly requiredRuleStatuses: readonly string[];
  readonly requiredEvidence: readonly string[];
  readonly readOnly: boolean;
}

export interface ManifestCertificationMetadata {
  readonly status: "draft" | "approved" | "certified" | "deprecated";
  readonly certifiedBy?: string;
  readonly certifiedAt?: string;
  readonly evidenceArtifacts: readonly string[];
}

export interface GovernanceManifest {
  readonly schemaVersion: string;
  readonly manifestId: string;
  readonly metadata: ManifestMetadata;
  readonly baseline: ManifestBaselineMetadata;
  readonly rules: readonly RuleDefinition[];
  readonly compatibilityMatrix: ManifestCompatibilityMatrix;
  readonly validationProfile: ManifestValidationProfile;
  readonly certification: ManifestCertificationMetadata;
}
