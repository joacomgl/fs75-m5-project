import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  type PropsWithChildren,
} from "react";
import { OrdersContext } from "./OrdersContext";
import {
  createOrder as createOrderService,
  getOrdersByUser,
} from "../../services/orders.service";
import { useAuth } from "../auth/useAuth";
import type { Order, CreateOrderPayload } from "../../types/order.types";

export function OrdersProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Load orders whenever the authenticated user changes
  const fetchUserOrders = useCallback(async () => {
    if (!user) { setOrders([]); return; }
    setLoading(true);
    try {
      const data = await getOrdersByUser(user.uid);
      setOrders(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchUserOrders(); }, [fetchUserOrders]);

  // Create a new order and refresh the list
  const createOrder = useCallback(async (payload: CreateOrderPayload): Promise<string> => {
    const orderId = await createOrderService(payload);
    await fetchUserOrders(); // refresh list after creation
    return orderId;
  }, [fetchUserOrders]);

  const value = useMemo(
    () => ({ orders, loading, createOrder, fetchUserOrders }),
    [orders, loading, createOrder, fetchUserOrders]
  );

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
}
