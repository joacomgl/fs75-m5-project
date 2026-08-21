import { useProducts } from "../../contexts/products/useProducts";
import { ProductCard } from "../common/ProductCard";
import { EmptyState } from "../states/EmptyState";
import { LoadingState } from "../states/LoadingState";

export function ProductList() {
  const { products, loading } = useProducts();

  if (loading) {
    return <LoadingState message="Cargando productos ..."></LoadingState>;
  }

  if (products.length === 0) {
    return (
    <EmptyState
    title="Aun no hay productos..."
    description="Carga el primer producto para comenzar..."
    />
    );
  }

  return (
    <div>
        <h2>Lista de nuevos Productos:</h2>
        <hr />
        <ul>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </ul>
    </div>
  );  
}