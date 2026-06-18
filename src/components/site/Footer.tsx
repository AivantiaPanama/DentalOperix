import { Sparkles, Mail, MapPin, Phone } from "lucide-react";
import { siteServices } from "@/data/siteServices";
import { userPortals } from "@/data/userPortals";

export function Footer({ onServiceInfo }: { onServiceInfo?: (serviceIdOrSlug: string) => void }) {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-deep text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="font-display text-lg font-bold text-deep">DentalOperix</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Acompañamiento dental profesional, claro y respetuoso.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-deep">Clínica</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="/nuestra-filosofia" className="text-inherit hover:text-deep">
                Nuestra Filosofía
              </a>
            </li>
            <li>
              <a href="/servicios" className="text-inherit hover:text-deep">
                Servicios
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-deep">Servicios</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {siteServices.map((service) => (
              <li key={service.id}>
                <a
                  href={`/servicios/${service.slug}`}
                  className="text-inherit hover:text-deep"
                  onClick={(event) => {
                    if (!onServiceInfo) return;
                    event.preventDefault();
                    onServiceInfo(service.id);
                  }}
                >
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-deep">Portales</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {userPortals.map((portal) => (
              <li key={portal.id}>
                <a href={portal.path} className="text-inherit hover:text-deep">
                  {portal.footerLabel}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-deep">Contacto</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" /> Av. Domingo Díaz, Rufina Alfaro
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" />{" "}
              <a href="tel:+50745061624" className="text-inherit hover:text-deep">
                +507 4506 1624
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />{" "}
              <a href="mailto:DentalOperix@gmail.com" className="text-inherit hover:text-deep">
                DentalOperix@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} DentalOperix — Todos los derechos reservados.
      </div>
    </footer>
  );
}
