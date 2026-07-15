import type { IValidator, ValidationContext, ValidationResult } from "../sdk";
import { ValidatorRunner } from "./validator-runner";

export class PipelineRunner {
  constructor(private readonly validatorRunner = new ValidatorRunner()) {}

  async run(
    validators: readonly IValidator[],
    context: ValidationContext,
  ): Promise<readonly ValidationResult[]> {
    const results: ValidationResult[] = [];

    for (const validator of validators) {
      results.push(await this.validatorRunner.run(validator, context));
    }

    return results;
  }
}
