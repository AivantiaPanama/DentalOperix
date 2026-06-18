import type { CRMStatus, GoogleCRMLeadPayload } from "@/server/google/types";

export type LeadPersistenceMode = "google-sheet" | "relational-db";

export type LeadPersistenceHealth = {
  mode: LeadPersistenceMode;
  writable: boolean;
  active: boolean;
  sourceOfTruth: "Leads";
  physicalPersistence: "Google Sheet" | "Relational Database";
  notes: string[];
};

export type LeadPersistenceAppendInput = unknown;

export type LeadPersistenceUpdateInput = {
  status?: CRMStatus;
  calendarEventId?: string;
  emailSent?: boolean;
};

export type LeadPersistenceListItem = GoogleCRMLeadPayload;

export type LeadPersistenceWriteResult = GoogleCRMLeadPayload;

export interface LeadPersistencePort {
  readonly mode: LeadPersistenceMode;
  appendLead(input: LeadPersistenceAppendInput): Promise<LeadPersistenceWriteResult>;
  updateLead(id: string, update: LeadPersistenceUpdateInput): Promise<void>;
  listLeads(): Promise<LeadPersistenceListItem[]>;
  getHealth(): LeadPersistenceHealth;
}

export class LeadPersistenceNotConfiguredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LeadPersistenceNotConfiguredError";
  }
}
