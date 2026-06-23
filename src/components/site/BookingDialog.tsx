import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { timeSlots, type Appointment } from "@/lib/clinic-data";
import { getBookedSlots, useAppointments } from "@/lib/appointments-store";
import { DENTAL_SERVICES, findDentalService, getDentalServiceById } from "@/data/dental-services";
import { useCreateDentalAppointment } from "@/lib/api/dental-hook";
import { track } from "@/lib/analytics";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CalendarDays,
  Clock,
  Sparkles,
} from "lucide-react";

export type BookingDialogInitialData = {
  name?: string;
  email?: string;
  phone?: string;
  serviceId?: string;
  service?: string;
  notes?: string;
  urgency?: "alta" | "media" | "baja";
  source?: "web-form" | "chat-widget";
  date?: string;
  time?: string;
  aiSummary?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialData?: BookingDialogInitialData;
};

type FormData = {
  name: string;
  email: string;
  phone: string;
  serviceId?: string;
  service: string;
  orthoType?: "brackets" | "alineadores";
  sensitivity?: "si" | "no";
  notes?: string;
  urgency?: "alta" | "media" | "baja";
  source?: "web-form" | "chat-widget";
  aiSummary?: string;
  date: string;
  time: string;
};

const empty: FormData = {
  name: "",
  email: "",
  phone: "",
  service: "",
  date: "",
  time: "",
};

export function buildBookingDialogData(initialData?: BookingDialogInitialData): FormData {
  const serviceMatch = initialData?.serviceId
    ? getDentalServiceById(initialData.serviceId)
    : initialData?.service
      ? findDentalService(initialData.service)
      : undefined;
  const predefinedService = serviceMatch?.label ?? initialData?.service ?? "";

  return {
    ...empty,
    name: initialData?.name ?? "",
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
    serviceId: initialData?.serviceId ?? serviceMatch?.id,
    service: predefinedService,
    notes: initialData?.notes ?? "",
    urgency: initialData?.urgency,
    source: initialData?.source ?? "web-form",
    aiSummary: initialData?.aiSummary,
    date: initialData?.date ?? "",
    time: initialData?.time ?? "",
  };
}

