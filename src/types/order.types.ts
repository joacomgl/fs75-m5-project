import type { CartItem } from "./cartItem.types";

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateOrderPayload = Omit<Order, "id" | "createdAt" | "updatedAt">;
