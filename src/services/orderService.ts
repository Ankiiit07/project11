// src/services/orderService.ts
import { supabase } from "../supabaseClient";
import { CartItem } from "../context/CartContextOptimized";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  type: "single" | "subscription";
}

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
  orderId?: string;
  signature?: string;
  status: "pending" | "completed" | "failed";
}

export interface Order {
  id: string;
  order_number: string;
  customer_info: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  payment_info: PaymentInfo;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  created_at: string;
  updated_at: string;
}

class OrderService {
  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Order[];
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();
    if (error) throw error;
    return data;
  }

  async createOrder(
    cartItems: CartItem[],
    customerInfo: CustomerInfo,
    paymentInfo: PaymentInfo,
    subtotal: number,
    shipping: number,
    tax: number,
    notes?: Record<string, any>
  ): Promise<Order> {
    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const total = subtotal + shipping + tax;

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          order_number: orderNumber,
          customer_info: customerInfo,
          items: cartItems,
          subtotal,
          shipping,
          tax,
          total,
          payment_info: paymentInfo,
          status: "confirmed",
          notes,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Order;
  }

  async updateOrderStatus(
    orderId: string,
    status: Order["status"],
    trackingNumber?: string
  ) {
    const { data, error } = await supabase
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
        ...(trackingNumber ? { tracking_number: trackingNumber } : {}),
      })
      .eq("id", orderId)
      .select()
      .single();
    if (error) throw error;
    return data as Order;
  }

  async updatePaymentInfo(orderId: string, paymentInfo: Partial<PaymentInfo>) {
    const { data, error } = await supabase
      .from("orders")
      .update({
        payment_info: paymentInfo,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()
      .single();
    if (error) throw error;
    return data as Order;
  }

  async deleteOrder(orderId: string): Promise<boolean> {
    const { error } = await supabase.from("orders").delete().eq("id", orderId);
    if (error) throw error;
    return true;
  }
}

export const orderService = new OrderService();
export default orderService;
