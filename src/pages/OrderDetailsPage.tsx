import React, { useState, useEffect } from "react";
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, updateOrderStatus, deleteOrder } = useOrders();

  const order = orders.find((o) => o.id === id);
  const [status, setStatus] = useState<Order["status"]>(
    order?.status || "pending"
  );
  const [shiprocketData, setShiprocketData] = useState<any>(null);

  useEffect(() => {
    if (order && (order as any).shiprocket_data) {
      setShiprocketData((order as any).shiprocket_data);
    }
  }, [order]);

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

  
  // Map fields to UI-friendly variables
const customer = order.customer_info || {};
const shipping = order.shipping_address || {};

  const handleStatusChange = async () => {
    try {
      // 1️⃣ Update local order status
      await updateOrderStatus(order.id, status);

      // 2️⃣ If status is shipped → send to Shiprocket
      if (status === "shipped") {
        try {
          const payloadResponse = await createShiprocketOrder(order);
          setShiprocketData(payloadResponse);

          // 3️⃣ Save Shiprocket response in Supabase
          await updateOrderStatus(order.id, status); // already updated status
          await fetch("/.netlify/functions/updateOrderShiprocket", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: order.id,
              shiprocketData: payloadResponse,
            }),
          });

          alert("Shiprocket order created successfully!");
        } catch (err) {
          console.error("❌ Shiprocket error:", err);
          alert("Failed to create Shiprocket order.");
        }
      }

      // 4️⃣ Navigate back to orders
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
<div className="mb-4">
  <h4 className="font-semibold text-gray-800 mb-2">Customer Info</h4>
  <p>
    <span className="font-medium">Name:</span> {customer.firstName}{" "}
    {customer.lastName}
  </p>
  <p>
    <span className="font-medium">Email:</span> {customer.email}
  </p>
  <p>
    <span className="font-medium">Phone:</span> {customer.phone}
  </p>
</div>

{/* Shipping Info */}
<div className="mb-4">
  <h4 className="font-semibold text-gray-800 mb-2">Shipping Address</h4>
  <p>{shipping?.address || 'No address provided'}</p>
  <p>
    {shipping?.city || ''}{shipping?.city && shipping?.state ? ', ' : ''}{shipping?.state || ''}{(shipping?.city || shipping?.state) && shipping?.zipCode ? ' - ' : ''}{shipping?.zipCode || ''}
  </p>
  <p>{shipping?.country || ''}</p>
</div>

          {/* Order Items */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Items</h4>
            <ul className="list-disc list-inside text-gray-700">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} × {item.quantity} — ₹{item.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>

         {/* Payment Info */}
<div className="mb-4">
  <h4 className="font-semibold text-gray-800 mb-2">Payment</h4>
  <p>
    <span className="font-medium">Method:</span>{" "}
    {order.payment_method?.toUpperCase() || "N/A"}
  </p>
  <p>
    <span className="font-medium">Status:</span>{" "}
    {order.payment_status || "N/A"}
  </p>
  <p>
    <span className="font-medium">Total:</span> ₹{order.total.toFixed(2)}
  </p>
</div>

          {/* Shiprocket Payload Preview */}
          {shiprocketData && (
            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Mapped Shiprocket Payload</h4>
              <pre className="text-xs text-gray-700 overflow-x-auto">
                {JSON.stringify(shiprocketData, null, 2)}
              </pre>
            </div>
          )}

          {/* Order Status Update */}
          <div className="mt-6">
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
