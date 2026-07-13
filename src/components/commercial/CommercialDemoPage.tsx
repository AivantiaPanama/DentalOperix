import { CommercialDemoHeader } from "./CommercialDemoHeader";
import { CommercialEvidencePanel } from "./CommercialEvidencePanel";
import { DemoStepIndicator } from "./DemoStepIndicator";
import { CommercialDemoJourneyCard } from "@/components/assistant/CommercialDemoJourneyCard";
import type { CommercialDemoContext } from "@/features/commercial-demo/context/commercialDemoContext.types";
import { buildCommercialNarrative } from "@/features/commercial-demo/narrative/buildCommercialNarrative";
import { buildCommercialPresentation } from "@/features/commercial-demo/presentation/buildCommercialPresentation";

type CommercialDemoPageProps = {
  context: CommercialDemoContext;
};

export function CommercialDemoPage({ context }: CommercialDemoPageProps) {
  const presentation = buildCommercialPresentation(buildCommercialNarrative(context));

  return (
    <div
      className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8"
      data-commercial-demo-context={JSON.stringify(context)}
      data-readiness-level={context.readinessLevel}
    >
      <CommercialDemoHeader header={presentation.header} />
      <DemoStepIndicator steps={presentation.steps} />
      <CommercialDemoJourneyCard journey={presentation.journey} />
      <CommercialEvidencePanel evidence={presentation.evidence} />
      <div className="rounded-2xl border border-border bg-background/70 p-4 text-sm text-muted-foreground">
        {presentation.closingMessage}
      </div>
    </div>
  );
}
