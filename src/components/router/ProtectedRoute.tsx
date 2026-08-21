import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/auth/useAuth";
import { LoadingState } from "../states/LoadingState";

/**
 * Wraps routes that require authentication.
 * - While Firebase resolves the session -> shows a loading spinner.
 * - If no user is authenticated -> redirects to /login.
 * - Otherwise -> renders the child route (Outlet).
 */
export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingState message="Verificando sesion..." />;
  if (!user)   return <Navigate to="/login" replace />;

  return <Outlet />;
}
