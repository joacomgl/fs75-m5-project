import {
  createContext,
  useReducer,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import type { CartItem } from "../../types/cartItem.types";
import type { Product }  from "../../types/product.types";
import { cartReducer }   from "./cartReducer";

// ─── Context type ─────────────────────────────────────────────────────────────

interface CartContextType {
  items:          CartItem[];
  totalItems:     number;        // sum of all quantities
  totalPrice:     number;        // sum of price * quantity
  addToCart:      (product: Product, quantity?: number) => void;
  removeFromCart: (id: string)  => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart:      () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const CartContext = createContext<CartContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, dispatch] = useReducer(cartReducer, []);

  // ── Derived state ──────────────────────────────────────────────────────────
  const { totalItems, totalPrice } = useMemo(() => ({
    totalItems: items.reduce((acc, item) => acc + item.quantity, 0),
    totalPrice: items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
  }), [items]);

  // ── Actions (wrap dispatch so consumers never touch it directly) ────────────
  const addToCart      = (product: Product, quantity = 1) =>
    dispatch({ type: "ADD_ITEM", payload: { product, quantity } });

  const removeFromCart = (id: string) =>
    dispatch({ type: "REMOVE_ITEM", payload: { id } });

  const updateQuantity = (id: string, quantity: number) =>
    dispatch({ type: "UPDATE_QTY", payload: { id, quantity } });

  const clearCart      = () =>
    dispatch({ type: "CLEAR_CART" });

  // ── Value ──────────────────────────────────────────────────────────────────
  const value = useMemo<CartContextType>(
    () => ({ items, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart }),
    [items, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
};
