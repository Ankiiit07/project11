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
  const customer = order.customer_info || {};
  const payment = order.payment_info || {};

  // Calculate sub_total (sum of all items)
  const sub_total = order.items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  const payload: ShiprocketOrderPayload = {
    order_id: order.id,
    order_date: new Date().toISOString(),
    pickup_location: "Home", // Must match Shiprocket panel
    billing_customer_name: customer.firstName || "",
    billing_last_name: customer.lastName || "",
    billing_address: customer.address || "",
    billing_city: customer.city || "",
    billing_pincode: customer.zipCode || "000000",
    billing_state: customer.state || "",
    billing_country: "India",
    billing_email: customer.email || "",
    billing_phone: customer.phone || "",
    shipping_customer_name: customer.firstName,
    shipping_last_name: customer.lastName,
    shipping_address: customer.address,
    shipping_city: customer.city,
    shipping_pincode: customer.zipCode || "000000",
    shipping_state: customer.state,
    shipping_country: "India",
    shipping_email: customer.email,
    shipping_phone: customer.phone,
    order_items: order.items.map((item: any) => ({
      name: item.name,
      sku: item.id,
      units: item.quantity,
      selling_price: item.price,
    })),
    payment_method: payment.method === "razorpay" ? "Prepaid" : "COD",
    sub_total,
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
      action: "createOrder",
      payload,
    }),
  });

  const text = await response.text();
  console.log("Shiprocket raw response:", text);

  if (!response.ok) {
    let errorMessage = `Shiprocket API error: ${response.status}`;
    try {
      const json = JSON.parse(text);
      errorMessage += ` - ${JSON.stringify(json)}`;
    } catch {}
    throw new Error(errorMessage);
  }

  return JSON.parse(text);
};
