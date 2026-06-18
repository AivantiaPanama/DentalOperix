import { ArrowRight, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteServices } from "@/data/siteServices";

export function ServicesGrid({
  onBook,
  onServiceInfo,
}: {
  onBook: (serviceId?: string) => void;
  onServiceInfo?: (serviceIdOrSlug: string) => void;
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="chip">Servicios dentales</span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-deep sm:text-4xl">
          Servicios disponibles
        </h2>
        <p className="mt-3 text-muted-foreground">
          Conoce los servicios que ofrecemos y solicita atención cuando lo necesites.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {siteServices.map((service, index) => (
          <article
            key={service.id}
            style={{ animationDelay: `${index * 60}ms` }}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow animate-fade-up"
          >
            <a
              href={`/servicios/${service.slug}`}
              onClick={(event) => {
                if (!onServiceInfo) return;
                event.preventDefault();
                onServiceInfo(service.id);
              }}
            >
              <img
                src={service.image}
                alt={service.alt}
                className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </a>

            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-xl font-bold text-deep">{service.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {service.shortDescription}
              </p>

              <div className="mt-5 flex items-start justify-between gap-4 border-t border-border pt-4 text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Según evaluación
                </span>
                <span className="flex items-center gap-1.5 text-right font-semibold text-deep">
                  <Tag className="h-3.5 w-3.5" />
                  {service.suggestedPrice}
                </span>
              </div>

              <div className="mt-auto flex flex-col gap-3 pt-5">
                <Button asChild className="w-full rounded-full bg-deep text-white hover:bg-primary">
                  <a
                    href={`/servicios/${service.slug}`}
                    onClick={(event) => {
                      if (!onServiceInfo) return;
                      event.preventDefault();
                      onServiceInfo(service.id);
                    }}
                  >
                    Ver descripción y precio <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-full"
                  onClick={() => onBook(service.id)}
                >
                  Agendar consulta
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
