import { ArrowRight, ClipboardCheck, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

export function DoctorClinicalContinuityStage() {
  return (
    <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-6 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Continuidad clínica
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-deep sm:text-3xl">
            El doctor recibe el contexto del paciente sin perder la continuidad de la historia
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            La misma historia que empezó en recepción y continuó con el asistente ahora se vuelve
            visible para el doctor, quien encuentra el contexto preparado para la siguiente etapa
            clínica.
          </p>
        </div>
        <Badge variant="outline" className="border-primary/20 bg-background/70 text-primary">
          <Stethoscope className="mr-2 h-3.5 w-3.5" />
          Doctor activo
        </Badge>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-primary/10 bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-deep">
            Transición hacia el workspace del doctor
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            El recorrido muestra que el doctor entra con contexto y encuentra una vista clínica
            existente, sin crear una segunda historia paralela.
          </p>
        </div>
        <Button asChild className="gap-2 self-start sm:self-auto">
          <Link to="/doctor">
            Ver workspace del doctor
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-border/70 bg-background/70 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-deep">
              <Stethoscope className="h-4 w-4 text-primary" />
              Doctor como actor activo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="leading-6">
              El doctor aparece como el siguiente actor de la historia clínica, con el contexto del
              caso ya conectado a la experiencia anterior.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-background/70 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-deep">
              <ClipboardCheck className="h-4 w-4 text-primary" />
              Notas clínicas y contexto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="leading-6">
              La transición se apoya en el workspace clínico existente para reforzar que el contexto
              del paciente sigue siendo parte del recorrido.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
