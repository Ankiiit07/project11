import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  User,
  Package,
  Settings,
  CreditCard,
  MapPin,
  Bell,
  LogOut,
  Plus,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { useOrders } from "../hooks/useOrders";

const AccountPage: React.FC = () => {
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { user, logout, login, register, isAuthenticated, loading } = useUser();
  const { orders, loading: ordersLoading } = useOrders();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "profile"
  );
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  // For order details modal
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const navigate = useNavigate();

  // 🚨 Protect this page
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream page-container flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      // You could add error state here to show to user
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream page-container flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream page-container py-8">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <User className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-gray-600 mt-2">
                {isLogin
                  ? "Sign in to manage your coffee subscriptions"
                  : "Join us for exclusive benefits and personalized coffee delivery"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                {isSubmitting
                  ? "Please wait..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:text-primary-dark font-medium"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "subscriptions", label: "Subscriptions", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}

              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors mt-6"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Profile Information
                </h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={user?.name || ""}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="(555) 123-4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <button className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Order History
                </h2>

                {ordersLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium text-gray-900">
                              Order #{order.orderNumber}
                            </p>
                            <p className="text-sm text-gray-600">
                              Placed on{" "}
                              {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </div>

                        <div className="space-y-2 mb-3">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between text-sm"
                            >
                              <span>
                                {item.name} x{item.quantity}
                              </span>
                              <span>
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                          <span className="font-medium">
                            Total: ₹{order.total.toFixed(2)}
                          </span>
                          <div className="flex space-x-2">
                            {order.trackingNumber && (
                              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                                Track Order
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-primary hover:text-primary-dark font-medium text-sm"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No orders yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start shopping to see your orders here.
                    </p>
                    <Link
                      to="/products"
                      className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Shop Now
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "subscriptions" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Active Subscriptions
                    </h2>
                    <Link
                      to="/products"
                      className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Browse Products
                    </Link>
                  </div>

                  {user?.subscriptions && user.subscriptions.length > 0 ? (
                    user.subscriptions.map((subscription) => (
                      <div
                        key={subscription.id}
                        className="border border-gray-200 rounded-lg p-4 mb-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium text-gray-900">
                              {subscription.frequency.charAt(0).toUpperCase() +
                                subscription.frequency.slice(1)}{" "}
                              Delivery
                            </p>
                            <p className="text-sm text-gray-600">
                              Next delivery:{" "}
                              {new Date(
                                subscription.nextDelivery
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              subscription.status === "active"
                                ? "bg-green-100 text-green-800"
                                : subscription.status === "paused"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {subscription.status.charAt(0).toUpperCase() +
                              subscription.status.slice(1)}
                          </span>
                        </div>

                        <div className="flex space-x-3">
                          <button className="text-primary hover:text-primary-dark font-medium">
                            Modify
                          </button>
                          <button className="text-yellow-600 hover:text-yellow-700 font-medium">
                            Pause
                          </button>
                          <button className="text-red-600 hover:text-red-700 font-medium">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No active subscriptions
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Subscribe to your favorite products for regular delivery
                        and savings.
                      </p>
                      <Link
                        to="/products"
                        className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        Browse Products
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Account Settings
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Notifications
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="rounded border-gray-300 text-primary focus:ring-primary mr-3"
                          />
                          <span>Email notifications for order updates</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="rounded border-gray-300 text-primary focus:ring-primary mr-3"
                          />
                          <span>Subscription delivery reminders</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary focus:ring-primary mr-3"
                          />
                          <span>Marketing emails and promotions</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Privacy
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="rounded border-gray-300 text-primary focus:ring-primary mr-3"
                          />
                          <span>
                            Allow data collection for personalized
                            recommendations
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary focus:ring-primary mr-3"
                          />
                          <span>Share usage data with partners</span>
                        </label>
                      </div>
                    </div>

                    <button className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors">
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 🔹 Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">
              Order #{selectedOrder.orderNumber}
            </h2>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedOrder.date).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p>
              <strong>Total:</strong> ₹{selectedOrder.total.toFixed(2)}
            </p>

            <div className="mt-4 space-y-2">
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-6 bg-primary text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
