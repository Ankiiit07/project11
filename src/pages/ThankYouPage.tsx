import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Truck,
  ArrowLeft,
  Home,
  Package,
} from "lucide-react";
import { supabase } from "../supabaseClient";
import { useOrders } from "../hooks/useOrders";
import { PaymentInfo } from "../hooks/useOrders"; 
import { useUser } from "../context/UserContext";

interface OrderDetails {
  orderNumber: string;
  total: number;
  subtotal?: number;
  shipping?: number;
  tax?: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  estimatedDelivery: string;
  paymentInfo: PaymentInfo;
}

const ThankYouPage: React.FC = () => {
  console.log("ThankYouPage rendered");
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const { getOrderById } = useOrders();
  const { isAuthenticated, loading, refreshUser } = useUser();

 useEffect(() => {
    refreshUser();
  }, []);
  

  useEffect(() => {
    const loadOrder = async () => {
      let details = location.state?.orderDetails;

      const params = new URLSearchParams(location.search);
      const orderId = params.get("orderId");

      if (!details && orderId) {
        try {
          const orderData = await getOrderById(orderId);

          if (orderData) {
            details = {
              orderNumber: orderData.id,
              total: orderData.total || 0,
              items: orderData.items || [],
              estimatedDelivery: new Date(
                Date.now() + 3 * 24 * 60 * 60 * 1000
              ).toISOString(),
              paymentInfo: orderData.payment_info ?? { 
                method: orderData.payment_info?.method || orderData.payment_info?.payment_method || "cod", 
                status: "pending", 
                orderId: orderData.id 
              },
            };
          }
        } catch (error) {
          console.error("Error fetching order:", error);
        }
      }

      setOrderDetails(details);
    };

    loadOrder();
  }, [location, getOrderById]);

  useEffect(() => {
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
          style={{ paddingTop: "20px", marginTop: "20px" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 icon-container"
          >
            <Truck className="h-12 w-12 text-green-600" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thank You for Your Order!
          </h1>
          <p className="text-xl text-gray-600">
  Your order has been confirmed and will be delivered soon.
          </p>
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
            {orderDetails.paymentInfo?.method === "cod" && (
              <p className="text-sm text-gray-600 mt-2">
                *
              </p>
            )}
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
              <CheckCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
              <span>Please keep the exact amount ready for cash payment upon delivery.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
              <span>Our delivery partner will contact you before delivery.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
              <span>You can track your order status in your account dashboard.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
              <span>For any queries, contact us at cafeatonce@gmail.com or call +91 7979837079</span>
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

          {!loading && isAuthenticated && (
            <button
              onClick={() => navigate("/account?tab=orders")}
              className="flex items-center justify-center px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              View My Orders
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ThankYouPage;
