import type { JSX } from "react/jsx-runtime";
import { useProducts } from "./contexts/products/useProducts.ts";

function App(): JSX.Element {
  const { products, loading } = useProducts();
  
  if (loading) return <div>Cargando...</div>;

  return (
    <div className="flex flex-col items-center">
      <h1>Listado de Productos</h1>
      {products.map((product) => (
        <button
        key={product.id}
        className ="m-2"
        onClick={() => window.confirm("Agregar al carrito")}
      >
       {product.name} - ${product.price} Agregar al carrito
       </button>
      ))}
    </div>
  );
}

export default App;