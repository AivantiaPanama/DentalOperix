import { describe, expect, it } from "vitest";
import {
  AppointmentValidationError,
  applyAppointmentUpdate,
  createAppointmentEntity,
  statusConsumesProviderCapacity,
  validateCreateAppointmentInput,
} from "./appointment-domain";

describe("61.2-06B appointment domain foundation", () => {
  it("creates a requested appointment without consuming provider capacity", () => {
    const appointment = createAppointmentEntity(
      {
        leadId: "lead_001",
        requestedDate: "2026-06-24",
        requestedTime: "10:00",
        service: "Implantes",
        source: "assistant_workspace",
        patientName: "María López",
        actor: {
          userId: "usr_assistant_001",
          role: "assistant",
          via: "assistant_workspace",
        },
      },
      { id: "appt_001", now: "2026-06-23T20:00:00.000Z" },
    );

    expect(appointment).toMatchObject({
      id: "appt_001",
      leadId: "lead_001",
      status: "requested",
      durationMinutes: 60,
      createdByUserId: "usr_assistant_001",
      createdByRole: "assistant",
      createdVia: "assistant_workspace",
    });
    expect(statusConsumesProviderCapacity(appointment.status)).toBe(false);
  });

  it("requires provider and scheduled interval for confirmed appointments", () => {
    expect(() =>
      validateCreateAppointmentInput({
        service: "Ortodoncia",
        source: "assistant_workspace",
        patientName: "Carlos Pérez",
        status: "confirmed",
      }),
    ).toThrow(AppointmentValidationError);
  });

  it("records update and cancellation audit metadata", () => {
    const appointment = createAppointmentEntity(
      {
        service: "Limpieza",
        source: "public_booking",
        patientName: "Ana García",
      },
      { id: "appt_002", now: "2026-06-23T20:00:00.000Z" },
    );

    const cancelled = applyAppointmentUpdate(
      appointment,
      {
        status: "cancelled",
        cancellationReason: "Paciente solicitó cancelar",
        actor: {
          userId: "usr_assistant_002",
          role: "assistant",
          via: "assistant_workspace",
        },
      },
      "2026-06-23T21:00:00.000Z",
    );

    expect(cancelled.status).toBe("cancelled");
    expect(cancelled.updatedByUserId).toBe("usr_assistant_002");
    expect(cancelled.cancelledByUserId).toBe("usr_assistant_002");
    expect(cancelled.cancelledByRole).toBe("assistant");
    expect(cancelled.cancelledVia).toBe("assistant_workspace");
  });
});
