import { useContext, useEffect, type JSX } from 'react';
import { Button } from './components/ui/Button';
import { CartContext, useCart } from './contexts/cart/CartContext';
import { useProducts } from './contexts/ProductsContext';
import { getProducts } from './services/products.service';

function App(): JSX.Element {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', isDark);

   //* Estados desde ProductsContext:
  const { products } = useProducts();

  //* Estados y Acciones desde CartContext:
  const {items, addToCart, removeFromCart, clearCart} = useCart();

  useEffect(() => {
    getProducts().then((data) => {
      console.log("Productos obtenidos:", data);
    });
  }, []);

  return (
    <div className="p-8">
      <h1>Carrito de Compras</h1>
      <hr className="my-4" />
      <h2>Productos</h2>
      <div className="flex flex-wrap gap-4">
        {products.map((product) => (
          <button key={product.id} onClick={() => addToCart(product)}>
            {product.name} - ${product.price}
          </button>
        ))}
      </div>
      <hr className="my-4" />
      <h2>Items en el carrito</h2>
      {items.length === 0 ? (
        <p>No hay productos en el carrito</p>
      ) : (
        <div>
          <ul>
          {items.map((item) => (
            <li key={item.product.id}>
              <strong>{item.product.name}</strong>
              {" - $"}
              {item.product.price}
              {" | Cantidad: "}
              {item.quantity}
              <Button onClick={() => removeFromCart(item.product.id)}
                className="ml-4"
              >
                Eliminar
              </Button>
            </li>
          ))}
          </ul>
          <div><Button onClick={clearCart}>Vaciar Carrito</Button></div>
        </div>
      )}
    </div>
  );
}

export default App;

//* UI (botones, inputs, divs, etc)
//* Componentes: Navbar, Sidebar, Footer, ProductCard, etc.
//* Layout: Navbar + Sidebar + Footer, ProductList, ProductDetail, etc.
//* Page: Ruta -> /products -> ProductPage