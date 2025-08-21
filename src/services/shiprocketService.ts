type OrderItem = {
  name: string;
  sku?: string;
  id?: string;
  units?: number;
  quantity?: number;
  selling_price?: number;
  price?: number;
  discount?: number;
  tax?: number;
  hsn?: string;
};

type Order = {
  id: string;
  customerInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    zipCode?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  items: OrderItem[];
  paymentInfo?: {
    method?: string;
  };
  total?: number;
  shipping_charges?: number;
  giftwrap_charges?: number;
  transaction_charges?: number;
  total_discount?: number;
  length?: number;
  breadth?: number;
  height?: number;
  weight?: number;
  order_type?: string;
  comment?: string;
  reseller_name?: string;
  company_name?: string;
};

export const createShiprocketOrder = async (order: Order) => {
  const customer = order.customerInfo || {};
  
  const payload = {
    action: "createOrder",
    payload: {
      order_id: order.id,
      order_date: new Date().toISOString().slice(0, 19).replace("T", " "),
      pickup_location: "Primary",
      comment: order.comment || "",
      reseller_name: order.reseller_name || "ABC Reseller",
      company_name: order.company_name || "ABC Pvt Ltd",

      // Billing info
      billing_customer_name: customer.firstName || "NA",
      billing_last_name: customer.lastName || "NA",
      billing_address: customer.address || "NA",
      billing_address_2: "",
      billing_isd_code: "+91",
      billing_city: customer.city || "NA",
      billing_pincode: customer.zipCode || "000000",
      billing_state: customer.state || "NA",
      billing_country: customer.country || "India",
      billing_customer_email: customer.email || "test@example.com",
      billing_phone: customer.phone || "9999999999",
      billing_alternate_phone: "",

      // Shipping info (use billing as default)
      shipping_is_billing: true,
      shipping_customer_name: customer.firstName || "NA",
      shipping_last_name: customer.lastName || "NA",
      shipping_address: customer.address || "NA",
      shipping_address_2: "",
      shipping_city: customer.city || "NA",
      shipping_pincode: customer.zipCode || "000000",
      shipping_country: customer.country || "India",
      shipping_state: customer.state || "NA",
      shipping_email: customer.email || "test@example.com",
      shipping_phone: customer.phone || "9999999999",

      // Items
      order_items: order.items.map((i) => ({
        name: i.name,
        sku: i.sku || i.id || "NA",
        units: i.units || i.quantity || 1,
        selling_price: i.selling_price || i.price || 0,
        discount: i.discount || 0,
        tax: i.tax || 0,
        hsn: i.hsn || "NA",
      })),

      payment_method: order.paymentInfo?.method === "razorpay" ? "Prepaid" : "COD",
      shipping_charges: order.shipping_charges || 0,
      giftwrap_charges: order.giftwrap_charges || 0,
      transaction_charges: order.transaction_charges || 0,
      total_discount: order.total_discount || 0,
      sub_total: order.total || 0,
      length: order.length || 10,
      breadth: order.breadth || 10,
      height: order.height || 10,
      weight: order.weight || 0.5,
      ewaybill_no: "",
      customer_gstin: "",
      invoice_number: `INV${Date.now()}`,
      order_type: order.order_type || "ESSENTIALS",
    },
  };

  const res = await fetch(
    "https://astonishing-mousse-c693a6.netlify.app/.netlify/functions/shiprocket",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
};
