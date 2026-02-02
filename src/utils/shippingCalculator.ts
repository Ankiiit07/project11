/**
 * Shipping Calculator Utility
 * Calculates shipping charges based on total weight, quantity, and location
 */

export interface ShippingRates {
  baseRate: number;        // Base shipping charge
  perKgRate: number;       // Rate per kg after base weight
  baseWeight: number;      // Weight included in base rate (in grams)
  freeShippingThreshold: number; // Order value for free shipping
  perItemRate: number;     // Additional charge per item
}

// Default shipping rates (can be configured)
export const DEFAULT_SHIPPING_RATES: ShippingRates = {
  baseRate: 50,            // ₹50 base shipping
  perKgRate: 30,           // ₹30 per additional kg
  baseWeight: 500,         // First 500g included in base rate
  freeShippingThreshold: 1000, // Free shipping above ₹1000
  perItemRate: 10,         // ₹10 per additional item after first
};

// Shipping method types
export type ShippingMethod = 'standard' | 'express';

export interface ShippingOption {
  id: ShippingMethod;
  name: string;
  description: string;
  estimatedDays: { min: number; max: number };
  charge: number;
  available: boolean;
}

// Zone-based delivery estimates (days)
export interface DeliveryZone {
  name: string;
  pincodeRanges: { start: number; end: number }[];
  standardDays: { min: number; max: number };
  expressAvailable: boolean;
  expressDays: { min: number; max: number };
  expressCharge: number;
}

// Mumbai pincode ranges (400001 - 400104 and 401101 - 401210 for Navi Mumbai)
const MUMBAI_PINCODES: DeliveryZone = {
  name: 'Mumbai',
  pincodeRanges: [
    { start: 400001, end: 400104 },  // Mumbai city
    { start: 401101, end: 401210 },  // Navi Mumbai
    { start: 410201, end: 410221 },  // Thane/extended Mumbai
  ],
  standardDays: { min: 2, max: 3 },
  expressAvailable: true,
  expressDays: { min: 1, max: 1 },
  expressCharge: 99,
};

// Major metro cities
const METRO_CITIES: DeliveryZone = {
  name: 'Metro Cities',
  pincodeRanges: [
    { start: 110001, end: 110096 },  // Delhi
    { start: 560001, end: 560109 },  // Bangalore
    { start: 600001, end: 600130 },  // Chennai
    { start: 700001, end: 700162 },  // Kolkata
    { start: 500001, end: 500100 },  // Hyderabad
    { start: 411001, end: 411062 },  // Pune
    { start: 380001, end: 380063 },  // Ahmedabad
  ],
  standardDays: { min: 3, max: 5 },
  expressAvailable: false,
  expressDays: { min: 2, max: 2 },
  expressCharge: 149,
};

// Rest of India
const REST_OF_INDIA: DeliveryZone = {
  name: 'Rest of India',
  pincodeRanges: [
    { start: 100000, end: 999999 },  // All other pincodes
  ],
  standardDays: { min: 5, max: 7 },
  expressAvailable: false,
  expressDays: { min: 3, max: 4 },
  expressCharge: 199,
};

/**
 * Get delivery zone based on pincode
 */
export function getDeliveryZone(pincode: string): DeliveryZone {
  const pin = parseInt(pincode, 10);
  
  if (isNaN(pin)) {
    return REST_OF_INDIA;
  }
  
  // Check Mumbai first (express available)
  for (const range of MUMBAI_PINCODES.pincodeRanges) {
    if (pin >= range.start && pin <= range.end) {
      return MUMBAI_PINCODES;
    }
  }
  
  // Check metro cities
  for (const range of METRO_CITIES.pincodeRanges) {
    if (pin >= range.start && pin <= range.end) {
      return METRO_CITIES;
    }
  }
  
  return REST_OF_INDIA;
}

/**
 * Check if pincode is valid Indian pincode
 */
export function isValidPincode(pincode: string): boolean {
  const pin = parseInt(pincode, 10);
  return !isNaN(pin) && pincode.length === 6 && pin >= 100000 && pin <= 999999;
}

/**
 * Get estimated delivery date
 */
export function getEstimatedDeliveryDate(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

/**
 * Format date for display
 */
export function formatDeliveryDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-IN', options);
}

/**
 * Get shipping options based on pincode and cart total
 */
