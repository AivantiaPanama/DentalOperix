import type { ValidationContext } from "../sdk";
import type {
  ValidationExecutionCategory,
  ValidationExecutionContext,
} from "../execution/validation-execution-types";

const DEFAULT_CATEGORIES: readonly ValidationExecutionCategory[] = [
  "architecture",
  "governance",
  "documentation",
  "compliance",
];

export class ValidationSession {
  static create(
    context: ValidationContext,
    categories: readonly ValidationExecutionCategory[] = DEFAULT_CATEGORIES,
  ): ValidationExecutionContext {
    const executionStartedAt = new Date().toISOString();

    return {
      ...context,
      sessionId: `${context.programId}-${context.incrementId}-${executionStartedAt}`,
      categories: [...categories],
      executionStartedAt,
    };
  }
}
