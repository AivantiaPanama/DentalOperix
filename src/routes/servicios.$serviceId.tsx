import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Info, Tag } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { getSiteServiceBySlug, siteServices } from "@/data/siteServices";

export const Route = createFileRoute("/servicios/$serviceId")({
  head: () => ({
    meta: [
      { title: "Detalle de servicio — DentalOperix" },
      {
        name: "description",
        content:
          "Conoce el enfoque general del servicio dental y agenda una consulta para recibir orientación personalizada.",
      },
    ],
  }),
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { serviceId } = Route.useParams();
  const service = getSiteServiceBySlug(serviceId);

  if (!service) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="text-4xl font-bold text-deep">Servicio no encontrado</h1>
          <p className="mt-4 text-muted-foreground">
            La página solicitada no corresponde a uno de los servicios principales de DentalOperix.
          </p>
          <Button asChild className="mt-8 rounded-full">
            <a href="/servicios">Ver servicios</a>
          </Button>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      {(
        openBooking: (id?: string) => void,
        openServiceInfo: (serviceIdOrSlug: string) => void,
      ) => (
        <>
          <section className="relative min-h-[72vh] overflow-hidden">
            <img src={service.image} alt={service.alt} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />
            <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-7xl items-center px-6 py-24">
              <div className="max-w-3xl text-white">
                <a href="/servicios" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
                  <ArrowLeft className="h-4 w-4" /> Servicios
                </a>
                <h1 className="mt-6 text-5xl font-bold leading-tight md:text-7xl">{service.title}</h1>
                <p className="mt-6 max-w-2xl text-xl leading-relaxed text-white/90 md:text-2xl">
                  {service.shortDescription}
                </p>
                <Button onClick={() => openBooking(service.id)} size="lg" className="mt-8 rounded-full px-8">
                  Agendar consulta <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 py-16">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <span className="chip">Enfoque del servicio</span>
                <h2 className="mt-4 text-3xl font-bold text-deep md:text-4xl">
                  Una consulta para entender tu caso con claridad
                </h2>
                <p className="mt-5 text-lg leading-8 text-muted-foreground">{service.overview}</p>
                <div className="mt-8 rounded-3xl border border-primary/15 bg-primary/5 p-6">
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-primary shadow-sm">
                      <Tag className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                        Precio sugerido
                      </h3>
                      <p className="mt-1 text-2xl font-bold text-deep">{service.suggestedPrice}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {service.priceNote}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3 rounded-2xl bg-white/70 p-4 text-sm leading-6 text-muted-foreground">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <p>
                      Valor referencial. El precio final se confirma después de la evaluación
                      clínica y el plan indicado por el especialista.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
                <h3 className="text-xl font-bold text-deep">¿Qué puede incluir?</h3>
                <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
                  {service.includes.map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <InfoCard title="Proceso de atención" items={service.process} />
              <InfoCard title="Beneficios esperados" items={service.benefits} />
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 pb-16">
            <div className="rounded-3xl bg-deep p-8 text-white md:p-10">
              <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <h2 className="text-3xl font-bold">Conversemos antes de decidir</h2>
                  <p className="mt-3 max-w-2xl text-white/80">
                    Agenda una consulta para recibir orientación personalizada y comprender qué opción se adapta mejor a tu caso.
                  </p>
                </div>
                <Button onClick={() => openBooking(service.id)} size="lg" className="rounded-full bg-white px-8 text-deep hover:bg-white/90">
                  Agendar consulta
                </Button>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 pb-20">
            <h2 className="text-2xl font-bold text-deep">Otros servicios</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {siteServices
                .filter((item) => item.id !== service.id)
                .map((item) => (
                  <a
                    key={item.id}
                    href={`/servicios/${item.slug}`}
                    className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-deep"
                    onClick={(event) => {
                      event.preventDefault();
                      openServiceInfo(item.id);
                    }}
                  >
                    {item.title}
                  </a>
                ))}
            </div>
          </section>
        </>
      )}
    </SiteLayout>
  );
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-3xl border border-border bg-white p-6 shadow-soft">
      <h3 className="text-xl font-bold text-deep">{title}</h3>
      <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
