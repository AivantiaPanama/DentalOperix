import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageCircle, RefreshCw, Send, X } from "lucide-react";
import { findDentalService, normalizeDentalService } from "@/data/dental-services";
import { WhatsAppIcon } from "./WhatsAppIcon";
import type { BookingDialogInitialData } from "./BookingDialog";
import type { DentalService } from "@/data/dental-services";
import { track } from "@/lib/analytics";

export { normalizeDentalService };

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
  quickReplies?: string[];
};

export type AssistantStage =
  | "greeting"
  | "urgency_check"
  | "service_discovery"
  | "service_info"
  | "ready_to_book"
  | "fallback"
  | "done";

type ConversationHistoryItem = {
  stage: AssistantStage;
  user?: string;
  bot: string;
};

const GREETING_MESSAGE =
  "Hola, soy el asistente virtual de DentalOperix.\n\nAntes de continuar, ¿tu consulta es una urgencia dental o una consulta general?";
const GREETING_QUESTION = "¿Se trata de una urgencia dental o de una consulta general?";

const FALLBACK_MESSAGE =
  "No quiero darte información incorrecta. Puedo orientarte sobre:\n• Odontología Preventiva\n• Ortodoncia\n• Diseño de Sonrisa\n• Implantes Dentales\n• Odontopediatría\n• Blanqueamiento Dental\n• Endodoncia\n• Urgencias Dentales\n• Revisión Dental\n¿Cuál se parece más a tu caso?";

const UNKNOWN_ATTEMPTS_MESSAGE =
  "No estoy entendiendo correctamente tu consulta.\n\nSi lo prefieres, puedo abrir el formulario para que nuestro equipo revise tu caso.";

export const CONTACT_TEAM_BUTTON = "Contactar al equipo";
const CONTACT_TEAM_URL =
  "https://wa.me/56923456789?text=Hola%20DentalOperix.%20Necesito%20ayuda%20con%20mi%20consulta";

const URGENCY_RESPONSE =
  "Entiendo. No puedo diagnosticar por chat, pero los síntomas que describes requieren atención prioritaria. ¿Quieres que abra el formulario para agendar una cita de urgencia?";

const SERVICE_DISCOVERY_PROMPT =
  "Entiendo. Cuéntame brevemente qué te preocupa o qué te gustaría mejorar y te orientaré con el servicio más adecuado.";

const HIGH_URGENCY_TERMS = [
  "absceso",
  "sangrado",
  "fiebre",
  "infeccion",
  "fractura",
  "diente roto",
  "muela rota",
  "traumatismo",
  "se me cayo un diente",
];

const MODERATE_URGENCY_TERMS = [
  "dolor fuerte",
  "dolor intenso",
  "mucho dolor",
  "duele muchisimo",
  "no puedo dormir",
  "cara inflamada",
  "hinchazon",
  "inflamacion severa",
];

const URGENCY_TERMS = [
  ...HIGH_URGENCY_TERMS,
  ...MODERATE_URGENCY_TERMS,
  "urgencias dentales",
  "urgencia dental",
];

const BOOKING_INTENT_TERMS = [
  "quiero agendar",
  "quiero reservar",
  "agendar cita",
  "reservar cita",
  "abrir formulario",
  "hacer una cita",
  "programar una cita",
  "agendar valoracion",
  "quiero una cita",
  "quiero hacer cita",
];

const PRICE_PATTERN = /\b(precio|cuánto cuesta|costo|valor|tarifa|cotiza|cuesta)\b/;
const GENERAL_CONSULTATION_PATTERN =
  /\b(consulta general|consulta general dental|consulta dental|consulta|informaci[oó]n general|tratamiento general)\b/;
const VIEW_SERVICES_PATTERN =
  /\b(ver servicios|mostrar servicios|mostrar el catálogo|ver el catálogo)\b/;
const GREETING_PATTERN =
  /^(hola|buenas|buenos días|buenas tardes|buenas noches|qué tal|buen día)(\W|$)/i;
