import { z } from "zod";
import { DENTAL_SERVICES } from "@/data/dental-services";

const ALLOWED_DENTAL_SERVICES = new Set(
  DENTAL_SERVICES.flatMap((service) => [service.label, service.id, ...service.aliases]).map(
    (value) => value.trim().toLocaleLowerCase("es"),
  ),
);

export function isAllowedDentalService(service: string) {
  return ALLOWED_DENTAL_SERVICES.has(service.trim().toLocaleLowerCase("es"));
}

export const googleLeadPayloadSchema = z.object({
  name: z.string().min(2, "Ingresa tu nombre."),
  email: z.string().email("Ingresa un correo válido."),
  phone: z.string().min(8, "Ingresa un teléfono válido.").max(20, "Teléfono demasiado largo."),
  service: z
    .string()
    .trim()
    .min(1, "Describe el tratamiento que buscas.")
    .refine(isAllowedDentalService, "Selecciona un servicio válido del catálogo."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Selecciona una fecha válida."),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Selecciona una hora válida."),
  notes: z.string().optional(),
  preferredDate: z.string().optional(),
  source: z.string().optional(),
});

export type GoogleLeadPayload = z.infer<typeof googleLeadPayloadSchema>;
