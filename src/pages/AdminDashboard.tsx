export function AdminDashboard() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">Panel de Administracion</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Productos", "Ordenes", "Usuarios"].map((section) => (
          <div
            key={section}
            className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-[var(--foreground)]">{section}</h2>
            <p className="text-sm text-[var(--muted)] mt-1">Gestion de {section.toLowerCase()}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
