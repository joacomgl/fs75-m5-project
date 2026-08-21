import { useProductFilters, type SortOption } from "../../hooks/useProductFilters";
import { ProductCard }  from "./ProductCard";
import { EmptyState }   from "../states/EmptyState";
import { LoadingState } from "../states/LoadingState";
import type { CategoryId } from "../../types/product.types";

const CATEGORIES: { id: CategoryId | "all"; label: string }[] = [
  { id: "all",      label: "Todos" },
  { id: "mouse",    label: "Mouse" },
  { id: "keyboard", label: "Teclado" },
  { id: "headset",  label: "Auriculares" },
  { id: "monitor",  label: "Monitor" },
  { id: "chair",    label: "Silla" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "name-asc",   label: "Nombre A–Z" },
  { value: "price-asc",  label: "Precio ↑" },
  { value: "price-desc", label: "Precio ↓" },
];

export function ProductList() {
  const {
    filteredProducts,
    loading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    totalResults,
  } = useProductFilters();

  if (loading) return <LoadingState message="Cargando productos..." />;

  return (
    <section className="space-y-6">

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">

        {/* Search bar */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none"
            fill="none" stroke="currentColor" strokeWidth={2}
            viewBox="0 0 24 24" aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            id="search-products"
            type="search"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
          />
        </div>

        {/* Category pills + sort */}
        <div className="flex flex-wrap items-center gap-2 justify-between">
          {/* Pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                id={`filter-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                    : "bg-[var(--surface)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort selector */}
          <select
            id="sort-products"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Results count ───────────────────────────────────────────────── */}
      <p className="text-xs text-[var(--muted)]">
        {totalResults === 0
          ? "Sin resultados"
          : `${totalResults} producto${totalResults !== 1 ? "s" : ""}`}
      </p>

      {/* ── Grid / Empty ─────────────────────────────────────────────────── */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description="Probá con otra búsqueda o categoría."
        />
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 list-none p-0 m-0">
          {filteredProducts.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
