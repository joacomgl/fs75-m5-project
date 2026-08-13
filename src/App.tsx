import type { JSX } from 'react';
import { Button } from './components/ui/Button';

function App(): JSX.Element {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', isDark);

  return (
    <div style={{padding: '2rem'}}>
      <h1>HENRY-commerce</h1>

      <Button onClick={() => document.documentElement.classList.toggle('dark')}>
        Modo: Claro☀️ / Oscuro🌙
      </Button>
    </div>
  );
}

export default App;

//* UI (botones, inputs, divs, etc)
//* Componentes: Navbar, Sidebar, Footer, ProductCard, etc.
//* Layout: Navbar + Sidebar + Footer, ProductList, ProductDetail, etc.
//* Page: Ruta -> /products -> ProductPage