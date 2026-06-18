import { createFileRoute } from "@tanstack/react-router";
import { RoleDashboardShell } from "@/components/admin/RoleDashboardShell";
import { RoleRouteGuard } from "@/components/admin/RoleRouteGuard";

export const Route = createFileRoute("/doctor")({
  head: () => ({
    meta: [
      { title: "Doctor — DentalOperix" },
      { name: "description", content: "Dashboard clínico protegido para doctores DentalOperix." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: DoctorPage,
});

function DoctorPage() {
  return (
    <RoleRouteGuard allowedRoles={["doctor"]} checkingLabel="Validando acceso clínico...">
      <RoleDashboardShell role="doctor" />
    </RoleRouteGuard>
  );
}
