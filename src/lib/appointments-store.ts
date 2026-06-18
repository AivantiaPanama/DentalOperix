import { useEffect, useState } from "react";
import { initialAppointments, type Appointment } from "./clinic-data";

const KEY = "dentaloperix_appointments_v1";

function read(): Appointment[] {
  if (typeof window === "undefined") return initialAppointments;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initialAppointments;
    return JSON.parse(raw) as Appointment[];
  } catch {
    return initialAppointments;
  }
}

function write(list: Appointment[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("appointments:changed"));
}

export function useAppointments() {
  const [list, setList] = useState<Appointment[]>(() => read());
  useEffect(() => {
    setList(read());
    const handler = () => setList(read());
    window.addEventListener("appointments:changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("appointments:changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return {
    appointments: list,
    add: (a: Appointment) => write([...read(), a]),
    cancel: (id: string) =>
      write(read().map((x) => (x.id === id ? { ...x, status: "cancelled" } : x))),
    remove: (id: string) => write(read().filter((x) => x.id !== id)),
  };
}

export function getBookedSlots(date: string): string[] {
  return read()
    .filter((a) => a.date === date && a.status !== "cancelled")
    .map((a) => a.time);
}
