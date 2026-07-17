import { describe, expect, it } from "vitest";
import { RelationalAppointmentRepository } from "./relational-appointment-repository";
import type { AppointmentDateRangeSearch, AppointmentConflictSearch } from "./appointment-read-repository";
import type { AppointmentPersistenceClient } from "./relational-appointment-repository";

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

function createClient(rows: Record<string, unknown>[], calls: QueryCall[]): AppointmentPersistenceClient {
  return {
    async query<T = Record<string, unknown>>(text: string, values?: unknown[]) {
      calls.push({ text, values });
      return { rows: rows as T[], rowCount: rows.length };
    },
  };
}

describe("AppointmentReadRepository", () => {
  it("finds appointment by id", async () => {
    const calls: QueryCall[] = [];
    const repository = new RelationalAppointmentRepository(async () => createClient([row], calls));

    const appointment = await repository.findAppointmentById("appt_001");

    expect(appointment).not.toBeNull();
    expect(appointment?.id).toBe("appt_001");
    expect(calls[0].text).toContain("WHERE id = $1");
    expect(calls[0].values).toEqual(["appt_001"]);
  });

  it("returns null when appointment id does not exist", async () => {
    const calls: QueryCall[] = [];
    const repository = new RelationalAppointmentRepository(async () => createClient([], calls));

    const appointment = await repository.findAppointmentById("appt_999");

    expect(appointment).toBeNull();
    expect(calls[0].text).toContain("WHERE id = $1");
  });

  it("lists appointments by date range without optional filters", async () => {
    const calls: QueryCall[] = [];
    const repository = new RelationalAppointmentRepository(async () => createClient([row], calls));

    const search: AppointmentDateRangeSearch = {
      startAt: "2026-06-24T09:00:00.000Z",
      endAt: "2026-06-24T12:00:00.000Z",
    };

    const appointments = await repository.listAppointmentsByDateRange(search);

    expect(appointments).toHaveLength(1);
    expect(calls[0].text).toContain("scheduled_start_at < $1");
    expect(calls[0].text).toContain("scheduled_end_at > $2");
    expect(calls[0].values).toEqual([search.endAt, search.startAt]);
  });

  it("lists appointments by date range filtered by provider", async () => {
    const calls: QueryCall[] = [];
    const repository = new RelationalAppointmentRepository(async () => createClient([row], calls));

    const search: AppointmentDateRangeSearch = {
      startAt: "2026-06-24T09:00:00.000Z",
      endAt: "2026-06-24T12:00:00.000Z",
      providerId: "provider_a",
    };

    const appointments = await repository.listAppointmentsByDateRange(search);

    expect(appointments).toHaveLength(1);
    expect(calls[0].text).toContain("provider_id = $3");
    expect(calls[0].values).toEqual([search.endAt, search.startAt, search.providerId]);
  });

  it("lists appointments by date range filtered by statuses", async () => {
    const calls: QueryCall[] = [];
    const repository = new RelationalAppointmentRepository(async () => createClient([row], calls));

    const search: AppointmentDateRangeSearch = {
      startAt: "2026-06-24T09:00:00.000Z",
      endAt: "2026-06-24T12:00:00.000Z",
      statuses: ["confirmed"],
    };

    const appointments = await repository.listAppointmentsByDateRange(search);

    expect(appointments).toHaveLength(1);
    expect(calls[0].text).toContain("status IN ($3)");
    expect(calls[0].values).toEqual([search.endAt, search.startAt, "confirmed"]);
  });

  it("lists appointments by date range filtered by multiple statuses", async () => {
    const calls: QueryCall[] = [];
    const repository = new RelationalAppointmentRepository(async () => createClient([row], calls));

    const search: AppointmentDateRangeSearch = {
      startAt: "2026-06-24T09:00:00.000Z",
      endAt: "2026-06-24T12:00:00.000Z",
      statuses: ["confirmed", "rescheduled"],
    };

    const appointments = await repository.listAppointmentsByDateRange(search);

    expect(appointments).toHaveLength(1);
    expect(calls[0].text).toContain("status IN ($3, $4)");
    expect(calls[0].values).toEqual([search.endAt, search.startAt, "confirmed", "rescheduled"]);
  });

  it("orders appointments by scheduled_start_at ascending", async () => {
    const calls: QueryCall[] = [];
    const repository = new RelationalAppointmentRepository(async () => createClient([row], calls));

    await repository.listAppointmentsByDateRange({
      startAt: "2026-06-24T09:00:00.000Z",
      endAt: "2026-06-24T12:00:00.000Z",
    });

    expect(calls[0].text).toContain("ORDER BY scheduled_start_at ASC");
  });

  it("rejects invalid range when endAt is before startAt", async () => {
    const repository = new RelationalAppointmentRepository(async () => createClient([row], []));

    await expect(
      repository.listAppointmentsByDateRange({
        startAt: "2026-06-24T12:00:00.000Z",
        endAt: "2026-06-24T09:00:00.000Z",
      }),
    ).rejects.toThrow("Invalid date range: endAt must be later than startAt.");
  });

  it("does not execute non-SELECT operations in date range query", async () => {
    const calls: QueryCall[] = [];
    const repository = new RelationalAppointmentRepository(async () => createClient([row], calls));

    await repository.listAppointmentsByDateRange({
      startAt: "2026-06-24T09:00:00.000Z",
      endAt: "2026-06-24T12:00:00.000Z",
    });

    expect(calls[0].text.trim().startsWith("SELECT")).toBe(true);
    expect(calls[0].text).not.toContain("INSERT");
    expect(calls[0].text).not.toContain("UPDATE");
    expect(calls[0].text).not.toContain("DELETE");
  });
});
