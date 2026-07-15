import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  HeartHandshake,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CommercialPresentationModel } from "@/features/commercial-demo/presentation/commercialPresentation.types";

type StoryboardScene07Props = {
  presentation: CommercialPresentationModel;
};

const evidencePoints = [
  {
    title: "Seguimiento pendiente",
    description: "La evidencia disponible muestra que el paciente necesita continuidad inmediata.",
  },
  {
    title: "Contexto preparado",
    description: "El recorrido ya está organizado y permite justificar una acción prioritaria.",
  },
  {
    title: "Continuidad del proceso",
    description: "La clínica puede ver que una decisión oportuna protege el avance del caso.",
  },
] as const;

const decisionSteps = ["Operación", "Evidencia", "Comprensión", "Decisión", "Acción"] as const;

export function StoryboardScene07({ presentation }: StoryboardScene07Props) {
  return (
    <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            S07 · La clínica comienza a decidir con evidencia
          </p>
          <h2 className="mt-3 text-3xl font-bold text-deep sm:text-4xl">
            Ahora sabemos por qué debemos actuar.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            La escena muestra cómo una decisión concreta encuentra respaldo en la evidencia ya
            disponible. No se trata de agregar más datos, sino de justificar una acción con
            fundamento. {presentation.header.title} sirve como referencia para esta transición de
            comprensión a decisión.
          </p>
        </div>
        <Badge variant="secondary">Paso 7</Badge>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70 bg-background/70">
          <CardHeader>
            <CardTitle className="text-lg text-deep">Evidencia y decisión</CardTitle>
            <CardDescription>
              Una decisión concreta, apoyada por contexto y continuidad.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {evidencePoints.map((point, index) => {
                const icons = [ClipboardCheck, Sparkles, CheckCircle2];
                const Icon = icons[index] ?? UserRound;
                return (
                  <div
                    key={point.title}
                    className="rounded-xl border border-border/60 bg-background/80 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-semibold text-deep">{point.title}</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {point.description}
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
              Decisión prioritaria
            </CardTitle>
            <CardDescription>
              La evidencia justifica una acción concreta y oportuna.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {decisionSteps.map((step) => (
                <div key={step} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
