import {
  applyAppointmentUpdate,
  statusConsumesProviderCapacity,
  type Appointment,
  type AppointmentAuditActor,
  type CreateAppointmentInput,
} from "./appointment-domain";
import { AppointmentAvailabilityService } from "./availability-service";
import type { AppointmentRepository } from "./appointment-repository";

export class AppointmentProviderConflictError extends Error {
  constructor(providerId: string) {
    super(`Provider ${providerId} is not available for the requested interval.`);
    this.name = "AppointmentProviderConflictError";
  }
}

export class AppointmentService {
  private readonly availabilityService: AppointmentAvailabilityService;

  constructor(private readonly repository: AppointmentRepository) {
    this.availabilityService = new AppointmentAvailabilityService(repository);
  }

  async createRequest(input: CreateAppointmentInput): Promise<Appointment> {
    return this.repository.createAppointment({ ...input, status: input.status ?? "requested" });
  }

  async confirmAppointment(
    id: string,
    input: {
      providerId: string;
      scheduledStartAt: string;
      scheduledEndAt: string;
      actor: AppointmentAuditActor;
    },
  ): Promise<Appointment> {
    const availability = await this.availabilityService.checkProviderAvailability({
      providerId: input.providerId,
      startAt: input.scheduledStartAt,
      endAt: input.scheduledEndAt,
      excludeAppointmentId: id,
    });

    if (!availability.available) {
      throw new AppointmentProviderConflictError(input.providerId);
    }

    return this.repository.updateAppointment(id, {
      providerId: input.providerId,
      scheduledStartAt: input.scheduledStartAt,
      scheduledEndAt: input.scheduledEndAt,
      status: "confirmed",
      actor: input.actor,
    });
  }

  async cancelAppointment(
    id: string,
    input: { actor: AppointmentAuditActor; reason?: string },
  ): Promise<Appointment> {
    return this.repository.updateAppointment(id, {
      status: "cancelled",
      cancellationReason: input.reason,
      actor: input.actor,
    });
  }

  async markNeedsAssistantReview(
    id: string,
    input: { actor: AppointmentAuditActor; notes?: string },
  ): Promise<Appointment> {
    return this.repository.updateAppointment(id, {
      status: "needs_assistant_review",
      notes: input.notes,
      actor: input.actor,
    });
  }

  applyUpdateForTesting(appointment: Appointment, actor: AppointmentAuditActor): Appointment {
    return applyAppointmentUpdate(
      appointment,
      {
        status: statusConsumesProviderCapacity(appointment.status)
          ? appointment.status
          : "needs_assistant_review",
        actor,
      },
      appointment.updatedAt,
    );
  }
}
