import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { AuthSession } from "@/lib/rbac/guards.server";
import type { Role } from "@/lib/rbac/roles";

export const OPERATIONAL_AUDIT_ACTIONS = [
  "patient.admin_profile.updated",
  "patient.profile.verified",
  "lead.operations.updated",
  "report.operational.viewed",
  "report.operational.exported",
] as const;

export type OperationalAuditAction = (typeof OPERATIONAL_AUDIT_ACTIONS)[number];

export type OperationalAuditResourceType = "patient" | "lead" | "report";

export type OperationalAuditActor = {
  role: Role | string;
  userId?: string;
  email?: string;
  name?: string;
};

export type OperationalAuditEvent = {
  id: string;
  timestamp: string;
  action: OperationalAuditAction;
  resourceType: OperationalAuditResourceType;
  resourceId?: string;
  actorRole: Role | string;
  actorId?: string;
  actorEmail?: string;
  actorName?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export type OperationalAuditInput = {
  action: OperationalAuditAction;
  resourceType: OperationalAuditResourceType;
  resourceId?: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
};

export type OperationalAuditFilters = {
  action?: OperationalAuditAction;
  resourceType?: OperationalAuditResourceType;
  resourceId?: string;
  actorRole?: string;
  from?: string;
  to?: string;
  limit: number;
};

export class InvalidOperationalAuditFiltersError extends Error {}

const STORE_PATH = resolve(process.cwd(), ".data/operational-audit-log.json");
const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 250;

function createAuditId() {
  const random = Math.random().toString(36).slice(2, 10);
  return `audit_${Date.now().toString(36)}_${random}`;
}

function sanitizeMetadata(
  metadata: OperationalAuditInput["metadata"],
): OperationalAuditEvent["metadata"] | undefined {
  if (!metadata) return undefined;

  const sanitizedEntries = Object.entries(metadata).filter(
    (entry): entry is [string, string | number | boolean | null] => entry[1] !== undefined,
  );

  return sanitizedEntries.length ? Object.fromEntries(sanitizedEntries) : undefined;
}

function toActor(session: AuthSession | OperationalAuditActor): OperationalAuditActor {
  return {
    role: session.role,
    userId: session.userId,
    email: session.email,
    name: session.name,
  };
}

async function readStore(): Promise<OperationalAuditEvent[]> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as OperationalAuditEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeStore(events: OperationalAuditEvent[]): Promise<void> {
  await mkdir(dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, `${JSON.stringify(events, null, 2)}\n`, "utf8");
}

export async function recordOperationalAuditEvent(
  input: OperationalAuditInput,
  session: AuthSession | OperationalAuditActor,
): Promise<OperationalAuditEvent> {
  const actor = toActor(session);
  const event: OperationalAuditEvent = {
    id: createAuditId(),
    timestamp: new Date().toISOString(),
    action: input.action,
    resourceType: input.resourceType,
    resourceId: input.resourceId,
    actorRole: actor.role,
    actorId: actor.userId,
    actorEmail: actor.email,
    actorName: actor.name,
    metadata: sanitizeMetadata(input.metadata),
  };

  const events = await readStore();
  events.unshift(event);
  await writeStore(events.slice(0, 1000));
  return event;
}

export function recordOperationalAuditEventSafely(
  input: OperationalAuditInput,
  session: AuthSession | OperationalAuditActor,
): void {
  void recordOperationalAuditEvent(input, session).catch((error) => {
    console.error("Failed to record operational audit event:", error);
  });
}

function isOperationalAuditAction(value: string): value is OperationalAuditAction {
  return (OPERATIONAL_AUDIT_ACTIONS as readonly string[]).includes(value);
}

function isOperationalAuditResourceType(value: string): value is OperationalAuditResourceType {
  return value === "patient" || value === "lead" || value === "report";
}

function parseDateFilter(value: string, fieldName: string): string {
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    throw new InvalidOperationalAuditFiltersError(`Invalid ${fieldName} filter.`);
  }
  return new Date(timestamp).toISOString();
}

export function parseOperationalAuditFilters(request: Request): OperationalAuditFilters {
  const url = new URL(request.url);
  const action = url.searchParams.get("action")?.trim();
  const resourceType = url.searchParams.get("resourceType")?.trim();
  const resourceId = url.searchParams.get("resourceId")?.trim();
  const actorRole = url.searchParams.get("actorRole")?.trim();
  const from = url.searchParams.get("from")?.trim();
  const to = url.searchParams.get("to")?.trim();
  const limitParam = url.searchParams.get("limit")?.trim();

  const filters: OperationalAuditFilters = { limit: DEFAULT_LIMIT };

  if (action) {
    if (!isOperationalAuditAction(action)) {
      throw new InvalidOperationalAuditFiltersError("Invalid action filter.");
    }
    filters.action = action;
  }

  if (resourceType) {
    if (!isOperationalAuditResourceType(resourceType)) {
      throw new InvalidOperationalAuditFiltersError("Invalid resourceType filter.");
    }
    filters.resourceType = resourceType;
  }

  if (resourceId) filters.resourceId = resourceId;
  if (actorRole) filters.actorRole = actorRole;
  if (from) filters.from = parseDateFilter(from, "from");
  if (to) filters.to = parseDateFilter(to, "to");

  if (limitParam) {
    const parsedLimit = Number.parseInt(limitParam, 10);
    if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > MAX_LIMIT) {
      throw new InvalidOperationalAuditFiltersError(`Invalid limit filter. Use 1-${MAX_LIMIT}.`);
    }
    filters.limit = parsedLimit;
  }

  return filters;
}

export async function listOperationalAuditEvents(
  filters: OperationalAuditFilters,
): Promise<OperationalAuditEvent[]> {
  const events = await readStore();
  const fromTime = filters.from ? Date.parse(filters.from) : undefined;
  const toTime = filters.to ? Date.parse(filters.to) : undefined;

  return events
    .filter((event) => {
      if (filters.action && event.action !== filters.action) return false;
      if (filters.resourceType && event.resourceType !== filters.resourceType) return false;
      if (filters.resourceId && event.resourceId !== filters.resourceId) return false;
      if (filters.actorRole && event.actorRole !== filters.actorRole) return false;

      const eventTime = Date.parse(event.timestamp);
      if (fromTime !== undefined && eventTime < fromTime) return false;
      if (toTime !== undefined && eventTime > toTime) return false;

      return true;
    })
    .slice(0, filters.limit);
}
