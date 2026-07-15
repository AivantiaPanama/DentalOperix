import { ArrowRight, CheckCircle2, Clock3, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DemoStageStatus = "completed" | "current" | "pending";

type DemoStageItem = {
  id: string;
  name: string;
  scene: string;
  actor: string;
  purpose: string;
  status: DemoStageStatus;
};

const demoStages: DemoStageItem[] = [
  {
    id: "arrival",
    name: "Llegada e introducción de la clínica",
    scene: "S01",
    actor: "Paciente potencial",
    purpose: "Presentar el contexto de la clínica y el inicio del recorrido.",
    status: "current",
  },
  {
    id: "diagnosis",
    name: "Situación actual y diagnóstico operativo",
    scene: "S02",
    actor: "Administración",
    purpose: "Mostrar que la clínica necesita claridad operativa y continuidad.",
    status: "completed",
  },
  {
    id: "introduction",
    name: "Introducción a DentalOperix",
    scene: "S03",
    actor: "Visitante de la demostración",
    purpose: "Explicar que la experiencia se vive como una historia operativa completa.",
    status: "completed",
  },
  {
    id: "booking",
    name: "Reserva y primer contacto",
    scene: "S04",
    actor: "Paciente",
    purpose: "Mostrar cómo el primer contacto se convierte en una oportunidad real.",
    status: "pending",
  },
  {
    id: "reception",
    name: "Recepción y coordinación del asistente",
    scene: "S05",
    actor: "Asistente",
    purpose: "Mostrar la gestión operativa del caso desde la entrada inicial.",
    status: "pending",
  },
  {
    id: "agenda",
    name: "Agenda y contexto del paciente",
    scene: "S06",
    actor: "Asistente",
    purpose: "Mostrar cómo la clínica organiza la presencia del paciente en el día.",
    status: "pending",
  },
  {
    id: "doctor",
    name: "Registro clínico y trabajo del doctor",
    scene: "S07",
    actor: "Doctor",
    purpose: "Conectar el contexto clínico con la continuidad operativa.",
    status: "pending",
  },
  {
    id: "followup",
    name: "Seguimiento y administración",
    scene: "S08",
    actor: "Administración",
    purpose: "Mostrar cómo la continuidad se sostiene después del encuentro.",
    status: "pending",
  },
  {
    id: "feedback",
    name: "Indicadores y reporte final",
    scene: "S09",
    actor: "Directivo",
    purpose: "Sintetizar la evidencia y cerrar la experiencia con claridad.",
    status: "pending",
  },
];

function statusMeta(status: DemoStageStatus) {
  switch (status) {
    case "current":
      return {
        label: "Actual",
        className: "border-primary/20 bg-primary/10 text-primary",
        icon: Sparkles,
      };
    case "completed":
      return {
        label: "Presente",
        className: "border-emerald-200 bg-emerald-50 text-emerald-700",
        icon: CheckCircle2,
      };
    default:
      return {
        label: "Pendiente",
        className: "border-border bg-background/70 text-muted-foreground",
        icon: Clock3,
      };
  }
}

export function DemoStageOrientation() {
  const currentStage = demoStages.find((stage) => stage.status === "current") ?? demoStages[0];
  const previousStage = demoStages.find((stage) => stage.status === "completed") ?? demoStages[0];
  const nextStage =
    demoStages.find((stage) => stage.status === "pending") ?? demoStages[demoStages.length - 1];

  return (
    <section className="rounded-3xl border border-border bg-background/70 p-6 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Guía de la experiencia
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-deep sm:text-3xl">
            El recorrido se presenta como una historia guiada, no como una colección de pantallas.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Este bloque orienta al visitante sobre el lugar que ocupa dentro de la demostración, el
            actor que participa y la dirección que tomará la experiencia en etapas futuras.
          </p>
        </div>
        <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
          Etapa actual · {currentStage.scene}
        </Badge>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-primary/20 bg-primary/5 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg text-deep">Etapa actual</CardTitle>
            <CardDescription>
              La narrativa que el visitante está viviendo en este momento.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-background/70 text-primary">
                {currentStage.scene}
              </Badge>
              <Badge variant="outline" className="border-primary/20 bg-background/70 text-primary">
                {currentStage.actor}
              </Badge>
            </div>
            <h3 className="text-xl font-semibold text-deep">{currentStage.name}</h3>
            <p className="text-sm leading-7 text-muted-foreground">{currentStage.purpose}</p>
          </CardContent>
        </Card>

        <div className="grid gap-3">
          <Card className="border-border/70 bg-background/70">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-deep">Anterior</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-foreground">{previousStage.name}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                La historia ya ha presentado este contexto como parte del recorrido inicial.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-background/70">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-deep">Siguiente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-foreground">{nextStage.name}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                La siguiente etapa forma parte del recorrido futuro de la demostración.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {demoStages.map((stage) => {
          const meta = statusMeta(stage.status);
          const Icon = meta.icon;

          return (
            <div
              key={stage.id}
              className={`rounded-2xl border p-4 ${stage.status === "current" ? "border-primary/20 bg-primary/5" : "border-border bg-background/70"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline" className={meta.className}>
                  <Icon className="mr-1 h-3.5 w-3.5" />
                  {meta.label}
                </Badge>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {stage.scene}
                </span>
              </div>
              <p className="mt-3 font-semibold text-deep">{stage.name}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{stage.actor}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{stage.purpose}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <ArrowRight className="h-4 w-4 text-primary" />
        La intención es orientar al visitante con claridad sin presentar aún los flujos operativos
        completos.
      </div>
    </section>
  );
}
