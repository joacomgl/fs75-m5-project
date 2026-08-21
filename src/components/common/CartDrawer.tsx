import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/cart/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();

  // Close drawer on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const formattedTotal = new Intl.NumberFormat("es-AR", {
    style: "currency", currency: "ARS", maximumFractionDigits: 0,
  }).format(totalPrice);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-label="Carrito de compras"
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-[var(--card)] border-l border-[var(--border)] shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="font-bold text-[var(--foreground)] text-lg">
            Carrito
            {totalItems > 0 && (
              <span className="ml-2 text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </h2>
          <button
            id="close-cart"
            onClick={onClose}
            className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors p-1 rounded-lg hover:bg-[var(--surface)]"
            aria-label="Cerrar carrito"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <span className="text-5xl">🛒</span>
              <p className="font-semibold text-[var(--foreground)]">Tu carrito está vacío</p>
              <p className="text-sm text-[var(--muted)]">Agregá productos desde el catálogo</p>
              <button
                onClick={onClose}
                className="mt-2 text-sm text-[var(--primary)] hover:underline"
              >
                Ver catálogo
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-3 items-start bg-[var(--surface)] rounded-xl p-3 border border-[var(--border)]">
                {/* Thumbnail */}
                <Link to={`/products/${product.id}`} onClick={onClose} className="shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/64x64/1e293b/94a3b8?text=?"; }}
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--foreground)] truncate">{product.name}</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(product.price)} c/u
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-6 h-6 rounded-md border border-[var(--border)] text-[var(--foreground)] text-sm hover:bg-[var(--card)] transition-colors flex items-center justify-center"
                    >−</button>
                    <span className="text-sm font-semibold text-[var(--foreground)] min-w-[1.5ch] text-center">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="w-6 h-6 rounded-md border border-[var(--border)] text-[var(--foreground)] text-sm hover:bg-[var(--card)] transition-colors flex items-center justify-center disabled:opacity-40"
                    >+</button>
                  </div>
                </div>

                {/* Subtotal + remove */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-sm font-bold text-[var(--foreground)]">
                    {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(product.price * quantity)}
                  </span>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-xs text-[var(--muted)] hover:text-[var(--destructive)] transition-colors"
                    aria-label={`Eliminar ${product.name}`}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[var(--border)] px-5 py-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--muted)]">Total</span>
              <span className="text-xl font-extrabold text-[var(--foreground)]">{formattedTotal}</span>
            </div>

            <Link
              to="/checkout"
              onClick={onClose}
              id="go-to-checkout"
              className="block w-full text-center bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)] py-3 rounded-xl text-sm font-bold transition-colors"
            >
              Ir al checkout →
            </Link>

            <button
              id="clear-cart"
              onClick={clearCart}
              className="w-full text-center text-xs text-[var(--muted)] hover:text-[var(--destructive)] transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
