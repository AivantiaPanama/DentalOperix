import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppImage from "./WhatsApp.png";

type Msg = { role: "user" | "bot"; text: string; cta?: boolean };

const greeting: Msg = {
  role: "bot",
  text: "Hola, soy tu asistente dental virtual. ¿En qué puedo ayudarte hoy?",
};

const quickReplies = [
  "¿Duele un implante?",
  "¿Cuánto dura un blanqueamiento?",
  "Cuidados después de una extracción",
  "Quiero una cita",
];

// TODO: aquí se conectará con OpenAI / Voiceflow u otra API externa
function getBotReply(input: string): Msg {
  const q = input.toLowerCase();
  if (/cita|agendar|reservar|hora/.test(q)) {
    return {
      role: "bot",
      text: "¡Por supuesto! Te ayudo a agendar tu cita con uno de nuestros especialistas. Puedes abrir el formulario aquí abajo 👇",
      cta: true,
    };
  }
  if (/implante.*duel|duele.*implante/.test(q)) {
    return {
      role: "bot",
      text: "El procedimiento se realiza con anestesia local, por lo que no sentirás dolor durante. Después puede haber molestias leves controladas con analgésicos comunes durante 2-3 días.",
    };
  }
  if (/blanqueamiento/.test(q)) {
    return {
      role: "bot",
      text: "Un blanqueamiento profesional dura en promedio entre 6 meses y 2 años, dependiendo de tus hábitos (café, té, tabaco) y de tu higiene dental.",
    };
  }
  if (/extracci[oó]n|extraer/.test(q)) {
    return {
      role: "bot",
      text: "Tras una extracción: muerde la gasa 30-45 min, evita enjuagues fuertes las primeras 24h, dieta blanda y fría, no fumes ni uses bombilla. Si hay dolor intenso o sangrado persistente, contáctanos.",
    };
  }
  if (/hola|buenas|buenos/.test(q)) {
    return {
      role: "bot",
      text: "¡Hola! 👋 Cuéntame, ¿tienes alguna duda sobre tratamientos o quieres agendar una cita?",
    };
  }
  return {
    role: "bot",
    text: "Gracias por tu mensaje. Un especialista podrá darte una respuesta más precisa. ¿Quieres que te ayude a agendar una cita?",
    cta: true,
  };
}

export function Chatbot({ onBook }: { onBook: () => void }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([greeting]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);
    setTimeout(
      () => {
        setMessages((m) => [...m, getBotReply(trimmed)]);
        setTyping(false);
      },
      700 + Math.random() * 500,
    );
  };

  return (
    <>
      <a
        href="https://wa.me/56923456789?text=Hola%20DentalOperix.%20quiero%20chatear%20por%20WhatsApp"
        target="_blank"
        rel="noreferrer"
        aria-label="Chatear por WhatsApp"
        className="fixed bottom-5 right-20 z-50 grid h-14 w-14 place-items-center rounded-full bg-white shadow-glow transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        <img src={WhatsAppImage} alt="WhatsApp" className="h-[55px] w-[55px]" />
      </a>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir chat"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full gradient-deep text-white shadow-glow transition-transform hover:scale-105 animate-pulse-ring"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[34rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-glow animate-fade-up">
          <div className="flex items-center gap-3 gradient-deep px-4 py-3 text-white">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-white/15">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Asistente Dental</p>
              <p className="text-[11px] text-white/70 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> En línea
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-full p-1.5 hover:bg-white/10">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-secondary/30 p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[80%] space-y-2">
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-white text-deep border border-border rounded-bl-md"
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.cta && (
                    <Button
                      onClick={onBook}
                      size="sm"
                      className="rounded-full bg-deep text-white hover:bg-primary"
                    >
                      <CalendarPlus className="mr-1.5 h-3.5 w-3.5" /> Abrir formulario de reserva
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-white px-3.5 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                </div>
              </div>
            )}
          </div>

          {messages.length <= 2 && (
            <div className="flex flex-wrap gap-1.5 border-t border-border bg-white px-3 pt-3">
              {quickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border border-border bg-white px-3 py-1.5 text-[11px] text-deep hover:border-primary hover:text-primary"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border bg-white p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              className="flex-1 rounded-full border border-border bg-secondary/40 px-4 py-2 text-sm outline-none focus:border-primary focus:bg-white"
            />
            <button
              type="submit"
              className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
