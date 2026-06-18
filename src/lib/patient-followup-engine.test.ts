/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FollowupRecord } from "@/server/google/followups";

const readLeadsFromSheet = vi.fn();
const readFollowupRecords = vi.fn();
const appendFollowupRecord = vi.fn();
const sendFollowupEmail = vi.fn();

vi.mock("@/server/google/sheets", () => ({
  readLeadsFromSheet,
}));

vi.mock("@/server/google/followups", () => ({
  readFollowupRecords,
  appendFollowupRecord,
}));

vi.mock("@/server/google/gmail", () => ({
  sendFollowupEmail,
}));

const { generateFollowupActions, runPatientFollowups } = await import("./patient-followup-engine");

describe("patient followup engine", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    sendFollowupEmail.mockResolvedValue(undefined);
    appendFollowupRecord.mockResolvedValue(undefined);
  });

  it("generates followups for appointment reminders and attendance confirmations", async () => {
    const now = new Date("2026-06-10T10:00:00Z");
    const leads = [
      {
        id: "lead-1",
        name: "Ana",
        email: "ana@example.com",
        status: "agendada",
        preferredDate: "2026-06-13 09:00",
      },
      {
        id: "lead-2",
        name: "Luis",
        email: "luis@example.com",
        status: "agendada",
        preferredDate: "2026-06-10 14:00",
      },
    ];

    const actions = generateFollowupActions(leads as any, [] as FollowupRecord[], now);
    expect(actions.map((action) => action.type)).toEqual([
      "appointment_reminder",
      "attendance_confirmation",
    ]);
  });

  it("does not generate duplicate followups inside the dedupe window", async () => {
    const now = new Date("2026-06-10T10:00:00Z");
    const leads = [
      {
        id: "lead-1",
        name: "Ana",
        email: "ana@example.com",
        status: "agendada",
        preferredDate: "2026-06-10 14:00",
      },
    ];
    const existing: FollowupRecord[] = [
      {
        leadId: "lead-1",
        type: "attendance_confirmation",
        channel: "email",
        recipient: "ana@example.com",
        message: "",
        status: "sent",
        date: "2026-06-10T10:00:00.000Z",
      } as FollowupRecord,
    ];

    const actions = generateFollowupActions(leads as any, existing, now);
    expect(actions).toEqual([]);
  });

  it("allows legitimate future followups outside the dedupe window", async () => {
    const now = new Date("2026-06-10T10:00:00Z");
    const leads = [
      {
        id: "lead-1",
        name: "Ana",
        email: "ana@example.com",
        status: "agendada",
        preferredDate: "2026-06-13 09:00",
      },
    ];
    const existing: FollowupRecord[] = [
      {
        leadId: "lead-1",
        type: "appointment_reminder",
        channel: "email",
        recipient: "ana@example.com",
        message: "",
        status: "sent",
        date: "2026-06-09T10:00:00.000Z",
      } as FollowupRecord,
    ];

    const actions = generateFollowupActions(leads as any, existing, now);
    expect(actions).toEqual([expect.objectContaining({ type: "appointment_reminder" })]);
  });

  it("skips sending followups in dryRun mode", async () => {
    readLeadsFromSheet.mockResolvedValue([
      {
        id: "lead-1",
        name: "Ana",
        email: "ana@example.com",
        status: "agendada",
        preferredDate: "2026-06-10 14:00",
      },
    ]);
    readFollowupRecords.mockResolvedValue([]);

    const result = await runPatientFollowups({ dryRun: true }, new Date("2026-06-10T10:00:00Z"));
    expect(result.generated).toBeGreaterThan(0);
    expect(result.sent).toBe(0);
    expect(result.skipped).toBe(result.generated);
    expect(sendFollowupEmail).not.toHaveBeenCalled();
  });

  it("does not fail when PatientFollowUps sheet is missing", async () => {
    readLeadsFromSheet.mockResolvedValue([
      {
        id: "lead-1",
        name: "Ana",
        email: "ana@example.com",
        status: "agendada",
        preferredDate: "2026-06-10 14:00",
      },
    ]);
    readFollowupRecords.mockRejectedValue(new Error("Sheet not found"));

    const result = await runPatientFollowups({ dryRun: true }, new Date("2026-06-10T10:00:00Z"));
    expect(result.generated).toBeGreaterThan(0);
    expect(result.sent).toBe(0);
    expect(result.skipped).toBe(result.generated);
    expect(result.errors.length).toBeGreaterThanOrEqual(0);
  });

  it("sends followups when dryRun is false and records sent actions", async () => {
    readLeadsFromSheet.mockResolvedValue([
      {
        id: "lead-1",
        name: "Ana",
        email: "ana@example.com",
        status: "agendada",
        preferredDate: "2026-06-10 14:00",
      },
    ]);
    readFollowupRecords.mockResolvedValue([]);

    const result = await runPatientFollowups({ dryRun: false }, new Date("2026-06-10T10:00:00Z"));
    expect(result.generated).toBeGreaterThan(0);
    expect(result.sent).toBe(result.generated);
    expect(result.errors).toEqual([]);
    expect(sendFollowupEmail).toHaveBeenCalledTimes(result.generated);
    expect(appendFollowupRecord).toHaveBeenCalledTimes(result.generated);
  });

  it("generates cancellation recovery followups for cancelled leads", async () => {
    const now = new Date("2026-06-10T10:00:00Z");
    const leads = [
      {
        id: "lead-1",
        name: "Paco",
        email: "paco@example.com",
        status: "cancelada",
        createdAt: "2026-06-09",
      },
    ];

    const actions = generateFollowupActions(leads as any, [], now);
    expect(actions[0]?.type).toBe("cancellation_recovery");
  });

  it("generates post appointment followups after completed appointments", async () => {
    const now = new Date("2026-06-12T10:00:00Z");
    const leads = [
      {
        id: "lead-1",
        name: "Carla",
        email: "carla@example.com",
        status: "completada",
        preferredDate: "2026-06-09 09:00",
      },
    ];

    const actions = generateFollowupActions(leads as any, [], now);
    expect(actions[0]?.type).toBe("post_appointment_followup");
  });

  it("generates inactive reactivation followups after 30 days of no action", async () => {
    const now = new Date("2026-07-10T10:00:00Z");
    const leads = [
      {
        id: "lead-1",
        name: "Marta",
        email: "marta@example.com",
        status: "nuevo",
        createdAt: "2026-06-01",
      },
    ];

    const actions = generateFollowupActions(leads as any, [], now);
    expect(actions[0]?.type).toBe("inactive_reactivation");
  });

  it("prioritizes followups by lead score descending (hot, warm, cold)", async () => {
    const now = new Date("2026-06-10T10:00:00Z");
    const leads = [
      {
        id: "hot-lead",
        name: "Ana",
        email: "ana@example.com",
        status: "agendada",
        urgency: "alta",
        treatment: "Implantes Dentales",
        source: "superconversion",
        preferredDate: "2026-06-11 09:00",
      },
      {
        id: "warm-lead",
        name: "Bea",
        email: "bea@example.com",
        status: "agendada",
        urgency: "media",
        treatment: "Ortodoncia",
        source: "chat-widget",
        preferredDate: "2026-06-13 09:00",
      },
      {
        id: "cold-lead",
        name: "Carlos",
        email: "carlos@example.com",
        status: "nuevo",
        urgency: "baja",
        treatment: "",
        createdAt: "2026-05-01",
      },
    ];

    const actions = generateFollowupActions(leads as any, [], now);
    expect(actions.map((action) => action.leadCategory)).toEqual(["hot", "warm", "cold"]);
    expect(actions[0].leadScore).toBeGreaterThan(actions[1].leadScore);
    expect(actions[1].leadScore).toBeGreaterThan(actions[2].leadScore);
  });
});
