import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../../contexts/cart/CartContext";
import { mockProducts } from "../../test/test-utils";
import type { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe("useCart (Hook with Provider Test)", () => {
  it("debe lanzar un error si se usa fuera de CartProvider", () => {
    // Suppress expected console.error during throw test
    expect(() => renderHook(() => useCart())).toThrow(
      "useCart debe usarse dentro de CartProvider"
    );
  });

  it("debe iniciar con items vacíos y totales en cero", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it("debe agregar productos y calcular totalItems y totalPrice automáticamente", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Agregamos prod-1 ($35,000)
    act(() => {
      result.current.addToCart(mockProducts[0], 2);
    });

    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBe(70000);

    // Agregamos prod-2 ($75,000)
    act(() => {
      result.current.addToCart(mockProducts[1], 1);
    });

    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalPrice).toBe(145000);
  });

  it("debe permitir modificar la cantidad de un item y recalcular los totales", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProducts[0], 1);
    });

    act(() => {
      result.current.updateQuantity(mockProducts[0].id, 3);
    });

    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalPrice).toBe(105000);
  });

  it("debe vaciar el carrito cuando se ejecuta clearCart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProducts[0], 2);
      result.current.clearCart();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });
});
