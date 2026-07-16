import { FormEvent, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LockKeyhole } from "lucide-react";
import { resolveDashboardRouteForRole } from "@/lib/dashboard-routing";
import { isRole, type Role } from "@/lib/rbac/roles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/login")({
  validateSearch: (search: Record<string, unknown>) => {
    const role = typeof search.role === "string" && isRole(search.role) ? search.role : undefined;
    return { role };
  },
  head: () => ({
    meta: [
      { title: "Login Admin — DentalOperix" },
      { name: "description", content: "Acceso administrativo privado de DentalOperix." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const initialRole = search.role ?? "administrator";
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(initialRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, role }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.success === false) {
        throw new Error(payload.error ?? "No se pudo iniciar sesión.");
      }
      const resolvedRole = isRole(payload.role) ? payload.role : role;
      navigate({ to: resolveDashboardRouteForRole(resolvedRole), replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Error de autenticación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/30 px-4 py-10">
      <Card className="w-full max-w-md shadow-soft">
        <CardHeader className="text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <LockKeyhole className="h-5 w-5" />
          </span>
          <CardTitle className="mt-3 text-2xl">Acceso administrativo</CardTitle>
          <CardDescription>Ingresa la contraseña privada de la clínica.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Contraseña</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-role">Workspace</Label>
              <select
                id="admin-role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={role}
                onChange={(event) => {
                  const selectedRole = event.target.value;
                  if (isRole(selectedRole)) setRole(selectedRole);
                }}
              >
                <option value="administrator">Administración</option>
                <option value="assistant">Asistente / Front Desk</option>
                <option value="doctor">Doctor</option>
                <option value="patient">Paciente</option>
              </select>
            </div>
            {error ? (
              <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
            ) : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Validando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