export function BookingDialog({ open, onOpenChange, initialData }: Props) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(buildBookingDialogData(initialData));
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [done, setDone] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<null | "saving">(null);
  const { add } = useAppointments();
  const mutation = useCreateDentalAppointment();

  useEffect(() => {
    if (open) {
      setStep(1);
      setErrors({});
      setSubmitting(null);
      setDone(false);
      setSuccessMessage(null);
      setData(buildBookingDialogData(initialData));
    }
  }, [open, initialData]);

  const validateStep1 = () => {
    const e: typeof errors = {};
    if (data.name.trim().length < 2) e.name = "Nombre mínimo 2 caracteres";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Email inválido";
    const phone = data.phone.replace(/\D/g, "");
    if (phone.length < 8 || phone.length > 10) e.phone = "Teléfono de 8 a 10 dígitos";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const validateStep2 = () => {
    const e: typeof errors = {};
    if (!data.serviceId) e.service = "Selecciona un servicio";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const validateStep3 = () => {
    const e: typeof errors = {};
    if (!data.date) e.date = "Selecciona una fecha";
    if (!data.time) e.time = "Selecciona una hora";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  const submit = async () => {
    track("booking_submit_clicked", {
      source: data.source,
      serviceId: data.serviceId,
      urgency: data.urgency,
      hasDate: Boolean(data.date),
      hasTime: Boolean(data.time),
    });

    if (submitting) return;

    if (!validateStep3()) {
      track("booking_submit_failed", {
        source: data.source,
        serviceId: data.serviceId,
        urgency: data.urgency,
        reason: "client_validation",
      });
      setServerError("Selecciona una fecha y un horario disponible para confirmar tu reserva.");
      return;
    }

    setServerError(null);
    setSubmitting("saving");
    track("booking_submit_started", {
      source: data.source,
      serviceId: data.serviceId,
      urgency: data.urgency,
    });

    const selectedServiceLabel = data.serviceId
      ? (getDentalServiceById(data.serviceId)?.label ?? data.service)
      : data.service;
    const notesFromExtras = data.orthoType
      ? `Tipo: ${data.orthoType}`
      : data.sensitivity
        ? `Sensibilidad: ${data.sensitivity}`
        : undefined;
    const combinedNotes =
      [data.urgency ? `Urgencia: ${data.urgency}` : undefined, data.notes?.trim(), notesFromExtras]
        .filter(Boolean)
        .join(" | ") || undefined;

    const appointmentInput = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      service: selectedServiceLabel,
      date: data.date,
      time: data.time,
      notes: combinedNotes,
      urgency: data.urgency,
      source: data.source ?? "web-form",
      aiSummary: data.aiSummary,
    };

    try {
      const result = await mutation.mutateAsync(appointmentInput);
      const appointment: Appointment = {
        id: `a_${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        date: data.date,
        time: data.time,
        status: result?.calendarCreated ? "confirmed" : "pending",
        notes: appointmentInput.notes,
      };
      add(appointment);
      track("booking_completed", {
        source: data.source,
        serviceId: data.serviceId,
        urgency: data.urgency,
      });
      setSuccessMessage(result?.message ?? "Tu cita fue registrada.");
      setDone(true);
    } catch (error) {
      track("booking_failed", {
        source: data.source,
        serviceId: data.serviceId,
        urgency: data.urgency,
        error: error instanceof Error ? error.message : "unknown",
      });
      setServerError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error creando tu cita. Intenta nuevamente.",
      );
    } finally {
      setSubmitting(null);
    }
  };

  const progress = done ? 100 : (step / 3) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-3xl p-0 overflow-hidden">
        <DialogDescription className="sr-only">
          Formulario para agendar una cita dental.
        </DialogDescription>
        <div className="gradient-deep px-6 py-5 text-white">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Agenda tu cita</DialogTitle>
          </DialogHeader>
          <p className="mt-1 text-sm text-white/70">
            Paso {done ? 3 : step} de 3 ·{" "}
            {done
              ? "Confirmada"
              : step === 1
                ? "Datos personales"
                : step === 2
                  ? "Servicio"
                  : "Fecha y hora"}
          </p>
          <div className="mt-3">
            <Progress value={progress} className="h-1.5 bg-white/15" />
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
          {done ? (
            <SuccessView
              successMessage={successMessage}
              data={data}
              onClose={() => onOpenChange(false)}
            />
          ) : submitting ? (
            <LoadingView state={submitting} />
          ) : step === 1 ? (
            <Step1 data={data} setData={setData} errors={errors} />
          ) : step === 2 ? (
            <Step2 data={data} setData={setData} errors={errors} />
          ) : (
            <Step3 data={data} setData={setData} errors={errors} />
          )}
          {serverError && (
            <p className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {serverError}
            </p>
          )}
        </div>

        {!done && (
          <div className="flex items-center justify-between border-t border-border px-6 py-4">
            <Button type="button" variant="ghost" onClick={back} disabled={step === 1 || Boolean(submitting)} className="rounded-full">
              <ChevronLeft className="mr-1 h-4 w-4" /> Atrás
            </Button>
            {step < 3 ? (
              <Button
                type="button"
                onClick={next}
                disabled={Boolean(submitting)}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Continuar <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={submit}
                disabled={Boolean(submitting)}
                aria-busy={Boolean(submitting)}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {submitting ? (
                  <>
                    Confirmando <Loader2 className="ml-1 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Confirmar reserva <Sparkles className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

type StepProps = {
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Partial<Record<keyof FormData, string>>;
};

function Step1({ data, setData, errors }: StepProps) {
  return (
    <div className="space-y-4 animate-fade-up">
      <div>
        <Label htmlFor="name">Nombre completo</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          placeholder="María González"
          className="mt-1.5 rounded-xl"
        />
        {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
      </div>
      <div>
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          placeholder="tu@email.cl"
          className="mt-1.5 rounded-xl"
        />
        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
      </div>
      <div>
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value })}
          placeholder="987654321"
          className="mt-1.5 rounded-xl"
        />
        {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
      </div>
    </div>
  );
}

function Step2({ data, setData, errors }: StepProps) {
  return (
    <div className="space-y-5 animate-fade-up">
      <div>
        <Label>Servicio</Label>
        <Select
          value={data.serviceId ?? ""}
          onValueChange={(v) => {
            const service = getDentalServiceById(v);
            setData({
              ...data,
              serviceId: v,
              service: service?.label ?? "",
              orthoType: undefined,
              sensitivity: undefined,
            });
          }}
        >
          <SelectTrigger className="mt-1.5 rounded-xl">
            <SelectValue placeholder="Elige el servicio que necesitas" />
          </SelectTrigger>
          <SelectContent>
            {DENTAL_SERVICES.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.service && <p className="mt-1 text-xs text-destructive">{errors.service}</p>}
      </div>

      {data.service === "Ortodoncia" && (
        <div className="rounded-2xl border border-border bg-secondary/40 p-4 animate-fade-up">
          <Label>¿Prefieres Brackets convencionales o Alineadores Invisibles?</Label>
          <RadioGroup
            value={data.orthoType ?? ""}
            onValueChange={(v) => {
              if (v === "brackets" || v === "alineadores") {
                setData({ ...data, orthoType: v });
              }
            }}
            className="mt-3 grid grid-cols-2 gap-3"
          >
            {([
              { v: "brackets", l: "Brackets" },
              { v: "alineadores", l: "Alineadores Invisibles" },
            ] satisfies Array<{ v: "brackets" | "alineadores"; l: string }>).map((o) => (
              <label
                key={o.v}
                className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition ${data.orthoType === o.v ? "border-primary bg-primary/5" : "border-border bg-white"}`}
              >
                <RadioGroupItem value={o.v} /> {o.l}
              </label>
            ))}
          </RadioGroup>
        </div>
      )}

      {data.service === "Diseño de Sonrisa" && (
        <div className="rounded-2xl border border-border bg-secondary/40 p-4 animate-fade-up">
          <Label>¿Has tenido sensibilidad dental antes?</Label>
          <RadioGroup
            value={data.sensitivity ?? ""}
            onValueChange={(v) => {
              if (v === "si" || v === "no") {
                setData({ ...data, sensitivity: v });
              }
            }}
            className="mt-3 grid grid-cols-2 gap-3"
          >
            {([
              { v: "si", l: "Sí" },
              { v: "no", l: "No" },
            ] satisfies Array<{ v: "si" | "no"; l: string }>).map((o) => (
              <label
                key={o.v}
                className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition ${data.sensitivity === o.v ? "border-primary bg-primary/5" : "border-border bg-white"}`}
              >
                <RadioGroupItem value={o.v} /> {o.l}
              </label>
            ))}
          </RadioGroup>
        </div>
      )}
    </div>
  );
}

function Step3({ data, setData, errors }: StepProps) {
  const [month, setMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const startOffset = (first.getDay() + 6) % 7; // monday-first
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= last.getDate(); d++)
      cells.push(new Date(month.getFullYear(), month.getMonth(), d));
    return cells;
  }, [month]);

  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const booked = data.date ? getBookedSlots(data.date) : [];
  const now = new Date();
  const isToday = data.date === fmt(now);

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="rounded-2xl border border-border p-4">
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            className="rounded-full p-1.5 hover:bg-secondary"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="text-sm font-semibold text-deep capitalize">
            {month.toLocaleDateString("es-CL", { month: "long", year: "numeric" })}
          </p>
          <button
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            className="rounded-full p-1.5 hover:bg-secondary"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-muted-foreground">
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {days.map((d, i) => {
            if (!d) return <div key={i} />;
            const past = d < today;
            const selected = data.date === fmt(d);
            return (
              <button
                key={i}
                disabled={past}
                onClick={() => setData({ ...data, date: fmt(d), time: "" })}
                className={`aspect-square rounded-lg text-sm transition ${
                  past
                    ? "text-muted-foreground/40 cursor-not-allowed"
                    : selected
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "hover:bg-secondary text-deep"
                }`}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
        {errors.date && <p className="mt-2 text-xs text-destructive">{errors.date}</p>}
      </div>

      {data.date && (
        <div className="animate-fade-up">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-deep">
            <Clock className="h-4 w-4 text-primary" /> Horarios disponibles
          </p>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map((t) => {
              const isBooked = booked.includes(t);
              const isPast = isToday && Number(t.split(":")[0]) <= now.getHours();
              const disabled = isBooked || isPast;
              const selected = data.time === t;
              return (
                <button
                  key={t}
                  disabled={disabled}
                  onClick={() => setData({ ...data, time: t })}
                  className={`rounded-xl border px-2 py-2.5 text-sm font-medium transition ${
                    disabled
                      ? "border-border bg-secondary/50 text-muted-foreground/50 line-through cursor-not-allowed"
                      : selected
                        ? "border-primary bg-primary text-primary-foreground shadow-soft"
                        : "border-border bg-white text-deep hover:border-primary hover:text-primary"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
          {errors.time && <p className="mt-2 text-xs text-destructive">{errors.time}</p>}
        </div>
      )}
    </div>
  );
}

function LoadingView({ state }: { state: "saving" }) {
  const text = state === "saving" ? "Confirmando tu cita y guardando el lead..." : "Procesando...";
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="relative">
        <div className="absolute inset-0 animate-pulse-ring rounded-full" />
        <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
      </div>
      <p className="mt-5 font-semibold text-deep">{text}</p>
      <p className="mt-1 text-sm text-muted-foreground">Esto solo toma unos segundos</p>
    </div>
  );
}

function SuccessView({
  successMessage,
  data,
  onClose,
}: {
  successMessage: string | null;
  data: FormData;
  onClose: () => void;
}) {
  const displayMessage =
    successMessage ??
    "Tu cita fue registrada correctamente. Te contactaremos para confirmar los detalles.";

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-up">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      <h3 className="mt-5 text-2xl font-bold text-deep">Cita Agendada</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{displayMessage}</p>
      <div className="mt-6 w-full max-w-md rounded-2xl border border-border bg-secondary/40 p-4 text-left">
        <p className="text-xs text-muted-foreground">Detalles de tu cita</p>
        <div className="mt-2 space-y-1.5 text-sm">
          <p className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-semibold text-deep">{data.service}</span>
          </p>
          <p className="flex items-center gap-2 text-deep">
            <CalendarDays className="h-4 w-4 text-primary" />
            {data.date} · {data.time} hrs
          </p>
        </div>
      </div>
      <Button
        onClick={onClose}
        className="mt-6 rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90"
      >
        Listo
      </Button>
    </div>
  );
}
