import { Link } from "@tanstack/react-router";
import { CalendarCheck, HeartHandshake, MessageCircle, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { BookingDialogInitialData } from "./BookingDialog";

const WHATSAPP_URL =
  "https://wa.me/56923456789?text=Hola%20DentalOperix.%20Me%20gustar%C3%ADa%20recibir%20orientaci%C3%B3n%20para%20una%20atenci%C3%B3n%20dental.";

type Props = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onContinueToBooking: () => void;
  onOpenChat?: () => void;
  initialData?: BookingDialogInitialData;
};

export function ClinicEntryDialog({
  open,
  onOpenChange,
  onContinueToBooking,
  onOpenChat,
  initialData,
}: Props) {
  const serviceLabel = initialData?.service ?? "tu atención dental";

  const handleChat = () => {
    onOpenChange(false);
    onOpenChat?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl overflow-hidden rounded-3xl p-0">
        <div className="gradient-deep px-6 py-6 text-white">
          <DialogHeader>
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-white">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <DialogTitle className="font-display text-2xl">Bienvenido a la clínica</DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-relaxed text-white/75">
              Estás por ingresar a un espacio de atención pensado para orientarte con calma, respeto
              y claridad.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="rounded-3xl border border-border bg-secondary/40 p-5">
            <p className="text-sm leading-relaxed text-deep/80">
              Tomaremos algunos datos para coordinar {serviceLabel}. Puedes avanzar a tu propio
              ritmo; si tienes dudas, también puedes conversar primero con nuestro asistente o
              hablar con el equipo por WhatsApp.
            </p>
          </div>

          <div className="grid gap-3">
            <Button
              onClick={onContinueToBooking}
              className="h-auto justify-start rounded-2xl bg-primary px-4 py-4 text-left text-primary-foreground hover:bg-primary/90"
            >
              <CalendarCheck className="mr-3 h-5 w-5 shrink-0" />
              <span>
                <span className="block font-semibold">Continuar para solicitar una cita</span>
                <span className="block text-xs font-normal text-primary-foreground/80">
                  Abriremos el formulario de agenda paso a paso.
                </span>
              </span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleChat}
              className="h-auto justify-start rounded-2xl px-4 py-4 text-left"
            >
              <MessageCircle className="mr-3 h-5 w-5 shrink-0 text-primary" />
              <span>
                <span className="block font-semibold text-deep">Conversar primero con la IA</span>
                <span className="block text-xs font-normal text-muted-foreground">
                  Recibe orientación general antes de continuar.
                </span>
              </span>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto justify-start rounded-2xl px-4 py-4 text-left"
            >
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                <MessageCircle className="mr-3 h-5 w-5 shrink-0 text-primary" />
                <span>
                  <span className="block font-semibold text-deep">Hablar por WhatsApp</span>
                  <span className="block text-xs font-normal text-muted-foreground">
                    Una opción directa si prefieres atención humana.
                  </span>
                </span>
              </a>
            </Button>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
            <span>La agenda formal siempre se realiza desde nuestro formulario seguro.</span>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            <Link
              to="/nuestra-filosofia"
              onClick={() => onOpenChange(false)}
              className="font-medium text-primary hover:underline"
            >
              Conoce nuestra filosofía de atención
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
