import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, mockProducts } from "../../test/test-utils";
import { Header } from "../common/Header";
import { ProductCard } from "../common/ProductCard";

describe("E-commerce Integration Flow (User Journey Test)", () => {
  it("permite al usuario agregar productos, actualizar el badge del Header y ver el total en el Drawer", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <div>
        <Header />
        <main>
          <ProductCard product={mockProducts[0]} />
          <ProductCard product={mockProducts[1]} />
        </main>
      </div>
    );

    const openCartBtn = screen.getByRole("button", { name: /abrir carrito/i });

    // 1. Agregar primer producto (Mouse Gamer $35.000)
    const addButtons = screen.getAllByRole("button", { name: /agregar al carrito/i });
    await user.click(addButtons[0]);

    // 2. El badge dentro del botón del carrito en el Header debe contener '1'
    expect(within(openCartBtn).getByText("1")).toBeInTheDocument();

    // 3. Agregar segundo producto (Teclado Mecánico $75.000)
    await user.click(addButtons[1]);

    // 4. El badge dentro del botón del carrito en el Header debe actualizarse a '2'
    expect(within(openCartBtn).getByText("2")).toBeInTheDocument();

    // 5. Abrir el carrito haciendo click en el Header
    await user.click(openCartBtn);

    // 6. En el CartDrawer deben figurar ambos productos
    expect(screen.getAllByText(mockProducts[0].name).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(mockProducts[1].name).length).toBeGreaterThanOrEqual(1);

    // 7. El botón de checkout debe estar disponible y apuntar a /checkout
    const checkoutBtn = screen.getByRole("link", { name: /ir al checkout/i });
    expect(checkoutBtn).toBeInTheDocument();
    expect(checkoutBtn).toHaveAttribute("href", "/checkout");
  });
});
