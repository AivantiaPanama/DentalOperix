import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { AssessmentThankYouPage } from "@/components/commercial-engagement/AssessmentThankYouPage";

export const Route = createFileRoute("/clinicas/gracias")({
  head: () => ({ meta: [{ title: "Diagnóstico completado — DentalOperix" }] }),
  component: AssessmentThanksRoute,
});

function AssessmentThanksRoute() {
  return <SiteLayout><AssessmentThankYouPage /></SiteLayout>;
}
