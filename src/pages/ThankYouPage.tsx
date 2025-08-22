import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Truck, Clock, MapPin, Phone, Mail, ArrowLeft, Home } from "lucide-react";
import { supabase } from "../supabaseClient";

interface OrderDetails {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  estimatedDelivery: string;
  paymentInfo: {
    method: "razorpay" | "cod";
    paymentId?: string;
    orderId: string;
    signature?: string;
    status: "pending" | "completed" | "failed";
  };
}

const ThankYouPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      const params = new URLSearchParams(location.search);
      const orderId = params.get("orderId");

      if (!orderId) return;

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (!error && data) {
        setOrderDetails({
          orderNumber: data.id,
          customerName: `${data.customer_info?.firstName || ""} ${data.customer_info?.lastName || ""}`,
          customerEmail: data.customer_info?.email,
          customerPhone: data.customer_info?.phone,
          total: data.total,
          items: data.items.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: {
            street: data.customer_info?.address || "",
            city: data.customer_info?.city || "",
            state: data.customer_info?.state || "",
            zipCode: data.customer_info?.zipCode || "",
          },
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          paymentInfo: data.payment_info,
        });
      }
    };

    loadOrder();
  }, [location]);

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8">Please check your order details.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8 thank-you-page">
      {/* Render order details similar to your previous component */}
      <h1 className="text-3xl font-bold text-center mb-6">Thank You for Your Order!</h1>
      <p className="text-center mb-4">Order #{orderDetails.orderNumber}</p>
      <p className="text-center mb-8">Total: ₹{orderDetails.total.toFixed(2)}</p>
      {/* Items, Customer Info, Shipping Info, Payment Info */}
      {/* ...rest of the UI */}
    </div>
  );
};

export default ThankYouPage;
