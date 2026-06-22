import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { AdminHomeDashboard } from "@/components/admin/AdminHomeDashboard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleRouteGuard } from "@/components/admin/RoleRouteGuard";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administración — DentalOperix" },
      { name: "description", content: "Dashboard administrativo protegido de DentalOperix." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminRouteShell,
});

function AdminRouteShell() {
  const { pathname } = useLocation();
  const normalizedPathname = pathname.replace(/\/+$/, "") || "/";

  if (normalizedPathname !== "/admin") {
    return <Outlet />;
  }

  return (
    <RoleRouteGuard allowedRoles={["administrator"]} checkingLabel="Validando acceso administrativo...">
      <AdminLayout>
        <AdminHomeDashboard />
      </AdminLayout>
    </RoleRouteGuard>
  );
}
