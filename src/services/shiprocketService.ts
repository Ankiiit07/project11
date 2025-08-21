export const createShiprocketOrder = async (order: any) => {
  const payload = {
    action: "createOrder",
    payload: {
      order_id: order.order_id || order.id,
      order_date: new Date().toISOString().slice(0, 19).replace("T", " "),
      pickup_location: order.pickup_location || "Primary",
      comment: order.comment || "",
      reseller_name: "ABC Reseller",
      company_name: "ABC Pvt Ltd",
      billing_customer_name: order.billing_customer_name,
      billing_last_name: order.billing_last_name,
      billing_address: order.billing_address,
      billing_address_2: order.billing_address_2 || "",
      billing_isd_code: order.billing_isd_code || "+91",
      billing_city: order.billing_city,
      billing_pincode: order.billing_pincode,
      billing_state: order.billing_state,
      billing_country: order.billing_country || "India",
      billing_customer_email: order.billing_email || order.billing_customer_email,
      billing_phone: order.billing_phone,
      billing_alternate_phone: order.billing_alternate_phone || "",
      shipping_is_billing: true,
      shipping_customer_name: order.shipping_customer_name || order.billing_customer_name,
      shipping_last_name: order.shipping_last_name || order.billing_last_name,
      shipping_address: order.shipping_address || order.billing_address,
      shipping_address_2: order.shipping_address_2 || "",
      shipping_city: order.shipping_city || order.billing_city,
      shipping_pincode: order.shipping_pincode || order.billing_pincode,
      shipping_country: order.shipping_country || order.billing_country || "India",
      shipping_state: order.shipping_state || order.billing_state,
      shipping_email: order.shipping_email || order.billing_email,
      shipping_phone: order.shipping_phone || order.billing_phone,
      order_items: order.order_items || order.items.map((i: any) => ({
        name: i.name,
        sku: i.sku || i.id,
        units: i.units || i.quantity,
        selling_price: i.selling_price || i.price,
        discount: i.discount || 0,
        tax: i.tax || 0,
        hsn: i.hsn || "NA",
      })),
      payment_method: order.payment_method || (order.paymentInfo?.method === "razorpay" ? "Prepaid" : "COD"),
      shipping_charges: order.shipping_charges || 0,
      giftwrap_charges: order.giftwrap_charges || 0,
      transaction_charges: order.transaction_charges || 0,
      total_discount: order.total_discount || 0,
      sub_total: order.sub_total || order.total,
      length: order.length || 10,
      breadth: order.breadth || 10,
      height: order.height || 10,
      weight: order.weight || 0.5,
      ewaybill_no: order.ewaybill_no || "",
      customer_gstin: order.customer_gstin || "",
      invoice_number: order.invoice_number || `INV${Date.now()}`,
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
