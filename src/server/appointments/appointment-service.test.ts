import { describe, expect, it } from "vitest";
import { AppointmentProviderConflictError, AppointmentService } from "./appointment-service";
import type {
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "./appointment-domain";
import { createAppointmentEntity, applyAppointmentUpdate } from "./appointment-domain";
import type { AppointmentConflictSearch, AppointmentRepository } from "./appointment-repository";

class MemoryAppointmentRepository implements AppointmentRepository {
  appointments = new Map<string, Appointment>();

  async createAppointment(input: CreateAppointmentInput): Promise<Appointment> {
    const appointment = createAppointmentEntity(input, {
      id: input.id ?? `appt_${this.appointments.size + 1}`,
    });
    this.appointments.set(appointment.id, appointment);
    return appointment;
  }

  async findAppointmentById(id: string): Promise<Appointment | null> {
    return this.appointments.get(id) ?? null;
  }

  async updateAppointment(id: string, input: UpdateAppointmentInput): Promise<Appointment> {
    const appointment = this.appointments.get(id);
    if (!appointment) throw new Error("not found");
    const updated = applyAppointmentUpdate(appointment, input);
    this.appointments.set(id, updated);
    return updated;
  }

  async listProviderCapacityConflicts(search: AppointmentConflictSearch): Promise<Appointment[]> {
    const { appointmentConflictsWithInterval } = await import("./availability-service");
    return [...this.appointments.values()].filter((appointment) =>
      appointmentConflictsWithInterval(appointment, {
        providerId: search.providerId,
        startAt: search.startAt,
        endAt: search.endAt,
        excludeAppointmentId: search.excludeAppointmentId,
      }),
    );
  }
}

describe("61.2-06B appointment service foundation", () => {
  it("confirms an appointment when the provider is available", async () => {
    const repository = new MemoryAppointmentRepository();
    const service = new AppointmentService(repository);
    const request = await service.createRequest({
      id: "appt_request",
      service: "Ortodoncia",
      source: "assistant_workspace",
      patientName: "Paciente Uno",
    });

    const confirmed = await service.confirmAppointment(request.id, {
      providerId: "provider_a",
      scheduledStartAt: "2026-06-24T10:00:00.000Z",
      scheduledEndAt: "2026-06-24T11:00:00.000Z",
      actor: {
        userId: "usr_assistant_001",
        role: "assistant",
        via: "assistant_workspace",
      },
    });

    expect(confirmed.status).toBe("confirmed");
    expect(confirmed.providerId).toBe("provider_a");
    expect(confirmed.updatedByUserId).toBe("usr_assistant_001");
  });

  it("blocks confirmation only for the same provider conflict", async () => {
    const repository = new MemoryAppointmentRepository();
    const service = new AppointmentService(repository);

    await service.createRequest({
      id: "appt_existing",
      providerId: "provider_a",
      scheduledStartAt: "2026-06-24T10:00:00.000Z",
      scheduledEndAt: "2026-06-24T11:00:00.000Z",
      service: "Implantes",
      status: "confirmed",
      source: "assistant_workspace",
      patientName: "Paciente Existente",
    });

    await service.createRequest({
      id: "appt_new",
      service: "Limpieza",
      source: "assistant_workspace",
      patientName: "Paciente Nuevo",
    });

    await expect(
      service.confirmAppointment("appt_new", {
        providerId: "provider_a",
        scheduledStartAt: "2026-06-24T10:30:00.000Z",
        scheduledEndAt: "2026-06-24T11:30:00.000Z",
        actor: { userId: "usr_assistant_001", role: "assistant", via: "assistant_workspace" },
      }),
    ).rejects.toThrow(AppointmentProviderConflictError);

    await expect(
      service.confirmAppointment("appt_new", {
        providerId: "provider_b",
        scheduledStartAt: "2026-06-24T10:30:00.000Z",
        scheduledEndAt: "2026-06-24T11:30:00.000Z",
        actor: { userId: "usr_assistant_001", role: "assistant", via: "assistant_workspace" },
      }),
    ).resolves.toMatchObject({ providerId: "provider_b", status: "confirmed" });
  });
});
