import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Mail,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CommercialPresentationModel } from "@/features/commercial-demo/presentation/commercialPresentation.types";

type StoryboardScene04Props = {
  presentation: CommercialPresentationModel;
};

const observableSteps = [
  {
    title: "Paciente solicita una cita",
    description:
      "La necesidad aparece en el punto de contacto y se vuelve visible para la clínica.",
  },
  {
    title: "DentalOperix recibe la solicitud",
    description: "La información entra a un flujo compartido y deja de depender de la memoria.",
  },
  {
    title: "El lead queda organizado",
    description: "La información comienza a estructurarse para sostener el siguiente paso.",
  },
  {
    title: "La agenda queda preparada",
    description: "El siguiente movimiento se vuelve más claro para la operación diaria.",
  },
  {
    title: "La confirmación es enviada",
    description: "La clínica recibe la respuesta con menos fricción y mayor continuidad.",
  },
] as const;

const witnessPoints = [
  "La asistente observa continuidad.",
  "El odontólogo recibe contexto preparado.",
  "La clínica comprende que la transformación ocurrió.",
] as const;

export function StoryboardScene04({ presentation }: StoryboardScene04Props) {
  return (
    <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            S04 · La primera transformación ocurre frente a la clínica
          </p>
          <h2 className="mt-3 text-3xl font-bold text-deep sm:text-4xl">
            Acabo de ver cómo una actividad que normalmente coordinamos manualmente ocurre de forma
            organizada frente a nosotros.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            La experiencia deja de ser una secuencia dispersa y se vuelve visible como una operación
            que avanza con claridad. {presentation.header.title} sirve aquí como el referente
            narrativo del cambio.
          </p>
        </div>
        <Badge variant="secondary">Paso 4</Badge>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70 bg-background/70">
          <CardHeader>
            <CardTitle className="text-lg text-deep">Transformación observable</CardTitle>
            <CardDescription>
              El recorrido se muestra como una experiencia visible y ordenada.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {observableSteps.map((step, index) => {
                const icons = [UserRound, ClipboardCheck, Sparkles, CalendarDays, Mail];
                const Icon = icons[index] ?? CheckCircle2;
                return (
                  <div
                    key={step.title}
                    className="rounded-xl border border-border/60 bg-background/80 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-semibold text-deep">{step.title}</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-background/70">
          <CardHeader>
            <CardTitle className="text-lg text-deep">Evidencia frente a la clínica</CardTitle>
            <CardDescription>
              La transformación ya no es una idea; se vuelve visible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {witnessPoints.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
