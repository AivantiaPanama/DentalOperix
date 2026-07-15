import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  MessageSquareText,
  RefreshCcw,
  Save,
  Search,
  ShieldAlert,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MockLead } from "@/lib/mock/leads";
import type { LeadOperationPriority, LeadOperationalStatus } from "@/server/leads/api-validation";
import type { LeadOperationsProfile } from "@/server/leads/operations-repository";

type LeadOperationsResponse = {
  success?: boolean;
  leadOperations?: LeadOperationsProfile[];
  error?: string;
};

type LeadOperationMutationResponse = {
  success?: boolean;
  leadOperations?: LeadOperationsProfile;
  error?: string;
};

type LeadOperationForm = {
  operationalStatus: LeadOperationalStatus;
  priority: LeadOperationPriority;
  lastContactAt: string;
  nextFollowUpAt: string;
  contactResult: string;
  internalNote: string;
};

const statusOptions: Array<{ value: LeadOperationalStatus; label: string }> = [
  { value: "nuevo", label: "Nuevo" },
  { value: "contactado", label: "Contactado" },
  { value: "seguimiento", label: "Seguimiento" },
  { value: "descartado", label: "Descartado" },
];

const priorityOptions: Array<{ value: LeadOperationPriority; label: string }> = [
  { value: "baja", label: "Baja" },
  { value: "normal", label: "Normal" },
  { value: "alta", label: "Alta" },
];

const emptyForm: LeadOperationForm = {
  operationalStatus: "nuevo",
  priority: "normal",
  lastContactAt: "",
  nextFollowUpAt: "",
  contactResult: "",
  internalNote: "",
};

function leadOperationsToForm(leadOperations: LeadOperationsProfile | null): LeadOperationForm {
  if (!leadOperations) return emptyForm;

  return {
    operationalStatus: leadOperations.operationalStatus,
    priority: leadOperations.priority,
    lastContactAt: leadOperations.lastContactAt,
    nextFollowUpAt: leadOperations.nextFollowUpAt,
    contactResult: leadOperations.contactResult,
    internalNote: leadOperations.internalNote,
  };
}

function statusLabel(status: LeadOperationalStatus) {
  return statusOptions.find((option) => option.value === status)?.label ?? status;
}

function priorityLabel(priority: LeadOperationPriority) {
  return priorityOptions.find((option) => option.value === priority)?.label ?? priority;
}

function statusClass(status: LeadOperationalStatus) {
  if (status === "contactado") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "seguimiento") return "border-blue-200 bg-blue-50 text-blue-700";
  if (status === "descartado") return "border-slate-200 bg-slate-50 text-slate-700";
  return "border-amber-200 bg-amber-50 text-amber-700";
}

function priorityClass(priority: LeadOperationPriority) {
  if (priority === "alta") return "border-red-200 bg-red-50 text-red-700";
  if (priority === "baja") return "border-slate-200 bg-slate-50 text-slate-700";
  return "border-primary/20 bg-primary/5 text-primary";
}

function formatLeadDate(value: string) {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-PA", { dateStyle: "medium" }).format(date);
}

