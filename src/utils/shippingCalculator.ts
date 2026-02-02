/**
 * Shipping Calculator Utility
 * Calculates shipping charges based on total weight and quantity of items
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
