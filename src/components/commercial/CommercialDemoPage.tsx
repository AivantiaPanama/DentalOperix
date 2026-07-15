import { CommercialDemoHeader } from "./CommercialDemoHeader";
import { CommercialEvidencePanel } from "./CommercialEvidencePanel";
import { DemoStageOrientation } from "./DemoStageOrientation";
import { PublicArrivalStage } from "./PublicArrivalStage";
import { AssistantReceptionStage } from "./AssistantReceptionStage";
import { PatientAgendaContinuityStage } from "./PatientAgendaContinuityStage";
import { DoctorClinicalContinuityStage } from "./DoctorClinicalContinuityStage";
import { FollowUpAdministrativeContinuityStage } from "./FollowUpAdministrativeContinuityStage";
import { FinalFeedbackReportStage } from "./FinalFeedbackReportStage";
import { DemoStepIndicator } from "./DemoStepIndicator";
import { CommercialDemoJourneyCard } from "@/components/assistant/CommercialDemoJourneyCard";
import type { CommercialDemoContext } from "@/features/commercial-demo/context/commercialDemoContext.types";
import { buildCommercialNarrative } from "@/features/commercial-demo/narrative/buildCommercialNarrative";
import { buildCommercialPresentation } from "@/features/commercial-demo/presentation/buildCommercialPresentation";
import { StoryboardScene01 } from "./StoryboardScene01";
import { StoryboardScene02 } from "./StoryboardScene02";
import { StoryboardScene03 } from "./StoryboardScene03";
import { StoryboardScene04 } from "./StoryboardScene04";
import { StoryboardScene05 } from "./StoryboardScene05";
import { StoryboardScene06 } from "./StoryboardScene06";
import { StoryboardScene07 } from "./StoryboardScene07";
import { StoryboardScene08 } from "./StoryboardScene08";
import { StoryboardScene09 } from "./StoryboardScene09";

type CommercialDemoPageProps = {
  context: CommercialDemoContext;
  onContinueToBooking?: () => void;
};

export function CommercialDemoPage({ context, onContinueToBooking }: CommercialDemoPageProps) {
  const presentation = buildCommercialPresentation(buildCommercialNarrative(context));

  return (
    <div
      className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8"
      data-commercial-demo-context={JSON.stringify(context)}
      data-readiness-level={context.readinessLevel}
    >
      <CommercialDemoHeader header={presentation.header} />
      <section className="rounded-3xl border border-border bg-background/70 p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Entrada oficial de la demostración
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-deep sm:text-3xl">
          Una experiencia guiada, no una colección de pantallas.
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
          La clínica no solo observa funciones; vive un recorrido operativo con protagonista,
          actores, evidencia y cierre. Esta apertura prepara el terreno para comprender el día
          completo de la clínica.
        </p>
      </section>
      <DemoStageOrientation />
      <PublicArrivalStage onContinueToBooking={onContinueToBooking} />
      <AssistantReceptionStage />
      <PatientAgendaContinuityStage />
      <DoctorClinicalContinuityStage />
      <FollowUpAdministrativeContinuityStage />
      <FinalFeedbackReportStage />
      <StoryboardScene01 presentation={presentation} />
      <StoryboardScene02 presentation={presentation} />
      <StoryboardScene03 presentation={presentation} />
      <StoryboardScene04 presentation={presentation} />
      <StoryboardScene05 presentation={presentation} />
      <StoryboardScene06 presentation={presentation} />
      <StoryboardScene07 presentation={presentation} />
      <StoryboardScene08 presentation={presentation} />
      <StoryboardScene09 presentation={presentation} />
      <DemoStepIndicator steps={presentation.steps} />
      <CommercialDemoJourneyCard journey={presentation.journey} />
      <CommercialEvidencePanel evidence={presentation.evidence} />
      <div className="rounded-2xl border border-border bg-background/70 p-4 text-sm text-muted-foreground">
        {presentation.closingMessage}
      </div>
    </div>
  );
}
