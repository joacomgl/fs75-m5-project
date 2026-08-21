import { useContext } from "react";
import { OrdersContext } from "./OrdersContext";

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders debe usarse dentro de OrdersProvider");
  return ctx;
}
