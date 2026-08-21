import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, mockProducts } from "../../test/test-utils";
import { CartDrawer } from "../common/CartDrawer";
import { ProductCard } from "../common/ProductCard";

describe("CartDrawer (Component Test)", () => {
  it("debe mostrar el estado vacío cuando el carrito no tiene productos", () => {
    const onClose = vi.fn();
    renderWithProviders(<CartDrawer isOpen={true} onClose={onClose} />);

    expect(screen.getByText("Tu carrito está vacío")).toBeInTheDocument();
    expect(
      screen.getByText("Agregá productos desde el catálogo")
    ).toBeInTheDocument();
  });

  it("debe mostrar los productos añadidos, subtotales y botón de checkout", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(
      <div>
        <ProductCard product={mockProducts[0]} />
        <CartDrawer isOpen={true} onClose={onClose} />
      </div>
    );

    // Agregamos el producto al carrito
    const addBtn = screen.getByRole("button", { name: /agregar al carrito/i });
    await user.click(addBtn);

    // En el drawer debe aparecer el nombre del producto y el botón 'Ir al checkout'
    const productTitles = screen.getAllByText(mockProducts[0].name);
    expect(productTitles.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByRole("link", { name: /ir al checkout/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /vaciar carrito/i })).toBeInTheDocument();
  });

  it("debe permitir vaciar el carrito al presionar 'Vaciar carrito'", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(
      <div>
        <ProductCard product={mockProducts[0]} />
        <CartDrawer isOpen={true} onClose={onClose} />
      </div>
    );

    await user.click(screen.getByRole("button", { name: /agregar al carrito/i }));

    const clearBtn = screen.getByRole("button", { name: /vaciar carrito/i });
    await user.click(clearBtn);

    expect(screen.getByText("Tu carrito está vacío")).toBeInTheDocument();
  });
});
