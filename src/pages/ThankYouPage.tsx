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
  paymentInfo: data.payment_info,
}


const ThankYouPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
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

  if (!error && data) {
    const customerInfo = typeof data.customer_info === "string"
      ? JSON.parse(data.customer_info)
      : data.customer_info;
    console.log("Customer Info:", customerInfo);

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
    console.log("Order Details prepared:", details);
  }
}

  setOrderDetails(details);
      console.log("Final orderDetails state:", details);
};

    loadOrder();
  }, [location]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Order Not Found
          </h1>
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
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 success-header"
          style={{
            // Add top padding to prevent icon cut off on mobile
            paddingTop: "20px",
            // Ensure proper spacing from header
            marginTop: "20px",
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 icon-container"
            style={{
              // Ensure icon container doesn't get cut off
              position: "relative",
              zIndex: 1,
            }}
          >
            <Truck className="h-12 w-12 text-green-600" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thank You for Your Order!
          </h1>
          <p className="text-xl text-gray-600">
            Your COD order has been confirmed and will be delivered soon.
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Order Number</p>
                    <p className="text-gray-600">{orderDetails.orderNumber}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-amber-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Estimated Delivery
                    </p>
                    <p className="text-gray-600">
                      {orderDetails?.estimatedDelivery
                        ? new Date(
                            orderDetails.estimatedDelivery
                          ).toLocaleDateString("en-IN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Will be updated soon"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
  <Truck className="w-5 h-5 text-orange-500 mr-3" />
  <div>
    <p className="font-medium text-gray-900">Payment Method</p>
    <p className="text-gray-600">
  {orderDetails?.payment_info?.method === "razorpay"
    ? "Razorpay (Paid Online)"
    : "Cash on Delivery (COD)"}
</p>
  </div>
</div>

              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Customer Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Name</p>
                    <p className="text-gray-600">{orderDetails.customerName}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-amber-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">
                      {orderDetails.customerEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">
                      {orderDetails.customerPhone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-red-500 mr-3 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Delivery Address
                    </p>
                    <p className="text-gray-600">
                      {orderDetails.shippingAddress?.street || "N/A"},{" "}
                      {orderDetails.shippingAddress?.city || ""},{" "}
                      {orderDetails.shippingAddress?.state || ""}{" "}
                      {orderDetails.shippingAddress?.zipCode
                        ? `- ${orderDetails.shippingAddress.zipCode}`
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Items</h2>

          <div className="space-y-4">
            {orderDetails.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="font-medium text-gray-900">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-primary">
                ₹{orderDetails.total.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              *Including ₹25 COD charges
            </p>
          </div>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-amber-50 rounded-2xl p-8 mb-8"
        >
          <h3 className="text-xl font-bold text-amber-900 mb-4">
            Important Information
          </h3>
          <ul className="space-y-3 text-amber-800">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
              <span>
                Please keep the exact amount ready for cash payment upon
                delivery.
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
              <span>
                Our delivery partner will contact you before delivery.
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
              <span>
                You can track your order status in your account dashboard.
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
              <span>
                For any queries, contact us at cafeatonce@gmail.com or call +91
                7979837079
              </span>
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/account?tab=orders")}
            className="flex items-center justify-center px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            View My Orders
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ThankYouPage;
