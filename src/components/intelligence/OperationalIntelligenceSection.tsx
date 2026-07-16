import { AlertCircle, BadgeAlert, Layers3 } from "lucide-react";

import { DecisionSignalCard } from "./DecisionSignalCard";
import { mapDecisionSignalToPresentationModel } from "../../lib/intelligence/presentation/mapDecisionSignalToPresentationModel";
import type { DecisionSignal } from "@/lib/intelligence/types";

type OperationalIntelligenceSectionProps = {
  signals: DecisionSignal[];
};

export function OperationalIntelligenceSection({ signals }: OperationalIntelligenceSectionProps) {
  return (
    <section className="rounded-3xl border border-primary/20 bg-background/80 p-6 shadow-soft" aria-label="Operational Intelligence">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Operational Intelligence</p>
          <h3 className="mt-2 text-xl font-semibold text-deep">Situaciones relevantes para la operación</h3>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            La capa de Decision Intelligence informa al asistente con contexto y evidencia explicable sin ejecutar acciones automáticas.
          </p>
        </div>
        <div className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary">
          <Layers3 className="mr-2 inline h-4 w-4" />
          Read-only
        </div>
      </div>

      {signals.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border/70 bg-muted/20 p-5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>No existen situaciones que requieran atención.</span>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {signals.map((signal) => (
            <DecisionSignalCard key={signal.id} model={mapDecisionSignalToPresentationModel(signal)} />
          ))}
        </div>
      )}
    </section>
  );
}
