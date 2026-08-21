import { createContext } from "react";
import type { Order } from "../../types/order.types";
import type { CreateOrderPayload } from "../../types/order.types";

export interface OrdersContextType {
  orders:           Order[];
  loading:          boolean;
  createOrder:      (payload: CreateOrderPayload) => Promise<string>;
  fetchUserOrders:  () => Promise<void>;
}

export const OrdersContext = createContext<OrdersContextType | null>(null);
