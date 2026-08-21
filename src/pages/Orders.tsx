import { Link } from "react-router-dom";
import { useOrders } from "../contexts/orders/useOrders";
import { LoadingState } from "../components/states/LoadingState";
import { EmptyState }   from "../components/states/EmptyState";
import type { OrderStatus } from "../types/order.types";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  pending:    { label: "Pendiente",  color: "text-amber-600 bg-amber-500/10 border-amber-500/30" },
  processing: { label: "En proceso", color: "text-blue-500 bg-blue-500/10 border-blue-500/30" },
  completed:  { label: "Completado", color: "text-green-600 bg-green-500/10 border-green-500/30" },
  cancelled:  { label: "Cancelado",  color: "text-red-500 bg-red-500/10 border-red-500/30" },
};

export function Orders() {
  const { orders, loading } = useOrders();

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingState message="Cargando tus órdenes..." /></div>;

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold text-[var(--foreground)] mb-6">Mis órdenes</h1>

      {orders.length === 0 ? (
        <EmptyState
          title="Todavía no hiciste ninguna compra"
          description="Explorá el catálogo y agregá productos al carrito."
          icon="📦"
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const config = STATUS_CONFIG[order.status];
            const formatted = new Intl.NumberFormat("es-AR", {
              style: "currency", currency: "ARS", maximumFractionDigits: 0
            }).format(order.total);

            return (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="flex items-center gap-4 bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 hover:border-[var(--primary)] hover:shadow-sm transition-all group"
              >
                {/* Date */}
                <div className="text-center shrink-0 min-w-[48px]">
                  <p className="text-xs text-[var(--muted)]">
                    {order.createdAt.toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {order.createdAt.getFullYear()}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-px h-10 bg-[var(--border)]" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-[var(--muted)] truncate">#{order.id.slice(0, 16)}…</p>
                  <p className="text-sm text-[var(--foreground)]">
                    {order.items.length} producto{order.items.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Status */}
                <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${config.color} shrink-0`}>
                  {config.label}
                </span>

                {/* Total + arrow */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-[var(--foreground)]">{formatted}</p>
                  <p className="text-xs text-[var(--primary)] group-hover:translate-x-1 transition-transform inline-block">→</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
