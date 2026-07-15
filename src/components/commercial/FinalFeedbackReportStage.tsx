import { ArrowRight, CheckCircle2, ClipboardList, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

const journeyStages = [
  "Llegada pública",
  "Recepción operativa",
  "Contexto del paciente",
  "Continuidad clínica",
  "Seguimiento administrativo",
];

const actors = ["Visitante", "Recepción", "Asistente", "Doctor", "Administración"];

const evidenceSignals = [
  "Contexto visible",
  "Continuidad entre roles",
  "Evidencia operativa",
  "Cierre narrativo",
];

export function FinalFeedbackReportStage() {
  return (
    <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-6 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Informe final
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-deep sm:text-3xl">
            La demostración concluye con una comprensión compartida del recorrido
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            El recorrido mostró cómo la clínica transforma una interacción inicial en una
            experiencia operativa y clínica continua. El cierre sintetiza los elementos observados
            sin convertir la demostración en una nueva capa de análisis.
          </p>
        </div>
        <Badge variant="outline" className="border-primary/20 bg-background/70 text-primary">
          <Sparkles className="mr-2 h-3.5 w-3.5" />
          Cierre de la experiencia
        </Badge>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-primary/10 bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-deep">Siguiente evaluación</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            La conclusión deja una invitación clara a revisar el recorrido completo y definir la
            siguiente evaluación del caso, sin inventar nuevas métricas ni nuevas operaciones.
          </p>
        </div>
        <Button asChild className="gap-2 self-start sm:self-auto">
          <Link to="/admin/dashboard">
            Revisar evidencia operativa
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="border-border/70 bg-background/70 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-deep">
              <ClipboardList className="h-4 w-4 text-primary" />
              Etapas demostradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="leading-6">
              El recorrido abarcó la llegada, la recepción, el contexto del paciente, la continuidad
              clínica y el seguimiento administrativo.
            </CardDescription>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {journeyStages.map((stage) => (
                <li key={stage} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {stage}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-background/70 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-deep">
              <Sparkles className="h-4 w-4 text-primary" />
              Actores presentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="leading-6">
              La historia reunió a varios actores que aportaron contexto y continuidad a la
              experiencia del paciente.
            </CardDescription>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {actors.map((actor) => (
                <li key={actor} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {actor}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-background/70 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-deep">
              <ClipboardList className="h-4 w-4 text-primary" />
              Evidencia observada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="leading-6">
              La síntesis recoge señales visibles de continuidad, contexto y comprensión operativa
              acumulada durante la demostración.
            </CardDescription>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {evidenceSignals.map((signal) => (
                <li key={signal} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {signal}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
