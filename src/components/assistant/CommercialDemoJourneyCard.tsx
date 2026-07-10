import { ArrowRight, ClipboardCheck, Sparkles, UserRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { commercialDemoFoundation } from "@/data/commercialDemoFoundation";

export function CommercialDemoJourneyCard() {
  const { scenario, patientJourney, clinicJourney, commercialEvidence } = commercialDemoFoundation;

  return (
    <Card className="shadow-soft" aria-label="Commercial Demo Journey">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg text-deep">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
              Commercial Demo Journey
            </CardTitle>
            <CardDescription className="mt-2 leading-6">
              Vista read-only para componer el recorrido comercial sobre capacidades existentes.
            </CardDescription>
          </div>
          <Badge variant="secondary">Vista read-only</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <section className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Escenario</p>
          <h3 className="mt-2 text-lg font-semibold text-deep">{scenario.id}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{scenario.name}</p>
          <p className="mt-2 text-sm text-muted-foreground">{scenario.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="outline">{scenario.audience}</Badge>
            <Badge variant="outline">{scenario.commercialGoal}</Badge>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-deep">
              <UserRound className="h-4 w-4 text-primary" aria-hidden="true" />
              Paciente
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {patientJourney.map((step) => (
                <li key={step} className="flex items-start gap-2">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-deep">
              <ClipboardCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              Clínica
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {clinicJourney.map((step) => (
                <li key={step} className="flex items-start gap-2">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-deep">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
              Evidencia
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {commercialEvidence.map((step) => (
                <li key={step} className="flex items-start gap-2">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
