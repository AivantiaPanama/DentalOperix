import { CommercialDemoHeader } from "./CommercialDemoHeader";
import { CommercialEvidencePanel } from "./CommercialEvidencePanel";
import { DemoStepIndicator } from "./DemoStepIndicator";
import { CommercialDemoJourneyCard } from "@/components/assistant/CommercialDemoJourneyCard";
import type { CommercialDemoContext } from "@/features/commercial-demo/context/commercialDemoContext.types";

type CommercialDemoPageProps = {
  context: CommercialDemoContext;
};

export function CommercialDemoPage({ context }: CommercialDemoPageProps) {
  return (
    <div
      className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8"
      data-commercial-demo-context={JSON.stringify(context)}
      data-readiness-level={context.readinessLevel}
    >
      <CommercialDemoHeader />
      <DemoStepIndicator />
      <CommercialDemoJourneyCard />
      <CommercialEvidencePanel />
    </div>
  );
}
