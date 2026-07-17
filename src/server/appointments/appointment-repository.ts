import type {
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "./appointment-domain";
import type { AppointmentReadRepository } from "./appointment-read-repository";

export type { AppointmentConflictSearch, AppointmentDateRangeSearch } from "./appointment-read-repository";

export interface AppointmentRepository extends AppointmentReadRepository {
  createAppointment(input: CreateAppointmentInput): Promise<Appointment>;
  updateAppointment(id: string, input: UpdateAppointmentInput): Promise<Appointment>;
}

export class AppointmentNotFoundError extends Error {
  constructor(id: string) {
    super(`Appointment ${id} was not found.`);
    this.name = "AppointmentNotFoundError";
  }
}
