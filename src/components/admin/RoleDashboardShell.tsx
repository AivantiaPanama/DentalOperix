import type { ReactNode } from "react";
import type { Role } from "@/lib/rbac/roles";
import { RoleWorkspaceLayout } from "./RoleWorkspaceLayout";

export function RoleDashboardShell({
  role,
  title,
  children,
}: {
  role: Role;
  title?: string;
  children?: ReactNode;
}) {
  return (
    <RoleWorkspaceLayout role={role} title={title}>
      <div className="rounded-2xl border border-dashed border-border bg-background/70 p-6">
        {children ?? (
          <div>
            <h2 className="text-xl font-semibold text-deep">Dashboard en construcción</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              La ruta ya está protegida por rol. Las funciones especializadas se integrarán en la siguiente fase.
            </p>
          </div>
        )}
      </div>
    </RoleWorkspaceLayout>
  );
}
