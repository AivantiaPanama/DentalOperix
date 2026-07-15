import { ArrowRight, CalendarClock, ClipboardList, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

export function AssistantReceptionStage() {
  return (
    <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-6 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Continuación al espacio del asistente
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-deep sm:text-3xl">
            Recepción y coordinación en el workspace operativo
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Una vez que la interacción pública llega a la clínica, el asistente se convierte en el
            actor operativo que entiende el nuevo caso y prepara los próximos pasos.
          </p>
        </div>
        <Badge variant="outline" className="border-primary/20 bg-background/70 text-primary">
          <Sparkles className="mr-2 h-3.5 w-3.5" />
          Recepción operativa
        </Badge>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-primary/10 bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-deep">Abrir workspace del asistente</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            La demostración ahora enlaza con el entorno existente de recepción para mostrar que la
            clínica ya está incorporando la solicitud.
          </p>
        </div>
        <Button asChild className="gap-2 self-start sm:self-auto">
          <Link to="/assistant">
            Ver workspace del asistente
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-border/70 bg-background/70 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-deep">
              <CalendarClock className="h-4 w-4 text-primary" />
              Agenda diaria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="leading-6">
              El asistente ya ve la agenda del día, mantiene el contexto de la recepción y comprende
              qué sigue para el paciente.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-background/70 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-deep">
              <ClipboardList className="h-4 w-4 text-primary" />
              Cola de leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="leading-6">
              El nuevo caso entra en el mismo entorno de recepción que la clínica ya utiliza para
              identificar, priorizar y coordinar.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
