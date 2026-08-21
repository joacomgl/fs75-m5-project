import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../services/orders.service";
import { LoadingState }  from "../components/states/LoadingState";
import type { Order }    from "../types/order.types";

export function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order,   setOrder]   = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    getOrderById(orderId)
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingState message="Cargando tu orden..." /></div>;

  return (
    <main className="min-h-screen bg-[var(--background)] flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-xl text-center space-y-5">
        {/* Success icon */}
        <div className="w-16 h-16 rounded-full bg-[var(--success)]/10 border-2 border-[var(--success)] flex items-center justify-center mx-auto text-3xl">
          ✓
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">¡Pedido confirmado!</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Tu orden fue recibida y está siendo procesada.
          </p>
        </div>

        {/* Order ID */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm">
          <p className="text-[var(--muted)]">Número de orden</p>
          <p className="font-mono font-bold text-[var(--foreground)] text-xs mt-0.5 break-all">{orderId}</p>
        </div>

        {/* Order summary */}
        {order && (
          <div className="text-sm space-y-2 text-left">
            <p className="font-semibold text-[var(--foreground)]">
              {order.items.length} producto{order.items.length !== 1 ? "s" : ""}
            </p>
            {order.items.slice(0, 3).map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-[var(--muted)]">
                <span className="truncate mr-2">{product.name} × {quantity}</span>
                <span className="shrink-0 font-medium text-[var(--foreground)]">
                  {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(product.price * quantity)}
                </span>
              </div>
            ))}
            {order.items.length > 3 && (
              <p className="text-xs text-[var(--muted)]">+ {order.items.length - 3} más...</p>
            )}
            <div className="border-t border-[var(--border)] pt-2 flex justify-between font-bold text-[var(--foreground)]">
              <span>Total</span>
              <span>{new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(order.total)}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2">
          <Link
            to="/orders"
            id="go-to-orders"
            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)] py-2.5 rounded-xl text-sm font-bold transition-colors text-center"
          >
            Ver mis órdenes
          </Link>
          <Link
            to="/"
            className="w-full border border-[var(--border)] text-[var(--foreground)] py-2.5 rounded-xl text-sm font-semibold hover:bg-[var(--surface)] transition-colors text-center"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </main>
  );
}
