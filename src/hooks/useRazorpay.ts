import { useState } from "react";
import { razorpayService } from "../services/razorpay";
import { RazorpayResponse } from "../types/razorpay";
import { apiConfig } from "../config/api"; // your backend API base URL

interface UseRazorpayProps {
  onSuccess?: (response: RazorpayResponse) => void;
  onError?: (error: Error) => void;
}

export const useRazorpay = ({ onSuccess, onError }: UseRazorpayProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const processPayment = async (
    amount: number,
    customerInfo: {
      name: string;
      email: string;
      phone?: string;
    },
    orderDetails: {
      description: string;
      receipt?: string;
    }
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!amount || amount <= 0) throw new Error("Invalid amount provided");
      if (!customerInfo.name || !customerInfo.email)
        throw new Error("Customer name and email are required");

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerInfo.email))
        throw new Error("Please provide a valid email address");

      if (customerInfo.phone && customerInfo.phone.length < 10)
        throw new Error("Please provide a valid phone number");

      const paymentAmount = Math.round(amount * 100); // paise

      await razorpayService.initiatePayment({
        amount: paymentAmount,
        currency: "INR",
        name: "Cafe at Once",
        description: orderDetails.description,
        image: "/coffee-icon.svg",

        handler: async (response: RazorpayResponse) => {
          try {
            console.log("💳 Payment response received:", response);

            // ✅ Assume payment success (in real, verify on backend)
            const isValid = true;

            if (isValid) {
              console.log("✅ Payment verified successfully");

              // 👉 Send order/payment data to backend for WhatsApp notification
              try {
                await fetch(`${apiConfig.baseUrl}/orders/notify-whatsapp`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    amount,
                    customerInfo,
                    orderDetails,
                    razorpayResponse: response,
                  }),
                });
                console.log("📲 WhatsApp notification request sent to backend");
              } catch (notifyError) {
                console.error(
                  "❌ Failed to notify backend for WhatsApp:",
                  notifyError
                );
              }

              onSuccess?.(response);
            } else {
              throw new Error(
                "Payment verification failed. Please contact support."
              );
            }
          } catch (verificationError) {
            console.error("❌ Payment verification error:", verificationError);
            const error =
              verificationError instanceof Error
                ? verificationError
                : new Error("Payment verification failed");
            setError(error.message);
            onError?.(error);
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        notes: {
          order_type: "coffee_purchase",
          customer_email: customerInfo.email,
        },
        modal: {
          ondismiss: () => {
            console.log("⚠️ Payment modal dismissed by user");
            setIsLoading(false);
            setError("Payment was cancelled by user");
          },
        },
        theme: {
          color: "#8B7355",
        },
      });
    } catch (err) {
      console.error("❌ Payment processing error:", err);
      const error =
        err instanceof Error
          ? err
          : new Error("Payment failed. Please try again.");
      setError(error.message);
      onError?.(error);
      setIsLoading(false);
    }
  };

  return {
    processPayment,
    isLoading,
    error,
    clearError,
  };
};
