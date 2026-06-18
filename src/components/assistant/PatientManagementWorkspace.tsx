import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, FilePenLine, RefreshCcw, Save, Search, ShieldAlert, ShieldCheck, UserRound } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { PatientAdministrativeProfile } from "@/lib/patients/admin-profile";

type PatientsListResponse = {
  success?: boolean;
  patients?: PatientAdministrativeProfile[];
  error?: string;
};

type PatientMutationResponse = {
  success?: boolean;
  patient?: PatientAdministrativeProfile;
  error?: string;
};

type AdministrativeProfileForm = {
  displayName: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthDate: string;
  address: string;
  emergencyContact: string;
  preferredContactMethod: string;
};

const emptyForm: AdministrativeProfileForm = {
  displayName: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  birthDate: "",
  address: "",
  emergencyContact: "",
  preferredContactMethod: "",
};

function profileToForm(profile: PatientAdministrativeProfile | null): AdministrativeProfileForm {
  if (!profile) return emptyForm;

  return {
    displayName: profile.displayName,
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone,
    email: profile.email,
    birthDate: profile.birthDate,
    address: profile.address,
    emergencyContact: profile.emergencyContact,
    preferredContactMethod: profile.preferredContactMethod,
  };
}

function statusLabel(status: PatientAdministrativeProfile["administrativeStatus"]) {
  if (status === "verified") return "Verificado";
  if (status === "pending-verification") return "Pendiente de verificación";
  return "Incompleto";
}

function statusClass(status: PatientAdministrativeProfile["administrativeStatus"]) {
  if (status === "verified") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "pending-verification") return "border-blue-200 bg-blue-50 text-blue-700";
  return "border-amber-200 bg-amber-50 text-amber-700";
}

function getUpdatePayload(form: AdministrativeProfileForm, original: PatientAdministrativeProfile) {
  const originalForm = profileToForm(original);
  return Object.entries(form).reduce<Record<string, string>>((payload, [key, value]) => {
    const normalizedValue = value.trim();
    const originalValue = originalForm[key as keyof AdministrativeProfileForm].trim();

    if (normalizedValue !== originalValue) payload[key] = normalizedValue;
    return payload;
  }, {});
}

