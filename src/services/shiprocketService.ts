/**
 * Shiprocket Integration Service
 * Handles all Shiprocket API interactions for order creation and tracking
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
  pickup_location?: string;
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
  length?: number;
  breadth?: number;
  height?: number;
}

export interface CreateOrderResponse {
  success: boolean;
  order_id?: string;
  shiprocket_order_id?: number;
  shipment_id?: number;
  awb_code?: string;
  courier_name?: string;
  courier_id?: number;
  label_url?: string;
  estimated_delivery?: string;
  message?: string;
  error?: string;
}

export interface TrackingCheckpoint {
  date: string;
  activity: string;
  location?: string;
  status?: string;
}

export interface TrackingResponse {
  success: boolean;
  order_id?: string;
  awb_code?: string;
  courier_name?: string;
  current_status?: string;
  current_status_description?: string;
  shipment_status?: number;
  delivered_date?: string;
  estimated_delivery?: string;
  pickup_date?: string;
  origin?: string;
  destination?: string;
  checkpoints: TrackingCheckpoint[];
  tracking_url?: string;
  message?: string;
  error?: string;
}

export interface CourierOption {
  id: number;
  name: string;
  rate: number;
  estimated_days: string;
  cod_available: boolean;
  min_weight: number;
  rating: number;
}

export interface CourierServiceabilityResponse {
  success: boolean;
  serviceable: boolean;
  couriers: CourierOption[];
  error?: string;
}

/**
 * Create a new order with automatic AWB assignment
 */
export async function createShiprocketOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
  const apiUrl = getApiUrl();
  
  try {
    const response = await fetch(`${apiUrl}/api/shiprocket/order/create-with-awb`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...orderData,
        customer_country: orderData.customer_country || 'India',
        pickup_location: orderData.pickup_location || 'Primary',
        shipping_charges: orderData.shipping_charges || 0,
        weight: orderData.weight || 0.5,
        length: orderData.length || 10,
        breadth: orderData.breadth || 10,
        height: orderData.height || 10,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        order_id: orderData.order_id,
        error: data.error || 'Failed to create order in Shiprocket',
        message: data.message || 'Order creation failed',
      };
    }

    return data;
  } catch (error) {
    console.error('Shiprocket order creation error:', error);
    return {
      success: false,
      order_id: orderData.order_id,
      error: error instanceof Error ? error.message : 'Network error',
      message: 'Failed to connect to shipping service',
    };
  }
}

/**
 * Track a shipment by AWB code
 */
export async function trackShipment(awbCode: string): Promise<TrackingResponse> {
  const apiUrl = getApiUrl();
  
  try {
    const response = await fetch(`${apiUrl}/api/shiprocket/tracking/${awbCode}`);
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('Tracking error:', error);
    return {
      success: false,
      awb_code: awbCode,
      checkpoints: [],
      error: error instanceof Error ? error.message : 'Network error',
      message: 'Failed to fetch tracking information',
    };
  }
}

/**
 * Check courier serviceability for a pincode
 */
export async function checkCourierServiceability(
  pickupPincode: string,
  deliveryPincode: string,
  weight: number = 0.5,
  cod: boolean = false
): Promise<CourierServiceabilityResponse> {
  const apiUrl = getApiUrl();
  
  try {
    const params = new URLSearchParams({
      pickup_pincode: pickupPincode,
      delivery_pincode: deliveryPincode,
      weight: weight.toString(),
      cod: cod ? '1' : '0',
    });
    
    const response = await fetch(`${apiUrl}/api/shiprocket/couriers?${params}`);
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('Courier serviceability error:', error);
    return {
      success: false,
      serviceable: false,
      couriers: [],
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Get pickup locations
 */
export async function getPickupLocations(): Promise<{ success: boolean; locations: any[]; error?: string }> {
  const apiUrl = getApiUrl();
  
  try {
    const response = await fetch(`${apiUrl}/api/shiprocket/pickup-locations`);
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('Pickup locations error:', error);
    return {
      success: false,
      locations: [],
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Calculate shipping weight from cart items
 */
export function calculateShippingWeight(items: { weight?: number; quantity: number }[]): number {
  const totalGrams = items.reduce((sum, item) => {
    const itemWeight = item.weight || 100; // Default 100g per item
    return sum + (itemWeight * item.quantity);
  }, 0);
  
  // Convert to kg (minimum 0.5kg)
  return Math.max(0.5, totalGrams / 1000);
}

/**
 * Format date for Shiprocket API (YYYY-MM-DD HH:mm)
 */
export function formatOrderDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
