import {
  ArrowRight,
  ClipboardCheck,
  HeartHandshake,
  Stethoscope,
  UserRound,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CommercialPresentationModel } from "@/features/commercial-demo/presentation/commercialPresentation.types";

type StoryboardScene02Props = {
  presentation: CommercialPresentationModel;
};

const sceneActors = [
  {
    icon: UserRound,
    title: "Paciente",
    description: "Solicita atención y empieza a ser escuchado dentro de un contexto más claro.",
  },
  {
    icon: ClipboardCheck,
    title: "Asistente",
    description:
      "Deja de depender solo de memoria y múltiples herramientas para trabajar con contexto compartido.",
  },
  {
    icon: Stethoscope,
    title: "Odontólogo",
    description:
      "Recibe información preparada antes de atender, con mayor espacio para la atención clínica.",
  },
  {
    icon: Users,
    title: "Administración",
    description:
      "Recupera continuidad y observa menos interrupciones gracias a una coordinación creciente.",
  },
] as const;

const sharedContextSignals = [
  "La información empieza a circular con menos relectura y menos pérdida de contexto.",
  "La coordinación manual se vuelve más fluida al compartir un mismo punto de referencia.",
  "Los tiempos de transición se vuelven más predecibles y menos fragmentados.",
  "La operación comienza a sentirse como un conjunto conectado, no como piezas aisladas.",
] as const;

export function StoryboardScene02({ presentation }: StoryboardScene02Props) {
  return (
    <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            S02 · La operación comienza a conectarse
          </p>
          <h2 className="mt-3 text-3xl font-bold text-deep sm:text-4xl">
            La clínica empieza a mostrar cómo comparten un mismo contexto operativo.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            S01 mostraba la fragmentación. S02 muestra el inicio del cambio: la información ya no
            solo vive en la memoria, sino en un entorno compartido que ayuda a sostener la
            continuidad. {presentation.header.title} se convierte en un puente narrativo para esta
            transición.
          </p>
        </div>
        <Badge variant="secondary">Paso 2</Badge>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        {sceneActors.map((actor) => {
          const Icon = actor.icon;
          return (
            <Card key={actor.title} className="border-border/70 bg-background/70 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-deep">
                  <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  {actor.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-6">{actor.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/70 bg-background/70">
          <CardHeader>
            <CardTitle className="text-lg text-deep">Señales del cambio</CardTitle>
            <CardDescription>
              La transformación aún está empezando, pero ya es visible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {sharedContextSignals.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-background/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-deep">
              <HeartHandshake className="h-5 w-5 text-primary" aria-hidden="true" />
              Idea central
            </CardTitle>
            <CardDescription>
              La clínica empieza a reconocer que el cambio ha comenzado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-7 text-muted-foreground">
              “Ahora entiendo cómo comienza el cambio.”
            </p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              La historia está lista para avanzar hacia una experiencia más conectada, sin mostrar
              todavía la solución completa.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
