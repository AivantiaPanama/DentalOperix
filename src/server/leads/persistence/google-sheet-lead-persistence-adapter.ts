import { appendLeadToSheet, readLeadsFromSheet, updateLeadInSheet } from "@/server/google/crm";
import type {
  LeadPersistenceAppendInput,
  LeadPersistenceHealth,
  LeadPersistencePort,
  LeadPersistenceUpdateInput,
  LeadPersistenceWriteResult,
} from "./lead-persistence-port";

function isGoogleSheetRollbackApproved(): boolean {
  return (
    process.env.LEADS_PERSISTENCE_MODE === "google-sheet" &&
    process.env.GOOGLE_SHEETS_ROLLBACK_APPROVED === "true"
  );
}

function assertGoogleSheetRollbackApproved(): void {
  if (!isGoogleSheetRollbackApproved()) {
    throw new Error(
      "Google Sheet Lead persistence is restricted to explicitly approved rollback mode.",
    );
  }
}

export class GoogleSheetLeadPersistenceAdapter implements LeadPersistencePort {
  readonly mode = "google-sheet" as const;

  async appendLead(input: LeadPersistenceAppendInput): Promise<LeadPersistenceWriteResult> {
    assertGoogleSheetRollbackApproved();
    return appendLeadToSheet(input);
  }

  async updateLead(id: string, update: LeadPersistenceUpdateInput): Promise<void> {
    assertGoogleSheetRollbackApproved();
    await updateLeadInSheet(id, update);
  }

  async listLeads() {
    assertGoogleSheetRollbackApproved();
    return readLeadsFromSheet();
  }

  getHealth(): LeadPersistenceHealth {
    return {
      mode: this.mode,
      writable: isGoogleSheetRollbackApproved(),
      active: isGoogleSheetRollbackApproved(),
      sourceOfTruth: "Leads",
      physicalPersistence: "Google Sheet",
      notes: [
        "Restricted rollback adapter only; not active after 57.x production cutover unless explicitly approved.",
        "Must not be used for dual write or as a parallel Source of Truth.",
      ],
    };
  }
}

export const googleSheetLeadPersistenceAdapter = new GoogleSheetLeadPersistenceAdapter();
