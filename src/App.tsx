import { type JSX } from "react/jsx-runtime";
import { ProductList } from "./components/common/ProductList";
import { useTheme } from "./contexts/Theme/useTheme";
import { Button } from "./components/ui/Button";

export default function App(): JSX.Element {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={toggleTheme}>
        {theme === "dark" ? "☀️Claro" : "🌑Oscuro"}
      </button>
      <h1>Bienvenido al E-commerce</h1>
      <h2>Componentes reutilizables</h2>
      <hr style={{ margin: "1rem 0" }} />

      <ProductList />

    </div>
  );
}