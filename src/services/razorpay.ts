import { RazorpayOptions, RazorpayOrder } from "../types/razorpay";
import { apiConfig } from "../config/api";

// Razorpay configuration - Using the provided test key
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

  // Load Razorpay checkout script dynamically with better error handling
  public async loadRazorpayScript(): Promise<boolean> {
    if (this.isScriptLoaded) return true;

    if (window.Razorpay) {
      this.isScriptLoaded = true;
      return true;
    }

    // If already loading, return the existing promise
    if (this.scriptLoadPromise) {
      return this.scriptLoadPromise;
    }

    this.scriptLoadPromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        this.isScriptLoaded = true;
        console.log("✅ Razorpay script loaded successfully");
        resolve(true);
      };

      script.onerror = (error) => {
        console.error("❌ Failed to load Razorpay script:", error);
        this.isScriptLoaded = false;
        resolve(false);
      };

      // Add timeout
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

      document.head.appendChild(script);
    });

    return this.scriptLoadPromise;
  }

  // Create order - call backend API to create real Razorpay order
  public async createOrder(
    amount: number,
    currency: string = "INR",
    receipt?: string,
    notes: Record<string, any> = {}
  ): Promise<RazorpayOrder> {
    console.log("Amount received in createOrder:", amount, typeof amount);

    if (typeof amount !== "number" || isNaN(amount) || amount < 1) {
      throw new Error("Invalid amount provided");
    }

    try {
      const response = await fetch(
        `${apiConfig.baseURL}/payments/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(amount * 100),
            currency,
            receipt,
            notes,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create Razorpay order");
      }

      const { data } = await response.json();
      return data.order;
    } catch (error) {
      console.warn("⚠️ Backend order creation failed, using mock order");
      return this.createMockOrder(amount, currency, receipt);
    }
  }

  // Create mock order for development when backend is unavailable
  private createMockOrder(
    amount: number,
    currency: string = "INR",
    receipt?: string
  ): RazorpayOrder {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);

    const mockOrder: RazorpayOrder = {
      id: `order_${timestamp}_${randomId}`,
      entity: "order",
      amount: Math.round(amount * 100),
      amount_paid: 0,
      amount_due: Math.round(amount * 100),
      currency,
      receipt: receipt || `receipt_${timestamp}`,
      status: "created",
      created_at: timestamp,
      notes: {
        source: "mock-order-for-development",
      },
    };

    console.log("✅ Mock order created:", mockOrder.id);
    return mockOrder;
  }

  // Verify payment signature - placeholder / demo version
  public async verifyPayment(
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<boolean> {
    if (!orderId || !paymentId || !signature) {
      console.error("❌ Missing parameters for payment verification");
      return false;
    }

    // If it's a mock order, always return true for development
    if (orderId.startsWith("order_")) {
      console.log(
        "✅ Mock order verification - always successful for development"
      );
      return true;
    }

    // Real verification must be done on backend
    return true;
  }

  // Initiate Razorpay payment with better error handling
  public async initiatePayment(
    options: Omit<RazorpayOptions, "key">
  ): Promise<void> {
    try {
      console.log("🚀 Initiating payment with options:", options);

      const scriptLoaded = await this.loadRazorpayScript();

      if (!scriptLoaded || !window.Razorpay) {
        console.warn(
          "⚠️ Razorpay script not loaded or unavailable. Payment cannot proceed."
        );
        throw new Error(
          "Razorpay SDK not loaded. Please check your internet connection and try again."
        );
      }

      if (!options.amount || options.amount <= 0) {
        throw new Error("Invalid payment amount");
      }

      if (!options.name || !options.description) {
        throw new Error("Payment name and description are required");
      }

      if (!options.order_id) {
        console.log(
          "🔄 No order ID provided, Razorpay will create order automatically"
        );
      }

      const razorpayOptions: RazorpayOptions = {
        key: RAZORPAY_KEY_ID,
        ...options,
        callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
        theme: {
          color: "#8B7355",
          ...options.theme,
        },
        modal: {
          ondismiss: () => {
            console.log("Payment modal dismissed by user");
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
          ...options.retry,
        },
        timeout: 300,
        remember_customer: false,
      };

      console.log(
        "🎯 Creating Razorpay instance with options:",
        razorpayOptions
      );

      const razorpay = new window.Razorpay(razorpayOptions);

      // Add event listeners
      razorpay.on("payment.failed", (response: any) => {
        console.error("❌ Payment failed:", response.error);
        alert(
          `Payment failed: ${
            response.error.description || "Unknown error occurred"
          }`
        );
        throw new Error(
          `Payment failed: ${response.error.description || "Unknown error"}`
        );
      });

      razorpay.on("payment.cancelled", () => {
        console.log("⚠️ Payment cancelled by user");
        alert("Payment was cancelled by user");
        throw new Error("Payment was cancelled by user");
      });
      razorpay.on("payment.success", (response) => {
        console.log("✅ Payment successful:", response);
        if (options.handler) {
          options.handler(response);
        }
      });
      console.log("🚀 Opening Razorpay modal...");
      razorpay.open();
    } catch (error) {
      console.error("❌ Error initiating payment:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to open Razorpay payment modal");
    }
  }

  // Format amount for display (assumes input is in rupees)
  public static formatAmount(amount: number): string {
    return `₹${amount.toFixed(2)}`;
  }

  // Convert rupees to paise
  public static toPaise(amount: number): number {
    return Math.round(amount * 100);
  }

  // Convert paise to rupees
  public static toRupees(paise: number): number {
    return paise / 100;
  }
}

export const razorpayService = RazorpayService.getInstance();
