/**
 * Email Notification Service
 * Handles email notifications for order and shipment updates
 */

// Get the backend API URL
const getApiUrl = () => {
  // In production, use the preview URL for API calls
  if (typeof window !== 'undefined' && window.location.hostname.includes('preview.emergentagent.com')) {
    return `https://${window.location.hostname}`;
  }
  // Development fallback
  return import.meta.env.VITE_SHIPROCKET_API_URL || 'http://localhost:8001';
};

export interface EmailNotificationRequest {
  recipient_email: string;
  customer_name: string;
  order_id: string;
  awb_code?: string;
  status: string;
  status_description: string;
  courier_name?: string;
  estimated_delivery?: string;
  tracking_url?: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  email_id?: string;
  error?: string;
}

export interface OrderConfirmationRequest {
  // Razorpay proof of payment — the server verifies these before sending anything
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: { name: string; quantity: number; price: number; type?: 'single' | 'subscription' }[];
  subtotal: number;
  discount?: number;
  shipping: number;
  tax: number;
  awbCode?: string;
  courierName?: string;
  estimatedDelivery?: string;
}

export interface OrderConfirmationResponse {
  success: boolean;
  customer?: { sent: boolean; id?: string; duplicate?: boolean; error?: string } | null;
  admin?: { sent: boolean; id?: string; duplicate?: boolean; error?: string } | null;
  error?: string;
}

/**
 * Send the order confirmation email (customer + store-owner alert).
 * Handled by the Netlify function `order-confirmation`, which verifies the
 * Razorpay payment server-side and sends at most one email per payment.
 */
export async function sendOrderConfirmationEmail(
  data: OrderConfirmationRequest
): Promise<OrderConfirmationResponse> {
  try {
    const response = await fetch('/.netlify/functions/order-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return (await response.json()) as OrderConfirmationResponse;
  } catch (error) {
    console.error('Order confirmation email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Send shipment status update email
 */
export async function sendShipmentStatusEmail(data: EmailNotificationRequest): Promise<EmailResponse> {
  const apiUrl = getApiUrl();
  
  try {
    const response = await fetch(`${apiUrl}/api/notifications/shipment-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Shipment status email error:', error);
    return {
      success: false,
      message: 'Failed to send shipment status email',
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Status descriptions for email notifications
 */
export const STATUS_DESCRIPTIONS: Record<string, string> = {
  'PENDING': 'Order Pending',
  'AWB_ASSIGNED': 'Shipping Label Created',
  'LABEL_GENERATED': 'Shipping Label Generated',
  'PICKUP_SCHEDULED': 'Pickup Scheduled',
  'PICKUP_QUEUED': 'Pickup Queued',
  'MANIFESTED': 'Ready for Pickup',
  'SHIPPED': 'Shipped - In Transit',
  'PICKED': 'Picked Up',
  'IN_TRANSIT': 'In Transit',
  'REACHED_DEST_HUB': 'Reached Destination Hub',
  'OUT_FOR_DELIVERY': 'Out for Delivery',
  'DELIVERED': 'Delivered',
  'CANCELLED': 'Order Cancelled',
  'RTO_INITIATED': 'Return Initiated',
  'RTO_DELIVERED': 'Returned to Seller',
  'UNDELIVERED': 'Delivery Attempt Failed',
};

/**
 * Get status description for a status code
 */
export function getStatusDescription(status: string): string {
  return STATUS_DESCRIPTIONS[status.toUpperCase()] || status;
}