function dateInputValue(value: string) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function leadText(lead: MockLead) {
  return [
    lead.id,
    lead.name,
    lead.phone,
    lead.email,
    lead.treatment,
    lead.status,
    lead.source,
    lead.notes,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getUpdatePayload(form: LeadOperationForm, original: LeadOperationsProfile) {
  const originalForm = leadOperationsToForm(original);
  return Object.entries(form).reduce<Record<string, string>>((payload, [key, value]) => {
    const originalValue = originalForm[key as keyof LeadOperationForm] ?? "";
    if (value !== originalValue) payload[key] = value;
    return payload;
  }, {});
}

export function LeadOperationsWorkspace() {
  const [leadOperations, setLeadOperations] = useState<LeadOperationsProfile[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [form, setForm] = useState<LeadOperationForm>(emptyForm);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadLeadOperations = async () => {
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch("/api/leads/operations", { credentials: "same-origin" });
      const payload = (await response.json()) as LeadOperationsResponse;

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "No se pudo cargar la operación de leads.");
      }

      const nextLeadOperations = payload.leadOperations ?? [];
      setLeadOperations(nextLeadOperations);

      const nextSelected =
        selectedLeadId && nextLeadOperations.some((item) => item.leadId === selectedLeadId)
          ? selectedLeadId
          : (nextLeadOperations[0]?.leadId ?? null);
      setSelectedLeadId(nextSelected);
      setForm(
        leadOperationsToForm(
          nextLeadOperations.find((item) => item.leadId === nextSelected) ?? null,
        ),
      );
    } catch (loadError) {
      setLeadOperations([]);
      setSelectedLeadId(null);
      setForm(emptyForm);
      setError(
        loadError instanceof Error ? loadError.message : "No se pudo cargar la operación de leads.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLeadOperations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedLeadOperations = useMemo(
    () => leadOperations.find((item) => item.leadId === selectedLeadId) ?? null,
    [leadOperations, selectedLeadId],
  );

  const filteredLeadOperations = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return leadOperations;

    return leadOperations.filter((item) =>
      [
        leadText(item.lead),
        item.operationalStatus,
        item.priority,
        item.contactResult,
        item.internalNote,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [leadOperations, query]);

  const followUpCount = leadOperations.filter(
    (item) => item.operationalStatus === "seguimiento",
  ).length;
  const highPriorityCount = leadOperations.filter((item) => item.priority === "alta").length;
  const contactedCount = leadOperations.filter(
    (item) => item.operationalStatus === "contactado",
  ).length;

  const selectLead = (item: LeadOperationsProfile) => {
    setSelectedLeadId(item.leadId);
    setForm(leadOperationsToForm(item));
    setError(null);
    setNotice(null);
  };

  const updateForm = (field: keyof LeadOperationForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }) as LeadOperationForm);
  };

  const saveLeadOperations = async () => {
    if (!selectedLeadOperations) return;

    const payload = getUpdatePayload(form, selectedLeadOperations);
    if (Object.keys(payload).length === 0) {
      setNotice("No hay cambios operativos por guardar.");
      return;
    }

    setSaving(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch(
        `/api/leads/${encodeURIComponent(selectedLeadOperations.leadId)}/operations`,
        {
          method: "PATCH",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = (await response.json()) as LeadOperationMutationResponse;

      if (!response.ok || !result.success || !result.leadOperations) {
        throw new Error(result.error ?? "No se pudo actualizar la operación del lead.");
      }

      setLeadOperations((current) =>
        current.map((item) =>
          item.leadId === result.leadOperations?.leadId ? result.leadOperations : item,
        ),
      );
      setSelectedLeadId(result.leadOperations.leadId);
      setForm(leadOperationsToForm(result.leadOperations));
      setNotice("Seguimiento operativo actualizado con seguridad.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo actualizar la operación del lead.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <CardTitle>Operación de leads</CardTitle>
          <CardDescription>
            Seguimiento administrativo paralelo. No crea citas, no escribe Calendar, no envía Gmail
            y no modifica datos clínicos.
          </CardDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void loadLeadOperations()}
          disabled={loading || saving}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Actualizar leads
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        <section className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              En seguimiento
            </p>
            <p className="mt-2 text-2xl font-bold text-deep">{loading ? "..." : followUpCount}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Prioridad alta
            </p>
            <p className="mt-2 text-2xl font-bold text-deep">
              {loading ? "..." : highPriorityCount}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Contactados
            </p>
            <p className="mt-2 text-2xl font-bold text-deep">{loading ? "..." : contactedCount}</p>
          </div>
        </section>

        <Alert className="border-blue-200 bg-blue-50 text-blue-900">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Límite arquitectónico activo</AlertTitle>
          <AlertDescription>
            Esta sección solo registra seguimiento interno. La creación de citas permanece
            exclusivamente en BookingDialog.
          </AlertDescription>
        </Alert>

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>No se pudo completar la operación</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {notice ? (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
            <AlertTitle>Operación actualizada</AlertTitle>
            <AlertDescription>{notice}</AlertDescription>
          </Alert>
        ) : null}

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar lead, paciente, teléfono, correo, servicio o nota"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-3">
            {loading ? (
              <div className="rounded-2xl border border-dashed border-border bg-background/70 p-6 text-sm text-muted-foreground">
                Cargando leads operativos...
              </div>
            ) : null}

            {!loading && filteredLeadOperations.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-background/70 p-6 text-sm text-muted-foreground">
                No hay leads que coincidan con los filtros actuales.
              </div>
            ) : null}

            {filteredLeadOperations.map((item) => (
              <button
                key={item.leadId}
                type="button"
                onClick={() => selectLead(item)}
                className={`w-full rounded-2xl border bg-background/70 p-4 text-left transition hover:border-primary/40 ${
                  item.leadId === selectedLeadId
                    ? "border-primary/50 ring-2 ring-primary/10"
                    : "border-border"
                }`}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className={statusClass(item.operationalStatus)}>
                        {statusLabel(item.operationalStatus)}
                      </Badge>
                      <Badge variant="outline" className={priorityClass(item.priority)}>
                        Prioridad {priorityLabel(item.priority)}
                      </Badge>
                    </div>
                    <p className="mt-3 font-semibold text-deep">
                      {item.lead.name || "Lead sin nombre"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.lead.treatment || "Servicio por definir"}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground md:text-right">
                    <p>{item.lead.phone || "Teléfono no registrado"}</p>
                    <p>{item.lead.email || "Correo no registrado"}</p>
                    <p className="mt-1 font-medium text-deep">{item.leadId}</p>
                  </div>
                </div>
                <div className="mt-3 grid gap-2 text-xs text-muted-foreground md:grid-cols-2">
                  <span>Último contacto: {formatLeadDate(item.lastContactAt)}</span>
                  <span>Próximo seguimiento: {formatLeadDate(item.nextFollowUpAt)}</span>
                </div>
                {item.internalNote ? (
                  <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-muted-foreground">
                    {item.internalNote}
                  </p>
                ) : null}
              </button>
            ))}
          </div>

          <aside className="rounded-2xl border border-border bg-background/70 p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                <ClipboardList className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-deep">Detalle operativo</p>
                <p className="text-sm text-muted-foreground">Solo seguimiento interno de leads.</p>
              </div>
            </div>

            {!selectedLeadOperations ? (
              <div className="mt-5 rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">
                Selecciona un lead para editar su seguimiento operativo.
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-white p-4 text-sm leading-6 text-muted-foreground">
                  <p className="font-semibold text-deep">{selectedLeadOperations.lead.name}</p>
                  <p>{selectedLeadOperations.lead.phone}</p>
                  <p>{selectedLeadOperations.lead.email}</p>
                  <p className="mt-2">Interés: {selectedLeadOperations.lead.treatment}</p>
                  <p>Estado de cita/CRM: {selectedLeadOperations.lead.status}</p>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
                  <label className="space-y-2">
                    <Label htmlFor="lead-operational-status">Estado operativo</Label>
                    <select
                      id="lead-operational-status"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={form.operationalStatus}
                      onChange={(event) => updateForm("operationalStatus", event.target.value)}
                      disabled={saving}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2">
                    <Label htmlFor="lead-priority">Prioridad</Label>
                    <select
                      id="lead-priority"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={form.priority}
                      onChange={(event) => updateForm("priority", event.target.value)}
                      disabled={saving}
                    >
                      {priorityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
                  <label className="space-y-2">
                    <Label htmlFor="lead-last-contact">Último contacto</Label>
                    <Input
                      id="lead-last-contact"
                      type="date"
                      value={dateInputValue(form.lastContactAt)}
                      onChange={(event) => updateForm("lastContactAt", event.target.value)}
                      disabled={saving}
                    />
                  </label>

                  <label className="space-y-2">
                    <Label htmlFor="lead-next-follow-up">Próximo seguimiento</Label>
                    <Input
                      id="lead-next-follow-up"
                      type="date"
                      value={dateInputValue(form.nextFollowUpAt)}
                      onChange={(event) => updateForm("nextFollowUpAt", event.target.value)}
                      disabled={saving}
                    />
                  </label>
                </div>

                <label className="space-y-2">
                  <Label htmlFor="lead-contact-result">Resultado de contacto</Label>
                  <Input
                    id="lead-contact-result"
                    value={form.contactResult}
                    onChange={(event) => updateForm("contactResult", event.target.value)}
                    placeholder="Ej. solicita llamada mañana, sin respuesta, interesado en orientación"
                    disabled={saving}
                  />
                </label>

                <label className="space-y-2">
                  <Label htmlFor="lead-internal-note" className="flex items-center gap-2">
                    <MessageSquareText className="h-4 w-4" />
                    Nota interna
                  </Label>
                  <Textarea
                    id="lead-internal-note"
                    value={form.internalNote}
                    onChange={(event) => updateForm("internalNote", event.target.value)}
                    placeholder="Registrar contexto administrativo con claridad y respeto. No incluir diagnósticos ni notas clínicas."
                    disabled={saving}
                    rows={5}
                  />
                </label>

                <Button
                  type="button"
                  className="w-full"
                  onClick={() => void saveLeadOperations()}
                  disabled={saving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Guardando..." : "Guardar seguimiento operativo"}
                </Button>
              </div>
            )}
          </aside>
        </section>
      </CardContent>
    </Card>
  );
}
