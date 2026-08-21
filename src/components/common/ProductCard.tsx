import { Link } from "react-router-dom";
import type { Product } from "../../types/product.types";
import { useCart } from "../../contexts/cart/CartContext";

const CATEGORY_LABELS: Record<string, string> = {
  mouse:    "Mouse",
  keyboard: "Teclado",
  headset:  "Auriculares",
  monitor:  "Monitor",
  chair:    "Silla",
};

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(product.price);

  const isOutOfStock = product.stock === 0;

  return (
    <article className="group relative flex flex-col bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

      {/* Image */}
      <Link to={`/products/${product.id}`} className="block overflow-hidden aspect-[4/3] bg-[var(--surface)]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/400x300/1e293b/94a3b8?text=Sin+imagen";
          }}
        />
      </Link>

      {/* Category badge */}
      <span className="absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
        {CATEGORY_LABELS[product.categoryId] ?? product.categoryId}
      </span>

      {/* Out of stock badge */}
      {isOutOfStock && (
        <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full bg-[var(--destructive)]/10 text-[var(--destructive)] border border-[var(--destructive)]/20">
          Sin stock
        </span>
      )}

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-[var(--foreground)] text-sm leading-tight hover:text-[var(--primary)] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-[var(--muted)] line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Price + stock */}
        <div className="flex items-end justify-between mt-1">
          <span className="text-lg font-bold text-[var(--foreground)]">
            {formattedPrice}
          </span>
          <span className={`text-xs font-medium ${product.stock <= 5 && product.stock > 0 ? "text-[var(--warning)]" : "text-[var(--muted)]"}`}>
            {isOutOfStock ? "" : `Stock: ${product.stock}`}
          </span>
        </div>

        {/* Add to cart */}
        <button
          id={`add-to-cart-${product.id}`}
          onClick={() => addToCart(product)}
          disabled={isOutOfStock}
          className="mt-2 w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)] text-sm font-semibold py-2 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isOutOfStock ? "Sin stock" : "Agregar al carrito"}
        </button>
      </div>
    </article>
  );
}
