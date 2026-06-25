import type { IEvidenceProvider } from "../contracts/governance-contracts";
import type { GovernanceEvidence, ValidationContext } from "../models/governance-models";

export class StaticEvidenceProvider implements IEvidenceProvider {
  constructor(private readonly evidence: readonly GovernanceEvidence[]) {}

  collect(_context: ValidationContext): readonly GovernanceEvidence[] {
    return this.evidence;
  }
}