const YES_PATTERN = /^(s[ií]|sí|si|claro|vale|por supuesto)\b/;
const NO_PATTERN = /^(no|no gracias|prefiero|más adelante|no quiero|no, gracias)\b/;

const MAX_UNKNOWN_ATTEMPTS = 3;

export const AI_TEMPERATURE = 0.2;

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

export function isUrgencyMessage(input: string) {
  const normalized = normalizeText(input);
  return URGENCY_TERMS.some((term) => normalized.includes(term));
}

export function isBookingIntent(input: string) {
  const normalized = normalizeText(input);
  return BOOKING_INTENT_TERMS.some((term) => normalized.includes(term));
}

export function isViewServicesMessage(input: string) {
  return VIEW_SERVICES_PATTERN.test(normalizeText(input));
}

export function isPriceQuestion(input: string) {
  return PRICE_PATTERN.test(normalizeText(input));
}

export function isGeneralConsultationMessage(input: string) {
  return GENERAL_CONSULTATION_PATTERN.test(normalizeText(input));
}

export function isGreetingMessage(input: string) {
  return GREETING_PATTERN.test(input);
}

export function isYesMessage(input: string) {
  return YES_PATTERN.test(normalizeText(input));
}

export function isNoMessage(input: string) {
  return NO_PATTERN.test(normalizeText(input));
}

export function isAffirmativeMessage(input: string) {
  return isYesMessage(input);
}

export function isNegativeMessage(input: string) {
  return isNoMessage(input);
}

export function getFallbackResponse() {
  return FALLBACK_MESSAGE;
}

export function getPriceQuestionResponse() {
  return "No puedo dar un precio exacto sin una valoración profesional. Cada caso es diferente y el costo se define en consulta.";
}

export function getServiceInfoText(service: DentalService) {
  return `${service.label}: ${service.shortDescription}\n\n${service.patientExplanation}\n\nBeneficios:\n- ${service.benefits.join("\n- ")}\n\nIdeal para:\n- ${service.idealFor.join("\n- ")}\n\n${service.cta}`;
}

export function getUrgencyLevel(text: string): "alta" | "media" | null {
  const normalized = normalizeText(text);
  if (HIGH_URGENCY_TERMS.some((term) => normalized.includes(term))) {
    return "alta";
  }
  if (MODERATE_URGENCY_TERMS.some((term) => normalized.includes(term))) {
    return "media";
  }
  return null;
}

export function getQuickRepliesForStage(stage: AssistantStage) {
  switch (stage) {
    case "greeting":
      return [
        "Urgencia Dental",
        "Ortodoncia",
        "Implantes Dentales",
        "Diseño de Sonrisa",
        "Revisión Dental",
      ];
    case "urgency_check":
      return ["Urgencia Dental", "Consulta General"];
    case "service_discovery":
      return ["Ortodoncia", "Diseño de Sonrisa", "Implantes Dentales", "Revisión Dental"];
    case "service_info":
      return ["Sí, agendar valoración", "No, gracias", "Ver servicios"];
    case "fallback":
      return ["Abrir formulario", "Ver servicios", "Urgencias Dentales"];
    default:
      return [];
  }
}

export function getFallbackResponseForUnknownAttempts(attempts: number) {
  if (attempts >= MAX_UNKNOWN_ATTEMPTS) {
    return (
      "No estoy logrando identificar correctamente tu consulta.\n\n" +
      "Te recomiendo abrir el formulario para que nuestro equipo pueda ayudarte, " +
      "o contactarnos directamente si prefieres una respuesta más rápida."
    );
  }

  return attempts >= 2 ? UNKNOWN_ATTEMPTS_MESSAGE : FALLBACK_MESSAGE;
}

export function getFallbackQuickRepliesForUnknownAttempts(attempts: number) {
  if (attempts >= MAX_UNKNOWN_ATTEMPTS) {
    return ["Abrir formulario", CONTACT_TEAM_BUTTON];
  }

  return getQuickRepliesForStage("fallback");
}

