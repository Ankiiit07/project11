import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  Truck,
  Package,
  Tag,
} from 'lucide-react';
import { useCart } from '../context/CartContextOptimized';
import { calculateShipping } from '../utils/shippingCalculator';

const CartPageTechForward: React.FC = () => {
  const { state: cartState, dispatch } = useCart();
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);

  const updateQuantity = async (id: string, newQuantity: number) => {
    setUpdatingItem(id);
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    } else {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id, quantity: newQuantity },
      });
    }
    setUpdatingItem(null);
  };

  const removeItem = async (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const calculateSubtotal = () => {
    return cartState.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const shippingResult = calculateShipping(
    cartState.items.map(item => ({
      weight: item.weight || 100,
      quantity: item.quantity,
      price: item.price,
    })),
    calculateSubtotal()
  );

  const calculateTotal = () => {
    return calculateSubtotal() + shippingResult.shippingCharge;
  };

  // Empty cart state
  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-16 sm:py-24">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-foreground/40" />
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-foreground/70 mb-8 text-center max-w-md">
              Looks like you haven't added any coffee to your cart yet. Start shopping now!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary/90 text-white font-heading font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
              data-testid="empty-cart-shop-button"
            >
              <ShoppingBag className="h-5 w-5" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
                Shopping <span className="text-primary">Cart</span>
              </h1>
              <p className="text-foreground/70">
                {cartState.itemCount} {cartState.itemCount === 1 ? 'item' : 'items'}
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
              data-testid="continue-shopping"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-lg font-bold text-foreground">Cart Items</h2>
                {cartState.items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-sm text-destructive hover:text-destructive/80 font-medium transition-colors"
                    data-testid="clear-cart"
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {cartState.items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                      data-testid={`cart-item-${item.id}`}
                    >
                      {/* Image */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-bold text-foreground mb-1 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-foreground/60 mb-2">
                          {item.type === 'single' ? 'Single' : `Pack of ${item.packSize}`}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {/* Quantity Controls */}
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={updatingItem === item.id}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:border-primary hover:bg-primary/10 transition-all disabled:opacity-50"
                              data-testid={`decrease-${item.id}`}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-medium" data-testid={`quantity-${item.id}`}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={updatingItem === item.id}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:border-primary hover:bg-primary/10 transition-all disabled:opacity-50"
                              data-testid={`increase-${item.id}`}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="flex items-center gap-4">
                            <p className="font-heading text-lg font-bold text-foreground">
                              ₹{(item.price * item.quantity).toFixed(0)}
                            </p>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-destructive hover:text-destructive/80 transition-colors"
                              data-testid={`remove-${item.id}`}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Order Summary - Sticky on desktop */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 lg:sticky lg:top-24">
              <h2 className="font-heading text-lg font-bold text-foreground mb-6">Order Summary</h2>

              {/* Progress Steps */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          step === 1
                            ? 'bg-primary text-white'
                            : 'bg-secondary text-foreground/40'
                        }`}
                      >
                        {step}
                      </div>
                      <span className="text-xs text-foreground/60 mt-1">
                        {step === 1 ? 'Cart' : step === 2 ? 'Checkout' : step === 3 ? 'Payment' : 'Complete'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1/4 transition-all duration-300" />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70">Subtotal</span>
                  <span className="font-medium text-foreground">₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70 flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    Shipping ({shippingResult.totalWeight}g)
                  </span>
                  <span className="font-medium text-foreground">
                    {shippingResult.isFreeShipping ? (
                      <span className="text-green-600 font-bold">FREE</span>
                    ) : (
                      `₹${shippingResult.shippingCharge.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70">Tax (GST)</span>
                  <span className="font-medium text-foreground">₹0.00</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-heading text-lg font-bold text-foreground">Total</span>
                <span className="font-heading text-2xl font-bold text-primary">
                  ₹{calculateTotal().toFixed(2)}
                </span>
              </div>

              {/* Free Shipping Progress */}
              {!shippingResult.isFreeShipping && shippingResult.amountForFreeShipping > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2 mb-2">
                    <Tag className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="flex-1 text-sm">
                      <p className="text-blue-900 font-medium mb-1">
                        Add ₹{shippingResult.amountForFreeShipping.toFixed(0)} more for free shipping
                      </p>
                      <p className="text-blue-700 text-xs">
                        Weight: {shippingResult.totalWeight}g | Items: {cartState.itemCount}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary hover:bg-primary/90 text-white font-heading font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                data-testid="proceed-to-checkout"
              >
                <Package className="h-5 w-5" />
                Proceed to Checkout
              </Link>

              <p className="text-xs text-center text-foreground/60 mt-4">
                Secure checkout powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPageTechForward;
