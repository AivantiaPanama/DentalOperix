import type {
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "./appointment-domain";

export type AppointmentConflictSearch = {
  providerId: string;
  startAt: string;
  endAt: string;
  excludeAppointmentId?: string;
};

export interface AppointmentRepository {
  createAppointment(input: CreateAppointmentInput): Promise<Appointment>;
  findAppointmentById(id: string): Promise<Appointment | null>;
  updateAppointment(id: string, input: UpdateAppointmentInput): Promise<Appointment>;
  listProviderCapacityConflicts(search: AppointmentConflictSearch): Promise<Appointment[]>;
}

export class AppointmentNotFoundError extends Error {
  constructor(id: string) {
    super(`Appointment ${id} was not found.`);
    this.name = "AppointmentNotFoundError";
  }
}
