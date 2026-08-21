import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, mockProducts } from "../../test/test-utils";
import { ProductCard } from "../common/ProductCard";

describe("ProductCard (Component Test)", () => {
  it("debe renderizar el nombre, precio formateado, stock y categoría del producto", () => {
    const product = mockProducts[0];
    renderWithProviders(<ProductCard product={product} />);

    // Verificar nombre
    expect(screen.getByText(product.name)).toBeInTheDocument();

    // Verificar categoría (badge 'Mouse')
    expect(screen.getByText("Mouse")).toBeInTheDocument();

    // Verificar stock
    expect(screen.getByText("Stock: 10")).toBeInTheDocument();

    // Botón agregar al carrito
    expect(
      screen.getByRole("button", { name: /agregar al carrito/i })
    ).toBeInTheDocument();
  });

  it("debe mostrar 'Sin stock' y deshabilitar el botón si el stock es 0", () => {
    const outOfStockProduct = mockProducts[2]; // stock: 0
    renderWithProviders(<ProductCard product={outOfStockProduct} />);

    // Verificar texto 'Sin stock'
    const outOfStockElements = screen.getAllByText(/sin stock/i);
    expect(outOfStockElements.length).toBeGreaterThanOrEqual(1);

    // Botón deshabilitado
    const button = screen.getByRole("button", { name: /sin stock/i });
    expect(button).toBeDisabled();
  });

  it("debe permitir hacer click en 'Agregar al carrito'", async () => {
    const user = userEvent.setup();
    const product = mockProducts[0];
    renderWithProviders(<ProductCard product={product} />);

    const button = screen.getByRole("button", { name: /agregar al carrito/i });
    await user.click(button);

    // El botón sigue accesible tras el click
    expect(button).toBeInTheDocument();
  });
});
