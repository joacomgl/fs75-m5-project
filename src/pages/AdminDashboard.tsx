import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/products.service";
import { getAllOrders } from "../services/orders.service";
import { LoadingState } from "../components/states/LoadingState";
import type { Product } from "../types/product.types";
import type { Order } from "../types/order.types";

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [prodList, orderList] = await Promise.all([
          getProducts(),
          getAllOrders(),
        ]);
        setProducts(prodList);
        setOrders(orderList);
      } catch (err) {
        console.error("Error loading dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <LoadingState message="Cargando métricas del panel de administración..." />;
  }

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((acc, curr) => acc + (curr.total || 0), 0);

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-[var(--foreground)] tracking-tight">
          Panel de Control
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Resumen general del catálogo, pedidos y facturación de TechStore
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <span className="font-semibold uppercase tracking-wider">Ingresos Totales</span>
            <span className="text-xl">💰</span>
          </div>
          <p className="text-2xl font-black text-[var(--foreground)]">
            ${totalRevenue.toLocaleString("es-AR")}
          </p>
          <p className="text-xs text-[var(--success)] font-medium">
            Órdenes confirmadas y procesadas
          </p>
        </div>

        {/* Card 2: Orders */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <span className="font-semibold uppercase tracking-wider">Total Órdenes</span>
            <span className="text-xl">🧾</span>
          </div>
          <p className="text-2xl font-black text-[var(--foreground)]">{orders.length}</p>
          <p className="text-xs text-[var(--muted)]">
            {pendingOrders > 0 ? (
              <span className="text-amber-500 font-semibold">{pendingOrders} pendientes de entrega</span>
            ) : (
              "Sin pedidos pendientes"
            )}
          </p>
        </div>

        {/* Card 3: Products */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <span className="font-semibold uppercase tracking-wider">Productos Activos</span>
            <span className="text-xl">📦</span>
          </div>
          <p className="text-2xl font-black text-[var(--foreground)]">{products.length}</p>
          <p className="text-xs text-[var(--muted)]">
            {outOfStock > 0 ? (
              <span className="text-red-500 font-semibold">{outOfStock} sin stock</span>
            ) : (
              "Todos con stock disponible"
            )}
          </p>
        </div>

        {/* Card 4: S3 Status */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <span className="font-semibold uppercase tracking-wider">Almacenamiento S3</span>
            <span className="text-xl">☁️</span>
          </div>
          <p className="text-sm font-bold text-[var(--foreground)]">AWS S3 Activo</p>
          <p className="text-xs text-[var(--muted)] truncate font-mono">
            Bucket: ecommerce-ft75-images
          </p>
        </div>
      </div>

      {/* Quick Access Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Manage Products Card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-[var(--foreground)]">Gestión del Catálogo</h3>
            <span className="text-2xl">📦</span>
          </div>
          <p className="text-xs text-[var(--muted)]">
            Agrega nuevos productos con subida de fotos a Amazon S3, edita precios, descripciones y controla el stock.
          </p>
          <div className="flex gap-3 pt-2">
            <Link
              to="/admin/products"
              className="flex-1 text-center py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-xs hover:bg-[var(--primary-hover)] transition-colors"
            >
              Ver Catálogo Completo →
            </Link>
          </div>
        </div>

        {/* Manage Orders Card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-[var(--foreground)]">Gestión de Órdenes</h3>
            <span className="text-2xl">🧾</span>
          </div>
          <p className="text-xs text-[var(--muted)]">
            Revisa los pedidos realizados por los clientes, cambia estados (Pendiente, En proceso, Completado, Cancelado) y monitorea las ventas.
          </p>
          <div className="flex gap-3 pt-2">
            <Link
              to="/admin/orders"
              className="flex-1 text-center py-2.5 rounded-xl border border-[var(--border)] text-[var(--foreground)] font-bold text-xs hover:bg-[var(--surface)] transition-colors"
            >
              Gestionar Órdenes →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
