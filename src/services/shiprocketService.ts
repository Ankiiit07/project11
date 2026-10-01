// Shiprocket from the browser: tracking only.
//
// Shipments are created on the server (netlify/functions/ship-orders.mjs runs every
// 10 minutes, and the admin page has a "Create shipment" button), so the Shiprocket
// login never reaches the browser and nobody outside can create shipments.

export interface ShiprocketOrderItem {
  id?: string;
  name: string;
  sku?: string;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  order_id: string;
  order_date: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  customer_state: string;
  customer_pincode: string;
  customer_country?: string;
  items: ShiprocketOrderItem[];
  payment_method: 'prepaid' | 'cod';
  sub_total: number;
  shipping_charges?: number;
  weight?: number;
}

export interface CreateOrderResponse {
  success: boolean;
  order_id?: string;
  awb_code?: string;
  courier_name?: string;
  estimated_delivery?: string;
  message?: string;
}

/**
 * Kept for the checkout page, which still calls it after payment. The shipment is
 * created on the server once the order is saved, so this only reports that.
 */
export async function createShiprocketOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
  return { success: false, order_id: orderData.order_id, message: 'The shipment is created by the store after the order is saved' };
}

export interface TrackingCheckpoint {
  date: string;
  activity: string;
  location: string;
}

export interface Tracking {
  awbCode: string;
  courierName: string;
  currentStatus: string;
  deliveredDate: string | null;
  estimatedDelivery: string | null;
  origin: string;
  destination: string;
  trackingUrl: string;
  checkpoints: TrackingCheckpoint[];
  message: string;
}

export interface OrderTracking {
  order?: {
    id: string;
    status: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
    awbCode: string | null;
    courierName: string | null;
  };
  tracking: Tracking | null;
}

async function get(params: Record<string, string>): Promise<OrderTracking> {
  const res = await fetch(`/.netlify/functions/shiprocket?${new URLSearchParams(params)}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) throw new Error(data.error || 'Could not load tracking. Please try again.');
  return { order: data.order, tracking: data.tracking ?? null };
}

/** Courier tracking for an AWB number. */
export const trackShipment = (awb: string) => get({ awb });

/** Order status, plus courier tracking once the order has an AWB. */
export const trackOrder = (orderId: string) => get({ orderId });

/** Shipping weight in kg from cart items (100 g each by default, 0.5 kg minimum). */
export function calculateShippingWeight(items: { weight?: number; quantity: number }[]): number {
  const totalGrams = items.reduce((sum, item) => sum + (item.weight || 100) * item.quantity, 0);
  return Math.max(0.5, totalGrams / 1000);
}

/** "YYYY-MM-DD HH:mm", the date format Shiprocket uses. */
export function formatOrderDate(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
