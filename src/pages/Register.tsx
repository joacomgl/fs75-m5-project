import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/auth/useAuth";

export function Register() {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [error, setError]             = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signUp(email, password, displayName);
      navigate("/");
    } catch {
      setError("No se pudo crear la cuenta. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/");
    } catch {
      setError("No se pudo continuar con Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-sm bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Crear cuenta</h1>
        <p className="text-sm text-[var(--muted)] mb-6">
          ¿Ya tenes cuenta?{" "}
          <Link to="/login" className="text-[var(--primary)] hover:underline">
            Iniciar sesion
          </Link>
        </p>

        {error && (
          <p className="text-sm text-[var(--error)] bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="register-name" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Nombre
            </label>
            <input
              id="register-name"
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label htmlFor="register-email" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label htmlFor="register-password" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Contrasena
            </label>
            <input
              id="register-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="Min. 6 caracteres"
            />
          </div>
          <button
            id="register-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)] font-semibold rounded-lg py-2 text-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border)]" />
          </div>
          <div className="relative text-center">
            <span className="bg-[var(--card)] px-3 text-xs text-[var(--muted)]">o continua con</span>
          </div>
        </div>

        <button
          id="register-google"
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 border border-[var(--border)] rounded-lg py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.3 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.5 7.3 29 5 24 5 13 5 4 14 4 24s9 19 20 19c11 0 20-9 20-20 0-1.2-.1-2.3-.4-3.5z"/>
            <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.8 19 13 24 13c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.5 7.3 29 5 24 5c-7.4 0-13.7 4.1-17.7 9.7z"/>
            <path fill="#4CAF50" d="M24 43c5 0 9.5-1.9 12.9-5l-6-5.2C29.2 34.2 26.7 35 24 35c-5.3 0-9.7-2.7-11.3-6.5l-6.5 5C9.6 39.3 16.3 43 24 43z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.9 2.5-2.5 4.6-4.6 6l6 5.2c-.4.4 6.3-4.6 6.3-15.2 0-1.2-.1-2.3-.4-3.5z"/>
          </svg>
          Google
        </button>
      </div>
    </div>
  );
}
