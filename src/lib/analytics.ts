export type LeadSource =
  | "chat-widget"
  | "hero-button"
  | "navbar-button"
  | "services-page"
  | "whatsapp"
  | "web-form";

export type AnalyticsEvent =
  | "chat_started"
  | "service_detected"
  | "urgency_detected"
  | "booking_intent"
  | "booking_dialog_opened"
  | "booking_submit_clicked"
  | "booking_submit_started"
  | "booking_completed"
  | "booking_submit_failed"
  | "booking_failed"
  | "whatsapp_clicked";

export type AnalyticsPayload = {
  source?: LeadSource;
  serviceId?: string;
  urgency?: "alta" | "media" | "baja";
  [key: string]: unknown;
};

export function track(event: AnalyticsEvent, payload?: AnalyticsPayload) {
  try {
    if (import.meta.env.DEV) {
      console.info("[analytics]", event, payload ?? {});
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("dentaloperix:analytics", {
          detail: {
            event,
            payload: payload ?? {},
            timestamp: new Date().toISOString(),
          },
        }),
      );
    }
  } catch (error) {
    console.error(error);
  }
}
