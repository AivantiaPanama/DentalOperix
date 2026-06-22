import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ClipboardList, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type LeadQueueItem = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  treatment?: string | null;
  status?: string | null;
  source?: string | null;
  preferredDate?: string | null;
};

type LeadQueueResponse = {
  leads?: LeadQueueItem[];
  fallback?: boolean;
  message?: string;
  error?: string;
};

type LoadState = "idle" | "loading" | "ready" | "error";

function normalize(value: string | null | undefined) {
  return value?.trim() || "Por confirmar";
}

function formatPreferredDate(value: string | null | undefined) {
  const normalized = normalize(value);
  if (normalized === "Por confirmar") {
    return normalized;
  }

  return normalized.slice(0, 10);
}

function getLeadSearchText(lead: LeadQueueItem) {
  return [lead.name, lead.email, lead.phone, lead.treatment, lead.status, lead.source, lead.preferredDate]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function filterLeadQueue(leads: LeadQueueItem[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return leads;
  }

  return leads.filter((lead) => getLeadSearchText(lead).includes(normalizedQuery));
}

export function LeadQueueWidget({ initialLeads }: { initialLeads?: LeadQueueItem[] }) {
  const [state, setState] = useState<LoadState>(initialLeads ? "ready" : "idle");
  const [leads, setLeads] = useState<LeadQueueItem[]>(initialLeads ?? []);
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (initialLeads) {
      return;
    }

    let cancelled = false;

    async function loadLeads() {
      setState("loading");
      setErrorMessage(null);

      try {
        const response = await fetch("/api/leads/list", { credentials: "same-origin" });
        const payload = (await response.json().catch(() => ({}))) as LeadQueueResponse;

        if (!response.ok) {
          throw new Error(payload.error || "No se pudo cargar la cola de leads.");
        }

        if (!cancelled) {
          setLeads(Array.isArray(payload.leads) ? payload.leads : []);
          setFallbackMessage(payload.fallback ? payload.message || "Mostrando datos demo de Leads." : null);
          setState("ready");
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : "No se pudo cargar la cola de leads.");
          setState("error");
        }
      }
    }

    void loadLeads();

    return () => {
      cancelled = true;
    };
  }, [initialLeads]);

  const filteredLeads = useMemo(() => filterLeadQueue(leads, query), [leads, query]);
  const isLoading = state === "idle" || state === "loading";

  return (
    <Card aria-label={`Cola de leads, ${filteredLeads.length} leads`} className="shadow-soft">
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg text-deep">
              <ClipboardList className="h-5 w-5 text-primary" aria-hidden="true" />
              Cola de leads
            </CardTitle>
            <CardDescription className="mt-2 leading-6">
              Vista read-only de Leads para recepción. Consume /api/leads/list y conserva Leads como Source of Truth.
            </CardDescription>
          </div>
          <Badge variant="secondary" className="w-fit">
            {filteredLeads.length} {filteredLeads.length === 1 ? "lead" : "leads"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {fallbackMessage ? (
          <Alert>
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertTitle>Modo demo de Leads</AlertTitle>
            <AlertDescription>{fallbackMessage}</AlertDescription>
          </Alert>
        ) : null}

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            aria-label="Buscar en cola de leads"
            className="pl-9"
            disabled={isLoading || state === "error"}
            placeholder="Buscar por nombre, contacto, tratamiento, estado o fuente"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-dashed border-border bg-background/70 px-4 py-5 text-sm text-muted-foreground" role="status">
            Cargando cola de leads...
          </div>
        ) : null}

        {state === "error" ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertTitle>No se pudo cargar Leads</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        {state === "ready" && leads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background/70 px-4 py-5 text-sm text-muted-foreground" role="status">
            No hay leads disponibles en la cola.
          </div>
        ) : null}

        {state === "ready" && leads.length > 0 && filteredLeads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background/70 px-4 py-5 text-sm text-muted-foreground" role="status">
            No hay leads que coincidan con la búsqueda.
          </div>
        ) : null}

        {state === "ready" && filteredLeads.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Tratamiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fuente</TableHead>
                <TableHead>Fecha preferida</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div className="font-semibold text-deep">{normalize(lead.name)}</div>
                    <div className="text-xs text-muted-foreground">{lead.id}</div>
                  </TableCell>
                  <TableCell>
                    <div>{normalize(lead.phone)}</div>
                    <div className="text-xs text-muted-foreground">{normalize(lead.email)}</div>
                  </TableCell>
                  <TableCell>{normalize(lead.treatment)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{normalize(lead.status)}</Badge>
                  </TableCell>
                  <TableCell>{normalize(lead.source)}</TableCell>
                  <TableCell>{formatPreferredDate(lead.preferredDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
      </CardContent>
    </Card>
  );
}
