import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  Truck,
  CreditCard,
  Package,
} from "lucide-react";
import { useCart } from "../context/CartContextOptimized";
import {
  LoadingSpinner,
  CartLoading,
  ProgressBar,
  StepProgress,
} from "../components/LoadingSystem";
import { calculateShipping, formatWeight, DEFAULT_SHIPPING_RATES } from "../utils/shippingCalculator";

const CartPage: React.FC = () => {
  const { state: cartState, dispatch } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);
  const [removingItem, setRemovingItem] = useState<string | null>(null);

  // Simulate loading on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const updateQuantity = async (id: string, newQuantity: number) => {
    setUpdatingItem(id);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (newQuantity === 0) {
      dispatch({ type: "REMOVE_ITEM", payload: id });
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id, quantity: newQuantity },
      });
    }

    setUpdatingItem(null);
  };

  const removeItem = async (id: string) => {
    setRemovingItem(id);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    dispatch({ type: "REMOVE_ITEM", payload: id });
    setRemovingItem(null);
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const calculateSubtotal = () => {
    return cartState.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  // Calculate shipping based on weight and quantity
  const shippingResult = calculateShipping(
    cartState.items.map(item => ({
      weight: item.weight || 100, // Default 100g if not specified
      quantity: item.quantity,
      price: item.price,
    })),
    calculateSubtotal()
  );

  const calculateShippingAmount = () => {
    return shippingResult.shippingCharge;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0; // 18% GST
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShippingAmount() + calculateTax();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <LoadingSpinner size="xl" text="Loading your cart..." />
          </div>
          <CartLoading />
        </div>
      </div>
    );
  }

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-cream pt-20">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-6">
              <ShoppingBag className="h-24 w-24 mx-auto" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any coffee products to your cart yet.
              Start shopping to discover our amazing collection!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Continue Shopping</span>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Shopping Cart
              </h1>
              <p className="text-gray-600">
                {cartState.itemCount}{" "}
                {cartState.itemCount === 1 ? "item" : "items"} in your cart
              </p>
            </div>
            <Link
              to="/products"
              className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Cart Items
                </h2>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Clear Cart
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {cartState.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center space-x-4 p-4 border border-gray-200 rounded-lg ${
                        removingItem === item.id ? "opacity-50" : ""
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        {updatingItem === item.id && (
                          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                            <LoadingSpinner size="sm" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm">₹{item.price}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {item.type}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={updatingItem === item.id}
                          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={updatingItem === item.id}
                          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          ₹{item.price * item.quantity}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={removingItem === item.id}
                          className="text-red-600 hover:text-red-800 text-sm mt-1 disabled:opacity-50"
                        >
                          {removingItem === item.id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Order Summary
              </h2>

              {/* Progress indicator for checkout steps */}
              <div className="mb-6">
                <StepProgress
                  steps={["Cart", "Checkout", "Payment", "Complete"]}
                  currentStep={0}
                  className="mb-4"
                />
                <ProgressBar progress={25} showPercentage={false} />
              </div>

              {/* Price breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ₹{calculateSubtotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Truck className="h-4 w-4 mr-1" />
                    Shipping ({formatWeight(shippingResult.totalWeight)})
                  </span>
                  <span className="font-medium">
                    {shippingResult.isFreeShipping
                      ? <span className="text-green-600">Free</span>
                      : `₹${calculateShippingAmount().toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST)</span>
                  <span className="font-medium">
                    ₹{calculateTax().toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-800">
                      Total
                    </span>
                    <span className="text-lg font-bold text-primary">
                      ₹{calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping info */}
              {shippingResult.isFreeShipping ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 font-medium">
                      Free Shipping!
                    </span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Your order qualifies for free shipping (saved ₹{shippingResult.breakdown.discount})
                  </p>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-800 font-medium">
                      Shipping: ₹{calculateShippingAmount().toFixed(0)}
                    </span>
                  </div>
                  <div className="text-blue-700 text-sm mt-1 space-y-1">
                    <p>Weight: {formatWeight(shippingResult.totalWeight)} | Items: {shippingResult.itemCount}</p>
                    <p>
                      Add ₹{(DEFAULT_SHIPPING_RATES.freeShippingThreshold - calculateSubtotal()).toFixed(2)} more for free
                      shipping
                    </p>
                  </div>
                </div>
              )}

              {/* Checkout button */}
              <Link
                to="/checkout"
                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2"
              >
                <CreditCard className="h-5 w-5" />
                <span>Proceed to Checkout</span>
              </Link>

              {/* Additional info */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Secure checkout powered by Razorpay
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
