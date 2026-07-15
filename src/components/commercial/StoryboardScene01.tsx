import { ArrowRight, ClipboardCheck, Stethoscope, UserRound, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CommercialPresentationModel } from "@/features/commercial-demo/presentation/commercialPresentation.types";

type StoryboardScene01Props = {
  presentation: CommercialPresentationModel;
};

const sceneActors = [
  {
    icon: UserRound,
    title: "Paciente",
    description: "Necesita orientación, atención y una respuesta oportuna.",
  },
  {
    icon: ClipboardCheck,
    title: "Asistente",
    description: "Coordina llamadas, mensajes, agenda y pacientes con esfuerzo manual.",
  },
  {
    icon: Stethoscope,
    title: "Odontólogo",
    description: "Requiere información organizada y tiempo clínico disponible.",
  },
  {
    icon: Users,
    title: "Administración",
    description: "Busca continuidad, control y crecimiento sin perder claridad operativa.",
  },
] as const;

const operationalConsequences = [
  "Interrupciones frecuentes entre contacto, agenda y seguimiento.",
  "Información dispersa que obliga a reconstruir contextos manualmente.",
  "Dependencia de la memoria para sostener la continuidad del día.",
  "Procesos que todavía no se encuentran conectados en una misma operación.",
] as const;

export function StoryboardScene01({ presentation }: StoryboardScene01Props) {
  return (
    <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            S01 · La realidad actual
          </p>
          <h2 className="mt-3 text-3xl font-bold text-deep sm:text-4xl">
            Antes de la solución, la operación ya está en movimiento.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            La clínica reconoce un día con llamadas, mensajes, agenda y expectativas que no siempre
            se alinean. {presentation.header.title} ayuda a situar esta realidad en el contexto de
            la operación diaria.
          </p>
        </div>
        <Badge variant="secondary">Paso 1</Badge>
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

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-border/70 bg-background/70">
          <CardHeader>
            <CardTitle className="text-lg text-deep">Consecuencias operativas</CardTitle>
            <CardDescription>
              Una realidad compleja, pero plausible, que aún no está conectada.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {operationalConsequences.map((item) => (
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
            <CardTitle className="text-lg text-deep">
              Transición hacia la siguiente escena
            </CardTitle>
            <CardDescription>La pregunta natural que surge al terminar esta etapa.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-7 text-muted-foreground">
              ¿Qué cambiaría si toda esta operación pudiera conectarse?
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
