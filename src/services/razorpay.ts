import { RazorpayOptions, RazorpayOrder } from "../types/razorpay";
import { apiConfig } from "../config/api";

// Razorpay configuration
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID as string;

export {};

declare global {
  interface Window {
    Razorpay: any;
  }
}

export class RazorpayService {
  private static instance: RazorpayService;
  private isScriptLoaded = false;
  private scriptLoadPromise: Promise<boolean> | null = null;

  private constructor() {}

  public static getInstance(): RazorpayService {
    if (!RazorpayService.instance) {
      RazorpayService.instance = new RazorpayService();
    }
    return RazorpayService.instance;
  }

  // Load Razorpay checkout script dynamically
  public async loadRazorpayScript(): Promise<boolean> {
    if (this.isScriptLoaded) return true;

    if (window.Razorpay) {
      this.isScriptLoaded = true;
      return true;
    }

    if (this.scriptLoadPromise) {
      return this.scriptLoadPromise;
    }

    this.scriptLoadPromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      const timeout = setTimeout(() => {
        console.error("❌ Razorpay script load timeout");
        this.isScriptLoaded = false;
        resolve(false);
      }, 10000);

      script.onload = () => {
        clearTimeout(timeout);
        this.isScriptLoaded = true;
        console.log("✅ Razorpay script loaded successfully");
        resolve(true);
      };

      script.onerror = (error) => {
        clearTimeout(timeout);
        console.error("❌ Failed to load Razorpay script:", error);
        this.isScriptLoaded = false;
        resolve(false);
      };

      document.head.appendChild(script);
    });

    return this.scriptLoadPromise;
  }

  // ✅ FIXED: Create order - call backend API to create real Razorpay order
  public async createOrder(
    amount: number,
    currency: string = "INR",
    receipt?: string,
    notes: Record<string, any> = {}
  ): Promise<RazorpayOrder> {
    console.log("📦 Creating Razorpay Order - Amount:", amount, "Currency:", currency);

    if (typeof amount !== "number" || isNaN(amount) || amount < 1) {
      throw new Error("Invalid amount provided");
    }

    try {
      // ✅ Call Netlify function
      const response = await fetch(
        '/.netlify/functions/create-order',
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(amount * 100), // Convert to paise
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
            notes,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create Razorpay order");
      }

      const { data } = await response.json();
      console.log("✅ Razorpay Order created successfully:", data.order.id);
      return data.order;
    } catch (error) {
      console.error("❌ Failed to create Razorpay order:", error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : "Failed to create order. Please try again."
      );
    }
  }

  // ✅ FIXED: Initiate payment - NOW creates order FIRST
  public async initiatePayment(
    options: Omit<RazorpayOptions, "key">
  ): Promise<void> {
    try {
      console.log("🚀 Initiating payment with options:", options);

      // 1. Load Razorpay script
      const scriptLoaded = await this.loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error(
          "Razorpay SDK not loaded. Please check your internet connection and try again."
        );
      }

      // 2. Validate inputs
      if (!options.amount || options.amount <= 0) {
        throw new Error("Invalid payment amount");
      }

      if (!options.name || !options.description) {
        throw new Error("Payment name and description are required");
      }

      // 3. ✅ CREATE ORDER FIRST (This is the critical fix!)
      let orderId = options.order_id;
      
      if (!orderId) {
        console.log("🔄 No order_id provided, creating Razorpay order...");
        
        const razorpayOrder = await this.createOrder(
          options.amount / 100, // Convert paise back to rupees for createOrder
          options.currency || "INR",
          options.notes?.receipt as string,
          options.notes || {}
        );
        
        orderId = razorpayOrder.id;
        console.log("✅ Order created with ID:", orderId);
      }

      // 4. Open Razorpay checkout with order_id
      const razorpayOptions: RazorpayOptions = {
        key: RAZORPAY_KEY_ID,
        amount: options.amount,
        currency: options.currency || "INR",
        name: options.name,
        description: options.description,
        image: options.image,
        order_id: orderId, // ✅ This is now guaranteed to exist
        handler: options.handler,
        prefill: options.prefill,
        notes: options.notes,
        theme: {
          color: "#8B7355",
          ...options.theme,
        },
        modal: {
          ondismiss: () => {
            console.log("⚠️ Payment modal dismissed by user");
            options.modal?.ondismiss?.();
          },
          confirm_close: true,
          escape: true,
          animation: true,
          ...options.modal,
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
        timeout: 300,
        remember_customer: false,
      };

      console.log("🎯 Opening Razorpay modal with order_id:", orderId);

      const razorpay = new window.Razorpay(razorpayOptions);

      // Add event listeners
      razorpay.on("payment.failed", (response: any) => {
        console.error("❌ Payment failed:", response.error);
        throw new Error(
          `Payment failed: ${response.error.description || "Unknown error"}`
        );
      });

      razorpay.on("payment.cancelled", () => {
        console.log("⚠️ Payment cancelled by user");
        throw new Error("Payment was cancelled by user");
      });

      razorpay.open();
    } catch (error) {
      console.error("❌ Error initiating payment:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to open Razorpay payment modal");
    }
  }

  // Verify payment signature (should be done on backend)
  public async verifyPayment(
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<boolean> {
    if (!orderId || !paymentId || !signature) {
      console.error("❌ Missing parameters for payment verification");
      return false;
    }

    try {
      const response = await fetch(
        '/.netlify/functions/verify-payment',
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: orderId,
            razorpay_payment_id: paymentId,
            razorpay_signature: signature,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Payment verification failed");
      }

      const { data } = await response.json();
      return data.isAuthentic;
    } catch (error) {
      console.error("❌ Payment verification error:", error);
      return false;
    }
  }

  // Utility methods
  public static formatAmount(amount: number): string {
    return `₹${amount.toFixed(2)}`;
  }

  public static toPaise(amount: number): number {
    return Math.round(amount * 100);
  }

  public static toRupees(paise: number): number {
    return paise / 100;
  }
}

export const razorpayService = RazorpayService.getInstance();
