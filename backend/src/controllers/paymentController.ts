import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order";
import Product from "../models/Product";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { sendEmail } from "../services/emailService";

// Initialize Razorpay with proper error handling and default values
let razorpay: Razorpay | null = null;

// Initialize Razorpay after environment variables are loaded
const initializeRazorpay = () => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
      console.warn(
        "⚠️  Razorpay credentials not found. Payment functionality will be limited."
      );
      console.warn(
        "Please set RAZORPAY_KEY_ID and RAZORPAY_SECRET in your .env file"
      );
      return null;
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    console.log("✅ Razorpay initialized successfully");
    return instance;
  } catch (error) {
    console.error("❌ Failed to initialize Razorpay:", error);
    return null;
  }
};

// Initialize Razorpay
razorpay = initializeRazorpay();

// Getter function to ensure Razorpay is available
const getRazorpay = () => {
  if (!razorpay) {
    razorpay = initializeRazorpay();
  }
  return razorpay;
};

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const razorpayInstance = getRazorpay();

  if (!razorpayInstance) {
    throw new AppError(
      "Payment service not available. Please check server configuration.",
      503
    );
  }

  const {
    amount,
    currency = "INR",
    receipt,
    notes,
    shippingAddress,
  } = req.body;

  if (!amount || amount <= 0) {
    throw new AppError("Invalid amount provided", 400);
  }

  const options: Razorpay.OrderCreateRequestBody = {
    amount: Math.round(amount), // already in paise
    currency,
    receipt: receipt || `receipt_${Date.now()}`,
    payment_capture: 1, // ✅ Auto-capture payments immediately
    notes: {
      ...notes,
      address: shippingAddress
        ? `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.zipCode}`
        : "No address provided",
    },
  };

  const order = await razorpayInstance.orders.create(options);

  res.status(201).json({
    status: "success",
    data: { order },
  });
});

export const verifyPayment = catchAsync(async (req: Request, res: Response) => {
  const razorpayInstance = getRazorpay();

  if (!razorpayInstance) {
    throw new AppError(
      "Payment service not available. Please check server configuration.",
      503
    );
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new AppError("Missing payment verification parameters", 400);
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET!)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    throw new AppError("Payment verification failed", 400);
  }

  // Fetch payment details from Razorpay
  const payment = await razorpayInstance.payments.fetch(razorpay_payment_id);

  res.status(200).json({
    status: "success",
    data: {
      isAuthentic: true,
      payment,
    },
  });
});

export const getPaymentStatus = catchAsync(
  async (req: Request, res: Response) => {
    const razorpayInstance = getRazorpay();

    if (!razorpayInstance) {
      throw new AppError(
        "Payment service not available. Please check server configuration.",
        503
      );
    }

    const { paymentId } = req.params;

    const payment = await razorpayInstance.payments.fetch(paymentId);

    res.status(200).json({
      status: "success",
      data: {
        payment,
      },
    });
  }
);

export const refundPayment = catchAsync(async (req: Request, res: Response) => {
  const razorpayInstance = getRazorpay();

  if (!razorpayInstance) {
    throw new AppError(
      "Payment service not available. Please check server configuration.",
      503
    );
  }

  const { paymentId, amount, reason } = req.body;

  if (!paymentId) {
    throw new AppError("Payment ID is required", 400);
  }

  const refund = await razorpayInstance.payments.refund(paymentId, {
    amount: amount ? Math.round(amount * 100) : undefined, // Convert to paise
    notes: {
      reason: reason || "Customer request",
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      refund,
    },
  });
});

export const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const webhookSignature = req.headers["x-razorpay-signature"] as string;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new AppError("Webhook secret not configured", 500);
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (webhookSignature !== expectedSignature) {
    throw new AppError("Invalid webhook signature", 400);
  }

  const event = req.body;

  switch (event.event) {
    case "payment.captured":
      // Handle successful payment
      await handlePaymentCaptured(event.payload.payment.entity);
      break;

    case "payment.failed":
      // Handle failed payment
      await handlePaymentFailed(event.payload.payment.entity);
      break;

    case "refund.processed":
      // Handle refund processed
      await handleRefundProcessed(event.payload.refund.entity);
      break;

    default:
      console.log(`Unhandled webhook event: ${event.event}`);
  }

  res.status(200).json({ status: "success" });
});

const handlePaymentCaptured = async (payment: any) => {
  // Update order status based on payment
  const order = await Order.findOne({
    "paymentDetails.razorpayOrderId": payment.order_id,
  });

  if (order) {
    order.paymentStatus = "completed";
    order.paymentDetails = {
      ...order.paymentDetails,
      razorpayPaymentId: payment.id,
    };
    await order.save();
  }
};

const handlePaymentFailed = async (payment: any) => {
  // Update order status for failed payment
  const order = await Order.findOne({
    "paymentDetails.razorpayOrderId": payment.order_id,
  });

  if (order) {
    order.paymentStatus = "failed";
    await order.save();
  }
};

const handleRefundProcessed = async (refund: any) => {
  // Update order refund status
  const order = await Order.findOne({
    "paymentDetails.razorpayPaymentId": refund.payment_id,
  });

  if (order) {
    order.refundStatus = "completed";
    order.refundAmount = refund.amount / 100; // Convert from paise
    await order.save();
  }
};

export const createOrderFromCart = catchAsync(
  async (req: Request, res: Response) => {
    const {
      items,
      customerInfo,
      shippingAddress,
      paymentMethod,
      paymentDetails,
    } = req.body;

    if (!items || items.length === 0) {
      throw new AppError("No items in order", 400);
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.email) {
      throw new AppError("Customer information is required", 400);
    }

    if (!shippingAddress) {
      throw new AppError("Shipping address is required", 400);
    }

    // Calculate order totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new AppError(`Product not found: ${item.product}`, 404);
      }

      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${product.name}`, 400);
      }

      const itemPrice =
        item.type === "subscription" ? product.price * 0.85 : product.price;
      const itemTotal = itemPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity,
        image: product.mainImage,
        sku: product.sku,
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Calculate tax and shipping
    const tax = subtotal * 0.18; // 18% GST
    const shipping = subtotal >= 1000 ? 0 : paymentMethod === "cod" ? 75 : 50;
    const total = subtotal + tax + shipping;

    // Create order
    const order = await Order.create({
      user: req.user?.id,
      customerInfo,
      items: orderItems,
      subtotal,
      tax,
      shipping,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "completed",
      paymentDetails,
      shippingAddress,
      orderStatus: "confirmed",
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
    });

    // Send order confirmation email
    try {
      await sendEmail({
        email: customerInfo.email,
        subject: "Order Confirmation - Cafe at Once",
        template: "orderConfirmation",
        data: {
          customerName: customerInfo.name,
          orderNumber: order.orderNumber,
          items: orderItems,
          total: total,
          paymentMethod,
          estimatedDelivery: order.estimatedDelivery,
        },
      });
    } catch (err) {
      console.error("Error sending order confirmation email:", err);
    }

    res.status(201).json({
      status: "success",
      data: {
        order,
      },
    });
  }
);
