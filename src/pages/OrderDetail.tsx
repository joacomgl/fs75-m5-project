import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../services/orders.service";
import { LoadingState } from "../components/states/LoadingState";
import { ErrorState }   from "../components/states/ErrorState";
import type { Order, OrderStatus } from "../types/order.types";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  pending:    { label: "Pendiente",  color: "text-amber-600 bg-amber-500/10 border-amber-500/30" },
  processing: { label: "En proceso", color: "text-blue-500 bg-blue-500/10 border-blue-500/30" },
  completed:  { label: "Completado", color: "text-green-600 bg-green-500/10 border-green-500/30" },
  cancelled:  { label: "Cancelado",  color: "text-red-500 bg-red-500/10 border-red-500/30" },
};

export function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate    = useNavigate();

  const [order,   setOrder]   = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    if (!orderId) { setError(true); setLoading(false); return; }
    getOrderById(orderId)
      .then((data) => { if (!data) setError(true); else setOrder(data); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingState message="Cargando orden..." /></div>;
  if (error || !order) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <ErrorState message="No encontramos esta orden." onRetry={() => navigate("/orders")} />
    </div>
  );

  const config    = STATUS_CONFIG[order.status];
  const formatted = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      {/* Back */}
      <button
        onClick={() => navigate("/orders")}
        className="flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Mis órdenes
      </button>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-[var(--foreground)]">Detalle de orden</h1>
          <p className="text-xs font-mono text-[var(--muted)] mt-0.5">#{order.id}</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* Metadata */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 text-sm text-[var(--muted)] space-y-1 mb-6">
        <p><span className="text-[var(--foreground)] font-medium">Fecha:</span> {order.createdAt.toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}</p>
        <p><span className="text-[var(--foreground)] font-medium">Hora:</span> {order.createdAt.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}</p>
      </div>

      {/* Items */}
      <div className="space-y-3 mb-6">
        <h2 className="font-semibold text-[var(--foreground)] text-sm">Productos</h2>
        {order.items.map(({ product, quantity }) => (
          <div key={product.id} className="flex gap-3 items-center bg-[var(--card)] border border-[var(--border)] rounded-xl p-3">
            <img
              src={product.image}
              alt={product.name}
              className="w-14 h-14 object-cover rounded-lg shrink-0"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/56x56/1e293b/94a3b8?text=?"; }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--foreground)] truncate">{product.name}</p>
              <p className="text-xs text-[var(--muted)]">Precio unitario: {formatted.format(product.price)}</p>
              <p className="text-xs text-[var(--muted)]">Cantidad: {quantity}</p>
            </div>
            <span className="text-sm font-bold text-[var(--foreground)] shrink-0">
              {formatted.format(product.price * quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 flex justify-between items-center">
        <span className="font-semibold text-[var(--foreground)]">Total pagado</span>
        <span className="text-xl font-extrabold text-[var(--foreground)]">{formatted.format(order.total)}</span>
      </div>
    </main>
  );
}
