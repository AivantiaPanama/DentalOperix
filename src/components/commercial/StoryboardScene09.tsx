import {
  ArrowRight,
  Brain,
  Building2,
  HeartHandshake,
  RefreshCcw,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CommercialPresentationModel } from "@/features/commercial-demo/presentation/commercialPresentation.types";

type StoryboardScene09Props = {
  presentation: CommercialPresentationModel;
};

const integratedCapacities = [
  {
    title: "Experiencia",
    description: "Cada interacción deja una comprensión útil para la clínica.",
  },
  {
    title: "Aprendizaje",
    description: "Lo comprendido puede aplicarse nuevamente en nuevas decisiones.",
  },
  {
    title: "Memoria institucional",
    description:
      "La organización conserva ese aprendizaje y lo pone al servicio de la continuidad.",
  },
  {
    title: "Decisiones fundamentadas",
    description: "La clínica actúa con mayor sentido porque cuenta con una base compartida.",
  },
] as const;

const evolutionLoop = [
  "Experiencia → aprendizaje",
  "Aprendizaje → memoria institucional",
  "Memoria institucional → decisiones fundamentadas",
  "Decisiones fundamentadas → mejora continua",
  "Mejora continua → nueva experiencia",
] as const;

export function StoryboardScene09({ presentation }: StoryboardScene09Props) {
  return (
    <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            S09 · La clínica se convierte en una organización que evoluciona
          </p>
          <h2 className="mt-3 text-3xl font-bold text-deep sm:text-4xl">
            Ahora nuestra capacidad para mejorar forma parte de la organización.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Esta escena integra lo que la clínica ha demostrado durante el recorrido: la experiencia
            se transforma en aprendizaje, el aprendizaje se conserva y la organización puede
            continuar mejorando con mayor coherencia. {presentation.header.title} sirve como
            referencia para este cierre de ciclo organizacional.
          </p>
        </div>
        <Badge variant="secondary">Paso 9</Badge>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70 bg-background/70">
          <CardHeader>
            <CardTitle className="text-lg text-deep">Capacidades integradas</CardTitle>
            <CardDescription>
              La evolución aparece porque las capacidades previas funcionan como un sistema
              coherente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {integratedCapacities.map((item, index) => {
                const icons = [Brain, Building2, HeartHandshake, Sparkles];
                const Icon = icons[index] ?? RefreshCcw;
                return (
                  <div
                    key={item.title}
                    className="rounded-xl border border-border/60 bg-background/80 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-semibold text-deep">{item.title}</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {item.description}
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
              <RefreshCcw className="h-5 w-5 text-primary" aria-hidden="true" />
              Mejora continua
            </CardTitle>
            <CardDescription>
              El ciclo de evolución se vuelve una propiedad de la organización.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {evolutionLoop.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <UserRound className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">
                  La organización no solo funciona mejor; ahora puede sostener su propia mejora de
                  forma continua.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
