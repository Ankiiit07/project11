import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Truck,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Home,
} from "lucide-react";
import { supabase } from "../supabaseClient";

// ✅ Type Definitions
interface PaymentInfo {
  method: "razorpay" | "cod" | string;
  paymentId?: string;
  status?: string;
  [key: string]: any;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface OrderDetails {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  estimatedDelivery: string;
  paymentInfo: PaymentInfo;
}

const ThankYouPage: React.FC = () => {
  console.log("✅ ThankYouPage rendered");

  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
  const loadOrder = async () => {
    try {
      let details = location.state?.orderDetails;
      const params = new URLSearchParams(location.search);
      const orderId = params.get("orderId");

      if (!details && orderId) {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        console.log("Supabase response:", data, error);

        if (error) throw error;

        const customerInfo = typeof data.customer_info === "string"
          ? JSON.parse(data.customer_info)
          : data.customer_info;

        const items = typeof data.items === "string" ? JSON.parse(data.items) : data.items;

        details = {
          orderNumber: data.id,
          customerName: `${customerInfo.firstName || ""} ${customerInfo.lastName || ""}`,
          customerEmail: customerInfo.email || "",
          customerPhone: customerInfo.phone || "",
          total: data.total || 0,
          items: items || [],
          shippingAddress: customerInfo.address || { street: "", city: "", state: "", zipCode: "" },
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          paymentInfo: data.payment_info || { method: "cod" },
        };
      }

      setOrderDetails(details);
      console.log("Final orderDetails state:", details);
    } catch (err) {
      console.error("Failed to load order:", err);
    }
  };

  loadOrder();
}, [location]);


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* … rest of your layout remains exactly the same … */}
      </div>
    </div>
  );
};

export default ThankYouPage;
