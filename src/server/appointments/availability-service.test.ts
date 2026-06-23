import { describe, expect, it } from "vitest";
import { createAppointmentEntity } from "./appointment-domain";
import { appointmentConflictsWithInterval, AppointmentAvailabilityService } from "./availability-service";
import type { AppointmentRepository } from "./appointment-repository";

const interval = {
  providerId: "provider_a",
  startAt: "2026-06-24T10:00:00.000Z",
  endAt: "2026-06-24T11:00:00.000Z",
};

const confirmedAppointment = createAppointmentEntity(
  {
    providerId: "provider_a",
    scheduledStartAt: "2026-06-24T10:30:00.000Z",
    scheduledEndAt: "2026-06-24T11:30:00.000Z",
    service: "Implantes",
    status: "confirmed",
    source: "assistant_workspace",
    patientName: "Paciente Uno",
  },
  { id: "appt_confirmed" },
);

describe("61.2-06B provider-aware availability foundation", () => {
  it("detects conflicts for the same provider and overlapping confirmed interval", () => {
    expect(appointmentConflictsWithInterval(confirmedAppointment, interval)).toBe(true);
  });

  it("allows the same date and time for a different provider", () => {
    expect(
      appointmentConflictsWithInterval(confirmedAppointment, {
        ...interval,
        providerId: "provider_b",
      }),
    ).toBe(false);
  });

  it("does not treat requested appointments as capacity conflicts", () => {
    const requested = createAppointmentEntity(
      {
        providerId: "provider_a",
        scheduledStartAt: "2026-06-24T10:30:00.000Z",
        scheduledEndAt: "2026-06-24T11:30:00.000Z",
        service: "Implantes",
        status: "requested",
        source: "assistant_workspace",
        patientName: "Paciente Dos",
      },
      { id: "appt_requested" },
    );

    expect(appointmentConflictsWithInterval(requested, interval)).toBe(false);
  });

  it("returns available when repository finds no provider conflicts", async () => {
    const repository: Pick<AppointmentRepository, "listProviderCapacityConflicts"> = {
      async listProviderCapacityConflicts() {
        return [];
      },
    };

    const service = new AppointmentAvailabilityService(repository);

    await expect(service.checkProviderAvailability(interval)).resolves.toMatchObject({
      available: true,
      providerId: "provider_a",
      conflicts: [],
    });
  });
});
