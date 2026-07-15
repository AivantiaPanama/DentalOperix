import { ArrowRight, ClipboardCheck, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

export function FollowUpAdministrativeContinuityStage() {
  return (
    <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-6 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Continuidad administrativa
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-deep sm:text-3xl">
            El seguimiento continúa después de la interacción clínica
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            La historia no termina cuando el doctor cierra el contexto clínico. La administración
            mantiene la continuidad al vigilar señales operativas y evidencias acumuladas del caso.
          </p>
        </div>
        <Badge variant="outline" className="border-primary/20 bg-background/70 text-primary">
          <ShieldCheck className="mr-2 h-3.5 w-3.5" />
          Seguimiento operativo
        </Badge>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-primary/10 bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-deep">Abrir la perspectiva administrativa</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            La demostración muestra que el caso sigue siendo visible para la administración a través
            de indicadores, notificaciones y calidad operativa existentes.
          </p>
        </div>
        <Button asChild className="gap-2 self-start sm:self-auto">
          <Link to="/admin/dashboard">
            Ver administración
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-border/70 bg-background/70 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-deep">
              <ClipboardCheck className="h-4 w-4 text-primary" />
              Seguimiento y evidencias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="leading-6">
              El recorrido conecta la historia clínica con la visibilidad administrativa del día,
              reforzando que la organización mantiene memoria operativa del caso.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-background/70 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-deep">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Administración y continuidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="leading-6">
              La administración aparece como un actor que conserva la continuidad de la experiencia
              sin crear un nuevo flujo ni una fuente independiente de verdad.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
