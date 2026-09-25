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

export interface AdminOrder extends Order {
  awbCode?: string;
  statusHistory?: { status: Order['status']; at: string; by: string }[];
}

export interface AdminOrdersResponse {
  orders: AdminOrder[];
  total: number;
  page: number;
  pageSize: number;
  summary: {
    counts: Record<Order['status'], number>;
    totalOrders: number;
    revenue: number;
    todayOrders: number;
    todayRevenue: number;
  };
}

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
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
    throw new ApiError(data.error || `Request failed (${res.status})`, res.status);
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

  adminListOrders: (params: { status?: string; q?: string; page?: number }) => {
    const qs = new URLSearchParams();
    if (params.status) qs.set('status', params.status);
    if (params.q) qs.set('q', params.q);
    if (params.page && params.page > 1) qs.set('page', String(params.page));
    return call<AdminOrdersResponse>(`admin-orders${qs.toString() ? `?${qs}` : ''}`);
  },

  adminUpdateOrder: (id: string, update: { status: Order['status']; awbCode?: string }) =>
    call<{ order: AdminOrder }>('admin-orders', { method: 'POST', body: JSON.stringify({ id, ...update }) }).then(
      (d) => d.order
    ),

  getOrder: (id: string) => call<{ order: Order }>(`orders?id=${encodeURIComponent(id)}`).then((d) => d.order),
};
