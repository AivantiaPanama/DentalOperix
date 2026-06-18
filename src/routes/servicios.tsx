import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BookingCTA } from "@/components/site/BookingCTA";
import { Button } from "@/components/ui/button";
import { siteServices } from "@/data/siteServices";

export const Route = createFileRoute("/servicios")({
  head: () => ({
    meta: [
      { title: "Servicios dentales — DentalOperix" },
      {
        name: "description",
        content:
          "Conoce las cinco áreas de atención dental de DentalOperix y agenda una consulta cuando necesites orientación.",
      },
      { property: "og:title", content: "Servicios dentales — DentalOperix" },
      {
        property: "og:description",
        content:
          "Odontología preventiva, ortodoncia, diseño de sonrisa, implantes dentales y odontopediatría.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <SiteLayout>
      {(
        openBooking: (id?: string) => void,
        openServiceInfo: (serviceIdOrSlug: string) => void,
      ) => (
        <>
          <section className="gradient-hero">
            <div className="mx-auto max-w-7xl px-6 py-20 text-center">
              <span className="chip">Servicios dentales</span>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-deep sm:text-5xl">
                Cinco caminos de cuidado, una misma forma de acompañarte
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Cada servicio parte de una conversación clara: entender tu caso, explicar opciones y
                ayudarte a tomar decisiones informadas.
              </p>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 py-16">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {siteServices.map((service) => (
                <article
                  key={service.id}
                  className="group overflow-hidden rounded-3xl border border-border bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow"
                >
                  <a
                    href={`/servicios/${service.slug}`}
                    className="block"
                    onClick={(event) => {
                      event.preventDefault();
                      openServiceInfo(service.id);
                    }}
                  >
                    <img
                      src={service.image}
                      alt={service.alt}
                      className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </a>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-deep">{service.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {service.shortDescription}
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <Button asChild className="rounded-full bg-deep text-white hover:bg-primary">
                        <a
                          href={`/servicios/${service.slug}`}
                          onClick={(event) => {
                            event.preventDefault();
                            openServiceInfo(service.id);
                          }}
                        >
                          Ver descripción y precio <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => openBooking(service.id)}
                      >
                        Agendar consulta
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <BookingCTA onBook={() => openBooking()} />
        </>
      )}
    </SiteLayout>
  );
}
