import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { mockLeads, type MockLead } from "@/lib/mock/leads";
import { getServerConfig } from "@/lib/config.server";
import { leadPersistenceProvider } from "@/server/leads/persistence";
import type { LeadOperationPriority, LeadOperationalStatus, LeadOperationsUpdate } from "./api-validation";

export class LeadNotFoundError extends Error {}

export type StoredLeadOperations = LeadOperationsUpdate & {
  updatedAt?: string;
  updatedBy?: string;
};

export type LeadOperationsProfile = {
  leadId: string;
  lead: MockLead & {
    urgency?: string;
    aiSummary?: string;
    message?: string;
    calendarEventId?: string;
    emailSent?: boolean;
  };
  operationalStatus: LeadOperationalStatus;
  priority: LeadOperationPriority;
  lastContactAt: string;
  nextFollowUpAt: string;
  contactResult: string;
  internalNote: string;
  updatedAt: string;
  updatedBy: string;
};

type LeadOperationsStore = Record<string, StoredLeadOperations>;

const STORE_PATH = resolve(process.cwd(), ".data/lead-operations.json");

async function readStore(): Promise<LeadOperationsStore> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    return JSON.parse(raw) as LeadOperationsStore;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

async function writeStore(store: LeadOperationsStore): Promise<void> {
  await mkdir(dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

async function readBaseLeads(): Promise<LeadOperationsProfile["lead"][]> {
  try {
    const config = getServerConfig();
    if (config.nodeEnv === "production" && !config.googleRefreshToken) {
      throw new Error("Lead operations access is restricted in production.");
    }

    const leads = await leadPersistenceProvider.getActiveLeadPersistenceAdapter().listLeads();
    if (!leads.length) throw new Error("No hay leads para gestionar operativamente.");
    return leads;
  } catch (error) {
    if (getServerConfig().nodeEnv === "production") throw error;
    console.warn("Falling back to mock lead operations:", error);
    return mockLeads;
  }
}

function deriveOperationalStatus(lead: LeadOperationsProfile["lead"]): LeadOperationalStatus {
  const normalized = (lead.status ?? "").toLowerCase().trim();
  if (normalized === "cancelada" || normalized === "no asistió" || normalized === "no asistio") return "seguimiento";
  if (normalized === "agendada" || normalized === "completada") return "contactado";
  return "nuevo";
}

function mergeLeadOperations(
  lead: LeadOperationsProfile["lead"],
  stored: StoredLeadOperations | undefined,
): LeadOperationsProfile {
  const fallbackUpdatedAt = lead.createdAt || "";

  return {
    leadId: lead.id,
    lead,
    operationalStatus: stored?.operationalStatus ?? deriveOperationalStatus(lead),
    priority: stored?.priority ?? "normal",
    lastContactAt: stored?.lastContactAt ?? "",
    nextFollowUpAt: stored?.nextFollowUpAt ?? "",
    contactResult: stored?.contactResult ?? "",
    internalNote: stored?.internalNote ?? "",
    updatedAt: stored?.updatedAt ?? fallbackUpdatedAt,
    updatedBy: stored?.updatedBy ?? "sistema",
  };
}

export async function listLeadOperationsProfiles(): Promise<LeadOperationsProfile[]> {
  const [leads, store] = await Promise.all([readBaseLeads(), readStore()]);
  return leads.map((lead) => mergeLeadOperations(lead, store[lead.id]));
}

export async function getLeadOperationsProfile(id: string): Promise<LeadOperationsProfile> {
  const profiles = await listLeadOperationsProfiles();
  const profile = profiles.find((leadOperations) => leadOperations.leadId === id);
  if (!profile) throw new LeadNotFoundError(`Lead ${id} no encontrado.`);
  return profile;
}

export async function updateLeadOperationsProfile(
  id: string,
  update: LeadOperationsUpdate,
  actor: { role: string; email?: string; userId?: string },
): Promise<LeadOperationsProfile> {
  await getLeadOperationsProfile(id);
  const store = await readStore();
  const updatedAt = new Date().toISOString();
  const updatedBy = actor.email ?? actor.userId ?? actor.role;

  store[id] = {
    ...(store[id] ?? {}),
    ...update,
    updatedAt,
    updatedBy,
  };

  await writeStore(store);
  return getLeadOperationsProfile(id);
}
