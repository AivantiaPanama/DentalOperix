import type { ReactNode } from "react";
import { RoleRouteGuard } from "./RoleRouteGuard";

export function AdminRouteGuard({ children }: { children: ReactNode }) {
  return (
    <RoleRouteGuard allowedRoles={["administrator"]} checkingLabel="Validando acceso administrativo...">
      {children}
    </RoleRouteGuard>
  );
}