export function PatientManagementWorkspace() {
  const [patients, setPatients] = useState<PatientAdministrativeProfile[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [form, setForm] = useState<AdministrativeProfileForm>(emptyForm);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const selectedPatient = useMemo(
    () => patients.find((patient) => patient.id === selectedPatientId) ?? patients[0] ?? null,
    [patients, selectedPatientId],
  );

  const filteredPatients = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return patients;

    return patients.filter((patient) =>
      [
        patient.displayName,
        patient.phone,
        patient.email,
        patient.treatmentInterest,
        patient.latestStatus,
        patient.source,
        patient.administrativeStatus,
        ...patient.sourceLeadIds,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [patients, query]);

  const verifiedCount = patients.filter((patient) => patient.administrativeStatus === "verified").length;
  const pendingCount = patients.filter((patient) => patient.administrativeStatus === "pending-verification").length;
  const incompleteCount = patients.filter((patient) => patient.administrativeStatus === "incomplete").length;

  const loadPatients = async () => {
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch("/api/patients/list", { credentials: "same-origin" });
      const payload = (await response.json()) as PatientsListResponse;

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "No se pudieron cargar los perfiles administrativos.");
      }

      const nextPatients = payload.patients ?? [];
      setPatients(nextPatients);
      const nextSelected = selectedPatientId
        ? nextPatients.find((patient) => patient.id === selectedPatientId)
        : nextPatients[0];
      setSelectedPatientId(nextSelected?.id ?? null);
      setForm(profileToForm(nextSelected ?? null));
    } catch (loadError) {
      setPatients([]);
      setSelectedPatientId(null);
      setForm(emptyForm);
      setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar los perfiles administrativos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPatients();
  }, []);

  useEffect(() => {
    setForm(profileToForm(selectedPatient));
  }, [selectedPatient?.id]);

  const updateFormField = (field: keyof AdministrativeProfileForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const selectPatient = (patient: PatientAdministrativeProfile) => {
    setSelectedPatientId(patient.id);
    setNotice(null);
    setError(null);
  };

  const saveAdministrativeProfile = async () => {
    if (!selectedPatient) return;
    const payload = getUpdatePayload(form, selectedPatient);

    if (Object.keys(payload).length === 0) {
      setNotice("No hay cambios administrativos por guardar.");
      return;
    }

    setSaving(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch(`/api/patients/${encodeURIComponent(selectedPatient.id)}/admin-profile`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as PatientMutationResponse;

      if (!response.ok || !result.success || !result.patient) {
        throw new Error(result.error ?? "No se pudo actualizar el perfil administrativo.");
      }

      setPatients((current) => current.map((patient) => (patient.id === result.patient?.id ? result.patient : patient)));
      setSelectedPatientId(result.patient.id);
      setForm(profileToForm(result.patient));
      setNotice("Perfil administrativo actualizado con seguridad.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "No se pudo actualizar el perfil administrativo.");
    } finally {
      setSaving(false);
    }
  };

  const verifyAdministrativeProfile = async () => {
    if (!selectedPatient) return;

    setVerifying(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch(`/api/patients/${encodeURIComponent(selectedPatient.id)}/verify-profile`, {
        method: "POST",
        credentials: "same-origin",
      });
      const result = (await response.json()) as PatientMutationResponse;

      if (!response.ok || !result.success || !result.patient) {
        throw new Error(result.error ?? "No se pudo verificar el perfil administrativo.");
      }

      setPatients((current) => current.map((patient) => (patient.id === result.patient?.id ? result.patient : patient)));
      setSelectedPatientId(result.patient.id);
      setForm(profileToForm(result.patient));
      setNotice("Perfil verificado administrativamente.");
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : "No se pudo verificar el perfil administrativo.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <CardTitle>Gestión administrativa de pacientes</CardTitle>
          <CardDescription>
            Edición segura de datos administrativos. No incluye historia clínica, diagnóstico ni tratamientos médicos.
          </CardDescription>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => void loadPatients()} disabled={loading || saving || verifying}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Actualizar perfiles
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        <section className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Verificados</p>
            <p className="mt-2 text-2xl font-bold text-deep">{loading ? "..." : verifiedCount}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pendientes</p>
            <p className="mt-2 text-2xl font-bold text-deep">{loading ? "..." : pendingCount}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Incompletos</p>
            <p className="mt-2 text-2xl font-bold text-deep">{loading ? "..." : incompleteCount}</p>
          </div>
        </section>

        {error ? (
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>No se pudo completar la operación</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {notice ? (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Operación administrativa</AlertTitle>
            <AlertDescription>{notice}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[minmax(280px,380px)_minmax(0,1fr)]">
          <section className="space-y-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Buscar por nombre, teléfono, correo o servicio"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            <div className="max-h-[520px] space-y-3 overflow-auto pr-1">
              {loading ? (
                <div className="rounded-2xl border border-dashed border-border bg-background/70 p-5 text-sm text-muted-foreground">
                  Cargando perfiles administrativos...
                </div>
              ) : null}

              {!loading && filteredPatients.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-background/70 p-5 text-sm text-muted-foreground">
                  No hay perfiles administrativos con los filtros actuales.
                </div>
              ) : null}

              {filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  type="button"
                  onClick={() => selectPatient(patient)}
                  className={`w-full rounded-2xl border p-4 text-left transition hover:border-primary/40 ${
                    selectedPatient?.id === patient.id ? "border-primary/50 bg-primary/5" : "border-border bg-background/70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-deep">{patient.displayName}</p>
                      <p className="text-sm text-muted-foreground">{patient.phone}</p>
                      <p className="text-sm text-muted-foreground">{patient.email}</p>
                    </div>
                    <Badge variant="outline" className={statusClass(patient.administrativeStatus)}>
                      {statusLabel(patient.administrativeStatus)}
                    </Badge>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">Interés: {patient.treatmentInterest}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Folio(s): {patient.sourceLeadIds.join(", ")}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-background/70 p-5">
            {selectedPatient ? (
              <div className="space-y-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <UserRound className="h-4 w-4" />
                      Perfil seleccionado
                    </div>
                    <h3 className="mt-2 text-xl font-semibold text-deep">{selectedPatient.displayName}</h3>
                    <p className="text-sm text-muted-foreground">Origen: {selectedPatient.source}</p>
                  </div>
                  <Badge variant="outline" className={statusClass(selectedPatient.administrativeStatus)}>
                    {statusLabel(selectedPatient.administrativeStatus)}
                  </Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-deep">
                    Nombre completo
                    <Input value={form.displayName} onChange={(event) => updateFormField("displayName", event.target.value)} />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-deep">
                    Nombre(s)
                    <Input value={form.firstName} onChange={(event) => updateFormField("firstName", event.target.value)} />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-deep">
                    Apellidos
                    <Input value={form.lastName} onChange={(event) => updateFormField("lastName", event.target.value)} />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-deep">
                    Teléfono
                    <Input value={form.phone} onChange={(event) => updateFormField("phone", event.target.value)} />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-deep">
                    Email
                    <Input value={form.email} onChange={(event) => updateFormField("email", event.target.value)} />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-deep">
                    Fecha de nacimiento
                    <Input value={form.birthDate} onChange={(event) => updateFormField("birthDate", event.target.value)} />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-deep md:col-span-2">
                    Dirección
                    <Input value={form.address} onChange={(event) => updateFormField("address", event.target.value)} />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-deep">
                    Contacto de emergencia
                    <Input value={form.emergencyContact} onChange={(event) => updateFormField("emergencyContact", event.target.value)} />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-deep">
                    Método de contacto preferido
                    <Input
                      value={form.preferredContactMethod}
                      onChange={(event) => updateFormField("preferredContactMethod", event.target.value)}
                    />
                  </label>
                </div>

                <div className="rounded-2xl border border-dashed border-border bg-white p-4 text-sm leading-6 text-muted-foreground">
                  <p className="font-medium text-deep">Límite de seguridad</p>
                  <p className="mt-1">
                    Esta sección solo guarda datos administrativos. Cualquier dato clínico debe permanecer fuera de este
                    flujo y ser atendido en una fase clínica futura.
                  </p>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:justify-end">
                  <Button type="button" variant="outline" onClick={() => setForm(profileToForm(selectedPatient))} disabled={saving || verifying}>
                    Descartar cambios
                  </Button>
                  <Button type="button" variant="outline" onClick={() => void verifyAdministrativeProfile()} disabled={saving || verifying}>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    {verifying ? "Verificando..." : "Verificar perfil"}
                  </Button>
                  <Button type="button" onClick={() => void saveAdministrativeProfile()} disabled={saving || verifying}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </div>

                {selectedPatient.updatedAt ? (
                  <p className="text-xs text-muted-foreground">
                    Última actualización administrativa: {selectedPatient.updatedAt}
                    {selectedPatient.updatedBy ? ` por ${selectedPatient.updatedBy}` : ""}.
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-background/70 p-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 font-medium text-deep">
                  <FilePenLine className="h-4 w-4" />
                  Selecciona un perfil para gestionar sus datos administrativos.
                </div>
              </div>
            )}
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
