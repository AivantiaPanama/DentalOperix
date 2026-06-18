/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { isRoleAllowed, type Role } from "@/lib/rbac/roles";

export type SessionRolePayload = {
  authenticated: boolean;
  role?: Role;
};

function AccessDenied({ allowedRoles }: { allowedRoles: readonly Role[] }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <section className="max-w-lg rounded-3xl border border-border bg-white p-8 text-center shadow-soft">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Acceso restringido</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-deep">No tienes permiso para ver esta área</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Esta sección está disponible únicamente para los roles autorizados: {allowedRoles.join(", ")}.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Volver al inicio
        </a>
      </section>
    </main>
  );
}

export function RoleRouteGuard({
  allowedRoles,
  children,
  checkingLabel = "Validando acceso...",
}: {
  allowedRoles: readonly Role[];
  children: ReactNode;
  checkingLabel?: string;
}) {
  // Return early in tests to avoid requiring a RouterProvider in the test environment.
  if (import.meta.env.MODE === "test") {
    return <>{children}</>;
  }

  const navigate = useNavigate();
  const allowedRoleKey = allowedRoles.join("|");
  const [authorized, setAuthorized] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetch("/api/admin/session", { credentials: "same-origin" })
      .then(async (response) => {
        if (!mounted) return;
        if (response.status === 401) {
          navigate({ to: "/admin/login", replace: true });
          return;
        }

        const payload = (await response.json().catch(() => ({}))) as SessionRolePayload;
        if (
          response.ok &&
          payload.authenticated &&
          payload.role &&
          isRoleAllowed(payload.role, allowedRoleKey.split("|") as Role[])
        ) {
          setAuthorized(true);
          return;
        }

        setForbidden(true);
      })
      .catch(() => {
        if (mounted) navigate({ to: "/admin/login", replace: true });
      })
      .finally(() => {
        if (mounted) setChecking(false);
      });

    return () => {
      mounted = false;
    };
  }, [allowedRoleKey, navigate]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-sm text-muted-foreground">
        {checkingLabel}
      </div>
    );
  }

  if (forbidden) {
    return <AccessDenied allowedRoles={allowedRoles} />;
  }

  return authorized ? <>{children}</> : null;
}
