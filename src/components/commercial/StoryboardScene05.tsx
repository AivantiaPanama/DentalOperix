import {
  ArrowRight,
  Brain,
  CalendarDays,
  ClipboardCheck,
  HeartHandshake,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CommercialPresentationModel } from "@/features/commercial-demo/presentation/commercialPresentation.types";

type StoryboardScene05Props = {
  presentation: CommercialPresentationModel;
};

const knowledgePoints = [
  {
    title: "Qué ocurrió",
    description: "La solicitud ya ha dejado una huella clara en la operación.",
  },
  {
    title: "Dónde se encuentra el paciente",
    description: "El contexto permite situar al paciente dentro del recorrido sin perder claridad.",
  },
  {
    title: "Qué acciones ya fueron realizadas",
    description: "La clínica puede reconocer el avance sin tener que reconstruirlo desde cero.",
  },
  {
    title: "Cuál es el siguiente paso",
    description: "La continuidad aporta un sentido de dirección y preparación.",
  },
] as const;

const insightBullets = [
  "Los procesos organizados empiezan a generar comprensión.",
  "La información relacionada permite ver el estado del paciente y del recorrido.",
  "La clínica empieza a percibir valor en la continuidad, no solo en la ejecución.",
] as const;

export function StoryboardScene05({ presentation }: StoryboardScene05Props) {
  return (
    <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            S05 · La clínica comienza a ver conocimiento, no solo procesos
          </p>
          <h2 className="mt-3 text-3xl font-bold text-deep sm:text-4xl">
            Ahora entiendo mejor lo que está ocurriendo en mi clínica.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            La escena muestra cómo la información ya existente se convierte en comprensión
            operativa. No se trata de acumular datos, sino de comprender qué pasó, qué sigue y por
            qué la continuidad importa. {presentation.header.title} funciona aquí como el referente
            para esta transición de proceso a conocimiento.
          </p>
        </div>
        <Badge variant="secondary">Paso 5</Badge>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70 bg-background/70">
          <CardHeader>
            <CardTitle className="text-lg text-deep">Comprensión operativa</CardTitle>
            <CardDescription>La clínica ve relaciones, no solo hechos aislados.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {knowledgePoints.map((point, index) => {
                const icons = [ClipboardCheck, UserRound, Sparkles, CalendarDays];
                const Icon = icons[index] ?? Brain;
                return (
                  <div
                    key={point.title}
                    className="rounded-xl border border-border/60 bg-background/80 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-semibold text-deep">{point.title}</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {point.description}
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
            <CardTitle className="flex items-center gap-2 text-lg text-deep">
              <HeartHandshake className="h-5 w-5 text-primary" aria-hidden="true" />
              Conocimiento inicial
            </CardTitle>
            <CardDescription>Un entendimiento claro del valor de la continuidad.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {insightBullets.map((item) => (
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