export function shouldResetUnknownAttempts(nextStage: AssistantStage) {
  return nextStage !== "fallback";
}

export function getAssistantTransition(
  rawValue: string,
  stage: AssistantStage,
): {
  nextStage: AssistantStage;
  botMessage: string;
  service?: DentalService | null;
} {
  const value = rawValue.trim();
  const normalized = normalizeText(value);
  const service = findDentalService(value);
  const effectiveStage = stage === "fallback" ? "greeting" : stage;

  if (effectiveStage === "greeting") {
    if (isGreetingMessage(normalized)) {
      return {
        nextStage: "greeting",
        botMessage: GREETING_QUESTION,
      };
    }

    if (isPriceQuestion(normalized)) {
      return {
        nextStage: "fallback",
        botMessage: getPriceQuestionResponse(),
      };
    }

    if (isUrgencyMessage(normalized) && isBookingIntent(normalized)) {
      return {
        nextStage: "ready_to_book",
        botMessage:
          "Perfecto. Abro el formulario de urgencias dentales para que completes fecha y hora.",
      };
    }

    if (isUrgencyMessage(normalized)) {
      return {
        nextStage: "urgency_check",
        botMessage: URGENCY_RESPONSE,
      };
    }

    if (isGeneralConsultationMessage(normalized) || isViewServicesMessage(normalized)) {
      return {
        nextStage: "service_discovery",
        botMessage: SERVICE_DISCOVERY_PROMPT,
      };
    }

    if (service && isBookingIntent(normalized)) {
      return {
        nextStage: "ready_to_book",
        botMessage:
          "Perfecto. Abro el formulario para que completes fecha y hora de este servicio.",
        service,
      };
    }

    if (service) {
      return {
        nextStage: "service_info",
        botMessage: getServiceInfoText(service),
        service,
      };
    }

    if (isBookingIntent(normalized)) {
      return {
        nextStage: "ready_to_book",
        botMessage: "Perfecto. Abro el formulario para que completes fecha y hora de tu cita.",
      };
    }

    return {
      nextStage: "fallback",
      botMessage: FALLBACK_MESSAGE,
    };
  }

  if (effectiveStage === "urgency_check") {
    if (isBookingIntent(normalized) || isUrgencyMessage(normalized)) {
      return {
        nextStage: "ready_to_book",
        botMessage:
          "Perfecto. Abro el formulario de urgencias dentales para que completes fecha y hora.",
      };
    }

    if (isNegativeMessage(normalized) || isGeneralConsultationMessage(normalized)) {
      return {
        nextStage: "service_discovery",
        botMessage: SERVICE_DISCOVERY_PROMPT,
      };
    }

    return {
      nextStage: "fallback",
      botMessage:
        "Quiero asegurarme de tu intención. Responde si quieres agendar cita de urgencia o si necesitas información sobre un tratamiento.",
    };
  }

  if (effectiveStage === "service_discovery") {
    if (isPriceQuestion(normalized)) {
      return {
        nextStage: "fallback",
        botMessage: getPriceQuestionResponse(),
      };
    }

    if (service) {
      return {
        nextStage: "service_info",
        botMessage: getServiceInfoText(service),
        service,
      };
    }

    return {
      nextStage: "fallback",
      botMessage: FALLBACK_MESSAGE,
    };
  }

  if (effectiveStage === "service_info") {
    if (isBookingIntent(normalized)) {
      return {
        nextStage: "ready_to_book",
        botMessage:
          "Perfecto. Abro el formulario para que completes fecha y hora de este servicio.",
      };
    }

    if (isNegativeMessage(normalized)) {
      return {
        nextStage: "done",
        botMessage:
          "Entiendo. Si quieres consultar otro tratamiento o agendar más adelante, aquí estaré para ayudarte.",
      };
    }

    return {
      nextStage: "fallback",
      botMessage:
        "No quiero darte información incorrecta. Puedes decir 'Sí, agendar valoración' o elegir otro servicio del catálogo.",
    };
  }

  return {
    nextStage: "fallback",
    botMessage: FALLBACK_MESSAGE,
  };
}

