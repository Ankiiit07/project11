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
    pickup_location: "Home", // Must match Shiprocket panel
    billing_customer_name: order.customer_info?.firstName || "",
billing_last_name: order.customer_info?.lastName || "",
billing_address: order.customer_info?.address || "",
billing_city: order.customer_info?.city || "",
billing_pincode: order.customer_info?.zipCode || "000000",
billing_state: order.customer_info?.state || "",
billing_country: "India",
billing_email: order.customer_info?.email || "",
billing_phone: order.customer_info?.phone || "",
    shipping_is_billing: true,
    shipping_customer_name: order.customer_info?.firstName,
shipping_last_name: order.customer_info?.lastName,
shipping_address: order.customer_info?.address,
shipping_city: order.customer_info?.city,
shipping_pincode: order.customer_info?.zipCode,
shipping_state: order.customer_info?.state,
shipping_country: order.customer_info?.country || "India",
shipping_email: order.customer_info?.email,
shipping_phone: order.customer_info?.phone,
    order_items: order.items.map((item: any) => ({
      name: item.name,
      sku: item.id,
      units: item.quantity,
      selling_price: item.price,
    })),
    payment_method: order.payment_info?.method === "razorpay" ? "Prepaid" : "COD",
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
