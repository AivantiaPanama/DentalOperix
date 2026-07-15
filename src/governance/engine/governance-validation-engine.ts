import type {
  IEvidenceProvider,
  IRegistryProvider,
  IValidationEngine,
  ValidationContext,
  ValidationReport,
} from "../sdk";
import { aggregateComplianceStatus } from "../sdk";
import type { ValidationExecutionResult } from "../execution/validation-execution-types";
import { ValidationPipeline } from "./validation-pipeline";
import { ValidationSession } from "./validation-session";
import { PipelineRunner } from "../runner/pipeline-runner";
import { ComplianceReportGenerator } from "../reporting/compliance-report-generator";

export class GovernanceValidationEngine implements IValidationEngine {
  private readonly pipeline: ValidationPipeline;

  constructor(
    registry: IRegistryProvider,
    private readonly evidenceProvider?: IEvidenceProvider,
    private readonly pipelineRunner = new PipelineRunner(),
    private readonly reportGenerator = new ComplianceReportGenerator(),
  ) {
    this.pipeline = new ValidationPipeline(registry);
  }

  async run(context: ValidationContext): Promise<ValidationReport> {
    return (await this.execute(context)).report;
  }

  async execute(context: ValidationContext): Promise<ValidationExecutionResult> {
    const session = ValidationSession.create(context);
    const validators = this.pipeline.listValidators();
    const results = await this.pipelineRunner.run(validators, session);
    const collectedEvidence = this.evidenceProvider
      ? await this.evidenceProvider.collect(session)
      : [];
    const resultEvidence = results.flatMap((result) => [...result.evidence]);
    const evidence = [...collectedEvidence, ...resultEvidence];
    const report = this.reportGenerator.generate(session, results);
    const completedAt = new Date().toISOString();

    return {
      sessionId: session.sessionId,
      status: aggregateComplianceStatus(results),
      startedAt: session.executionStartedAt,
      completedAt,
      executedValidators: validators.map((validator) => validator.validatorId),
      skippedValidators: [],
      results,
      evidence,
      report,
    };
  }
}
