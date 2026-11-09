// Mientras cargan los números: esqueleto con la forma del panel (nunca un spinner suelto, 15).

export default function CargandoPanel() {
  const bloque = 'rounded-[var(--radius-card)] bg-raised motion-safe:animate-pulse';
  return (
    <div aria-busy="true" aria-label="Cargando los números">
      <div className="mb-6">
        <div className="h-3 w-32 rounded-full bg-raised motion-safe:animate-pulse" />
        <div className="mt-2 h-8 w-56 rounded-[var(--radius-chip)] bg-raised motion-safe:animate-pulse" />
      </div>
      <div className={`${bloque} mb-4 h-32`} />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`${bloque} h-28`} />
        ))}
      </div>
      <div className={`${bloque} h-64`} />
    </div>
  );
}
