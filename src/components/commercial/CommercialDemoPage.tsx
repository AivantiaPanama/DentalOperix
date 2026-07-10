import { CommercialDemoHeader } from "./CommercialDemoHeader";
import { CommercialEvidencePanel } from "./CommercialEvidencePanel";
import { DemoStepIndicator } from "./DemoStepIndicator";
import { CommercialDemoJourneyCard } from "@/components/assistant/CommercialDemoJourneyCard";

export function CommercialDemoPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <CommercialDemoHeader />
      <DemoStepIndicator />
      <CommercialDemoJourneyCard />
      <CommercialEvidencePanel />
    </div>
  );
}
