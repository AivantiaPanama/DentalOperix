import type { BaselineCertificationStatus, BaselineReleaseType } from "../enums";
import type { BaselineVersion } from "../value-objects/baseline-version";
import type { RuleIdentifier } from "../value-objects/rule-identifier";

export interface BaselineDescriptorMetadata {
  readonly createdAt: string;
  readonly updatedAt?: string;
  readonly documentationPackage?: string;
  readonly notes?: readonly string[];
}

export interface BaselineDescriptor {
  readonly identifier: string;
  readonly version: BaselineVersion;
  readonly releaseType: BaselineReleaseType;
  readonly certificationStatus: BaselineCertificationStatus;
  readonly certifiedArchitectures: readonly string[];
  readonly protectedComponents: readonly string[];
  readonly governanceRestrictions: readonly string[];
  readonly requiredRules: readonly RuleIdentifier[];
  readonly metadata: BaselineDescriptorMetadata;
}
