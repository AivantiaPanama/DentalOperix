import type { LeadPersistenceMode, LeadPersistencePort } from "./lead-persistence-port";
import { googleSheetLeadPersistenceAdapter } from "./google-sheet-lead-persistence-adapter";
import { relationalLeadPersistenceAdapter } from "./relational-lead-persistence-adapter";

const DEFAULT_LEAD_PERSISTENCE_MODE: LeadPersistenceMode = "relational-db";

function normalizeLeadPersistenceMode(raw: string | undefined): LeadPersistenceMode {
  if (raw === "google-sheet") return "google-sheet";
  return DEFAULT_LEAD_PERSISTENCE_MODE;
}

export function getConfiguredLeadPersistenceMode(): LeadPersistenceMode {
  return normalizeLeadPersistenceMode(process.env.LEADS_PERSISTENCE_MODE);
}

export function isGoogleSheetRollbackApproved(): boolean {
  return (
    process.env.LEADS_PERSISTENCE_MODE === "google-sheet" &&
    process.env.GOOGLE_SHEETS_ROLLBACK_APPROVED === "true"
  );
}

export function getLeadPersistenceAdapter(
  mode: LeadPersistenceMode = getConfiguredLeadPersistenceMode(),
): LeadPersistencePort {
  if (mode === "google-sheet") return googleSheetLeadPersistenceAdapter;
  return relationalLeadPersistenceAdapter;
}

export function getActiveLeadPersistenceAdapter(): LeadPersistencePort {
  const mode = getConfiguredLeadPersistenceMode();

  if (mode === "google-sheet" && isGoogleSheetRollbackApproved()) {
    return googleSheetLeadPersistenceAdapter;
  }

  return relationalLeadPersistenceAdapter;
}

export const leadPersistenceProvider = {
  getConfiguredLeadPersistenceMode,
  getLeadPersistenceAdapter,
  getActiveLeadPersistenceAdapter,
  isGoogleSheetRollbackApproved,
};
