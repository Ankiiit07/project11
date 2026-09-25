import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Truck } from "lucide-react";
import { useUser } from "../context/UserContext";
import { accountApi, type Order } from "../services/accountApi";

const inr = (n: number) => `₹${(n || 0).toFixed(2)}`;

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, ready } = useUser();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready || !id) return;
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    accountApi
      .getOrder(id)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id, ready, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" aria-label="Loading" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg text-foreground/70 mb-4">
            {user ? "Order not found." : "Please sign in to see this order."}
          </p>
          <Link to={user ? "/orders" : "/account"} className="text-primary hover:underline">
            {user ? "← Back to Orders" : "Sign in"}
          </Link>
        </div>
      </div>
    );
  }

  const c = order.customer;

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/orders" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
        </Link>

        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">Order #{order.id}</h1>
              <p className="text-sm text-foreground/60">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <span className="self-start px-3 py-1 text-sm font-medium rounded-full border border-border capitalize">
              {order.status}
            </span>
          </div>

          <div>
            <h2 className="font-heading font-bold text-foreground mb-3">Items</h2>
            <ul className="divide-y divide-border">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex justify-between py-2 text-foreground/80">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{inr(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1 text-sm text-foreground/70">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(order.subtotal)}</dd></div>
              {order.discount > 0 && (
                <div className="flex justify-between"><dt>Discount{order.discountCode ? ` (${order.discountCode})` : ""}</dt><dd>−{inr(order.discount)}</dd></div>
              )}
              <div className="flex justify-between"><dt>Shipping</dt><dd>{order.shipping ? inr(order.shipping) : "Free"}</dd></div>
              <div className="flex justify-between font-bold text-foreground text-base pt-1"><dt>Total paid</dt><dd>{inr(order.total)}</dd></div>
            </dl>
          </div>

          <div>
            <h2 className="font-heading font-bold text-foreground mb-2">Delivery address</h2>
            <p className="text-foreground/80">{c.firstName} {c.lastName}</p>
            <p className="text-foreground/70">{c.address}, {c.city}, {c.state} {c.zipCode}</p>
            <p className="text-foreground/70">{c.phone}</p>
          </div>

          <Link
            to={`/track?orderId=${order.id}`}
            className="h-12 px-6 bg-primary hover:bg-primary/90 text-white font-medium rounded-full transition-all inline-flex items-center justify-center gap-2"
          >
            <Truck className="h-5 w-5" /> Track Order
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
