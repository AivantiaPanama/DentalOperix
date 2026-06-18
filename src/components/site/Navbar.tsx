import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/servicios", label: "Servicios" },
  { to: "/nuestra-filosofia", label: "Nuestra Filosofía" },
];

export function Navbar({ onBook }: { onBook: () => void }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl gradient-deep text-white shadow-soft">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-deep">
            DentalOperix
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                pathname === l.to
                  ? "bg-secondary text-deep"
                  : "text-muted-foreground hover:text-deep"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            onClick={onBook}
            className="hidden rounded-full bg-primary text-primary-foreground shadow-glow hover:bg-primary/90 sm:inline-flex"
          >
            Solicitar Atención
          </Button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-border md:hidden"
            aria-label="Menú"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          role="menu"
          className="border-t border-border bg-background md:hidden"
        >
          <div className="flex flex-col p-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-deep hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
            <Button
              onClick={() => {
                setOpen(false);
                onBook();
              }}
              className="mt-2 rounded-full bg-primary text-primary-foreground"
            >
              Solicitar Atención
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
