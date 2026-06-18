import { createFileRoute, Link } from "@tanstack/react-router";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { getUserPortalByPublicSlug } from "@/data/userPortals";

export const Route = createFileRoute("/portal/$profile")({
  head: ({ params }) => {
    const portal = getUserPortalByPublicSlug(params.profile);
    const title = portal ? `${portal.title} — DentalOperix` : "Portal — DentalOperix";

    return {
      meta: [
        { title },
        {
          name: "description",
          content:
            "Referencias de acceso por perfil para pacientes, doctores, asistentes y administración DentalOperix.",
        },
        { name: "robots", content: "noindex,nofollow" },
      ],
    };
  },
  component: PortalProfilePage,
});

function PortalProfilePage() {
  const { profile } = Route.useParams();
  const portal = getUserPortalByPublicSlug(profile);

  if (!portal) {
    return (
      <SiteLayout>
        <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Portal</p>
          <h1 className="mt-4 font-display text-4xl font-bold text-deep md:text-5xl">
            Perfil no disponible
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Este acceso no corresponde a un perfil publicado de DentalOperix.
          </p>
          <Button asChild className="mt-8 rounded-full bg-primary text-primary-foreground">
            <Link to="/">Volver al inicio</Link>
          </Button>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="rounded-[2rem] border border-border bg-background p-8 shadow-soft md:p-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-deep">
                <LockKeyhole className="h-3.5 w-3.5" /> Acceso por perfil
              </span>
              <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-deep md:text-5xl">
                {portal.title}
              </h1>
              <p className="mt-3 text-sm font-semibold text-primary">{portal.audience}</p>
              <p className="mt-5 text-base leading-7 text-muted-foreground md:text-lg">
                {portal.description}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-secondary/60 px-4 py-3 text-sm font-medium text-deep">
              En preparación
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {portal.visibleNotes.map((note) => (
              <div key={note} className="rounded-2xl border border-border bg-secondary/40 p-5">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{note}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild className="rounded-full bg-primary text-primary-foreground">
              <Link to="/">Volver al inicio</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/servicios">Ver servicios</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
