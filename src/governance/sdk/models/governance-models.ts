export type ComplianceStatus = "PASS" | "FAIL" | "WARNING" | "NOT_APPLICABLE";

export type GovernanceSeverity = "info" | "low" | "medium" | "high" | "critical";

export interface BaselineDescriptor {
  readonly baselineId: string;
  readonly releaseCandidate: boolean;
  readonly certifiedArchitectures: readonly string[];
  readonly protectedComponents: readonly string[];
}

export interface ADRDescriptor {
  readonly adrId: string;
  readonly title: string;
  readonly status: "proposed" | "approved" | "superseded" | "rejected";
  readonly supersedes?: string;
}

export interface RegistryDescriptor {
  readonly registryId: string;
  readonly sdkVersion: string;
  readonly registeredValidators: readonly string[];
}

export interface GovernanceEvidence {
  readonly evidenceId: string;
  readonly generatedAt: string;
  readonly source: string;
  readonly summary: string;
  readonly artifacts: readonly string[];
}

export interface GovernanceFinding {
  readonly findingId: string;
  readonly ruleId: string;
  readonly status: ComplianceStatus;
  readonly severity: GovernanceSeverity;
  readonly message: string;
  readonly evidence?: GovernanceEvidence;
}

export interface ValidationContext {
  readonly programId: string;
  readonly incrementId: string;
  readonly baseline: BaselineDescriptor;
  readonly checkedAt: string;
  readonly metadata?: Readonly<Record<string, string>>;
}

export interface ValidationResult {
  readonly validatorId: string;
  readonly status: ComplianceStatus;
  readonly findings: readonly GovernanceFinding[];
  readonly evidence: readonly GovernanceEvidence[];
}

export interface ValidationReport {
  readonly reportId: string;
  readonly sdkVersion: string;
  readonly context: ValidationContext;
  readonly status: ComplianceStatus;
  readonly results: readonly ValidationResult[];
  readonly generatedAt: string;
}
