import { describe, it, expect } from "vitest";
import { cartReducer, type CartAction } from "../cartReducer";
import type { CartItem } from "../../../types/cartItem.types";
import type { Product } from "../../../types/product.types";

const mockProductA: Product = {
  id: "prod-a",
  name: "Mouse Gamer",
  nameLower: "mouse gamer",
  description: "DPI alto",
  price: 20000,
  stock: 5,
  categoryId: "mouse",
  image: "https://example.com/mouse.jpg",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockProductB: Product = {
  id: "prod-b",
  name: "Teclado RGB",
  nameLower: "teclado rgb",
  description: "Switches red",
  price: 50000,
  stock: 3,
  categoryId: "keyboard",
  image: "https://example.com/keyboard.jpg",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("cartReducer (Unit Tests)", () => {
  it("debe retornar el estado inicial cuando el carrito está vacío", () => {
    const initialState: CartItem[] = [];
    const action = { type: "UNKNOWN" } as unknown as CartAction;
    const result = cartReducer(initialState, action);
    expect(result).toEqual([]);
  });

  describe("ADD_ITEM", () => {
    it("debe agregar un nuevo producto al carrito con cantidad 1", () => {
      const initialState: CartItem[] = [];
      const action: CartAction = {
        type: "ADD_ITEM",
        payload: { product: mockProductA },
      };
      const state = cartReducer(initialState, action);

      expect(state).toHaveLength(1);
      expect(state[0]).toEqual({
        product: mockProductA,
        quantity: 1,
      });
    });

    it("debe agregar un nuevo producto con una cantidad específica", () => {
      const initialState: CartItem[] = [];
      const action: CartAction = {
        type: "ADD_ITEM",
        payload: { product: mockProductA, quantity: 3 },
      };
      const state = cartReducer(initialState, action);

      expect(state[0].quantity).toBe(3);
    });

    it("debe incrementar la cantidad si el producto ya existe en el carrito", () => {
      const initialState: CartItem[] = [{ product: mockProductA, quantity: 2 }];
      const action: CartAction = {
        type: "ADD_ITEM",
        payload: { product: mockProductA, quantity: 1 },
      };
      const state = cartReducer(initialState, action);

      expect(state).toHaveLength(1);
      expect(state[0].quantity).toBe(3);
    });

    it("no debe permitir que la cantidad supere el stock máximo disponible", () => {
      const initialState: CartItem[] = [{ product: mockProductA, quantity: 4 }];
      // mockProductA stock is 5
      const action: CartAction = {
        type: "ADD_ITEM",
        payload: { product: mockProductA, quantity: 3 },
      };
      const state = cartReducer(initialState, action);

      expect(state[0].quantity).toBe(5); // capped at stock (5)
    });
  });

  describe("UPDATE_QTY", () => {
    it("debe actualizar la cantidad de un producto existente", () => {
      const initialState: CartItem[] = [
        { product: mockProductA, quantity: 2 },
        { product: mockProductB, quantity: 1 },
      ];
      const action: CartAction = {
        type: "UPDATE_QTY",
        payload: { id: "prod-a", quantity: 4 },
      };
      const state = cartReducer(initialState, action);

      expect(state.find((i) => i.product.id === "prod-a")?.quantity).toBe(4);
      expect(state.find((i) => i.product.id === "prod-b")?.quantity).toBe(1);
    });

    it("debe eliminar el producto si la nueva cantidad es menor a 1 (ej: 0)", () => {
      const initialState: CartItem[] = [
        { product: mockProductA, quantity: 2 },
        { product: mockProductB, quantity: 1 },
      ];
      const action: CartAction = {
        type: "UPDATE_QTY",
        payload: { id: "prod-a", quantity: 0 },
      };
      const state = cartReducer(initialState, action);

      expect(state).toHaveLength(1);
      expect(state.find((i) => i.product.id === "prod-a")).toBeUndefined();
      expect(state[0].product.id).toBe("prod-b");
    });
  });

  describe("REMOVE_ITEM", () => {
    it("debe eliminar el producto correspondiente por su ID", () => {
      const initialState: CartItem[] = [
        { product: mockProductA, quantity: 1 },
        { product: mockProductB, quantity: 2 },
      ];
      const action: CartAction = {
        type: "REMOVE_ITEM",
        payload: { id: "prod-a" },
      };
      const state = cartReducer(initialState, action);

      expect(state).toHaveLength(1);
      expect(state[0].product.id).toBe("prod-b");
    });
  });

  describe("CLEAR_CART", () => {
    it("debe vaciar todos los items del carrito", () => {
      const initialState: CartItem[] = [
        { product: mockProductA, quantity: 2 },
        { product: mockProductB, quantity: 3 },
      ];
      const action: CartAction = { type: "CLEAR_CART" };
      const state = cartReducer(initialState, action);

      expect(state).toEqual([]);
    });
  });
});
