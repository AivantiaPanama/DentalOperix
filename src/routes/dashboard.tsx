import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRouteGuard } from "@/components/admin/AdminRouteGuard";
import { PatientDashboard } from "@/components/site/PatientDashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Mi Portal legacy — DentalOperix" },
      { name: "description", content: "Panel administrativo legacy de DentalOperix." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <AdminRouteGuard>
      <AdminLayout>
        <PatientDashboard />
      </AdminLayout>
    </AdminRouteGuard>
  );
}
