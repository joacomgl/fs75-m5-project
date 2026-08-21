import { useState, type FormEvent } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useCart }   from "../contexts/cart/CartContext";
import { useAuth }   from "../contexts/auth/useAuth";
import { useOrders } from "../contexts/orders/useOrders";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;

interface DeliveryForm {
  fullName:   string;
  address:    string;
  city:       string;
  postalCode: string;
  phone:      string;
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
  const steps = ["Resumen", "Entrega", "Confirmación"];
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((label, idx) => {
        const step = (idx + 1) as Step;
        const active   = step === current;
        const complete = step < current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                complete ? "bg-[var(--success)] border-[var(--success)] text-white"
                : active  ? "bg-[var(--primary)] border-[var(--primary)] text-[var(--primary-foreground)]"
                : "bg-transparent border-[var(--border)] text-[var(--muted)]"
              }`}>
                {complete ? "✓" : step}
              </div>
              <span className={`text-xs hidden sm:block ${active ? "text-[var(--foreground)] font-semibold" : "text-[var(--muted)]"}`}>
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-16 sm:w-24 h-0.5 mx-1 mb-4 transition-all ${
                complete ? "bg-[var(--success)]" : "bg-[var(--border)]"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Checkout() {
  const navigate = useNavigate();
  const { user }  = useAuth();
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { createOrder } = useOrders();

  const [step,     setStep]     = useState<Step>(1);
  const [loading,  setLoading]  = useState(false);
  const [delivery, setDelivery] = useState<DeliveryForm>({
    fullName: user?.displayName ?? "",
    address: "", city: "", postalCode: "", phone: "",
  });

  // Guard: redirect if cart is empty
  if (totalItems === 0 && step === 1) return <Navigate to="/" replace />;

  const formattedTotal = new Intl.NumberFormat("es-AR", {
    style: "currency", currency: "ARS", maximumFractionDigits: 0,
  }).format(totalPrice);

  // ── Step 1 – Order summary ───────────────────────────────────────────────

  const renderStep1 = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-[var(--foreground)]">Resumen del pedido</h2>
      <div className="space-y-3">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex gap-3 items-center bg-[var(--surface)] rounded-xl p-3 border border-[var(--border)]">
            <img
              src={product.image}
              alt={product.name}
              className="w-14 h-14 object-cover rounded-lg shrink-0"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/56x56/1e293b/94a3b8?text=?"; }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--foreground)] truncate">{product.name}</p>
              <p className="text-xs text-[var(--muted)]">Cantidad: {quantity}</p>
            </div>
            <span className="text-sm font-bold text-[var(--foreground)] shrink-0">
              {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(product.price * quantity)}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center border-t border-[var(--border)] pt-4 mt-4">
        <span className="font-semibold text-[var(--foreground)]">Total</span>
        <span className="text-xl font-extrabold text-[var(--foreground)]">{formattedTotal}</span>
      </div>
      <button
        id="checkout-step1-next"
        onClick={() => setStep(2)}
        className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)] py-3 rounded-xl text-sm font-bold transition-colors mt-2"
      >
        Continuar →
      </button>
    </div>
  );

  // ── Step 2 – Delivery form ───────────────────────────────────────────────

  const handleDeliverySubmit = (e: FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const field = (
    id: keyof DeliveryForm,
    label: string,
    type = "text",
    placeholder = ""
  ) => (
    <div>
      <label htmlFor={`delivery-${id}`} className="block text-sm font-medium text-[var(--foreground)] mb-1">{label}</label>
      <input
        id={`delivery-${id}`}
        type={type}
        required
        value={delivery[id]}
        onChange={(e) => setDelivery((prev) => ({ ...prev, [id]: e.target.value }))}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
      />
    </div>
  );

  const renderStep2 = () => (
    <form onSubmit={handleDeliverySubmit} className="space-y-4">
      <h2 className="text-lg font-bold text-[var(--foreground)]">Datos de entrega</h2>
      {field("fullName",   "Nombre completo",   "text", "Tu nombre")}
      {field("address",    "Dirección",          "text", "Av. Corrientes 1234")}
      {field("city",       "Ciudad",             "text", "Buenos Aires")}
      {field("postalCode", "Código postal",      "text", "C1414")}
      {field("phone",      "Teléfono",           "tel",  "+54 11 1234-5678")}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => setStep(1)}
          className="flex-1 border border-[var(--border)] text-[var(--foreground)] py-3 rounded-xl text-sm font-semibold hover:bg-[var(--surface)] transition-colors">
          ← Volver
        </button>
        <button id="checkout-step2-next" type="submit"
          className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)] py-3 rounded-xl text-sm font-bold transition-colors">
          Continuar →
        </button>
      </div>
    </form>
  );

  // ── Step 3 – Confirmation + simulated payment ────────────────────────────

  const handleConfirm = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const orderId = await createOrder({
        userId: user.uid,
        items,
        total:  totalPrice,
        status: "pending",
      });
      clearCart();
      navigate(`/orders/confirmation/${orderId}`);
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Hubo un error al procesar tu pedido. Intentalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep3 = () => (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-[var(--foreground)]">Confirmación y pago</h2>

      {/* Order mini-summary */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 text-sm space-y-1">
        <p className="font-semibold text-[var(--foreground)]">Entregar a: {delivery.fullName}</p>
        <p className="text-[var(--muted)]">{delivery.address}, {delivery.city} {delivery.postalCode}</p>
        <p className="text-[var(--muted)]">{delivery.phone}</p>
        <div className="border-t border-[var(--border)] pt-2 mt-2 flex justify-between">
          <span className="text-[var(--muted)]">{totalItems} producto{totalItems !== 1 ? "s" : ""}</span>
          <span className="font-bold text-[var(--foreground)]">{formattedTotal}</span>
        </div>
      </div>

      {/* Simulated payment fields */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-[var(--foreground)]">Datos de pago <span className="text-xs text-[var(--muted)] font-normal">(simulado)</span></p>
        <div>
          <label htmlFor="card-number" className="block text-xs text-[var(--muted)] mb-1">Número de tarjeta</label>
          <input id="card-number" type="text" placeholder="4242 4242 4242 4242" readOnly
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] px-3 py-2 text-sm opacity-60 cursor-not-allowed" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="card-expiry" className="block text-xs text-[var(--muted)] mb-1">Vencimiento</label>
            <input id="card-expiry" type="text" placeholder="12/29" readOnly
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] px-3 py-2 text-sm opacity-60 cursor-not-allowed" />
          </div>
          <div>
            <label htmlFor="card-cvv" className="block text-xs text-[var(--muted)] mb-1">CVV</label>
            <input id="card-cvv" type="text" placeholder="123" readOnly
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] px-3 py-2 text-sm opacity-60 cursor-not-allowed" />
          </div>
        </div>
        <p className="text-xs text-[var(--muted)] flex items-center gap-1">
          🔒 Pago simulado — no se procesará ningún cargo real.
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => setStep(2)} disabled={loading}
          className="flex-1 border border-[var(--border)] text-[var(--foreground)] py-3 rounded-xl text-sm font-semibold hover:bg-[var(--surface)] transition-colors disabled:opacity-40">
          ← Volver
        </button>
        <button
          id="checkout-confirm"
          type="button"
          onClick={handleConfirm}
          disabled={loading}
          className="flex-1 bg-[var(--success)] hover:opacity-90 text-white py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
        >
          {loading ? "Procesando..." : "Confirmar pedido ✓"}
        </button>
      </div>
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[var(--background)] py-10 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-extrabold text-[var(--foreground)] text-center mb-6">Checkout</h1>
        <StepIndicator current={step} />
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>
    </main>
  );
}
