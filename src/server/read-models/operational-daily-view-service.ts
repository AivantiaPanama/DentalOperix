import { listLeadOperationsProfiles } from "@/server/leads/operations-repository";

import { listAppointmentsForOperationalDay } from "./appointment-read-adapter";

import type {
  OperationalDailyView,
  OperationalLeadSummary,
} from "./operational-daily-view.types";

function normalize(value: string | undefined | null): string {
  return (value ?? "").trim();
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function mapLeadToOperationalSummary(
  profile: Awaited<ReturnType<typeof listLeadOperationsProfiles>>[number],
): OperationalLeadSummary {
  return {
    leadId: profile.leadId,
    name: normalize(profile.lead.name) || "Paciente sin nombre",
    ...(normalize(profile.lead.treatment)
      ? { treatment: normalize(profile.lead.treatment) }
      : {}),
    status: profile.operationalStatus,
    priority: profile.priority,
  };
}

/**
 * Builds the operational daily read view consumed
 * by Assistant Workspace.
 *
 * This service is read-only.
 * It does not modify domains or persistence.
 */
export async function getOperationalDailyView(
  date: Date = new Date(),
): Promise<OperationalDailyView> {
  const [appointments, leadProfiles] = await Promise.all([
    listAppointmentsForOperationalDay(date),
    listLeadOperationsProfiles(),
  ]);

  const newLeads = leadProfiles
    .filter((profile) => profile.operationalStatus === "nuevo")
    .map(mapLeadToOperationalSummary);

  return {
    date: formatDate(date),

    summary: {
      appointmentsCount: appointments.length,
      newLeadsCount: newLeads.length,
    },

    appointments,

    newLeads,
  };
}