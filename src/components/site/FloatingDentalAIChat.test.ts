import { describe, expect, it } from "vitest";
import {
  getAssistantTransition,
  getFallbackResponse,
  getQuickRepliesForStage,
  getFallbackResponseForUnknownAttempts,
  getFallbackQuickRepliesForUnknownAttempts,
  getUrgencyLevel,
  isUrgencyMessage,
  isBookingIntent,
  createReviewDentalBookingData,
  createUrgencyBookingData,
  CONTACT_TEAM_BUTTON,
  buildChatBookingPayload,
  type AssistantStage,
} from "./FloatingDentalAIChat";
import { findDentalService } from "@/data/dental-services";
import { googleLeadPayloadSchema } from "@/lib/google/schemas";

// Removed normalizeDentalService tests because the assistant flow is now guided by service lookup and explicit state transitions.
describe("assistant flow", () => {
  it("mensaje incoherente activa fallback", () => {
    const transition = getAssistantTransition("no entiendo nada", "greeting");
    expect(transition.nextStage).toBe("fallback");
    expect(transition.botMessage).toBe(getFallbackResponse());
  });

  it("dolor intenso activa urgencia", () => {
    const transition = getAssistantTransition("Tengo dolor intenso en una muela", "greeting");
    expect(transition.nextStage).toBe("urgency_check");
    expect(transition.botMessage).toContain("requieren atención prioritaria");
  });

  it("implante mapea a Implantes Dentales", () => {
    const transition = getAssistantTransition("Necesito un implante", "service_discovery");
    expect(transition.service?.label).toBe("Implantes Dentales");
  });

  it("carillas mapea a Diseño de Sonrisa", () => {
    const transition = getAssistantTransition("Estoy interesado en carillas", "service_discovery");
    expect(transition.service?.label).toBe("Diseño de Sonrisa");
  });

  it("niños mapea a Odontopediatría", () => {
    const transition = getAssistantTransition("Es para niños", "service_discovery");
    expect(transition.service?.label).toBe("Odontopediatría");
  });

  it("falta un diente mapea a Implantes Dentales", () => {
    const transition = getAssistantTransition("Me falta un diente", "service_discovery");
    expect(transition.service?.label).toBe("Implantes Dentales");
  });

  it("pregunta de precio no inventa precio exacto", () => {
    const transition = getAssistantTransition("¿Cuánto cuesta un implante?", "greeting");
    expect(transition.botMessage).toContain("No puedo dar un precio exacto");
  });

  it("consulta general lleva a discovery de servicio", () => {
    const transition = getAssistantTransition("Quiero una consulta general", "greeting");
    expect(transition.nextStage).toBe("service_discovery");
    expect(transition.botMessage).toContain("Cuéntame brevemente qué te preocupa");
  });

  it("urgencia detectada prellena Urgencias Dentales y urgency alta", () => {
    const transition = getAssistantTransition("Tengo un absceso y dolor", "greeting");
    expect(transition.nextStage).toBe("urgency_check");
    expect(transition.botMessage).toContain("requieren atención prioritaria");
  });

  it("devuelve sugerencias de respuesta rápida según el estado", () => {
    expect(getQuickRepliesForStage("greeting")).toEqual([
      "Urgencia Dental",
      "Ortodoncia",
      "Implantes Dentales",
      "Diseño de Sonrisa",
      "Revisión Dental",
    ]);
    expect(getQuickRepliesForStage("urgency_check")).toEqual([
      "Urgencia Dental",
      "Consulta General",
    ]);
    expect(getQuickRepliesForStage("fallback")).toEqual([
      "Abrir formulario",
      "Ver servicios",
      "Urgencias Dentales",
    ]);
  });

  it("procesa quick reply de urgencia dental como urgencia", () => {
    const transition = getAssistantTransition("Urgencia Dental", "greeting");
    expect(transition.nextStage).toBe("urgency_check");
    expect(transition.botMessage).toContain("requieren atención prioritaria");
  });

  it("procesa quick reply de ortodoncia como servicio válido", () => {
    const transition = getAssistantTransition("Ortodoncia", "greeting");
    expect(transition.nextStage).toBe("service_info");
    expect(transition.service?.label).toBe("Ortodoncia");
  });

  it("procesa quick reply de consulta general en urgencia_check hacia discovery", () => {
    const transition = getAssistantTransition("Consulta General", "urgency_check");
    expect(transition.nextStage).toBe("service_discovery");
    expect(transition.botMessage).toContain("Cuéntame brevemente qué te preocupa");
  });

  it("detecta niveles de urgencia alta y media", () => {
    expect(getUrgencyLevel("absceso")).toBe("alta");
    expect(getUrgencyLevel("diente roto")).toBe("alta");
    expect(getUrgencyLevel("dolor intenso")).toBe("media");
    expect(getUrgencyLevel("cara inflamada")).toBe("media");
  });

  it("anti-loop muestra botón de contacto directo tras 3 intentos desconocidos", () => {
    expect(getFallbackResponseForUnknownAttempts(3)).toContain(
      "Te recomiendo abrir el formulario para que nuestro equipo pueda ayudarte",
    );
    expect(getFallbackQuickRepliesForUnknownAttempts(3)).toEqual([
      "Abrir formulario",
      CONTACT_TEAM_BUTTON,
    ]);
  });

  it("alarmas de urgencia normalizadas se detectan", () => {
    expect(isUrgencyMessage("tengo un absceso")).toBe(true);
    expect(isUrgencyMessage("se me cayó un diente")).toBe(true);
    expect(isUrgencyMessage("me duele muchísimo una muela")).toBe(true);
    expect(isUrgencyMessage("tengo la cara inflamada")).toBe(true);
    expect(isUrgencyMessage("no puedo dormir del dolor")).toBe(true);
  });

  it("dolor leve no activa urgencia alta", () => {
    expect(isUrgencyMessage("me duele un poco una muela")).toBe(false);
    expect(isUrgencyMessage("tengo dolor cuando tomo agua fría")).toBe(false);
  });

  it("urgencia genera payload de urgencias dentales", () => {
    const urgentPayload = createUrgencyBookingData("Tengo un absceso en la muela");
    expect(urgentPayload.serviceId).toBe("urgencias-dentales");
    expect(urgentPayload.service).toBe("Urgencias Dentales");
    expect(urgentPayload.urgency).toBe("alta");
    expect(urgentPayload.notes).toBe("Tengo un absceso en la muela");
    expect(urgentPayload.source).toBe("chat-widget");
    expect(urgentPayload.aiSummary).toContain("Urgencias Dentales");
  });

  it("booking intent es estricto y no acepta citas genéricas", () => {
    expect(isBookingIntent("quiero agendar")).toBe(true);
    expect(isBookingIntent("agendar cita")).toBe(true);
    expect(isBookingIntent("abrir formulario")).toBe(true);
    expect(isBookingIntent("cómo funciona una cita")).toBe(false);
    expect(isBookingIntent("cita")).toBe(false);
    expect(isBookingIntent("agenda")).toBe(false);
  });

  it("findDentalService mapea alias de catálogo correctamente", () => {
    expect(findDentalService("brackets")?.label).toBe("Ortodoncia");
    expect(findDentalService("carillas")?.label).toBe("Diseño de Sonrisa");
    expect(findDentalService("niños")?.label).toBe("Odontopediatría");
    expect(findDentalService("me falta un diente")?.label).toBe("Implantes Dentales");
  });

  it("abrir formulario de revisión dental prellena datos correctos", () => {
    const data = createReviewDentalBookingData();
    expect(data.serviceId).toBe("revision-dental");
    expect(data.service).toBe("Revisión Dental");
    expect(data.urgency).toBe("media");
    expect(data.notes).toContain("Paciente solicita valoración");
    expect(data.aiSummary).toContain("Se sugiere revisión dental");
  });

  it("intención de agendar abre BookingDialog", () => {
    const transition = getAssistantTransition("Quiero agendar una cita", "greeting");
    expect(transition.nextStage).toBe("ready_to_book");
    expect(transition.botMessage).toContain("Abro el formulario");
  });

  it("no detecta booking por solo mencionar un servicio", () => {
    const transition = getAssistantTransition("Necesito ortodoncia", "greeting");
    expect(transition.nextStage).toBe("service_info");
    expect(transition.service?.label).toBe("Ortodoncia");
  });

  it("Ok en service_info no debe pasar a agenda", () => {
    const transition = getAssistantTransition("Ok", "service_info");
    expect(transition.nextStage).toBe("fallback");
  });

  it("sí, quiero agendar en service_info sí debe abrir BookingDialog", () => {
    const transition = getAssistantTransition("Sí, quiero agendar", "service_info");
    expect(transition.nextStage).toBe("ready_to_book");
    expect(transition.botMessage).toContain("Abro el formulario");
  });

  it("servicio desconocido activa fallback", () => {
    const transition = getAssistantTransition(
      "Necesito algo raro que no existe",
      "service_discovery",
    );
    expect(transition.nextStage).toBe("fallback");
    expect(transition.botMessage).toBe(getFallbackResponse());
  });

  it("No se interpreta como negación en servicio", () => {
    const transition = getAssistantTransition("No", "service_info");
    expect(transition.nextStage).toBe("done");
  });

  it("saludo inicial pregunta qué necesita el paciente", () => {
    const transition = getAssistantTransition("hola", "greeting");
    expect(transition.nextStage).toBe("greeting");
    expect(transition.botMessage).toBe(
      "¿Se trata de una urgencia dental o de una consulta general?",
    );
  });

  it("AssistantStage no incluye error", () => {
    const stage: AssistantStage = "fallback";
    expect(stage).not.toBe("error");
  });

  it("buildChatBookingPayload no incluye datos de fecha/hora/personales", () => {
    const payload = createReviewDentalBookingData();
    const bookingPayload = buildChatBookingPayload(payload);

    expect(bookingPayload).toEqual({
      serviceId: payload.serviceId,
      service: payload.service,
      urgency: payload.urgency,
      source: payload.source,
      notes: payload.notes,
      aiSummary: expect.any(String),
    });
    expect(bookingPayload).not.toHaveProperty("date");
    expect(bookingPayload).not.toHaveProperty("time");
    expect(bookingPayload).not.toHaveProperty("name");
    expect(bookingPayload).not.toHaveProperty("phone");
    expect(bookingPayload).not.toHaveProperty("email");
  });
});

describe("googleLeadPayloadSchema", () => {
  it("accepts a valid payload with service", () => {
    const payload = {
      name: "Carlos",
      email: "carlos@example.com",
      phone: "+507 60000000",
      service: "limpieza",
      date: "2026-06-20",
      time: "10:00",
    };

    expect(googleLeadPayloadSchema.safeParse(payload).success).toBe(true);
  });

  it("rejects a payload with empty service", () => {
    const payload = {
      name: "Carlos",
      email: "carlos@example.com",
      phone: "+507 60000000",
      service: "  ",
      date: "2026-06-20",
      time: "10:00",
    };

    const result = googleLeadPayloadSchema.safeParse(payload);
    expect(result.success).toBe(false);
    expect(result.error.errors[0]?.message).toBe("Describe el tratamiento que buscas.");
  });
});
