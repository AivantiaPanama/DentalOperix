/* eslint-disable react-hooks/rules-of-hooks */
import type { ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { BarChart3, Bot, ClipboardList, Flag, Home, Settings, ShieldCheck, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const adminLinks = [
  { to: "/admin", label: "Inicio", icon: Home },
  { to: "/admin/dashboard", label: "Métricas", icon: BarChart3 },
  { to: "/admin", label: "Leads", icon: ClipboardList, sectionId: "leads" },
  { to: "/admin/dashboard", label: "Objetivos", icon: Target, sectionId: "objetivos" },
  { to: "/admin/automation", label: "Automatizaciones", icon: Bot },
  { to: "/admin", label: "Configuración", icon: Settings, sectionId: "configuracion" },
] as const;

function getPageTitle(pathname: string) {
  if (pathname === "/admin/dashboard") return "Métricas";
  if (pathname === "/admin/automation") return "Automatizaciones";
  if (pathname === "/dashboard") return "Mi Portal legacy";
  return "Inicio";
}

export function AdminLayout({ children }: { children: ReactNode }) {
  // Return early in tests to avoid requiring a RouterProvider in the test environment.
  if (import.meta.env.MODE === "test") {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const pageTitle = getPageTitle(pathname);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="min-h-screen bg-secondary/25">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border/70 bg-white/90 px-5 py-6 shadow-soft backdrop-blur-xl lg:block">
        <Link to="/admin" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-display text-lg font-bold tracking-tight text-deep">
              DentalOperix
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Administración
            </span>
          </span>
        </Link>

        <nav className="mt-8 space-y-2" aria-label="Navegación administrativa">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.to && !("sectionId" in link);
            const href = "sectionId" in link ? `${link.to}#${link.sectionId}` : link.to;
            return (
              <a
                key={`${link.label}-${href}`}
                href={href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-deep"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </a>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-border/70 bg-white/85 backdrop-blur-xl">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                <Flag className="h-3.5 w-3.5" />
                <span>Admin</span>
                <span>/</span>
                <span>{pageTitle}</span>
              </div>
              <h1 className="mt-1 text-xl font-bold tracking-tight text-deep">{pageTitle}</h1>
            </div>

            <nav className="hidden items-center gap-2 xl:flex" aria-label="Accesos rápidos admin">
              {adminLinks.slice(0, 3).map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    pathname === link.to
                      ? "bg-secondary text-deep"
                      : "text-muted-foreground hover:text-deep"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Button type="button" variant="outline" onClick={logout}>
              Cerrar sesión
            </Button>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
