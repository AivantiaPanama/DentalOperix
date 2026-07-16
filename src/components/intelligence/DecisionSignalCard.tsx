import { BadgeAlert, CircleAlert, ListChecks } from "lucide-react";

import type { IntelligencePresentationModel } from "@/lib/intelligence/presentation/intelligencePresentation.types";

type DecisionSignalCardProps = {
  model: IntelligencePresentationModel;
};

export function DecisionSignalCard({ model }: DecisionSignalCardProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/70 p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{model.priority}</p>
          <h4 className="mt-2 text-lg font-semibold text-deep">{model.title}</h4>
        </div>
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          <BadgeAlert className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted-foreground">{model.explanation}</p>

      <div className="mt-4 rounded-2xl border border-primary/10 bg-primary/5 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-deep">
          <ListChecks className="h-4 w-4 text-primary" aria-hidden="true" />
          Evidencia
        </div>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {model.evidence.map((item) => (
            <li key={`${item.source}-${item.field}`} className="flex items-start gap-2">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{item.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
