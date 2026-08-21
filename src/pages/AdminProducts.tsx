import { useState, useEffect } from "react";
import { getProducts, deleteProduct } from "../services/products.service";
import { AdminProductForm } from "../components/common/admin/AdminProductForm";
import { LoadingState } from "../components/states/LoadingState";
import { EmptyState } from "../components/states/EmptyState";
import type { Product } from "../types/product.types";

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar "${name}"?`)) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Error al eliminar el producto.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    loadProducts();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoryId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
            Gestión de Catálogo (CRUD)
          </h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            Crea, edita y elimina productos con carga directa a AWS S3
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)] font-bold text-sm shadow-md transition-all shrink-0"
          >
            <span>+</span> Nuevo Producto
          </button>
        )}
      </div>

      {/* Form Drawer/Modal section */}
      {showForm && (
        <AdminProductForm
          productToEdit={editingProduct}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      {/* Search and Table */}
      {!showForm && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden space-y-4 p-5">
          {/* Search bar */}
          <div className="flex items-center justify-between gap-4">
            <input
              type="search"
              placeholder="Filtrar por nombre o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <span className="text-xs text-[var(--muted)] font-medium shrink-0">
              {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
            </span>
          </div>

          {loading ? (
            <LoadingState message="Cargando catálogo..." />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No hay productos disponibles"
              description={searchTerm ? "Ningún producto coincide con la búsqueda." : "Crea tu primer producto."}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)] text-xs uppercase tracking-wider bg-[var(--surface)]/50">
                    <th className="py-3 px-4">Producto</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4">Precio</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filtered.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[var(--surface)]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[var(--border)] bg-[var(--surface)] shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/48x48/1e293b/94a3b8?text=?";
                            }}
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-[var(--foreground)] text-sm truncate max-w-[220px]">
                              {prod.name}
                            </p>
                            <p className="text-xs text-[var(--muted)] truncate max-w-[220px]">
                              {prod.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                          {prod.categoryId}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[var(--foreground)]">
                        ${prod.price.toLocaleString("es-AR")}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                            prod.stock === 0
                              ? "bg-red-500/10 text-red-500"
                              : prod.stock < 5
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-green-500/10 text-green-500"
                          }`}
                        >
                          {prod.stock} un.
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(prod)}
                            className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface)] hover:text-[var(--primary)] transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            disabled={deletingId === prod.id}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-semibold hover:bg-red-500/20 transition-colors disabled:opacity-50"
                          >
                            {deletingId === prod.id ? "..." : "Eliminar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
