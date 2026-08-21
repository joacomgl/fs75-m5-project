import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/auth/useAuth";
import { LoadingState } from "../states/LoadingState";

/**
 * Wraps routes that are only accessible to admins.
 * - While resolving role -> loading spinner.
 * - If not authenticated -> /login.
 * - If authenticated but not admin -> /unauthorized.
 * - Otherwise -> renders the child route (Outlet).
 */
export function AdminRoute() {
  const { user, role, loading } = useAuth();

  if (loading)            return <LoadingState message="Verificando permisos..." />;
  if (!user)              return <Navigate to="/login" replace />;
  if (role !== "admin")   return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}