export function getShippingOptions(
  pincode: string,
  subtotal: number,
  baseShippingCharge: number
): ShippingOption[] {
  const zone = getDeliveryZone(pincode);
  const isFreeShipping = subtotal >= DEFAULT_SHIPPING_RATES.freeShippingThreshold;
  
  const options: ShippingOption[] = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: `Delivery in ${zone.standardDays.min}-${zone.standardDays.max} business days`,
      estimatedDays: zone.standardDays,
      charge: isFreeShipping ? 0 : baseShippingCharge,
      available: true,
    },
  ];
  
  // Add express option only for Mumbai
  if (zone.expressAvailable) {
    options.push({
      id: 'express',
      name: 'Express Delivery',
      description: `Next day delivery (Mumbai only)`,
      estimatedDays: zone.expressDays,
      charge: zone.expressCharge,
      available: true,
    });
  }
  
  return options;
}

/**
 * Get delivery estimate text
 */
export function getDeliveryEstimate(pincode: string, method: ShippingMethod = 'standard'): string {
  if (!isValidPincode(pincode)) {
    return 'Enter pincode for delivery estimate';
  }
  
  const zone = getDeliveryZone(pincode);
  const days = method === 'express' && zone.expressAvailable 
    ? zone.expressDays 
    : zone.standardDays;
  
  const minDate = getEstimatedDeliveryDate(days.min);
  const maxDate = getEstimatedDeliveryDate(days.max);
  
  if (days.min === days.max) {
    return `Delivery by ${formatDeliveryDate(minDate)}`;
  }
  
  return `Delivery between ${formatDeliveryDate(minDate)} - ${formatDeliveryDate(maxDate)}`;
}

export interface ShippingItem {
  weight?: number;         // Weight in grams
  quantity: number;
  price: number;
}

export interface ShippingResult {
  shippingCharge: number;
  totalWeight: number;     // in grams
  itemCount: number;
  isFreeShipping: boolean;
  breakdown: {
    baseCharge: number;
    weightCharge: number;
    itemCharge: number;
    discount: number;
  };
}

/**
 * Calculate shipping charges based on weight and quantity
 */
export function calculateShipping(
  items: ShippingItem[],
  subtotal: number,
  rates: ShippingRates = DEFAULT_SHIPPING_RATES
): ShippingResult {
  // Calculate total weight and item count
  const totalWeight = items.reduce((sum, item) => {
    const itemWeight = item.weight || 100; // Default 100g if not specified
    return sum + (itemWeight * item.quantity);
  }, 0);
  
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Check for free shipping
  if (subtotal >= rates.freeShippingThreshold) {
    return {
      shippingCharge: 0,
      totalWeight,
      itemCount: totalItemCount,
      isFreeShipping: true,
      breakdown: {
        baseCharge: 0,
        weightCharge: 0,
        itemCharge: 0,
        discount: rates.baseRate, // Show what they saved
      },
    };
  }
  
  // Calculate base charge
  let baseCharge = rates.baseRate;
  
  // Calculate weight-based charge
  let weightCharge = 0;
  const excessWeight = totalWeight - rates.baseWeight;
  if (excessWeight > 0) {
    // Convert to kg and calculate
    const excessKg = excessWeight / 1000;
    weightCharge = Math.ceil(excessKg) * rates.perKgRate;
  }
  
  // Calculate item-based charge (for quantities > 1)
  let itemCharge = 0;
  if (totalItemCount > 1) {
    itemCharge = (totalItemCount - 1) * rates.perItemRate;
  }
  
  const totalShipping = baseCharge + weightCharge + itemCharge;
  
  return {
    shippingCharge: totalShipping,
    totalWeight,
    itemCount: totalItemCount,
    isFreeShipping: false,
    breakdown: {
      baseCharge,
      weightCharge,
      itemCharge,
      discount: 0,
    },
  };
}

/**
 * Get shipping estimate message
 */
export function getShippingMessage(result: ShippingResult, subtotal: number): string {
  if (result.isFreeShipping) {
    return 'Free Shipping! 🎉';
  }
  
  const amountForFree = DEFAULT_SHIPPING_RATES.freeShippingThreshold - subtotal;
  if (amountForFree > 0) {
    return `Add ₹${amountForFree.toFixed(0)} more for free shipping!`;
  }
  
  return `Shipping: ₹${result.shippingCharge}`;
}

/**
 * Format weight for display
 */
export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(1)} kg`;
  }
  return `${grams} g`;
}
