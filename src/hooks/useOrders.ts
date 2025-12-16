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
  method: "online" | "cod"; // ✅ Changed from "razorpay" | "cod"
  paymentId?: string;
  orderId?: string;
  signature?: string;
  status: "pending" | "completed" | "failed";
}
export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  items: CartItem[];
  customer_info: CustomerInfo;
  shipping_address: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  payment_method: string;
  payment_status: string;
  payment_details: any;
  payment_info: PaymentInfo;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  order_status: string;
  tracking_number?: string;
  estimated_delivery?: string;
  actual_delivery?: string;
  notes?: string;
  cancellation_reason?: string;
  refund_amount?: number;
  refund_status?: string;
  created_at: string;
  updated_at?: string;
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
    status: string,
    trackingNumber?: string
  ) => Promise<Order | null>;
  updatePaymentInfo: (
    orderId: string,
    paymentInfo: Partial<PaymentInfo>
  ) => Promise<Order | null>;
  getOrderById: (orderId: string) => Promise<Order | null>;
  getOrdersByCustomer: (email: string) => Promise<Order[]>;
  getRecentOrders: (limit?: number) => Promise<Order[]>;
  getOrdersByStatus: (status: string) => Promise<Order[]>;
  deleteOrder: (orderId: string) => Promise<boolean>;
  refreshOrders: () => void;
}

export const useOrders = (): UseOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all orders
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
      
      console.log("🔵 createOrder called with:", {
        cartItems: cartItems.length,
        customerInfo,
        paymentInfo,
        subtotal,
        shipping,
        tax
      });

      const total = subtotal + shipping + tax;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      console.log("🔵 Current user:", user?.id || "No user");

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Build shipping address from customer info
      const shippingAddress = {
        address: customerInfo.address,
        city: customerInfo.city,
        state: customerInfo.state,
        zipCode: customerInfo.zipCode,
        country: customerInfo.country,
      };

      // ✅ Map payment method to match database constraint
      const paymentMethod = paymentInfo.method === 'razorpay' ? 'online' : paymentInfo.method;

      // Build order data matching your Supabase schema exactly
      const orderData = {
        order_number: orderNumber,
        user_id: user?.id || null,
        customer_info: {
          email: customerInfo.email,
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          phone: customerInfo.phone,
        },
        shipping_address: shippingAddress,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          type: item.type || 'one-time'
        })),
        subtotal: Number(subtotal.toFixed(2)),
        shipping: Number(shipping.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        discount: 0, // Must be >= 0
        total: Number(total.toFixed(2)),
        payment_method: paymentMethod, // ✅ Must be 'online' or 'cod'
        payment_status: paymentInfo.status, // ✅ 'pending', 'completed', 'failed', 'refunded'
        payment_details: {
          paymentId: paymentInfo.paymentId || null,
          orderId: paymentInfo.orderId || null,
          signature: paymentInfo.signature || null,
        },
        payment_info: paymentInfo,
        order_status: "pending", // ✅ Must be one of the allowed values
        tracking_number: null,
        estimated_delivery: null,
        actual_delivery: null,
        notes: null,
        cancellation_reason: null,
        refund_amount: 0, // ✅ Must be >= 0, using 0 instead of null
        refund_status: 'none', // ✅ Must be 'none', 'requested', 'processing', or 'completed'
      };

      console.log("🔵 Inserting order data:", JSON.stringify(orderData, null, 2));

      const { data, error } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();

      if (error) {
        console.error("❌ Supabase insertion error:", error);
        console.error("❌ Error message:", error.message);
        console.error("❌ Error details:", error.details);
        console.error("❌ Error hint:", error.hint);
        console.error("❌ Error code:", error.code);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error("Order creation failed - no data returned");
      }

      console.log("✅ Order created successfully:", data.id);
      
      await loadOrders();
      return data as Order;
    } catch (err) {
      console.error("❌ createOrder error:", err);
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
      status: string,
      trackingNumber?: string
    ): Promise<Order | null> => {
      try {
        const updateData: any = { order_status: status };
        if (trackingNumber) {
          updateData.tracking_number = trackingNumber;
        }

        const { data, error } = await supabase
          .from("orders")
          .update(updateData)
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
  const getOrdersByStatus = useCallback(async (status: string) => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_status", status)
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    return data as Order[];
  }, []);

  // Delete order
  const deleteOrder = useCallback(async (orderId: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);
        
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
