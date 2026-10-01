// Google Analytics 4 events for the shopping funnel. The tag itself loads in
// index.html; if it's blocked (ad blockers, no network) every call here is a no-op.
// Reports: GA4 → Reports → Monetization → E-commerce purchases, and
// Explore → Funnel exploration (view_item → add_to_cart → begin_checkout → purchase).

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export interface AnalyticsItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  category?: string;
}

const CURRENCY = 'INR';

const toGaItems = (items: AnalyticsItem[]) =>
  items.map((i) => ({
    item_id: i.id,
    item_name: i.name,
    price: i.price,
    quantity: i.quantity ?? 1,
    ...(i.category ? { item_category: i.category } : {}),
  }));

const valueOf = (items: AnalyticsItem[]) =>
  Math.round(items.reduce((sum, i) => sum + i.price * (i.quantity ?? 1), 0) * 100) / 100;

export function track(event: string, params: Record<string, unknown> = {}) {
  try {
    window.gtag?.('event', event, params);
  } catch {
    // analytics must never break the shop
  }
}

export const analytics = {
  viewItem: (item: AnalyticsItem) =>
    track('view_item', { currency: CURRENCY, value: item.price, items: toGaItems([item]) }),

  addToCart: (item: AnalyticsItem) =>
    track('add_to_cart', { currency: CURRENCY, value: valueOf([item]), items: toGaItems([item]) }),

  viewCart: (items: AnalyticsItem[]) =>
    track('view_cart', { currency: CURRENCY, value: valueOf(items), items: toGaItems(items) }),

  beginCheckout: (items: AnalyticsItem[]) =>
    track('begin_checkout', { currency: CURRENCY, value: valueOf(items), items: toGaItems(items) }),

  /** Sent once per order, even if the thank-you page is reloaded. */
  purchase: (orderId: string, total: number, items: AnalyticsItem[]) => {
    const key = `ga-purchase-${orderId}`;
    try {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(key, '1');
    } catch {
      // storage blocked: GA also de-duplicates by transaction_id
    }
    track('purchase', { transaction_id: orderId, currency: CURRENCY, value: total, items: toGaItems(items) });
  },

  /** How a visitor reached out: WhatsApp, the chat helper or the contact form. */
  contact: (method: 'whatsapp' | 'chatbot' | 'contact_form') => track('generate_lead', { method }),

  newsletterSignup: () => track('sign_up', { method: 'newsletter' }),
};
