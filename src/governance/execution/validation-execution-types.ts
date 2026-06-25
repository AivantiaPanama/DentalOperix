import type {
  ComplianceStatus,
  GovernanceEvidence,
  ValidationContext,
  ValidationReport,
  ValidationResult,
} from "../sdk";

export type ValidationExecutionCategory = "architecture" | "governance" | "documentation" | "compliance";

export interface ValidationExecutionContext extends ValidationContext {
  readonly sessionId: string;
  readonly categories: readonly ValidationExecutionCategory[];
  readonly executionStartedAt: string;
}

export interface ValidationExecutionResult {
  readonly sessionId: string;
  readonly status: ComplianceStatus;
  readonly startedAt: string;
  readonly completedAt: string;
  readonly executedValidators: readonly string[];
  readonly skippedValidators: readonly string[];
  readonly results: readonly ValidationResult[];
  readonly evidence: readonly GovernanceEvidence[];
  readonly report: ValidationReport;
}
