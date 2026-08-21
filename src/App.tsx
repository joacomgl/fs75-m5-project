import { type JSX } from "react/jsx-runtime";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
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

/** Standard layout with top header for all customer/public views */
function StoreLayout() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--background)]">
        <Outlet />
      </main>
    </>
  );
}

export default function App(): JSX.Element {
  return (
    <Routes>
      {/* ── Client Store Layout (Header + Content via Outlet) ───── */}
      <Route element={<StoreLayout />}>
        {/* Public routes (no auth required) */}
        <Route path="/"                            element={<Home />} />
        <Route path="/login"                       element={<Login />} />
        <Route path="/register"                    element={<Register />} />
        <Route path="/unauthorized"                element={<Unauthorized />} />
        <Route path="/products/:id"                element={<ProductDetail />} />

        {/* Protected customer routes (auth required) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout"                     element={<Checkout />} />
          <Route path="/orders"                       element={<Orders />} />
          <Route path="/orders/:orderId"              element={<OrderDetail />} />
          <Route path="/orders/confirmation/:orderId" element={<OrderConfirmation />} />
        </Route>
      </Route>

      {/* ── Admin Portal Layout (Differentiated Sidebar UI) ─────── */}
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
