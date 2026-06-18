import { describe, expect, it } from "vitest";
import { filterLeadsByPeriod, normalizeDashboardPeriod } from "./date-filters";
import type { CrmLeadRow } from "./crm-metrics";

const baseLeads: CrmLeadRow[] = [
  {
    id: "1",
    createdAt: "2026-06-14",
    name: "A",
    phone: "",
    email: "",
    treatment: "Ortodoncia",
    message: "",
    status: "agendada",
    source: "chat-widget",
    aiSummary: "",
    calendarEventId: "",
    emailSent: "false",
  },
  {
    id: "2",
    createdAt: "2026-06-10",
    name: "B",
    phone: "",
    email: "",
    treatment: "Implantes Dentales",
    message: "",
    status: "completada",
    source: "hero-button",
    aiSummary: "",
    calendarEventId: "",
    emailSent: "false",
  },
  {
    id: "3",
    createdAt: "2026-05-25",
    name: "C",
    phone: "",
    email: "",
    treatment: "Diseño de Sonrisa",
    message: "",
    status: "cancelada",
    source: "services-page",
    aiSummary: "",
    calendarEventId: "",
    emailSent: "false",
  },
  {
    id: "4",
    createdAt: "2026-05-15",
    name: "D",
    phone: "",
    email: "",
    treatment: "Odontopediatría",
    message: "",
    status: "no asistió",
    source: "navbar-button",
    aiSummary: "",
    calendarEventId: "",
    emailSent: "false",
  },
];

describe("date filters", () => {
  const now = new Date("2026-06-14T12:00:00Z");

  it("filters today", () => {
    const filtered = filterLeadsByPeriod(baseLeads, "today", now);
    expect(filtered.map((lead) => lead.id)).toEqual(["1"]);
  });

  it("filters last 7 days", () => {
    const filtered = filterLeadsByPeriod(baseLeads, "last7days", now);
    expect(filtered.map((lead) => lead.id)).toEqual(["1", "2"]);
  });

  it("filters last 30 days", () => {
    const filtered = filterLeadsByPeriod(baseLeads, "last30days", now);
    expect(filtered.map((lead) => lead.id)).toEqual(["1", "2", "3"]);
  });

  it("filters this month", () => {
    const filtered = filterLeadsByPeriod(baseLeads, "thisMonth", now);
    expect(filtered.map((lead) => lead.id)).toEqual(["1", "2"]);
  });

  it("filters previous month", () => {
    const filtered = filterLeadsByPeriod(baseLeads, "previousMonth", now);
    expect(filtered.map((lead) => lead.id)).toEqual(["3", "4"]);
  });

  it("returns empty for no matching data", () => {
    const filtered = filterLeadsByPeriod([], "today", now);
    expect(filtered).toEqual([]);
  });

  it("normalizes invalid period to all", () => {
    expect(normalizeDashboardPeriod("invalid" as string)).toBe("all");
  });
});
