export type ComplianceStatus = "PASS" | "WARNING" | "FAIL";

export type GovernanceDecision = "COMPLIANT" | "REVIEW_REQUIRED" | "NON_COMPLIANT";

export type RuleSeverity = "info" | "low" | "medium" | "high" | "critical";

export type BaselineCertificationStatus = "RELEASE_CANDIDATE" | "CERTIFIED" | "DEPRECATED";

export type BaselineReleaseType = "release-candidate" | "certified-baseline" | "governance-baseline";
