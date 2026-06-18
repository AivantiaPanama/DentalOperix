import { createFileRoute } from "@tanstack/react-router";
import { RoleDashboardShell } from "@/components/admin/RoleDashboardShell";
import { RoleRouteGuard } from "@/components/admin/RoleRouteGuard";

export const Route = createFileRoute("/patient")({
  head: () => ({
    meta: [
      { title: "Paciente — DentalOperix" },
      { name: "description", content: "Portal protegido para pacientes DentalOperix." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PatientPage,
});

function PatientPage() {
  return (
    <RoleRouteGuard allowedRoles={["patient"]} checkingLabel="Validando acceso del paciente...">
      <RoleDashboardShell role="patient" />
    </RoleRouteGuard>
  );
}
