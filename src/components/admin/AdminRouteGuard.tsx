import type { ReactNode } from "react";
import { RoleRouteGuard } from "./RoleRouteGuard";

export function AdminRouteGuard({ children }: { children: ReactNode }) {
  return (
    <RoleRouteGuard allowedRoles={["admin"]} checkingLabel="Validando acceso administrativo...">
      {children}
    </RoleRouteGuard>
  );
}
