import { beforeEach, describe, expect, it } from "vitest";
import { appointmentServiceProvider } from "@/server/appointments/appointment-service-provider";
import { appointmentConflictsWithInterval } from "@/server/appointments/availability-service";
import { applyAppointmentUpdate, createAppointmentEntity, type Appointment, type CreateAppointmentInput, type UpdateAppointmentInput } from "@/server/appointments/appointment-domain";
import type { AppointmentConflictSearch, AppointmentRepository } from "@/server/appointments/appointment-repository";
import { POST as requestAppointment } from "./request";
import { POST as checkAvailability } from "./check-availability";
import { POST as confirmAppointment } from "./confirm";
import { POST as markReview } from "./mark-review";

class MemoryAppointmentRepository implements AppointmentRepository {
  appointments = new Map<string, Appointment>();

  async createAppointment(input: CreateAppointmentInput): Promise<Appointment> {
    const appointment = createAppointmentEntity(input, { id: input.id ?? `appt_${this.appointments.size + 1}` });
    this.appointments.set(appointment.id, appointment);
    return appointment;
  }

  async findAppointmentById(id: string): Promise<Appointment | null> {
    return this.appointments.get(id) ?? null;
  }

  async updateAppointment(id: string, input: UpdateAppointmentInput): Promise<Appointment> {
    const current = this.appointments.get(id);
    if (!current) throw new Error("not found");
    const updated = applyAppointmentUpdate(current, input);
    this.appointments.set(id, updated);
    return updated;
  }

  async listProviderCapacityConflicts(search: AppointmentConflictSearch): Promise<Appointment[]> {
    return [...this.appointments.values()].filter((appointment) =>
      appointmentConflictsWithInterval(appointment, {
        providerId: search.providerId,
        startAt: search.startAt,
        endAt: search.endAt,
        excludeAppointmentId: search.excludeAppointmentId,
      }),
    );
  }

  async listAppointmentsByDateRange(): Promise<Appointment[]> {
    return [...this.appointments.values()];
  }
}

const repository = new MemoryAppointmentRepository();

function apiRequest(path: string, body: unknown, headers: Record<string, string> = { "x-api-key": "test-key" }) {
  return new Request(`http://localhost${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("61.2-06C appointment workflow API routes", () => {
  beforeEach(() => {
    repository.appointments.clear();
    appointmentServiceProvider.setRepositoryFactoryForTesting(() => repository);
    process.env.INTERNAL_API_KEY = "test-key";
    process.env.GOOGLE_CLIENT_ID = "client-id";
    process.env.GOOGLE_CLIENT_SECRET = "client-secret";
    process.env.GOOGLE_REDIRECT_URI = "https://example.com/oauth";
    process.env.GOOGLE_SCOPES = "scope";
    process.env.GOOGLE_SHEET_ID = "sheet-id";
    process.env.GMAIL_SENDER = "clinic@example.com";
  });

  it("creates assistant appointment requests without requiring public booking", async () => {
    const response = await requestAppointment(
      apiRequest("/api/appointments/request", {
        leadId: "LEAD-001",
        requestedDate: "2026-06-25",
        requestedTime: "14:30",
        durationMinutes: 60,
        service: "Ortodoncia",
        patientName: "Ana Perez",
      }),
    );

    expect(response.status).toBe(201);
    const payload = await response.json();
    expect(payload.appointment).toMatchObject({
      leadId: "LEAD-001",
      status: "requested",
      source: "assistant_workspace",
      createdVia: "assistant_workspace",
    });
  });

  it("checks provider-aware availability and allows same time for another provider", async () => {
    await repository.createAppointment({
      id: "appt_existing",
      providerId: "provider_a",
      scheduledStartAt: "2026-06-25T14:00:00.000Z",
      scheduledEndAt: "2026-06-25T15:00:00.000Z",
      service: "Implantes",
      status: "confirmed",
      source: "assistant_workspace",
      patientName: "Paciente Existente",
    });

    const busy = await checkAvailability(
      apiRequest("/api/appointments/check-availability", {
        providerId: "provider_a",
        startAt: "2026-06-25T14:30:00.000Z",
        endAt: "2026-06-25T15:30:00.000Z",
      }),
    );
    expect(await busy.json()).toMatchObject({ success: true, available: false });

    const available = await checkAvailability(
      apiRequest("/api/appointments/check-availability", {
        providerId: "provider_b",
        startAt: "2026-06-25T14:30:00.000Z",
        endAt: "2026-06-25T15:30:00.000Z",
      }),
    );
    expect(await available.json()).toMatchObject({ success: true, available: true });
  });

  it("confirms only when the selected provider is available", async () => {
    const appointment = await repository.createAppointment({
      id: "appt_request",
      service: "Limpieza",
      source: "assistant_workspace",
      patientName: "Paciente Nuevo",
    });

    const response = await confirmAppointment(
      apiRequest("/api/appointments/confirm", {
        appointmentId: appointment.id,
        providerId: "provider_a",
        scheduledStartAt: "2026-06-25T16:00:00.000Z",
        scheduledEndAt: "2026-06-25T17:00:00.000Z",
      }),
    );

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.appointment).toMatchObject({ status: "confirmed", providerId: "provider_a" });
  });

  it("moves non-confirmable requests to assistant review", async () => {
    const appointment = await repository.createAppointment({
      id: "appt_review",
      service: "Limpieza",
      source: "assistant_workspace",
      patientName: "Paciente Nuevo",
    });

    const response = await markReview(
      apiRequest("/api/appointments/mark-review", {
        appointmentId: appointment.id,
        notes: "Buscar alternativa cercana.",
      }),
    );

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.appointment).toMatchObject({ status: "needs_assistant_review", notes: "Buscar alternativa cercana." });
  });
});
