// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BookingDialog } from "./BookingDialog";

const mutateAsync = vi.fn();

vi.mock("@/lib/api/dental-hook", () => ({
  useCreateDentalAppointment: () => ({ mutateAsync }),
}));

vi.mock("@/lib/analytics", () => ({
  track: vi.fn(),
}));

describe("BookingDialog confirmation action guard", () => {
  beforeEach(() => {
    localStorage.clear();
    mutateAsync.mockReset();
  });

  it("submits a selected appointment and renders the success confirmation", async () => {
    let resolveAppointment!: (value: { calendarCreated: boolean; message: string }) => void;
    mutateAsync.mockReturnValue(
      new Promise((resolve) => {
        resolveAppointment = resolve;
      }),
    );

    render(
      <BookingDialog
        open
        onOpenChange={vi.fn()}
        initialData={{
          name: "María González",
          email: "maria@example.com",
          phone: "987654321",
          serviceId: "consulta-general",
          date: "2026-06-27",
          time: "18:00",
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /continuar/i }));
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }));
    fireEvent.click(screen.getByRole("button", { name: /confirmar reserva/i }));

    expect(await screen.findByText(/confirmando tu cita/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "María González",
          email: "maria@example.com",
          phone: "987654321",
          date: "2026-06-27",
          time: "18:00",
        }),
      );
    });

    resolveAppointment({
      calendarCreated: true,
      message: "Tu cita fue agendada correctamente.",
    });

    expect(await screen.findByText(/cita agendada/i)).toBeInTheDocument();
    expect(screen.getByText(/tu cita fue agendada correctamente/i)).toBeInTheDocument();
  });

  it("shows a visible validation error instead of failing silently", () => {
    render(
      <BookingDialog
        open
        onOpenChange={vi.fn()}
        initialData={{
          name: "María González",
          email: "maria@example.com",
          phone: "987654321",
          serviceId: "consulta-general",
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /continuar/i }));
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }));
    fireEvent.click(screen.getByRole("button", { name: /confirmar reserva/i }));

    expect(
      screen.getByText(/selecciona una fecha y un horario disponible/i),
    ).toBeInTheDocument();
    expect(mutateAsync).not.toHaveBeenCalled();
  });
});
