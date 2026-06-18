import { createFileRoute } from "@tanstack/react-router";
import { AssistantDashboard } from "@/components/assistant/AssistantDashboard";
import { RoleWorkspaceLayout } from "@/components/admin/RoleWorkspaceLayout";
import { RoleRouteGuard } from "@/components/admin/RoleRouteGuard";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Asistente — DentalOperix" },
      { name: "description", content: "Dashboard operativo protegido para asistentes DentalOperix." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AssistantPage,
});

function AssistantPage() {
  return (
    <RoleRouteGuard allowedRoles={["assistant"]} checkingLabel="Validando acceso operativo...">
      <RoleWorkspaceLayout role="assistant" title="Asistente">
        <AssistantDashboard />
      </RoleWorkspaceLayout>
    </RoleRouteGuard>
  );
}
