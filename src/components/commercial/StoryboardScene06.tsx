import {
  ArrowRight,
  Brain,
  Building2,
  ClipboardCheck,
  HeartHandshake,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CommercialPresentationModel } from "@/features/commercial-demo/presentation/commercialPresentation.types";

type StoryboardScene06Props = {
  presentation: CommercialPresentationModel;
};

const actorChanges = [
  {
    title: "Recepción",
    before: "Esperaba instrucciones y dependía de memoria o coordinación manual.",
    after: "Conoce el siguiente paso, mantiene continuidad y actúa con contexto.",
  },
  {
    title: "Odontólogo",
    before: "Reconstruía el contexto del paciente desde cero.",
    after: "Recibe el contexto preparado y puede concentrarse en la atención clínica.",
  },
  {
    title: "Administrador",
    before: "Reaccionaba ante problemas cuando aparecían.",
    after: "Comienza a detectar oportunidades de mejora gracias al conocimiento disponible.",
  },
  {
    title: "Paciente",
    before: "Cada contacto parecía iniciar desde cero.",
    after: "Percibe continuidad y siente que la clínica recuerda su recorrido.",
  },
] as const;

const evolutionSignals = [
  "El conocimiento disponible cambia el comportamiento de las personas.",
  "La coordinación mejora porque cada actor comprende el siguiente paso.",
  "La clínica deja de reaccionar solo a los problemas y empieza a trabajar con mayor continuidad.",
] as const;

export function StoryboardScene06({ presentation }: StoryboardScene06Props) {
  return (
    <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            S06 · La clínica comienza a evolucionar
          </p>
          <h2 className="mt-3 text-3xl font-bold text-deep sm:text-4xl">
            Nuestra forma de trabajar ya no es la misma.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            El cambio ya no está solo en la organización de pasos: aparece en el comportamiento de
            las personas. Gracias al conocimiento disponible, cada actor empieza a trabajar con una
            nueva lógica de continuidad. {presentation.header.title} sirve aquí como el referente de
            esta evolución organizacional.
          </p>
        </div>
        <Badge variant="secondary">Paso 6</Badge>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/70 bg-background/70">
          <CardHeader>
            <CardTitle className="text-lg text-deep">Cambio de comportamiento por actor</CardTitle>
            <CardDescription>
              La evolución se observa en la forma de actuar de cada rol.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {actorChanges.map((actor, index) => {
                const icons = [Building2, Stethoscope, Brain, UserRound];
                const Icon = icons[index] ?? ClipboardCheck;
                return (
                  <div
                    key={actor.title}
                    className="rounded-xl border border-border/60 bg-background/80 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-semibold text-deep">{actor.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          <span className="font-medium text-deep">Antes:</span> {actor.before}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          <span className="font-medium text-deep">Después:</span> {actor.after}
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
              Señal de evolución
            </CardTitle>
            <CardDescription>La organización cambia de forma visible.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {evolutionSignals.map((item) => (
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
