import { ArrowRight, Sparkles, UserRound, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type PublicArrivalStageProps = {
  title?: string;
  description?: string;
  onContinueToBooking?: () => void;
};

export function PublicArrivalStage({
  title = "Primer contacto con la clínica",
  description = "El visitante entra a la historia como un paciente potencial que descubre la clínica y comprende que la experiencia se está construyendo con orden, contexto y continuidad.",
  onContinueToBooking,
}: PublicArrivalStageProps) {
  return (
    <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-6 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Etapa de llegada pública
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-deep sm:text-3xl">{title}</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">{description}</p>
        </div>
        <Badge variant="outline" className="border-primary/20 bg-background/70 text-primary">
          <Sparkles className="mr-2 h-3.5 w-3.5" />
          Continuación guiada
        </Badge>
      </div>

      {onContinueToBooking ? (
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-primary/10 bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-deep">
              Continuar hacia la primera interacción operativa
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              El recorrido guiado ahora conduce hacia la capa de reserva pública ya establecida en
              DentalOperix.
            </p>
          </div>
          <Button onClick={() => onContinueToBooking?.()} className="gap-2 self-start sm:self-auto">
            Continuar a la reserva
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="border-border/70 bg-background/70 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-deep">
              <UserRound className="h-4 w-4 text-primary" />
              Quién llega
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="leading-6">
              El visitante asume el papel de alguien que busca atención y entra a la historia de la
              clínica con una intención clara.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-background/70 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-deep">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Qué entiende
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="leading-6">
              Comprende que la clínica está preparada para recibirlo, orientarlo y acompañarlo en un
              recorrido operativo coherente.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-background/70 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-deep">
              <ArrowRight className="h-4 w-4 text-primary" />
              Qué sigue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="leading-6">
              La experiencia continúa hacia la siguiente fase del recorrido guiado, manteniendo el
              contexto del paciente y la clínica.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
