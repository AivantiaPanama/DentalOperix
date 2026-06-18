import {
  readLeadsFromSheet as readLeadsFromCRM,
  appendLeadToSheet as appendLeadToCRM,
} from "./crm";
import type { GoogleLeadPayload } from "./types";

export async function appendLeadToSheet(payload: GoogleLeadPayload) {
  return appendLeadToCRM(payload);
}

export async function readLeadsFromSheet() {
  const leads = await readLeadsFromCRM();
  return leads.map((lead) => ({
    id: lead.id,
    createdAt: lead.createdAt.slice(0, 10),
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    treatment: lead.treatment,
    status: lead.status,
    source: lead.source,
    preferredDate: lead.preferredDate,
    notes: lead.message,
  }));
}
