import React, { useState, useEffect } from "react";
import { CreditCard, AlertCircle, CheckCircle } from "lucide-react";
import { useRazorpay } from "../hooks/useRazorpay";
import { LoadingSpinner, PaymentProcessing } from "./LoadingSystem";
import { motion } from "framer-motion";
import { RazorpayResponse } from "../types/razorpay";

interface PaymentButtonProps {
  amount: number;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  orderDetails: {
    description: string;
    receipt?: string;
  };
  onSuccess?: (response: any) => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount,
  customerInfo,
  orderDetails,
  onSuccess,
  onError,
  disabled = false,
  className = "",
  children,
}) => {
  const { processPayment, isLoading, error, clearError } = useRazorpay({
    onSuccess,
    onError,
  });

  const [paymentStep, setPaymentStep] = useState<
    "idle" | "creating-order" | "processing-payment" | "verifying" | "complete"
  >("idle");

  const [progress, setProgress] = useState(0);

  // Simulate progress for better UX
  useEffect(() => {
    if (isLoading && paymentStep !== "idle") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);
      return () => clearInterval(interval);
    } else if (!isLoading) {
      setProgress(0);
    }
  }, [isLoading, paymentStep]);

  const handlePayment = async () => {
    clearError();
    setPaymentStep("creating-order");
    setProgress(0);

    if (!customerInfo.name || !customerInfo.email) {
      const validationError = new Error(
        "Please provide customer name and email"
      );
      onError?.(validationError);
      setPaymentStep("idle");
      return;
    }

    if (amount <= 0) {
      const validationError = new Error("Invalid payment amount");
      onError?.(validationError);
      setPaymentStep("idle");
      return;
    }

    try {
      setPaymentStep("creating-order");
      setProgress(20);

      await processPayment(amount, customerInfo, orderDetails);

      setPaymentStep("processing-payment");
      setProgress(60);

      setTimeout(() => {
        setPaymentStep("verifying");
        setProgress(80);
      }, 1000);
    } catch (err) {
      console.error("❌ Payment processing failed:", err);
      setPaymentStep("idle");
      setProgress(0);
    }
  };

  // Overlay during processing
  if (paymentStep !== "idle" && isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <PaymentProcessing
            step={
              paymentStep === "creating-order"
                ? "creating-order"
                : paymentStep === "processing-payment"
                ? "processing-payment"
                : paymentStep === "verifying"
                ? "verifying"
                : "complete"
            }
            progress={progress}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handlePayment}
        disabled={disabled || isLoading}
        className={`w-full bg-gradient-to-r from-primary to-primary-dark 
          hover:from-primary-dark hover:to-primary 
          disabled:from-gray-400 disabled:to-gray-500 
          text-white py-4 px-6 rounded-lg font-semibold 
          transition-all duration-300 flex items-center justify-center 
          transform hover:scale-105 hover:shadow-lg 
          disabled:transform-none disabled:shadow-none ${className}`}
        aria-label={
          isLoading ? "Processing payment..." : `Pay ₹${amount.toFixed(2)}`
        }
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            {children || `Pay ₹${amount.toFixed(2)}`}
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-red-800 font-medium text-sm">
                Payment Error
              </h4>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={clearError}
                  className="text-red-600 hover:text-red-800 text-sm font-medium underline"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="text-red-600 hover:text-red-800 text-sm font-medium underline"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Secure Payment Info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 
                   0 01-2 2H5a2 2 0 01-2-2v-5a2 2 
                   0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-green-800 mb-2">Secure Payment</h4>
            <div className="text-sm text-green-700 space-y-1">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                256-bit SSL encryption
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                PCI DSS compliant
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                Trusted by millions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 
                   0 0116 0zm-7-4a1 1 0 
                   11-2 0 1 1 0 012 0zM9 9a1 1 0 
                   000 2v3a1 1 0 001 1h1a1 1 0 
                   100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Payment Tips</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Ensure your card details are correct</p>
              <p>• Check that you have sufficient funds</p>
              <p>• Keep this window open during payment</p>
              <p>• Contact support if you face any issues</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentButton;
