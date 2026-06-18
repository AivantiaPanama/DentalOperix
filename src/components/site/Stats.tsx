export function Stats() {
  const items = [
    { n: "+5.000", t: "Pacientes atendidos" },
    { n: "98%", t: "Satisfacción reportada" },
    { n: "15", t: "Años de experiencia" },
    { n: "12", t: "Equipo odontológico profesional" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-4 rounded-3xl gradient-deep p-8 text-white shadow-glow sm:grid-cols-2 md:grid-cols-4 md:p-10">
        {items.map((i) => (
          <div key={i.t} className="text-center">
            <p className="font-display text-4xl font-bold tracking-tight">{i.n}</p>
            <p className="mt-1 text-sm text-white/70">{i.t}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
