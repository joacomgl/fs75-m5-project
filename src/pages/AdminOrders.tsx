import { useState, useEffect } from "react";
import { getAllOrders, updateOrderStatus } from "../services/orders.service";
import { LoadingState } from "../components/states/LoadingState";
import { EmptyState } from "../components/states/EmptyState";
import type { Order, OrderStatus } from "../types/order.types";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "text-amber-600 bg-amber-500/10 border-amber-500/30" },
  processing: { label: "En proceso", color: "text-blue-500 bg-blue-500/10 border-blue-500/30" },
  completed: { label: "Completado", color: "text-green-600 bg-green-500/10 border-green-500/30" },
  cancelled: { label: "Cancelado", color: "text-red-500 bg-red-500/10 border-red-500/30" },
};

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      // Update local state immediately
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("No se pudo actualizar el estado de la orden.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter((o) =>
    filterStatus === "all" ? true : o.status === filterStatus
  );

  return (
    <div className="space-y-6">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
            Gestión Global de Órdenes
          </h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            Monitorea los pedidos de todos los usuarios y actualiza sus estados
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-[var(--border)] hover:bg-[var(--surface)] transition-colors self-start sm:self-auto"
        >
          🔄 Refrescar
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: "Todas" },
          { id: "pending", label: "Pendientes" },
          { id: "processing", label: "En proceso" },
          { id: "completed", label: "Completadas" },
          { id: "cancelled", label: "Canceladas" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filterStatus === tab.id
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-sm"
                : "bg-[var(--surface)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab.label} (
            {tab.id === "all"
              ? orders.length
              : orders.filter((o) => o.status === tab.id).length}
            )
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <LoadingState message="Cargando órdenes del sistema..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No hay órdenes para mostrar"
          description="Aún no se han registrado compras con este estado."
          icon="📦"
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

            return (
              <div
                key={order.id}
                className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
                  <div>
                    <span className="text-xs font-mono text-[var(--muted)]">
                      ID: #{order.id}
                    </span>
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                      Fecha:{" "}
                      {order.createdAt.toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      • Usuario ID: <span className="font-mono">{order.userId.slice(0, 10)}...</span>
                    </p>
                  </div>

                  {/* Status selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--muted)]">Estado:</span>
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      className={`text-xs font-bold rounded-xl border px-3 py-1.5 outline-none cursor-pointer ${config.color} disabled:opacity-50`}
                    >
                      <option value="pending">🟡 Pendiente</option>
                      <option value="processing">🔵 En proceso</option>
                      <option value="completed">🟢 Completado</option>
                      <option value="cancelled">🔴 Cancelado</option>
                    </select>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[var(--foreground)]">
                    Items ({order.items.length}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 bg-[var(--surface)] p-2 rounded-xl border border-[var(--border)] text-xs"
                      >
                        <img
                          src={item.product?.image}
                          alt={item.product?.name}
                          className="w-9 h-9 object-cover rounded-lg bg-[var(--card)] shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/36x36/1e293b/94a3b8?text=?";
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-[var(--foreground)] truncate">
                            {item.product?.name}
                          </p>
                          <p className="text-[var(--muted)]">
                            {item.quantity} x ${item.product?.price?.toLocaleString("es-AR")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 text-sm">
                  <span className="text-[var(--muted)]">Total de la orden:</span>
                  <span className="text-base font-black text-[var(--foreground)]">
                    ${order.total.toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
