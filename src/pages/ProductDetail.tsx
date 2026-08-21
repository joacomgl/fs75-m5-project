import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/products.service";
import { useCart } from "../contexts/cart/CartContext";
import { LoadingState } from "../components/states/LoadingState";
import { ErrorState }   from "../components/states/ErrorState";
import type { Product } from "../types/product.types";

const CATEGORY_LABELS: Record<string, string> = {
  mouse: "Mouse", keyboard: "Teclado", headset: "Auriculares",
  monitor: "Monitor", chair: "Silla",
};

export function ProductDetail() {
  const { id }      = useParams<{ id: string }>();
  const navigate    = useNavigate();
  const { addToCart } = useCart();

  const [product,  setProduct]  = useState<Product | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added,    setAdded]    = useState(false);

  useEffect(() => {
    if (!id) { setError(true); setLoading(false); return; }

    setLoading(true);
    setError(false);

    getProductById(id)
      .then((data) => {
        if (!data) setError(true);
        else { setProduct(data); setQuantity(1); }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingState message="Cargando producto..." /></div>;
  if (error || !product) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <ErrorState message="No encontramos este producto." onRetry={() => navigate(-1)} />
    </div>
  );

  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency", currency: "ARS", maximumFractionDigits: 0,
  }).format(product.price);

  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Volver al catálogo
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Image */}
        <div className="rounded-2xl overflow-hidden bg-[var(--surface)] border border-[var(--border)] aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/600x600/1e293b/94a3b8?text=Sin+imagen";
            }}
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          {/* Category */}
          <span className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wide">
            {CATEGORY_LABELS[product.categoryId] ?? product.categoryId}
          </span>

          <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] leading-tight">
            {product.name}
          </h1>

          <p className="text-[var(--muted)] text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--foreground)]">{formattedPrice}</span>
          </div>

          {/* Stock indicator */}
          <p className={`text-sm font-medium ${
            isOutOfStock ? "text-[var(--destructive)]"
            : product.stock <= 5 ? "text-[var(--warning)]"
            : "text-[var(--success)]"
          }`}>
            {isOutOfStock ? "Sin stock disponible"
             : product.stock <= 5 ? `¡Solo quedan ${product.stock}!`
             : `${product.stock} en stock`}
          </p>

          {/* Quantity selector */}
          {!isOutOfStock && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--muted)]">Cantidad:</span>
              <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
                <button
                  id="qty-decrease"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="px-3 py-1.5 text-[var(--foreground)] hover:bg-[var(--surface)] disabled:opacity-40 transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-1.5 text-sm font-semibold text-[var(--foreground)] min-w-[3ch] text-center border-x border-[var(--border)]">
                  {quantity}
                </span>
                <button
                  id="qty-increase"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="px-3 py-1.5 text-[var(--foreground)] hover:bg-[var(--surface)] disabled:opacity-40 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to cart */}
          <button
            id="product-detail-add-to-cart"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`mt-2 w-full py-3 rounded-xl text-sm font-bold transition-all ${
              added
                ? "bg-[var(--success)] text-white"
                : "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)]"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {added ? "✓ Agregado al carrito" : isOutOfStock ? "Sin stock" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </main>
  );
}
