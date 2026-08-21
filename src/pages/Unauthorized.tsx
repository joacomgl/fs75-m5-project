import { Link } from "react-router-dom";

export function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--background)] text-[var(--foreground)] px-4 text-center">
      <span className="text-6xl">🔒</span>
      <h1 className="text-3xl font-bold">Acceso denegado</h1>
      <p className="text-[var(--muted)] max-w-sm">
        No tenes permisos para ver esta pagina. Contacta al administrador si crees que es un error.
      </p>
      <Link
        to="/"
        className="mt-2 inline-block bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
