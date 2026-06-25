import { CERTIFIED_RULE_CATALOG } from "../../rule-registry/catalog";
import type { GovernanceManifest } from "../domain";

export const BASELINE_71_5_GOVERNANCE_MANIFEST: GovernanceManifest = {
  schemaVersion: "1.0.0",
  manifestId: "DENTALOPERIX_GOVERNANCE_MANIFEST_71_5_RC",
  metadata: {
    generatedAt: "2026-06-25T00:00:00.000Z",
    generatedBy: "DentalOperix Governance Platform 72.1.3-I3",
    documentationPackage: "DENTALOPERIX_72_1_3_DOCUMENTATION_AUDITED_UPDATED_PACKAGE.zip",
    notes: [
      "Manifest integration is read-only.",
      "Rules are sourced from the certified 72.1.3-I2 Rule Registry catalog.",
    ],
  },
  baseline: {
    identifier: "DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE",
    version: "DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE",
    label: "71.5 Release Candidate",
    releaseType: "release-candidate",
    certificationStatus: "RELEASE_CANDIDATE",
  },
  rules: CERTIFIED_RULE_CATALOG,
  compatibilityMatrix: {
    compatibleSdkVersions: ["72.1.1"],
    compatibleValidationEngineVersions: ["72.1.2"],
    compatibleRuleRegistryVersions: ["72.1.3-I2"],
    compatibleBaselineVersions: ["DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE"],
  },
  validationProfile: {
    profileId: "DGF-GPRA-BASELINE-COMPLIANCE-READONLY",
    requiredRuleStatuses: ["certified"],
    requiredEvidence: [
      "Architecture Conformance Review",
      "Baseline Compliance Review",
      "Governance Validation",
      "Validation Evidence",
    ],
    readOnly: true,
  },
  certification: {
    status: "approved",
    evidenceArtifacts: [
      "PROGRAM_72_1_3_I1_DOMAIN_FOUNDATION_CERTIFICATION",
      "PROGRAM_72_1_3_I2_RULE_REGISTRY_INFRASTRUCTURE_CERTIFICATION",
    ],
  },
} as const;
