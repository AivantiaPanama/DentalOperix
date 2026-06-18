import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/site/Hero";
import { BookingCTA } from "@/components/site/BookingCTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DentalOperix — Atención dental profesional en Panamá" },
      {
        name: "description",
        content: "Solicita una cita, consulta nuestros servicios o comunícate con la clínica.",
      },
      { property: "og:title", content: "DentalOperix — Atención dental profesional" },
      {
        property: "og:description",
        content: "Solicita una cita, consulta nuestros servicios o comunícate con la clínica.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      {(
        openBooking: (id?: string) => void,
        openServiceInfo: (serviceIdOrSlug: string) => void,
      ) => (
        <>
          <Hero onBook={() => openBooking()} onServiceInfo={openServiceInfo} />
          
          <BookingCTA onBook={() => openBooking()} />
        </>
      )}
    </SiteLayout>
  );
}
