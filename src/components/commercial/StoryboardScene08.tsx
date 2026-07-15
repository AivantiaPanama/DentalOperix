import {
  ArrowRight,
  BookOpenCheck,
  Brain,
  Building2,
  HeartHandshake,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CommercialPresentationModel } from "@/features/commercial-demo/presentation/commercialPresentation.types";

type StoryboardScene08Props = {
  presentation: CommercialPresentationModel;
};

const institutionalLearning = [
  {
    title: "Experiencia vivida",
    description: "Una situación concreta deja una huella útil para la clínica.",
  },
  {
    title: "Aprendizaje compartido",
    description: "Lo que se comprendió puede volver a servir en nuevas ocasiones.",
  },
  {
    title: "Memoria institucional",
    description:
      "El aprendizaje permanece disponible para la organización y no depende solo de una persona.",
  },
] as const;

const continuitySignals = [
  "La clínica conserva el sentido de lo que funcionó y lo que conviene repetir.",
  "El conocimiento se vuelve parte de la forma de trabajar de la organización.",
  "La continuidad ya no depende de la memoria individual, sino del aprendizaje compartido.",
] as const;

export function StoryboardScene08({ presentation }: StoryboardScene08Props) {
  return (
    <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            S08 · La clínica construye memoria institucional
          </p>
          <h2 className="mt-3 text-3xl font-bold text-deep sm:text-4xl">
            Lo que aprendemos ya no depende de una persona; ahora forma parte de nuestra
            organización.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            La escena representa el momento en que la clínica transforma una experiencia vivida en
            un aprendizaje reutilizable. No se trata de guardar información, sino de asegurar que la
            organización pueda seguir mejorando. {presentation.header.title} sirve como referencia
            para esta continuidad del conocimiento.
          </p>
        </div>
        <Badge variant="secondary">Paso 8</Badge>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70 bg-background/70">
          <CardHeader>
            <CardTitle className="text-lg text-deep">Memoria institucional</CardTitle>
            <CardDescription>
              Un aprendizaje que permanece disponible para la organización.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {institutionalLearning.map((item, index) => {
                const icons = [BookOpenCheck, Brain, Building2];
                const Icon = icons[index] ?? Sparkles;
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
              <HeartHandshake className="h-5 w-5 text-primary" aria-hidden="true" />
              Continuidad organizacional
            </CardTitle>
            <CardDescription>
              El aprendizaje se convierte en una base para seguir avanzando.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {continuitySignals.map((item) => (
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
                  La organización ya no necesita volver a aprenderlo todo desde cero; el
                  conocimiento queda disponible para seguir actuando con sentido.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
