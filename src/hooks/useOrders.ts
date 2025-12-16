// Create order
const createOrder = useCallback(
  async (
    cartItems: CartItem[],
    customerInfo: CustomerInfo,
    paymentInfo: PaymentInfo,
    subtotal: number,
    shipping: number,
    tax: number
  ): Promise<Order> => {
    try {
      setError(null);
      
      console.log("🔵 createOrder called with:", {
        cartItems: cartItems.length,
        customerInfo,
        paymentInfo,
        subtotal,
        shipping,
        tax
      });

      const total = subtotal + shipping + tax;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      console.log("🔵 Current user:", user?.id || "No user");

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Build shipping address from customer info
      const shippingAddress = {
        address: customerInfo.address,
        city: customerInfo.city,
        state: customerInfo.state,
        zipCode: customerInfo.zipCode,
        country: customerInfo.country,
      };

      // Build order data matching your Supabase schema exactly
      const orderData = {
        order_number: orderNumber,
        user_id: user?.id || null,
        customer_info: {
          email: customerInfo.email,
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          phone: customerInfo.phone,
        },
        shipping_address: shippingAddress,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          type: item.type || 'one-time'
        })),
        subtotal: Number(subtotal.toFixed(2)),
        shipping: Number(shipping.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        discount: 0, // Add discount column
        total: Number(total.toFixed(2)),
        payment_method: paymentInfo.method,
        payment_status: paymentInfo.status,
        payment_details: {
          paymentId: paymentInfo.paymentId || null,
          orderId: paymentInfo.orderId || null,
          signature: paymentInfo.signature || null,
        },
        payment_info: paymentInfo, // Also add to payment_info column
        order_status: "pending", // Use order_status not status
        tracking_number: null,
        estimated_delivery: null,
        actual_delivery: null,
        notes: null,
        cancellation_reason: null,
        refund_amount: null,
        refund_status: null,
      };

      console.log("🔵 Inserting order data:", JSON.stringify(orderData, null, 2));

      const { data, error } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();

      if (error) {
        console.error("❌ Supabase insertion error:", error);
        console.error("❌ Error message:", error.message);
        console.error("❌ Error details:", error.details);
        console.error("❌ Error hint:", error.hint);
        console.error("❌ Error code:", error.code);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error("Order creation failed - no data returned");
      }

      console.log("✅ Order created successfully:", data.id);
      
      await loadOrders();
      return data as Order;
    } catch (err) {
      console.error("❌ createOrder error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create order";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  },
  [loadOrders]
);
