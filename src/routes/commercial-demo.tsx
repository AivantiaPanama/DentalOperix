import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CommercialDemoPage } from "@/components/commercial/CommercialDemoPage";

export const Route = createFileRoute("/commercial-demo")({
  head: () => ({
    meta: [
      { title: "Commercial Demo — DentalOperix" },
      {
        name: "description",
        content: "Una presentación comercial de la experiencia de DentalOperix sobre un recorrido de paciente, oportunidad y clínica.",
      },
    ],
  }),
  component: CommercialDemoRoute,
});

function CommercialDemoRoute() {
  return (
    <SiteLayout>
      <CommercialDemoPage />
    </SiteLayout>
  );
}
