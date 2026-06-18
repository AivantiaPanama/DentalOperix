import { Link, createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRouteGuard } from "@/components/admin/AdminRouteGuard";
import { AutomationPanel } from "@/components/admin/AutomationPanel";

export const Route = createFileRoute("/admin/automation")({
  head: () => ({
    meta: [
      { title: "Automatizaciones — DentalOperix" },
      {
        name: "description",
        content: "Panel operativo para ejecutar y auditar automatizaciones DentalOperix.",
      },
    ],
  }),
  component: AutomationPage,
});

function AutomationPage() {
  return (
    <AdminRouteGuard>
      <AdminLayout>
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Admin CRM</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-deep">Automatizaciones</h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Ejecuta followups, consulta historial y revisa métricas de automatización.
              </p>
            </div>
            <Link
              to="/admin/dashboard"
              className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary hover:text-deep"
            >
              Volver al dashboard
            </Link>
          </div>
          <AutomationPanel />
        </div>
      </AdminLayout>
    </AdminRouteGuard>
  );
}
