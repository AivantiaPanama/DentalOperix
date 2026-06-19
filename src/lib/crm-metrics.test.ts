import { describe, expect, it } from "vitest";
import {
  calculateAttendanceRate,
  calculateConversionRate,
  calculateDailyTrend,
  calculateEstimatedPipelineValue,
  calculateMonthlyTrend,
  calculatePeriodComparison,
  calculateServiceConversion,
  calculateServicePerformance,
  calculateServiceTrend,
  calculateSourceConversion,
  calculateSourcePerformance,
  calculateWeeklyTrend,
  type CrmLeadRow,
} from "./crm-metrics";

describe("crm metrics", () => {
  it("returns zeros for empty dataset", () => {
    expect(calculateConversionRate([])).toBe(0);
    expect(calculateAttendanceRate([])).toBe(0);
    expect(calculateSourcePerformance([])).toEqual([]);
    expect(calculateServicePerformance([])).toEqual([]);
    expect(calculateDailyTrend([])).toEqual([]);
    expect(calculateWeeklyTrend([])).toEqual([]);
    expect(calculateMonthlyTrend([])).toEqual([]);
    expect(calculatePeriodComparison([], [])).toEqual({
      leads: { current: 0, previous: 0, changePercent: 0 },
      agendadas: { current: 0, previous: 0, changePercent: 0 },
      completadas: { current: 0, previous: 0, changePercent: 0 },
      canceladas: { current: 0, previous: 0, changePercent: 0 },
      conversionRate: { current: 0, previous: 0, changePercent: 0 },
    });
  });

  it("calculates a single appointment dataset", () => {
    const rows: CrmLeadRow[] = [
      {
        id: "1",
        date: "2026-06-14",
        name: "Ana",
        phone: "+507 60000000",
        email: "ana@example.com",
        treatment: "Ortodoncia",
        message: "Consulta ortodoncia",
        urgency: "media",
        preferredDate: "2026-06-20",
        status: "agendada",
        source: "chat-widget",
        aiSummary: "Ortodoncia",
        calendarEventId: "",
        emailSent: "false",
      },
    ];

    expect(calculateConversionRate(rows)).toBe(100);
    expect(calculateAttendanceRate(rows)).toBe(0);
    expect(calculateSourcePerformance(rows)).toEqual([
      { source: "chat-widget", leads: 1, scheduled: 1, completed: 0, conversionRate: 100 },
    ]);
    expect(calculateServicePerformance(rows)).toEqual([
      { service: "Ortodoncia", leads: 1, scheduled: 1, completed: 0, conversionRate: 100 },
    ]);
  });

  it("calculates estimated pipeline value and conversion by source/service", () => {
    const rows: CrmLeadRow[] = [
      {
        id: "1",
        date: "2026-06-14",
        name: "Ana",
        phone: "+507 60000000",
        email: "ana@example.com",
        treatment: "Ortodoncia",
        message: "Consulta ortodoncia",
        urgency: "media",
        preferredDate: "2026-06-20",
        status: "agendada",
        source: "chat-widget",
      },
      {
        id: "2",
        date: "2026-06-14",
        name: "Bruno",
        phone: "+507 60000001",
        email: "bruno@example.com",
        treatment: "Implantes Dentales",
        message: "Necesito un implante",
        urgency: "alta",
        preferredDate: "2026-06-21",
        status: "completada",
        source: "hero-button",
      },
      {
        id: "3",
        date: "2026-06-14",
        name: "Carla",
        phone: "+507 60000002",
        email: "carla@example.com",
        treatment: "Diseño de Sonrisa",
        message: "Quiero carillas",
        urgency: "media",
        preferredDate: "2026-06-22",
        status: "no asistió",
        source: "services-page",
      },
    ];

    expect(calculateEstimatedPipelineValue(rows)).toBe(4300);
    expect(calculateSourceConversion(rows)).toEqual([
      { source: "chat-widget", leads: 1, scheduled: 1, completed: 0, conversionRate: 100 },
      { source: "hero-button", leads: 1, scheduled: 1, completed: 1, conversionRate: 100 },
      { source: "services-page", leads: 1, scheduled: 0, completed: 0, conversionRate: 0 },
    ]);
    expect(calculateServiceConversion(rows)).toEqual([
      {
        service: "Ortodoncia",
        leads: 1,
        scheduled: 1,
        completed: 0,
        conversionRate: 100,
        estimatedPipelineValue: 2500,
      },
      {
        service: "Implantes Dentales",
        leads: 1,
        scheduled: 1,
        completed: 1,
        conversionRate: 100,
        estimatedPipelineValue: 1800,
      },
      {
        service: "Diseño de Sonrisa",
        leads: 1,
        scheduled: 0,
        completed: 0,
        conversionRate: 0,
        estimatedPipelineValue: 1200,
      },
    ]);
    expect(calculateServiceTrend(rows)).toEqual([
      { service: "Ortodoncia", leads: 1 },
      { service: "Implantes Dentales", leads: 1 },
      { service: "Diseño de Sonrisa", leads: 1 },
    ]);
  });

  it("handles multiple sources and statuses", () => {
    const rows: CrmLeadRow[] = [
      {
        id: "1",
        date: "2026-06-14",
        name: "Ana",
        phone: "+507 60000000",
        email: "ana@example.com",
        treatment: "Ortodoncia",
        message: "Consulta ortodoncia",
        urgency: "media",
        preferredDate: "2026-06-20",
        status: "agendada",
        source: "chat-widget",
        aiSummary: "Ortodoncia",
        calendarEventId: "",
        emailSent: "false",
      },
      {
        id: "2",
        date: "2026-06-14",
        name: "Bruno",
        phone: "+507 60000001",
        email: "bruno@example.com",
        treatment: "Implantes Dentales",
        message: "Necesito un implante",
        urgency: "alta",
        preferredDate: "2026-06-21",
        status: "completada",
        source: "hero-button",
        aiSummary: "Implantes Dentales",
        calendarEventId: "",
        emailSent: "true",
      },
      {
        id: "3",
        date: "2026-06-14",
        name: "Carla",
        phone: "+507 60000002",
        email: "carla@example.com",
        treatment: "Diseño de Sonrisa",
        message: "Quiero carillas",
        urgency: "media",
        preferredDate: "2026-06-22",
        status: "no asistió",
        source: "services-page",
        aiSummary: "Diseño de Sonrisa",
        calendarEventId: "",
        emailSent: "false",
      },
    ];

    expect(calculateConversionRate(rows)).toBeCloseTo(66.7, 1);
    expect(calculateAttendanceRate(rows)).toBe(50.0);
    expect(calculateSourcePerformance(rows)).toEqual([
      { source: "chat-widget", leads: 1, scheduled: 1, completed: 0, conversionRate: 100 },
      { source: "hero-button", leads: 1, scheduled: 1, completed: 1, conversionRate: 100 },
      { source: "services-page", leads: 1, scheduled: 0, completed: 0, conversionRate: 0 },
    ]);
    expect(calculateServicePerformance(rows)).toEqual([
      { service: "Ortodoncia", leads: 1, scheduled: 1, completed: 0, conversionRate: 100 },
      { service: "Implantes Dentales", leads: 1, scheduled: 1, completed: 1, conversionRate: 100 },
      { service: "Diseño de Sonrisa", leads: 1, scheduled: 0, completed: 0, conversionRate: 0 },
    ]);
  });

  it("calculates trends using createdAt and date interchangeably", () => {
    const rows: CrmLeadRow[] = [
      {
        id: "1",
        createdAt: "2026-06-10",
        name: "Ana",
        phone: "+507 60000000",
        email: "ana@example.com",
        treatment: "Ortodoncia",
        message: "Consulta ortodoncia",
        status: "agendada",
      },
      {
        id: "2",
        date: "2026-06-10",
        name: "Bruno",
        phone: "+507 60000001",
        email: "bruno@example.com",
        treatment: "Implantes Dentales",
        message: "Necesito un implante",
        status: "completada",
      },
    ];

    expect(calculateDailyTrend(rows)).toEqual([
      { label: "2026-06-10", leads: 2, agendadas: 1, completadas: 1, canceladas: 0, noAsistio: 0 },
    ]);
  });

  it("calculates weekly and monthly trend groups correctly", () => {
    const rows: CrmLeadRow[] = [
      {
        id: "1",
        createdAt: "2026-05-31",
        name: "A",
        phone: "",
        email: "",
        treatment: "T1",
        message: "",
        status: "nuevo",
      },
      {
        id: "2",
        createdAt: "2026-06-01",
        name: "B",
        phone: "",
        email: "",
        treatment: "T2",
        message: "",
        status: "agendada",
      },
      {
        id: "3",
        createdAt: "2026-06-15",
        name: "C",
        phone: "",
        email: "",
        treatment: "T3",
        message: "",
        status: "completada",
      },
    ];

    expect(calculateWeeklyTrend(rows)[0].label).toBe("Semana 2026-05-25");
    expect(calculateMonthlyTrend(rows)).toEqual([
      { label: "2026-05", leads: 1, agendadas: 0, completadas: 0, canceladas: 0, noAsistio: 0 },
      { label: "2026-06", leads: 2, agendadas: 1, completadas: 1, canceladas: 0, noAsistio: 0 },
    ]);
  });

  it("calculates period comparison with previous = 0 and current > 0", () => {
    const current: CrmLeadRow[] = [
      {
        id: "1",
        createdAt: "2026-06-14",
        name: "A",
        phone: "",
        email: "",
        treatment: "T1",
        message: "",
        status: "agendada",
      },
    ];
    const previous: CrmLeadRow[] = [];

    expect(calculatePeriodComparison(current, previous)).toEqual({
      leads: { current: 1, previous: 0, changePercent: 100 },
      agendadas: { current: 1, previous: 0, changePercent: 100 },
      completadas: { current: 0, previous: 0, changePercent: 0 },
      canceladas: { current: 0, previous: 0, changePercent: 0 },
      conversionRate: { current: 100, previous: 0, changePercent: 100 },
    });
  });

  it("calculates period comparison with current = 0 and previous > 0", () => {
    const current: CrmLeadRow[] = [];
    const previous: CrmLeadRow[] = [
      {
        id: "1",
        createdAt: "2026-06-01",
        name: "A",
        phone: "",
        email: "",
        treatment: "T1",
        message: "",
        status: "agendada",
      },
    ];

    expect(calculatePeriodComparison(current, previous)).toEqual({
      leads: { current: 0, previous: 1, changePercent: -100 },
      agendadas: { current: 0, previous: 1, changePercent: -100 },
      completadas: { current: 0, previous: 0, changePercent: 0 },
      canceladas: { current: 0, previous: 0, changePercent: 0 },
      conversionRate: { current: 0, previous: 100, changePercent: -100 },
    });
  });
  it("normalizes mojibake service names before grouping and valuation", () => {
    const rows: CrmLeadRow[] = [
      {
        id: "1",
        date: "2026-06-14",
        name: "Ana",
        phone: "+507 60000000",
        email: "ana@example.com",
        treatment: "DiseÃ±o de Sonrisa",
        message: "Consulta",
        status: "agendada",
      },
      {
        id: "2",
        date: "2026-06-14",
        name: "Bruno",
        phone: "+507 60000001",
        email: "bruno@example.com",
        treatment: "Diseño de Sonrisa",
        message: "Consulta",
        status: "completada",
      },
    ];

    expect(calculateServicePerformance(rows)).toEqual([
      { service: "Diseño de Sonrisa", leads: 2, scheduled: 2, completed: 1, conversionRate: 100 },
    ]);
    expect(calculateEstimatedPipelineValue(rows)).toBe(2400);
  });

});
