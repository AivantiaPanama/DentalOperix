import type { IRegistryProvider, IValidator } from "../sdk";

export class ValidationPipeline {
  constructor(private readonly registry: IRegistryProvider) {}

  listValidators(): readonly IValidator[] {
    return [...this.registry.list()].sort((left, right) =>
      left.validatorId.localeCompare(right.validatorId),
    );
  }
}
