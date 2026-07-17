import type {
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "./appointment-domain";

export interface AppointmentWriteRepository {
  createAppointment(
    input: CreateAppointmentInput,
  ): Promise<Appointment>;

  updateAppointment(
    id: string,
    input: UpdateAppointmentInput,
  ): Promise<Appointment>;
}