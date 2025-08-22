import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Truck, CheckCircle, Clock, Mail, Phone, MapPin, Home, ArrowLeft } from "lucide-react";

interface OrderDetails {
  id: string;
  customer_info: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  payment_info: {
    method: string;
    status: string;
  };
  status: string;
  created_at: string;
}

const ThankYouPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      const params = new URLSearchParams(location.search);
      const orderId = params.get("orderId");
      const email = params.get("email"); // guest email passed from checkout

      if (!orderId && !email) return;

      let query = supabase.from("orders").select("*");

      if (orderId) {
        query = query.eq("id", orderId).single();
      } else if (email) {
        query = query.eq("customer_info->>email", email).order("created_at", { ascending: false }).limit(1).single();
      }

      const { data, error } = await query;

      if (error) {
        console.error("Supabase fetch error:", error);
      } else {
        setOrder(data as OrderDetails);
      }

      setLoading(false);
    };

    fetchOrder();
  }, [location]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Order not found.</p>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
        <div className="text-center mb-6">
          <CheckCircle className="mx-auto text-green-600 w-12 h-12 mb-2" />
          <h1 className="text-2xl font-bold">Thank you, {order.customer_info.name}!</h1>
          <p>Your order has been confirmed.</p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2">Order #{order.id}</h2>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Payment:</strong> {order.payment_info.method.toUpperCase()} ({order.payment_info.status})
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Items</h3>
          <ul>
            {order.items.map((item, i) => (
              <li key={i}>
                {item.name} × {item.quantity} — ₹{(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
          <p className="mt-2 font-bold">Total: ₹{order.total.toFixed(2)}</p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Shipping</h3>
          <p>{order.customer_info.address}, {order.customer_info.city}, {order.customer_info.state} {order.customer_info.zipCode}</p>
          <p>{order.customer_info.country}</p>
          <p>Email: {order.customer_info.email}</p>
          {order.customer_info.phone && <p>Phone: {order.customer_info.phone}</p>}
        </div>

        <div className="flex justify-center gap-4">
          <button onClick={() => navigate("/")} className="px-4 py-2 bg-primary text-white rounded">Continue Shopping</button>
          <button onClick={() => navigate(`/account?tab=orders&email=${order.customer_info.email}`)} className="px-4 py-2 border rounded">View My Orders</button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
