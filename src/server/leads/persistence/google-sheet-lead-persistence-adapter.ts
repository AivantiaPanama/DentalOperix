import {
  appendLeadToSheet,
  readLeadsFromSheet,
  updateLeadInSheet,
} from "@/server/google/crm";
import type {
  LeadPersistenceAppendInput,
  LeadPersistenceHealth,
  LeadPersistencePort,
  LeadPersistenceUpdateInput,
  LeadPersistenceWriteResult,
} from "./lead-persistence-port";

export class GoogleSheetLeadPersistenceAdapter implements LeadPersistencePort {
  readonly mode = "google-sheet" as const;

  async appendLead(input: LeadPersistenceAppendInput): Promise<LeadPersistenceWriteResult> {
    return appendLeadToSheet(input);
  }

  async updateLead(id: string, update: LeadPersistenceUpdateInput): Promise<void> {
    await updateLeadInSheet(id, update);
  }

  async listLeads() {
    return readLeadsFromSheet();
  }

  getHealth(): LeadPersistenceHealth {
    return {
      mode: this.mode,
      writable: true,
      active: true,
      sourceOfTruth: "Leads",
      physicalPersistence: "Google Sheet",
      notes: [
        "Current active persistence for Leads.",
        "Maintains the existing operational flow without dual write.",
      ],
    };
  }
}

export const googleSheetLeadPersistenceAdapter = new GoogleSheetLeadPersistenceAdapter();
