import { createFileRoute, useLocation } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CommercialDemoPage } from "@/components/commercial/CommercialDemoPage";
import { parseCommercialDemoContext } from "@/features/commercial-demo/context/parseCommercialDemoContext";

export const Route = createFileRoute("/commercial-demo")({
  head: () => ({
    meta: [
      { title: "Commercial Demo — DentalOperix" },
      {
        name: "description",
        content:
          "Una presentación comercial de la experiencia de DentalOperix sobre un recorrido de paciente, oportunidad y clínica.",
      },
    ],
  }),
  component: CommercialDemoRoute,
});

function CommercialDemoRoute() {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const commercialDemoContext = parseCommercialDemoContext(searchParams);

  return (
    <SiteLayout>
      {(openBooking) => (
        <CommercialDemoPage
          context={commercialDemoContext}
          onContinueToBooking={() => openBooking()}
        />
      )}
    </SiteLayout>
  );
}