function createMessage(role: "bot" | "user", text: string, quickReplies?: string[]): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    text,
    quickReplies,
  };
}

export function createUrgencyBookingData(notes?: string): BookingDialogInitialData {
  const urgency = notes ? (getUrgencyLevel(notes) ?? "alta") : "alta";
  const payload: BookingDialogInitialData = {
    serviceId: "urgencias-dentales",
    service: "Urgencias Dentales",
    urgency,
    source: "chat-widget",
    notes,
  };
  return {
    ...payload,
    aiSummary: createAiSummary(payload),
  };
}

export function createReviewDentalBookingData(): BookingDialogInitialData {
  return {
    serviceId: "revision-dental",
    service: "Revisión Dental",
    urgency: "media",
    source: "chat-widget",
    notes: "Paciente solicita valoración desde el asistente dental.",
    aiSummary: "El asistente no pudo clasificar la consulta. Se sugiere revisión dental.",
  };
}

function createAiSummary(payload: BookingDialogInitialData) {
  const service = payload.service ?? "consulta dental";
  const urgencyText =
    payload.urgency === "alta" ? "Se detecta urgencia." : "Se sugiere valoración.";
  const notes = payload.notes ? ` ${payload.notes}` : "";
  return `${service}. ${urgencyText}${notes}`;
}

type ChatBookingPayload = {
  serviceId?: string;
  service?: string;
  urgency?: "alta" | "media" | "baja";
  source: "chat-widget";
  notes?: string;
  aiSummary?: string;
};

export function buildChatBookingPayload(payload: BookingDialogInitialData): ChatBookingPayload {
  return {
    serviceId: payload.serviceId,
    service: payload.service,
    urgency: payload.urgency ?? "media",
    source: "chat-widget",
    notes: payload.notes,
    aiSummary: createAiSummary(payload),
  };
}

