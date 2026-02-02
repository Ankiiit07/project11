import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Lock,
  MapPin,
  User,
  CheckCircle,
  ShoppingBag,
  Truck,
  Package,
  Zap,
  Clock,
  Calendar,
} from "lucide-react";
import { useCart } from "../context/CartContextOptimized";
import { useUser } from "../context/UserContext";
import PaymentOptions from "../components/PaymentOptions";
import { RazorpayResponse } from "../types/razorpay";
import { useOrders } from "../hooks/useOrders";
import { useNotification } from "../components/NotificationSystem";
import {
  LoadingSpinner,
  StepProgress,
  ProgressBar,
  LoadingOverlay,
} from "../components/LoadingSystem";
import PaymentButton from "../components/PaymentButton";
import { 
  calculateShipping, 
  formatWeight, 
  DEFAULT_SHIPPING_RATES,
  getShippingOptions,
  getDeliveryEstimate,
  isValidPincode,
  getDeliveryZone,
  ShippingMethod,
  ShippingOption,
} from "../utils/shippingCalculator";

const CheckoutPage: React.FC = () => {
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { state: cartState, dispatch: cartDispatch } = useCart();
  const { user, updateProfile } = useUser();
  const navigate = useNavigate();
  const { createOrder } = useOrders();
  const notification = useNotification();

  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "IN",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">(
    "online"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod>('standard');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string>('');

  // Calculate base shipping based on weight
  const shippingResult = useMemo(() => calculateShipping(
    cartState.items.map(item => ({
      weight: item.weight || 100,
      quantity: item.quantity,
      price: item.price,
    })),
    cartState.total
  ), [cartState.items, cartState.total]);

  // Get available shipping options based on pincode
  const shippingOptions = useMemo(() => {
    if (formData.zipCode && isValidPincode(formData.zipCode)) {
      return getShippingOptions(formData.zipCode, cartState.total, shippingResult.shippingCharge);
    }
    return [];
  }, [formData.zipCode, cartState.total, shippingResult.shippingCharge]);

  // Get current selected shipping option
  const selectedShippingOption = useMemo(() => {
    return shippingOptions.find(opt => opt.id === selectedShippingMethod) || shippingOptions[0];
  }, [shippingOptions, selectedShippingMethod]);

  // Update delivery estimate when pincode or shipping method changes
  useEffect(() => {
    if (formData.zipCode && isValidPincode(formData.zipCode)) {
      setDeliveryEstimate(getDeliveryEstimate(formData.zipCode, selectedShippingMethod));
      
      // Check if express is available for this pincode
      const zone = getDeliveryZone(formData.zipCode);
      if (!zone.expressAvailable && selectedShippingMethod === 'express') {
        setSelectedShippingMethod('standard');
      }
    } else {
      setDeliveryEstimate('');
    }
  }, [formData.zipCode, selectedShippingMethod]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(newFormData);

    // Check if form is valid
    const required = [
      "email",
      "firstName",
      "lastName",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
    ];
    const isValid = required.every(
      (field) => newFormData[field as keyof typeof newFormData].trim() !== ""
    );
    setIsFormValid(isValid);
  };

  const handlePaymentSuccess = async (response: RazorpayResponse) => {
  console.log("🔥 Payment success raw response:", response);
  setIsSubmitting(true);
  setCurrentStep(3);

  try {
    const customerInfo = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
    };

    const paymentInfo = {
      method: "online",
      paymentId: response.razorpay_payment_id,
      status: "completed",
    };

    console.log("💡 Data being sent to createOrder:");
    console.log("- cartItems:", JSON.stringify(cartState.items, null, 2));
    console.log("- customerInfo:", JSON.stringify(customerInfo, null, 2));
    console.log("- paymentInfo:", JSON.stringify(paymentInfo, null, 2));

    const newOrder = await createOrder(
      cartState.items,
      customerInfo,
      paymentInfo,
      cartState.total,
      shipping,
      tax
    );

    setOrderDetails(newOrder);
    setPaymentSuccess(true);

    await sendOrderConfirmationEmail(newOrder, customerInfo);

    await updateProfile({
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
    });

    setTimeout(() => {
      cartDispatch({ type: "CLEAR_CART" });
      navigate(`/thank-you?orderId=${newOrder.id}`, {
        state: { orderDetails: newOrder },
      });
    }, 3000);

  } catch (error) {
    console.error("❌ Full error object:", error);
    notification.error(
      error instanceof Error ? error.message : "Order creation failed"
    );
    handlePaymentError(
      error instanceof Error ? error : new Error("Order creation failed")
    );
  }
};

  const handlePaymentError = (error: Error) => {
    console.error("❌ Payment error in checkout:", error);

    // Show user-friendly error message
    let userMessage = "Payment failed. Please try again.";

    if (error.message.includes("Razorpay SDK not loaded")) {
      userMessage =
        "Payment system is not available. Please check your internet connection and try again.";
    } else if (error.message.includes("cancelled")) {
      userMessage = "Payment was cancelled. You can try again anytime.";
    } else if (error.message.includes("verification failed")) {
      userMessage =
        "Payment verification failed. Please contact support if the amount was deducted.";
    } else if (error.message.includes("Invalid amount")) {
      userMessage =
        "Invalid payment amount. Please refresh the page and try again.";
    }

    notification.error(userMessage);
  };

  const calculateTax = () => {
    return cartState.total * 0; // 18% GST for India
  };

  // Get shipping charge based on selected method
  const getShippingCharge = () => {
    if (selectedShippingOption) {
      return selectedShippingOption.charge;
    }
    return shippingResult.shippingCharge;
  };

  const shipping = getShippingCharge();
  const tax = calculateTax();
  const finalTotal = (cartState.total || 0) + tax + shipping;

  const sendOrderConfirmationEmail = async (orderDetails: any, customerInfo: any) => {
  try {
    const response = await fetch('/.netlify/functions/send-order-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderDetails,
        customerInfo
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Order confirmation email sent successfully');
      notification.success('Order confirmation email sent to your email address');
    } else {
      console.error('❌ Failed to send confirmation email:', result.error);
      // Don't show error to user as order is still successful
    }
  } catch (error) {
    console.error('❌ Email service error:', error);
    // Don't show error to user as order is still successful
  }
};

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-cream page-container py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              No items to checkout
            </h1>
            <p className="text-gray-600 mb-8">
              Add some products to your cart first.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
            >
              Shop Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LoadingOverlay loading={isSubmitting} message="Processing your order...">
      <div className="min-h-screen bg-cream py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/cart"
              className="inline-flex items-center text-primary hover:text-primary-dark transition-colors mb-4 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md z-10 relative"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Secure Checkout
            </h1>
            <p className="text-gray-600 mt-2">
              Complete your order with our secure payment system
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
            <StepProgress
              steps={["Cart Review", "Customer Info", "Payment", "Complete"]}
              currentStep={currentStep}
              className="mb-4"
            />
            <ProgressBar
              progress={(currentStep + 1) * 25}
              showPercentage={false}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Checkout Form */}
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <User className="h-6 w-6 text-primary mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Contact Information
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <MapPin className="h-6 w-6 text-primary mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Shipping Address
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      placeholder="123 Main Street, Apartment 4B"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                        placeholder="Mumbai"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                        placeholder="Maharashtra"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                        placeholder="400001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      >
                        <option value="IN">India</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Security Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-start">
                  <Lock className="h-6 w-6 text-amber-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">
                      Secure Payment Guarantee
                    </h3>
                    <p className="text-sm text-amber-700 leading-relaxed">
                      Your payment information is encrypted and secure. We use
                      Razorpay's industry-leading security measures to protect
                      your data. We never store your card details.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {cartState.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-contain rounded-lg bg-cream p-1"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                        {item.type === "subscription" && (
                          <p className="text-xs text-primary font-medium">
                            Subscription (15% off)
                          </p>
                        )}
                      </div>
                      <span className="font-semibold text-gray-900">
                        ₹
                        {(
                          (item.type === "subscription"
                            ? item.price * 0.85
                            : item.price) * item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Subtotal ({cartState.itemCount} items)
                    </span>
                    <span>
                      ₹
                      {cartState.items
                        .reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>

                  {cartState.items.some(
                    (item) => item.type === "subscription"
                  ) && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Subscription Savings</span>
                      <span>
                        -₹
                        {cartState.items
                          .filter((item) => item.type === "subscription")
                          .reduce(
                            (sum, item) =>
                              sum + item.price * 0.15 * item.quantity,
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Truck className="h-4 w-4 mr-1" />
                      Shipping ({formatWeight(shippingResult.totalWeight)})
                    </span>
                    <span
                      className={
                        shippingResult.isFreeShipping ? "text-green-600 font-medium" : ""
                      }
                    >
                      {shippingResult.isFreeShipping ? "Free" : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST (18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-lg font-bold border-t pt-3">
                    <span>Total</span>
                    <span>₹{(finalTotal || 0).toFixed(2)}</span>
                  </div>
                </div>

                

                {/* Payment Button */}
                <div className="mt-6">
                  <PaymentOptions
  amount={finalTotal}
  customerInfo={{
    name: `${formData.firstName} ${formData.lastName}`.trim(),
    email: formData.email,
    phone: formData.phone,
  }}
  orderDetails={{
    description: `@once Coffee - ${cartState.items.length} items`,
    receipt: `receipt_${Date.now()}`,
  }}
  onPaymentSuccess={handlePaymentSuccess}
  onPaymentError={handlePaymentError}
  disabled={!isFormValid}
/>
                </div>

                {!isFormValid && (
                  <p className="text-sm text-gray-500 text-center mt-3">
                    Please fill in all required fields to proceed with payment
                  </p>
                )}

                {/* Shipping Details */}
                {!shippingResult.isFreeShipping && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Package className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-900">Shipping Details</span>
                    </div>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>Total Weight: {formatWeight(shippingResult.totalWeight)}</p>
                      <p>Items: {shippingResult.itemCount}</p>
                      {shippingResult.breakdown.baseCharge > 0 && (
                        <p>Base Charge: ₹{shippingResult.breakdown.baseCharge}</p>
                      )}
                      {shippingResult.breakdown.weightCharge > 0 && (
                        <p>Weight Charge: ₹{shippingResult.breakdown.weightCharge}</p>
                      )}
                      {shippingResult.breakdown.itemCharge > 0 && (
                        <p>Item Charge: ₹{shippingResult.breakdown.itemCharge}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Free Shipping Notice */}
                {cartState.total < DEFAULT_SHIPPING_RATES.freeShippingThreshold && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Add ₹{(DEFAULT_SHIPPING_RATES.freeShippingThreshold - cartState.total).toFixed(2)} more for free
                      shipping!
                    </p>
                  </div>
                )}

                {/* Free Shipping Badge */}
                {shippingResult.isFreeShipping && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-green-800 font-medium">
                        You qualify for FREE shipping!
                      </span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      You're saving ₹{shippingResult.breakdown.discount} on shipping
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default CheckoutPage;
