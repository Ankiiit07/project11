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

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(data: EmailNotificationRequest): Promise<EmailResponse> {
  const apiUrl = getApiUrl();
  
  try {
    const response = await fetch(`${apiUrl}/api/notifications/order-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Order confirmation email error:', error);
    return {
      success: false,
      message: 'Failed to send order confirmation email',
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
