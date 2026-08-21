import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth }    from "../../contexts/auth/useAuth";
import { useTheme }   from "../../contexts/Theme/useTheme";
import { useCart }    from "../../contexts/cart/CartContext";
import { CartDrawer } from "./CartDrawer";

export function Header() {
  const { user, role, signOut } = useAuth();
  const { theme, toggleTheme }  = useTheme();
  const { totalItems }          = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

          {/* Brand */}
          <Link to="/" className="font-bold text-[var(--primary)] text-lg tracking-tight flex items-center gap-1.5 shrink-0">
            <span>⚡</span> TechStore
          </Link>

          {/* Nav */}
          <nav className="hidden sm:flex items-center gap-5 text-sm font-medium">
            <Link to="/" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
              Catálogo
            </Link>
            {user && (
              <Link to="/orders" id="nav-orders" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                Mis órdenes
              </Link>
            )}
            {role === "admin" && (
              <Link to="/admin" className="text-[var(--primary)] font-semibold hover:underline">
                Admin ↗
              </Link>
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">

            {/* Theme */}
            <button
              id="toggle-theme"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-all"
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {/* Cart */}
            <button
              id="open-cart"
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-all"
              aria-label="Abrir carrito"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-extrabold bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full px-1">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2 ml-1">
                <span className="text-sm text-[var(--muted)] hidden lg:block max-w-[120px] truncate">
                  {user.displayName ?? user.email}
                </span>
                <button
                  id="btn-logout"
                  onClick={signOut}
                  className="text-sm border border-[var(--border)] rounded-lg px-3 py-1.5 text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Link
                  id="btn-login"
                  to="/login"
                  className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors px-2"
                >
                  Ingresar
                </Link>
                <Link
                  id="btn-register"
                  to="/register"
                  className="text-sm bg-[var(--primary)] text-[var(--primary-foreground)] px-3 py-1.5 rounded-lg hover:bg-[var(--primary-hover)] transition-colors font-semibold"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
