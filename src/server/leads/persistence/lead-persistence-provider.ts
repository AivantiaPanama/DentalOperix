import type { LeadPersistenceMode, LeadPersistencePort } from "./lead-persistence-port";
import { googleSheetLeadPersistenceAdapter } from "./google-sheet-lead-persistence-adapter";
import { relationalLeadPersistenceAdapter } from "./relational-lead-persistence-adapter";

const DEFAULT_LEAD_PERSISTENCE_MODE: LeadPersistenceMode = "google-sheet";

function normalizeLeadPersistenceMode(raw: string | undefined): LeadPersistenceMode {
  if (raw === "relational-db") return "relational-db";
  return DEFAULT_LEAD_PERSISTENCE_MODE;
}

export function getConfiguredLeadPersistenceMode(): LeadPersistenceMode {
  return normalizeLeadPersistenceMode(process.env.LEADS_PERSISTENCE_MODE);
}

export function getLeadPersistenceAdapter(
  mode: LeadPersistenceMode = getConfiguredLeadPersistenceMode(),
): LeadPersistencePort {
  if (mode === "relational-db") return relationalLeadPersistenceAdapter;
  return googleSheetLeadPersistenceAdapter;
}

export function getActiveLeadPersistenceAdapter(): LeadPersistencePort {
  const adapter = getLeadPersistenceAdapter();

  if (adapter.mode === "relational-db") {
    // 57.x governance: relational persistence is present as infrastructure only.
    // It must not become active without an explicit cutover decision.
    return relationalLeadPersistenceAdapter;
  }

  return adapter;
}

export const leadPersistenceProvider = {
  getConfiguredLeadPersistenceMode,
  getLeadPersistenceAdapter,
  getActiveLeadPersistenceAdapter,
};
