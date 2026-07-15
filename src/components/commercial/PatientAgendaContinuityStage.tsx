import { ArrowRight, CalendarClock, CircleUserRound, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { useAppointments } from "@/lib/appointments-store";

export function PatientAgendaContinuityStage() {
  const { appointments } = useAppointments();
  const upcomingAppointments = appointments
    .filter((appointment) => appointment.status !== "cancelled")
    .slice(0, 3);

  return (
    <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-6 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Contexto del paciente y agenda
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-deep sm:text-3xl">
            La clínica ya entiende al paciente dentro del día operativo
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            La solicitud ya no aparece como una tarea aislada. El asistente puede ubicar al paciente
            dentro del contexto de la agenda y preparar el siguiente paso.
          </p>
        </div>
        <Badge variant="outline" className="border-primary/20 bg-background/70 text-primary">
          <Sparkles className="mr-2 h-3.5 w-3.5" />
          Continuidad operativa
        </Badge>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-primary/10 bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-deep">
            La clínica ya entiende el contexto del paciente
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            La demostración muestra que la información ya se mueve con el caso y se relaciona con la
            agenda del día.
          </p>
        </div>
        <Button asChild className="gap-2 self-start sm:self-auto">
          <Link to="/assistant">
            Ver contexto operativo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-border/70 bg-background/70 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-deep">
              <CircleUserRound className="h-4 w-4 text-primary" />
              Contexto del paciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="leading-6">
              El caso se presenta dentro de una relación clara con el paciente, el servicio y el
              estado operativo del día.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-background/70 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-deep">
              <CalendarClock className="h-4 w-4 text-primary" />
              Agenda diaria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="leading-6">
              La agenda ofrece la referencia visible de en qué parte del día se encuentra el
              paciente y qué sigue después de la recepción.
            </CardDescription>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {upcomingAppointments.map((appointment) => (
                <li
                  key={appointment.id}
                  className="rounded-xl border border-border/60 bg-background/70 px-3 py-2"
                >
                  {appointment.name} · {appointment.service} · {appointment.time}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
