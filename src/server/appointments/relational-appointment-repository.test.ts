import { describe, expect, it } from "vitest";
import {
  RELATIONAL_APPOINTMENTS_TABLE_NAME,
  RelationalAppointmentRepository,
  type AppointmentPersistenceClient,
} from "./relational-appointment-repository";

type QueryCall = { text: string; values?: unknown[] };

const row = {
  id: "appt_001",
  lead_id: "lead_001",
  provider_id: "provider_a",
  requested_date: "2026-06-24",
  requested_time: "10:00",
  scheduled_start_at: "2026-06-24T10:00:00.000Z",
  scheduled_end_at: "2026-06-24T11:00:00.000Z",
  duration_minutes: 60,
  service: "Implantes",
  status: "confirmed",
  source: "assistant_workspace",
  patient_name: "María López",
  patient_email: "maria@example.com",
  patient_phone: "555-0000",
  notes: null,
  calendar_event_id: null,
  created_by_user_id: "usr_assistant_001",
  created_by_role: "assistant",
  created_via: "assistant_workspace",
  updated_by_user_id: null,
  updated_by_role: null,
  updated_via: null,
  cancelled_by_user_id: null,
  cancelled_by_role: null,
  cancelled_via: null,
  cancellation_reason: null,
  created_at: "2026-06-23T20:00:00.000Z",
  updated_at: "2026-06-23T20:00:00.000Z",
};

function createClient(
  rows: Record<string, unknown>[],
  calls: QueryCall[],
): AppointmentPersistenceClient {
  return {
    async query<T = Record<string, unknown>>(text: string, values?: unknown[]) {
      calls.push({ text, values });
      return { rows: rows as T[], rowCount: rows.length };
    },
  };
}

describe("61.2-06B relational appointment repository", () => {
  it("creates appointments in the appointments table without touching leads", async () => {
    const calls: QueryCall[] = [];
    const repository = new RelationalAppointmentRepository(async () => createClient([row], calls));

    const created = await repository.createAppointment({
      leadId: "lead_001",
      providerId: "provider_a",
      requestedDate: "2026-06-24",
      requestedTime: "10:00",
      scheduledStartAt: "2026-06-24T10:00:00.000Z",
      scheduledEndAt: "2026-06-24T11:00:00.000Z",
      service: "Implantes",
      status: "confirmed",
      source: "assistant_workspace",
      patientName: "María López",
      patientEmail: "maria@example.com",
      patientPhone: "555-0000",
      actor: {
        userId: "usr_assistant_001",
        role: "assistant",
        via: "assistant_workspace",
      },
    });

    expect(created.id).toBe("appt_001");
    expect(calls[0].text).toContain(`INSERT INTO ${RELATIONAL_APPOINTMENTS_TABLE_NAME}`);
    expect(calls[0].text).not.toContain("INSERT INTO leads");
  });

  it("queries provider conflicts by provider and overlapping interval", async () => {
    const calls: QueryCall[] = [];
    const repository = new RelationalAppointmentRepository(async () => createClient([row], calls));

    const conflicts = await repository.listProviderCapacityConflicts({
      providerId: "provider_a",
      startAt: "2026-06-24T10:30:00.000Z",
      endAt: "2026-06-24T11:30:00.000Z",
    });

    expect(conflicts).toHaveLength(1);
    expect(calls[0].text).toContain("provider_id = $1");
    expect(calls[0].text).toContain("status = 'confirmed'");
    expect(calls[0].values).toEqual([
      "provider_a",
      "2026-06-24T10:30:00.000Z",
      "2026-06-24T11:30:00.000Z",
    ]);
  });
});
