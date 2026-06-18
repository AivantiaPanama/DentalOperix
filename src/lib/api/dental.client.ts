import { useMutation } from "@tanstack/react-query";
import { createDentalAppointment, type DentalAppointmentInput } from "./dental.functions";

export function useCreateDentalAppointment() {
  return useMutation({
    mutationFn: (data: DentalAppointmentInput) => createDentalAppointment({ data }),
  });
}
