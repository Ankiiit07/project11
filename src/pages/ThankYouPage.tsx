import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient"; // Your Supabase client
import { ShoppingBag, CheckCircle } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  items: OrderItem[];
  status: string;
  customerEmail: string;
}

const ThankYouPage: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const guestEmail = searchParams.get("email");

  const [order, setOrder] = useState<Order | null>(location.state?.orderDetails || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!order && guestEmail) {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from<Order>("orders")
            .select("*")
            .eq("customerEmail", guestEmail)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          if (error) throw error;
          setOrder(data);
        } catch (err) {
          console.error("Failed to fetch order:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrder();
  }, [guestEmail, order]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream p-6 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
        <p className="text-gray-600 mb-4">
          We couldn't find your order. Please check your email for the confirmation.
        </p>
        <Link
          to="/products"
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thank you for your order!
          </h1>
          <p className="text-gray-600 mb-6">
            We've received your order #{order.orderNumber}. A confirmation email has been sent to {order.customerEmail}.
          </p>
        </div>

        <div className="mb-6 border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-gray-800">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-gray-900 border-t pt-3 mt-3">
            <span>Total</span>
            <span>₹{order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/products"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
