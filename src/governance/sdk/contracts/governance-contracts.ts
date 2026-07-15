import type {
  GovernanceEvidence,
  ValidationContext,
  ValidationReport,
  ValidationResult,
} from "../models/governance-models";

export interface IValidator {
  readonly validatorId: string;
  readonly version: string;
  validate(context: ValidationContext): Promise<ValidationResult> | ValidationResult;
}

export interface IValidationEngine {
  run(context: ValidationContext): Promise<ValidationReport>;
}

export interface IReportGenerator {
  generate(context: ValidationContext, results: readonly ValidationResult[]): ValidationReport;
}

export interface IEvidenceProvider {
  collect(
    context: ValidationContext,
  ): Promise<readonly GovernanceEvidence[]> | readonly GovernanceEvidence[];
}

export interface IRegistryProvider {
  register(validator: IValidator): void;
  unregister(validatorId: string): void;
  get(validatorId: string): IValidator | undefined;
  list(): readonly IValidator[];
}

export interface IComplianceRule {
  readonly ruleId: string;
  readonly description: string;
  evaluate(context: ValidationContext): Promise<ValidationResult> | ValidationResult;
}
