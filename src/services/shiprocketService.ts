// services/shiprocketService.ts
export interface ShiprocketOrderPayload {
  order_id: string;
  order_date: string;
  pickup_location: string;
  billing_customer_name: string;
  billing_last_name?: string;
  billing_address: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_customer_name?: string;
  shipping_last_name?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_pincode?: string;
  shipping_state?: string;
  shipping_country?: string;
  shipping_email?: string;
  shipping_phone?: string;
  order_items: {
    name: string;
    sku: string;
    units: number;
    selling_price: number;
  }[];
  payment_method: "Prepaid" | "COD";
  sub_total: number;
  length?: number;
  breadth?: number;
  height?: number;
  weight?: number;
}

export const createShiprocketOrder = async (order: any) => {
  // Prepare payload
  const payload: ShiprocketOrderPayload = {
    order_id: order.id,
    order_date: new Date().toISOString(),
    pickup_location: "Primary", // Must match Shiprocket panel
    billing_customer_name: order.customerInfo?.firstName || "",
    billing_last_name: order.customerInfo?.lastName || "",
    billing_address: order.customerInfo?.address || "",
    billing_city: order.customerInfo?.city || "",
    billing_pincode: order.customerInfo?.zipCode || "000000",
    billing_state: order.customerInfo?.state || "",
    billing_country: "India",
    billing_email: order.customerInfo?.email || "",
    billing_phone: order.customerInfo?.phone || "",
    // Shipping same as billing if not specified
    shipping_customer_name: order.shippingInfo?.firstName || order.customerInfo?.firstName,
    shipping_last_name: order.shippingInfo?.lastName || order.customerInfo?.lastName,
    shipping_address: order.shippingInfo?.address || order.customerInfo?.address,
    shipping_city: order.shippingInfo?.city || order.customerInfo?.city,
    shipping_pincode: order.shippingInfo?.zipCode || order.customerInfo?.zipCode || "000000",
    shipping_state: order.shippingInfo?.state || order.customerInfo?.state,
    shipping_country: order.shippingInfo?.country || "India",
    shipping_email: order.shippingInfo?.email || order.customerInfo?.email,
    shipping_phone: order.shippingInfo?.phone || order.customerInfo?.phone,
    order_items: order.items.map((item: any) => ({
      name: item.name,
      sku: item.id,
      units: item.quantity,
      selling_price: item.price,
    })),
    payment_method: order.paymentInfo?.method === "razorpay" ? "Prepaid" : "COD",
    sub_total: order.total,
    length: 10,
    breadth: 10,
    height: 10,
    weight: 0.5,
  };

  // Call your Netlify function
  const response = await fetch("/.netlify/functions/shiprocket", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "createOrder",  // ✅ required
      payload
    }),
  });

  const text = await response.text(); // Get raw response
  console.log("Shiprocket raw response:", text); // Logs exact API error

  if (!response.ok) {
    let errorMessage = `Shiprocket API error: ${response.status}`;
    try {
      const json = JSON.parse(text);
      errorMessage += ` - ${JSON.stringify(json)}`; // Include API error details
    } catch {}
    throw new Error(errorMessage);
  }

  return JSON.parse(text);
};
