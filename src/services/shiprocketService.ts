// src/services/shiprocketService.ts
// Frontend-safe version (no Shiprocket secrets here!)

/**
 * Create a shipping order (calls your backend)
 */
export async function createShiprocketOrder(order: any) {
  const res = await fetch("/.netlify/functions/shiprocket", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("🚨 Shiprocket Order Error:", data);
    throw new Error(data.error || "Failed to create Shiprocket order");
  }

  return data;
}

/**
 * Track shipment (calls your backend)
 */
export async function trackShipment(awb: string) {
  const res = await fetch(`/api/shiprocket/track/${awb}`);

  const data = await res.json();

  if (!res.ok) {
    console.error("🚨 Shiprocket Tracking Error:", data);
    throw new Error(data.error || "Failed to track shipment");
  }

  return data;
}
