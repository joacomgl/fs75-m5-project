import { type JSX } from "react/jsx-runtime";
import { Routes, Route, Navigate } from "react-router-dom";
import { Header }          from "./components/common/Header";
import { ProtectedRoute }  from "./components/router/ProtectedRoute";
import { AdminRoute }      from "./components/router/AdminRoute";
import { Home }            from "./pages/Home";
import { Login }           from "./pages/Login";
import { Register }        from "./pages/Register";
import { Unauthorized }    from "./pages/Unauthorized";
import { AdminDashboard }  from "./pages/AdminDashboard";
import { ProductDetail }   from "./pages/ProductDetail";

export default function App(): JSX.Element {
  return (
    <>
      <Header />
      <Routes>
        {/* Public routes */}
        <Route path="/"                element={<Home />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/unauthorized"    element={<Unauthorized />} />
        <Route path="/products/:id"    element={<ProductDetail />} />

        {/* Protected routes — authenticated users only */}
        <Route element={<ProtectedRoute />}>
          {/* /checkout and /orders will be added in Phase 3 */}
        </Route>

        {/* Admin routes — admin role only */}
        <Route element={<AdminRoute />}>
          <Route path="/admin"         element={<AdminDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
