// Calls to our Netlify functions for accounts and orders. Sends the Firebase ID
// token when someone is signed in so the server knows who is asking.

import { auth } from '../lib/firebase';
import type { User } from '../store';

export interface OrderItem {
  id: string;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  type: 'single' | 'subscription';
}

export interface OrderCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  status: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  shipping: number;
  shippingMethod?: string;
  tax: number;
  total: number;
  payment: { method: string; paymentId: string; status: string };
  createdAt: string;
}

export interface NewOrderRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  shipping: number;
  shippingMethod?: string;
  tax: number;
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = await auth?.currentUser?.getIdToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/.netlify/functions/${path}`, { ...init, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data as T;
}

export const accountApi = {
  getProfile: () => call<{ profile: User }>('profile').then((d) => d.profile),

  updateProfile: (update: Partial<Pick<User, 'name' | 'phone' | 'address'>>) =>
    call<{ profile: User }>('profile', { method: 'PUT', body: JSON.stringify(update) }).then((d) => d.profile),

  createOrder: (order: NewOrderRequest) =>
    call<{ order: Order }>('orders', { method: 'POST', body: JSON.stringify(order) }).then((d) => d.order),

  listOrders: () => call<{ orders: Order[] }>('orders').then((d) => d.orders),

  getOrder: (id: string) => call<{ order: Order }>(`orders?id=${encodeURIComponent(id)}`).then((d) => d.order),
};
