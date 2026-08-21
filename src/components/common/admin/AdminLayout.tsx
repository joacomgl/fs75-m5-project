import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../../contexts/auth/useAuth";
import { useTheme } from "../../../contexts/Theme/useTheme";

export function AdminLayout() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--background)] text-[var(--foreground)]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[var(--card)] border-r border-[var(--border)] flex flex-col shrink-0">
        {/* Brand / Title */}
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-black text-lg text-[var(--primary)] tracking-tight">
            <span>⚡</span> TechStore
            <span className="text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
              Admin
            </span>
          </Link>
          <button
            onClick={toggleTheme}
            className="md:hidden p-2 text-sm rounded-lg hover:bg-[var(--surface)] text-[var(--muted)]"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5 flex-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                  : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
              }`
            }
          >
            <span>📊</span> Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                  : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
              }`
            }
          >
            <span>📦</span> Productos (CRUD)
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                  : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
              }`
            }
          >
            <span>🧾</span> Gestión de Órdenes
          </NavLink>
        </nav>

        {/* User / Bottom info */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)]/50 space-y-3">
          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <span className="truncate max-w-[150px] font-medium text-[var(--foreground)]">
              {user?.displayName || user?.email}
            </span>
            <button
              onClick={toggleTheme}
              className="hidden md:block p-1 rounded hover:bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"
              title="Cambiar tema"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>

          <div className="flex gap-2">
            <Link
              to="/"
              className="flex-1 text-center py-2 text-xs font-semibold rounded-lg border border-[var(--border)] hover:bg-[var(--card)] transition-colors"
            >
              ← Volver a la Tienda
            </Link>
            <button
              onClick={signOut}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors"
              title="Cerrar sesión"
            >
              Salir
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
}