export function FloatingDentalAIChat({
  onBook,
}: {
  onBook?: (data: BookingDialogInitialData) => void;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stage, setStage] = useState<AssistantStage>("greeting");
  const [conversationHistory, setConversationHistory] = useState<ConversationHistoryItem[]>([]);
  const [bookingData, setBookingData] = useState<BookingDialogInitialData>({
    source: "chat-widget",
    urgency: "media",
  });
  const [unknownAttempts, setUnknownAttempts] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    if (messages.length === 0) {
      setMessages([createMessage("bot", GREETING_MESSAGE, getQuickRepliesForStage("greeting"))]);
      setConversationHistory([{ stage: "greeting", bot: GREETING_MESSAGE }]);
      setStage("greeting");
      setBookingData({ source: "chat-widget", urgency: "media" });
    }
  }, [open, messages.length]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.scrollTo({ top: panelRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, sending]);

  const appendMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev.slice(-11), message]);
  };

  const recordHistory = (item: ConversationHistoryItem) => {
    setConversationHistory((prev) => [...prev.slice(-7), item]);
  };

  const appendBot = (text: string, quickReplies?: string[], messageStage?: AssistantStage) => {
    const message = createMessage("bot", text, quickReplies);
    appendMessage(message);
    recordHistory({ stage: messageStage ?? stage, bot: text });
  };

  const appendUser = (text: string) => {
    const message = createMessage("user", text);
    appendMessage(message);
    recordHistory({ stage, user: text, bot: "" });
  };

  const processUserMessage = (rawValue: string) => {
    const value = rawValue.trim();
    if (!value) return;
    if (stage === "done") {
      setInputError("La conversación ya finalizó. Reinicia si deseas comenzar de nuevo.");
      return;
    }

    const { nextStage, botMessage, service } = getAssistantTransition(value, stage);
    let nextData = bookingData;
    if (service) {
      track("service_detected", { serviceId: service.id, service: service.label });
      nextData = {
        ...nextData,
        serviceId: service.id,
        service: service.label,
        source: "chat-widget",
      };
      setUnknownAttempts(0);
    }

    if (nextStage === "ready_to_book") {
      track("booking_intent", { query: value });
      if (stage === "urgency_check" || isUrgencyMessage(value)) {
        track("urgency_detected", { urgency: getUrgencyLevel(value) });
        nextData = createUrgencyBookingData(value);
      } else if (normalizeText(value).includes("abrir formulario")) {
        nextData = createReviewDentalBookingData();
      } else {
        nextData = {
          serviceId: nextData.serviceId,
          service: nextData.service,
          urgency: nextData.urgency ?? "media",
          source: "chat-widget",
          notes: nextData.notes ? nextData.notes : value,
        };
      }

      setUnknownAttempts(0);
      setBookingData(nextData);
      setStage(nextStage);
      appendBot(botMessage, undefined, nextStage);
      openBooking(nextData);
      return;
    }

    const isUnknownFallback =
      nextStage === "fallback" &&
      !service &&
      !isPriceQuestion(value) &&
      !isBookingIntent(value) &&
      !isUrgencyMessage(value) &&
      !isViewServicesMessage(value);

    if (isUnknownFallback) {
      const nextUnknownAttempts = unknownAttempts + 1;
      setUnknownAttempts(nextUnknownAttempts);
      const fallbackMessage = getFallbackResponseForUnknownAttempts(nextUnknownAttempts);
      const quickReplies = getFallbackQuickRepliesForUnknownAttempts(nextUnknownAttempts);
      setStage("fallback");
      appendBot(fallbackMessage, quickReplies, "fallback");
      return;
    }

    if (nextStage !== "fallback") {
      setUnknownAttempts(0);
    }

    setBookingData(nextData);
    setStage(nextStage);
    appendBot(botMessage, getQuickRepliesForStage(nextStage), nextStage);
  };

  const resetConversation = () => {
    const startMessage = createMessage(
      "bot",
      GREETING_MESSAGE,
      getQuickRepliesForStage("greeting"),
    );
    setBookingData({ source: "chat-widget", urgency: "media" });
    setStage("greeting");
    setInputValue("");
    setInputError(null);
    setSending(false);
    setStatus("idle");
    setServerError(null);
    setMessages([startMessage]);
    setConversationHistory([{ stage: "greeting", bot: GREETING_MESSAGE }]);
  };

  const openBooking = (payload: BookingDialogInitialData) => {
    const finalPayload: BookingDialogInitialData = {
      serviceId: payload.serviceId,
      service: payload.service,
      urgency: payload.urgency ?? "media",
      source: "chat-widget",
      notes: payload.notes,
      aiSummary: createAiSummary(payload),
    };

    if (process.env.NODE_ENV !== "production") {
      console.log("ASSISTANT BOOKING DATA:", finalPayload);
    }

    if (onBook) {
      track("booking_dialog_opened", {
        serviceId: finalPayload.serviceId,
        service: finalPayload.service,
        urgency: finalPayload.urgency,
      });
      onBook(finalPayload);
      appendBot(
        "Ingresa tus datos para agendar la cita. Ajusta fecha, hora y confirma tu cita allí.",
      );
      setStage("done");
      setStatus("sent");
      toast.success("Formulario listo para confirmar");
    } else {
      appendBot(
        "No pude abrir el formulario de reserva. Usa el botón de Agendar cita en la página.",
      );
      setStatus("error");
      setServerError("No fue posible abrir el formulario de agenda. Intenta nuevamente.");
    }
  };

  const handleTextSubmit = () => {
    const value = inputValue.trim();
    if (!value) {
      setInputError("Por favor escribe tu respuesta.");
      return;
    }

    setInputError(null);
    appendUser(value);
    setInputValue("");
    processUserMessage(value);
  };

  const handleQuickReply = (value: string) => {
    appendUser(value);

    if (value === CONTACT_TEAM_BUTTON) {
      track("whatsapp_clicked", {
        source: "whatsapp",
      });
      if (typeof window !== "undefined") {
        window.open(CONTACT_TEAM_URL, "_blank");
      }
      appendBot(
        "Te dirijo a WhatsApp para que puedas contactar al equipo directamente. Si necesitas, también puedes volver a este chat.",
      );
      setStage("done");
      return;
    }

    processUserMessage(value);
  };

  const renderInputArea = () => {
    if (status !== "idle" || stage === "done") return null;

    return (
      <div className="grid gap-3">
        <div className="relative">
          <Input
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value);
              setInputError(null);
            }}
            placeholder="Escribe aquí..."
            className="mt-1 pr-10"
            aria-label="Campo de respuesta del asistente"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleTextSubmit();
              }
            }}
          />
          <button
            type="button"
            aria-label="Reiniciar conversación"
            onClick={resetConversation}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-500 hover:bg-slate-100"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          {inputError && <p className="mt-1 text-xs text-destructive">{inputError}</p>}
        </div>
        <Button className="w-full" onClick={handleTextSubmit} disabled={sending}>
          Continuar
          <Send className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <>
      <Toaster position="bottom-right" />

      <button
        aria-label="Abrir asistente dental"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow transition-transform hover:scale-105"
        onClick={() =>
          setOpen((value) => {
            if (!value) track("chat_started");
            return !value;
          })
        }
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[38rem] w-[24rem] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-[2rem] border border-border bg-white shadow-2xl">
          <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-primary to-emerald-500 px-4 py-4 text-white">
            <div>
              <p className="font-semibold">Asistente DentalOperix</p>
              <p className="text-xs text-white/80">Orientación rápida y pre-captura de reserva</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/20 p-2 text-white transition hover:bg-white/10"
              aria-label="Cerrar chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={panelRef} className="flex-1 space-y-3 overflow-y-auto p-4 bg-slate-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-white text-slate-900 shadow-sm rounded-bl-none"
                  }`}
                >
                  {message.text.split("\n").map((line, index) => (
                    <p key={index} className={index > 0 ? "mt-1" : undefined}>
                      {line}
                    </p>
                  ))}

                  {message.role === "bot" && message.quickReplies?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.quickReplies.map((reply) => {
                        const button = (
                          <Button
                            key={reply}
                            type="button"
                            variant={
                              reply === CONTACT_TEAM_BUTTON
                                ? "default"
                                : reply === "Abrir formulario"
                                  ? "default"
                                  : "outline"
                            }
                            size="sm"
                            className={
                              reply === CONTACT_TEAM_BUTTON
                                ? "rounded-full px-3 py-1 text-xs bg-emerald-100 text-emerald-900 border-emerald-200 hover:bg-emerald-200"
                                : reply === "Abrir formulario"
                                  ? "rounded-full px-3 py-1 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                                  : "rounded-full px-3 py-1 text-xs"
                            }
                            onClick={() => handleQuickReply(reply)}
                          >
                            {reply === CONTACT_TEAM_BUTTON ? (
                              <WhatsAppIcon className="h-3.5 w-3.5" />
                            ) : null}
                            {reply}
                          </Button>
                        );

                        return reply === CONTACT_TEAM_BUTTON ? (
                          <TooltipProvider key={reply}>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger asChild>{button}</TooltipTrigger>
                              <TooltipContent side="top">
                                Contacta al equipo por WhatsApp
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          button
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-border bg-white p-4">
            {status === "sent" && (
              <div className="grid gap-2">
                <p className="text-sm text-slate-600">
                  Formulario abierto. Completa la fecha y confirma tu reserva.
                </p>
                <Button variant="ghost" className="w-full" onClick={resetConversation}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            )}

            {status === "error" && (
              <div className="grid gap-2">
                <p className="text-sm text-destructive">
                  {serverError || "Hubo un problema con el asistente."}
                </p>
                <Button className="w-full" onClick={resetConversation}>
                  Reiniciar conversación
                </Button>
              </div>
            )}

            {status === "idle" && renderInputArea()}
          </div>
        </div>
      )}
    </>
  );
}
