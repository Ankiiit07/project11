import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { CartItem } from "../context/CartContext";

export interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  method: "razorpay" | "cod";
  paymentId?: string;
  orderId: string;
  signature?: string;
  status: "pending" | "completed" | "failed";
}

export interface Order {
  id: string;
  user_id?: string;
  items: CartItem[];
  customer_info: CustomerInfo;
  payment_info: PaymentInfo;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "placed" | "shipped" | "delivered" | "cancelled";
  tracking_number?: string;
  created_at: string;
}


interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  createOrder: (
    cartItems: CartItem[],
    customerInfo: CustomerInfo,
    paymentInfo: PaymentInfo,
    subtotal: number,
    shipping: number,
    tax: number
  ) => Promise<Order>;
  updateOrderStatus: (
    orderId: string,
    status: Order["status"],
    trackingNumber?: string
  ) => Promise<Order | null>;
  updatePaymentInfo: (
    orderId: string,
    paymentInfo: Partial<PaymentInfo>
  ) => Promise<Order | null>;
  getOrderById: (orderId: string) => Promise<Order | null>;
  getOrdersByCustomer: (email: string) => Promise<Order[]>;
  getRecentOrders: (limit?: number) => Promise<Order[]>;
  getOrdersByStatus: (status: Order["status"]) => Promise<Order[]>;
  deleteOrder: (orderId: string) => Promise<boolean>;
  refreshOrders: () => void;
}

export const useOrders = (): UseOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all orders (for admin or debugging)
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setOrders(data as Order[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Create order
  const createOrder = useCallback(
    async (
      cartItems: CartItem[],
      customerInfo: CustomerInfo,
      paymentInfo: PaymentInfo,
      subtotal: number,
      shipping: number,
      tax: number
    ): Promise<Order> => {
      try {
        setError(null);
        const total = subtotal + shipping + tax;

        const { data, error } = await supabase
          .from("orders")
          .insert([
            {
              items: cartItems,
              customer_info: customerInfo,
              payment_info: paymentInfo,
              subtotal,
              shipping,
              tax,
              total,
              status: "placed",
            },
          ])
          .select()
          .single();

        if (error) throw error;
        if (!data) throw new Error("Order creation failed");

        // Refresh local state
        await loadOrders();

        return data as Order;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create order";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [loadOrders]
  );

  // Update order status
  const updateOrderStatus = useCallback(
    async (
      orderId: string,
      status: Order["status"],
      trackingNumber?: string
    ): Promise<Order | null> => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .update({ status, tracking_number: trackingNumber })
          .eq("id", orderId)
          .select()
          .single();
        if (error) throw error;
        await loadOrders();
        return data as Order;
      } catch (err) {
        setError("Failed to update order status");
        return null;
      }
    },
    [loadOrders]
  );

  // Update payment info
  const updatePaymentInfo = useCallback(
    async (
      orderId: string,
      paymentInfo: Partial<PaymentInfo>
    ): Promise<Order | null> => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .update({ payment_info: paymentInfo })
          .eq("id", orderId)
          .select()
          .single();
        if (error) throw error;
        await loadOrders();
        return data as Order;
      } catch (err) {
        setError("Failed to update payment info");
        return null;
      }
    },
    [loadOrders]
  );

  // Get single order
  const getOrderById = useCallback(async (orderId: string) => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();
    if (error) throw error;
    return data as Order;
  }, []);

  // Get customer orders
  const getOrdersByCustomer = useCallback(async (email: string) => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_info->>email", email)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Order[];
  }, []);

  // Get recent orders
  const getRecentOrders = useCallback(async (limit: number = 10) => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data as Order[];
  }, []);

  // Get by status
  const getOrdersByStatus = useCallback(async (status: Order["status"]) => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Order[];
  }, []);

  // Delete order
  const deleteOrder = useCallback(async (orderId: string) => {
    try {
      const { error } = await supabase.from("orders").delete().eq("id", orderId);
      if (error) throw error;
      await loadOrders();
      return true;
    } catch {
      setError("Failed to delete order");
      return false;
    }
  }, [loadOrders]);

  // Refresh all
  const refreshOrders = useCallback(() => {
    loadOrders();
  }, [loadOrders]);

  return {
    orders,
    loading,
    error,
    createOrder,
    updateOrderStatus,
    updatePaymentInfo,
    getOrderById,
    getOrdersByCustomer,
    getRecentOrders,
    getOrdersByStatus,
    deleteOrder,
    refreshOrders,
  };
};
