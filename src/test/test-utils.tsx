import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "../contexts/Theme/ThemeProvider";
import { CartProvider } from "../contexts/cart/CartContext";
import { AuthContext } from "../contexts/auth/AuthContext";
import type { AuthContextType } from "../types/auth.types";
import type { Product } from "../types/product.types";

/** Sample test products for testing components and hooks */
export const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Mouse Gamer RGB Pro",
    nameLower: "mouse gamer rgb pro",
    description: "Sensor óptico de alta precisión 16000 DPI",
    price: 35000,
    stock: 10,
    categoryId: "mouse",
    image: "https://example.com/mouse.jpg",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "prod-2",
    name: "Teclado Mecánico Switch Blue",
    nameLower: "teclado mecanico switch blue",
    description: "Teclas mecánicas con retroiluminación RGB",
    price: 75000,
    stock: 5,
    categoryId: "keyboard",
    image: "https://example.com/keyboard.jpg",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "prod-3",
    name: "Auriculares Inalámbricos 7.1",
    nameLower: "auriculares inalambricos 7.1",
    description: "Sonido envolvente 7.1 con cancelación de ruido",
    price: 60000,
    stock: 0, // out of stock product for edge testing
    categoryId: "headset",
    image: "https://example.com/headset.jpg",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
];

export const mockAuthValue: AuthContextType = {
  user: {
    uid: "test-user-123",
    email: "test@example.com",
    displayName: "Usuario Test",
    photoURL: null,
  },
  role: "customer",
  loading: false,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
};

interface WrapperProps {
  children: ReactNode;
}

export function AllTheProviders({ children }: WrapperProps) {
  return (
    <MemoryRouter>
      <ThemeProvider>
        <AuthContext.Provider value={mockAuthValue}>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthContext.Provider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
