import type { IValidator, ValidationContext, ValidationResult } from "../sdk";

export class ValidatorRunner {
  async run(validator: IValidator, context: ValidationContext): Promise<ValidationResult> {
    return validator.validate(context);
  }
}
