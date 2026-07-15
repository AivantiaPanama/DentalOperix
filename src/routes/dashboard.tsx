import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { getDashboardRoutingDecision } from "@/lib/dashboard-routing";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard Resolver — DentalOperix" },
      {
        name: "description",
        content: "Resolver de dashboard protegido por rol para DentalOperix.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: DashboardResolverPage,
});

type DashboardSessionPayload = {
  authenticated?: boolean;
  role?: unknown;
};

function AccessBlocked() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <section className="max-w-lg rounded-3xl border border-border bg-white p-8 text-center shadow-soft">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Acceso restringido
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-deep">ACCESS BLOCKED</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          No fue posible resolver un dashboard autorizado para el rol de la sesión actual.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Volver al inicio
        </a>
      </section>
    </main>
  );
}

function DashboardResolverPage() {
  const navigate = useNavigate();
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    let mounted = true;

    fetch("/api/admin/session", { credentials: "same-origin" })
      .then(async (response) => {
        if (!mounted) return;

        if (response.status === 401) {
          navigate({ to: "/admin/login", replace: true });
          return;
        }

        const payload = (await response.json().catch(() => ({}))) as DashboardSessionPayload;
        const decision = getDashboardRoutingDecision(payload.role);

        if (response.ok && payload.authenticated && decision.status === "allowed") {
          navigate({ to: decision.route, replace: true });
          return;
        }

        setBlocked(true);
      })
      .catch(() => {
        if (mounted) navigate({ to: "/admin/login", replace: true });
      });

    return () => {
      mounted = false;
    };
  }, [navigate]);

  if (blocked) {
    return <AccessBlocked />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-sm text-muted-foreground">
      Resolviendo dashboard autorizado...
    </div>
  );
}
