import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { TodayScheduleWidget, getTodayScheduleAppointments } from "./TodayScheduleWidget";
import type { Appointment } from "@/lib/clinic-data";

const appointments: Appointment[] = [
  {
    id: "late",
    name: "Paciente Tarde",
    email: "late@example.com",
    phone: "100",
    service: "Ortodoncia",
    date: "2026-06-22",
    time: "15:00",
    status: "confirmed",
  },
  {
    id: "cancelled",
    name: "Paciente Cancelado",
    email: "cancelled@example.com",
    phone: "200",
    service: "Diseño de Sonrisa",
    date: "2026-06-22",
    time: "09:00",
    status: "cancelled",
  },
  {
    id: "early",
    name: "Paciente Temprano",
    email: "early@example.com",
    phone: "300",
    service: "Odontología Preventiva",
    date: "2026-06-22",
    time: "10:00",
    status: "confirmed",
  },
  {
    id: "tomorrow",
    name: "Paciente Mañana",
    email: "tomorrow@example.com",
    phone: "400",
    service: "Limpieza Dental",
    date: "2026-06-23",
    time: "09:00",
    status: "confirmed",
  },
];

describe("61.2 PR-02 Today's Schedule widget", () => {
  it("lists today's non-cancelled appointments ordered by start time", () => {
    const schedule = getTodayScheduleAppointments(appointments, "2026-06-22");

    expect(schedule.map((appointment) => appointment.id)).toEqual(["early", "late"]);
  });

  it("renders patient name, time, and provider for today's appointments", () => {
    const html = renderToStaticMarkup(<TodayScheduleWidget appointments={appointments} today="2026-06-22" />);

    expect(html).toContain("Agenda diaria");
    expect(html).toContain("10:00");
    expect(html).toContain("Paciente Temprano");
    expect(html).toContain("Dra. Camila Ríos");
    expect(html).toContain("15:00");
    expect(html).toContain("Paciente Tarde");
    expect(html).toContain("Dr. Felipe Soto");
    expect(html).not.toContain("Paciente Cancelado");
    expect(html).not.toContain("Paciente Mañana");
  });

  it("shows an explicit empty state with zero appointments", () => {
    const html = renderToStaticMarkup(<TodayScheduleWidget appointments={[]} today="2026-06-22" />);

    expect(html).toContain("No hay citas programadas para hoy.");
    expect(html).toContain("role=\"status\"");
  });
});
