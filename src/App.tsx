import { type JSX } from "react/jsx-runtime";
import { Routes, Route, Navigate } from "react-router-dom";
import { Header }             from "./components/common/Header";
import { ProtectedRoute }     from "./components/router/ProtectedRoute";
import { AdminRoute }         from "./components/router/AdminRoute";
import { AdminLayout }        from "./components/common/admin/AdminLayout";
import { Home }               from "./pages/Home";
import { Login }              from "./pages/Login";
import { Register }           from "./pages/Register";
import { Unauthorized }       from "./pages/Unauthorized";
import { AdminDashboard }     from "./pages/AdminDashboard";
import { AdminProducts }      from "./pages/AdminProducts";
import { AdminOrders }        from "./pages/AdminOrders";
import { ProductDetail }      from "./pages/ProductDetail";
import { Checkout }           from "./pages/Checkout";
import { Orders }             from "./pages/Orders";
import { OrderDetail }        from "./pages/OrderDetail";
import { OrderConfirmation }  from "./pages/OrderConfirmation";

export default function App(): JSX.Element {
  return (
    <Routes>
      {/* ── Client Store Layout (with Top Header) ──────────────── */}
      <Route
        element={
          <>
            <Header />
            <div className="min-h-screen bg-[var(--background)]">
              {/* Children rendered by nested routes */}
            </div>
          </>
        }
      >
        {/* Public routes */}
        <Route path="/"                            element={<><Header /><Home /></>} />
        <Route path="/login"                       element={<><Header /><Login /></>} />
        <Route path="/register"                    element={<><Header /><Register /></>} />
        <Route path="/unauthorized"                element={<><Header /><Unauthorized /></>} />
        <Route path="/products/:id"                element={<><Header /><ProductDetail /></>} />

        {/* Protected routes (authenticated customers) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout"                     element={<><Header /><Checkout /></>} />
          <Route path="/orders"                       element={<><Header /><Orders /></>} />
          <Route path="/orders/:orderId"              element={<><Header /><OrderDetail /></>} />
          <Route path="/orders/confirmation/:orderId" element={<><Header /><OrderConfirmation /></>} />
        </Route>
      </Route>

      {/* ── Admin Portal Layout (Differentiated UI with Sidebar) ──── */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Route>

      {/* ── Fallback ─────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
