import type { CartItem } from "../../types/cartItem.types";
import type { Product } from "../../types/product.types";

// ─── Action types ─────────────────────────────────────────────────────────────

export type CartAction =
  | { type: "ADD_ITEM";    payload: { product: Product; quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QTY";  payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

// ─── Pure reducer ─────────────────────────────────────────────────────────────

/**
 * cartReducer — pure function, no side effects, no mutations.
 * Takes the current cart state and an action, returns a new state.
 */
export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {

    case "ADD_ITEM": {
      const { product, quantity = 1 } = action.payload;
      const existing = state.find((item) => item.product.id === product.id);

      if (existing) {
        // Increment quantity, but do not exceed stock
        return state.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      // Add new item
      return [...state, { product, quantity: Math.min(quantity, product.stock) }];
    }

    case "REMOVE_ITEM":
      return state.filter((item) => item.product.id !== action.payload.id);

    case "UPDATE_QTY": {
      const { id, quantity } = action.payload;
      if (quantity < 1) return state.filter((item) => item.product.id !== id);
      return state.map((item) =>
        item.product.id === id ? { ...item, quantity } : item
      );
    }

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
}
