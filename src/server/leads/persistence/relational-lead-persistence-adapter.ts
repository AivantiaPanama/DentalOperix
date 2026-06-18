import type {
  LeadPersistenceAppendInput,
  LeadPersistenceHealth,
  LeadPersistencePort,
  LeadPersistenceUpdateInput,
} from "./lead-persistence-port";
import { LeadPersistenceNotConfiguredError } from "./lead-persistence-port";

export class RelationalLeadPersistenceAdapter implements LeadPersistencePort {
  readonly mode = "relational-db" as const;

  async appendLead(_input: LeadPersistenceAppendInput) {
    throw new LeadPersistenceNotConfiguredError(
      "Relational Lead persistence is intentionally not active. 57.x requires explicit cutover approval before writes are enabled.",
    );
  }

  async updateLead(_id: string, _update: LeadPersistenceUpdateInput): Promise<void> {
    throw new LeadPersistenceNotConfiguredError(
      "Relational Lead persistence is intentionally not active. 57.x requires explicit cutover approval before updates are enabled.",
    );
  }

  async listLeads() {
    throw new LeadPersistenceNotConfiguredError(
      "Relational Lead persistence is intentionally not active. 57.x requires explicit cutover approval before reads are enabled.",
    );
  }

  getHealth(): LeadPersistenceHealth {
    return {
      mode: this.mode,
      writable: false,
      active: false,
      sourceOfTruth: "Leads",
      physicalPersistence: "Relational Database",
      notes: [
        "Future persistence adapter placeholder for 57.x.",
        "Not wired into operational flows.",
        "Must not be used for dual write.",
      ],
    };
  }
}

export const relationalLeadPersistenceAdapter = new RelationalLeadPersistenceAdapter();
