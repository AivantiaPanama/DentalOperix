import type { IRegistryProvider, IValidator } from "../contracts/governance-contracts";
import type { RegistryDescriptor } from "../models/governance-models";
import { GOVERNANCE_SDK_VERSION } from "../version/governance-version";

export class ValidatorRegistry implements IRegistryProvider {
  private readonly validators = new Map<string, IValidator>();

  register(validator: IValidator): void {
    if (!validator.validatorId.trim()) {
      throw new Error("validatorId is required");
    }

    if (this.validators.has(validator.validatorId)) {
      throw new Error(`Validator already registered: ${validator.validatorId}`);
    }

    this.validators.set(validator.validatorId, validator);
  }

  unregister(validatorId: string): void {
    this.validators.delete(validatorId);
  }

  get(validatorId: string): IValidator | undefined {
    return this.validators.get(validatorId);
  }

  list(): readonly IValidator[] {
    return [...this.validators.values()];
  }

  describe(registryId = "governance-sdk-validator-registry"): RegistryDescriptor {
    return {
      registryId,
      sdkVersion: GOVERNANCE_SDK_VERSION,
      registeredValidators: [...this.validators.keys()].sort(),
    };
  }
}
