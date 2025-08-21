import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useOrders } from "../hooks/useOrders";
import { Order } from "../services/orderService";
import { createShiprocketOrder } from "../services/shiprocketService";

const OrderDetailsPage: React.FC = () => {
  const handleShipOrder = async () => {
    if (!order) return;

    try {
      const response = await fetch("/.netlify/functions/shiprocket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: order.id,
          order_date: new Date().toISOString(),
          pickup_location: "Primary",
          billing_customer_name: order.customerInfo?.firstName || "",
          billing_last_name: order.customerInfo?.lastName || "",
          billing_address: order.customerInfo?.address || "",
          billing_city: order.customerInfo?.city || "",
          billing_pincode: order.customerInfo?.pincode || "000000",
          billing_state: order.customerInfo?.state || "",
          billing_country: "India",
          billing_email: order.customerInfo?.email || "",
          billing_phone: order.customerInfo?.phone || "",
          order_items: order.items.map((item) => ({
            name: item.name,
            sku: item.id,
            units: item.quantity,
            selling_price: item.price,
          })),
          payment_method:
            order.paymentInfo?.method === "razorpay" ? "Prepaid" : "COD",
          sub_total: order.total,
          length: 10,
          breadth: 10,
          height: 10,
          weight: 0.5,
        }),
      }).then((res) => res.json());

      console.log("🚚 Shiprocket Order Created:", response);
      alert("Shiprocket order created successfully!");
    } catch (error) {
      console.error("Shiprocket error:", error);
      alert("Failed to create Shiprocket order.");
    }
  };

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, updateOrderStatus, deleteOrder } = useOrders();

  const order = orders.find((o) => o.id === id);

  const [status, setStatus] = useState<Order["status"]>(
    order?.status || "pending"
  );

  if (!order) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-4">Order not found.</p>
          <Link to="/orders" className="text-primary hover:underline">
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const handleStatusChange = async () => {
  try {
    // 1️⃣ Update local order status
    updateOrderStatus(order.id, status);

    // 2️⃣ If status is shipped → send to Shiprocket
    if (status === "shipped") {
      try {
        const shiprocketResponse = await createShiprocketOrder(order);
        console.log("🚚 Shiprocket order created:", shiprocketResponse);
        alert("Shiprocket order created successfully!");
      } catch (err) {
        console.error("❌ Shiprocket error:", err);
        alert("Failed to create Shiprocket order.");
      }
    }

    // 3️⃣ Navigate back to orders
    navigate("/orders");
  } catch (error) {
    console.error("Error updating order:", error);
    alert("Failed to update order.");
  }
};



  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/orders"
            className="inline-flex items-center text-primary hover:text-primary-dark"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
          </Link>
          <button
            onClick={() => {
              if (window.confirm("Delete this order?")) {
                deleteOrder(order.id);
                navigate("/orders");
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete Order
          </button>
        </div>

        {/* Order Details Card */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Order #{order.id}</h2>

          {/* Customer Info */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Customer</h3>
            <p>
              {order.customerInfo?.firstName} {order.customerInfo?.lastName}
            </p>
            <p>{order.customerInfo?.email}</p>
            <p>{order.customerInfo?.phone}</p>
            <p>{order.customerInfo?.address}</p>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Items</h3>
            <ul className="list-disc list-inside text-gray-700">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} × {item.quantity} — ₹{item.price}
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Info */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Payment</h3>
            <p>
              Method:{" "}
              <span className="font-medium">
                {order.paymentInfo?.method
                  ? order.paymentInfo.method.toUpperCase()
                  : "N/A"}
              </span>
            </p>
            <p>Status: {order.paymentInfo?.status || "unknown"}</p>
            <p>Total: ₹{order.total.toFixed(2)}</p>
          </div>

          {/* Order Status Update */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Update Status</h3>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Order["status"])}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              onClick={handleStatusChange}
              className="ml-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
