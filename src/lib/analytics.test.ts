import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { track, type AnalyticsEvent, type AnalyticsPayload } from "./analytics";

describe("analytics track", () => {
  const originalWindow = globalThis.window;

  beforeEach(() => {
    const listeners = new Map<string, EventListenerOrEventListenerObject>();
    const mockWindow = {
      addEventListener: vi.fn((event, listener) => listeners.set(event, listener)),
      removeEventListener: vi.fn((event) => listeners.delete(event)),
      dispatchEvent: vi.fn((event) => {
        const listener = listeners.get((event as CustomEvent).type);
        if (listener && typeof listener === "function") {
          listener(event);
        }
        return true;
      }),
    };
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      writable: true,
      value: mockWindow,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      writable: true,
      value: originalWindow,
    });
    vi.restoreAllMocks();
  });

  it("does not throw for valid events", () => {
    expect(() => track("chat_started")).not.toThrow();
  });

  it("includes whatsapp_clicked in AnalyticsEvent", () => {
    const eventName: AnalyticsEvent = "whatsapp_clicked";
    expect(eventName).toBe("whatsapp_clicked");
  });

  it("dispatches a CustomEvent with the correct payload", () => {
    const listener = vi.fn();
    window.addEventListener("dentaloperix:analytics", listener);

    const payload: AnalyticsPayload = { source: "whatsapp" };
    track("whatsapp_clicked", payload);

    expect(listener).toHaveBeenCalledTimes(1);
    const event = listener.mock.calls[0][0] as CustomEvent;
    expect(event.type).toBe("dentaloperix:analytics");
    expect(event.detail).toMatchObject({
      event: "whatsapp_clicked",
      payload,
    });
    expect(typeof event.detail.timestamp).toBe("string");
  });

  it("supports booking_completed and booking_failed events", () => {
    const listener = vi.fn();
    window.addEventListener("dentaloperix:analytics", listener);

    const completedPayload: AnalyticsPayload = {
      source: "chat-widget",
      serviceId: "ortodoncia",
      urgency: "alta",
    };
    track("booking_completed", completedPayload);

    const failedPayload: AnalyticsPayload = {
      source: "chat-widget",
      serviceId: "ortodoncia",
      urgency: "alta",
      error: "network failure",
    };
    track("booking_failed", failedPayload);

    expect(listener).toHaveBeenCalledTimes(2);

    const completedEvent = listener.mock.calls[0][0] as CustomEvent;
    expect(completedEvent.detail).toMatchObject({
      event: "booking_completed",
      payload: completedPayload,
    });

    const failedEvent = listener.mock.calls[1][0] as CustomEvent;
    expect(failedEvent.detail).toMatchObject({
      event: "booking_failed",
      payload: failedPayload,
    });
  });
});
