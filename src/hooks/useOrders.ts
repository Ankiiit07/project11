import { useState, useEffect, useCallback } from "react";
import { useUser } from "../context/UserContext";
import { accountApi, type NewOrderRequest, type Order } from "../services/accountApi";

export type { Order } from "../services/accountApi";

interface UseOrdersReturn {
  /** The signed-in customer's own orders (empty for guests). */
  orders: Order[];
  loading: boolean;
  error: string | null;
  createOrder: (order: NewOrderRequest) => Promise<Order>;
  refreshOrders: () => void;
}

export const useOrders = (): UseOrdersReturn => {
  const { user, ready } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    if (!ready) return;
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setOrders(await accountApi.listOrders());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [ready, user]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const createOrder = useCallback(async (order: NewOrderRequest) => {
    setError(null);
    return accountApi.createOrder(order);
  }, []);

  return { orders, loading, error, createOrder, refreshOrders: loadOrders };
};
