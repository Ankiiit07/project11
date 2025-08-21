"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder =
  exports.updateOrderStatus =
  exports.getAllOrders =
  exports.cancelOrder =
  exports.trackOrder =
  exports.getOrder =
  exports.getUserOrders =
    void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = require("../utils/AppError");
const Order_1 = __importDefault(require("../models/Order"));
const apiFeatures_1 = require("../utils/apiFeatures");
const emailService_1 = require("../services/emailService");
const router = express_1.default.Router();
exports.getUserOrders = (0, catchAsync_1.catchAsync)(async (req, res) => {
  const features = new apiFeatures_1.APIFeatures(
    Order_1.default.find({ user: req.user.id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const orders = await features.query;
  const totalOrders = await Order_1.default.countDocuments({
    user: req.user.id,
  });
  res.status(200).json({
    status: "success",
    results: orders.length,
    totalResults: totalOrders,
    data: {
      orders,
    },
  });
});
exports.getOrder = (0, catchAsync_1.catchAsync)(async (req, res) => {
  const order = await Order_1.default.findOne({
    _id: req.params.id,
    user: req.user.id,
  });
  if (!order) {
    throw new AppError_1.AppError("No order found with that ID", 404);
  }
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});
exports.trackOrder = (0, catchAsync_1.catchAsync)(async (req, res) => {
  const { orderNumber } = req.params;
  const order = await Order_1.default.findOne({
    orderNumber,
    $or: [{ user: req.user.id }, { "customerInfo.email": req.user.email }],
  });
  if (!order) {
    throw new AppError_1.AppError("No order found with that order number", 404);
  }
  const trackingInfo = {
    orderNumber: order.orderNumber,
    status: order.orderStatus,
    paymentStatus: order.paymentStatus,
    estimatedDelivery: order.estimatedDelivery,
    actualDelivery: order.actualDelivery,
    trackingNumber: order.trackingNumber,
    timeline: [
      {
        status: "pending",
        date: order.createdAt,
        description: "Order placed successfully",
        completed: true,
      },
      {
        status: "confirmed",
        date: order.orderStatus !== "pending" ? order.updatedAt : null,
        description: "Order confirmed and being prepared",
        completed: ["confirmed", "processing", "shipped", "delivered"].includes(
          order.orderStatus
        ),
      },
      {
        status: "processing",
        date: order.orderStatus === "processing" ? order.updatedAt : null,
        description: "Order is being processed",
        completed: ["processing", "shipped", "delivered"].includes(
          order.orderStatus
        ),
      },
      {
        status: "shipped",
        date: order.orderStatus === "shipped" ? order.updatedAt : null,
        description: "Order has been shipped",
        completed: ["shipped", "delivered"].includes(order.orderStatus),
      },
      {
        status: "delivered",
        date: order.actualDelivery,
        description: "Order delivered successfully",
        completed: order.orderStatus === "delivered",
      },
    ],
  };
  res.status(200).json({
    status: "success",
    data: {
      tracking: trackingInfo,
    },
  });
});
exports.cancelOrder = (0, catchAsync_1.catchAsync)(async (req, res) => {
  const { reason } = req.body;
  const order = await Order_1.default.findOne({
    _id: req.params.id,
    user: req.user.id,
  });
  if (!order) {
    throw new AppError_1.AppError("No order found with that ID", 404);
  }
  if (!["pending", "confirmed"].includes(order.orderStatus)) {
    throw new AppError_1.AppError(
      "Order cannot be cancelled at this stage",
      400
    );
  }
  order.orderStatus = "cancelled";
  order.cancellationReason = reason;
  await order.save();
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});
exports.getAllOrders = (0, catchAsync_1.catchAsync)(async (req, res) => {
  const features = new apiFeatures_1.APIFeatures(
    Order_1.default.find(),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const orders = await features.query;
  const totalOrders = await Order_1.default.countDocuments();
  res.status(200).json({
    status: "success",
    results: orders.length,
    totalResults: totalOrders,
    data: {
      orders,
    },
  });
});
exports.updateOrderStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
  const { orderStatus, trackingNumber } = req.body;
  const order = await Order_1.default.findByIdAndUpdate(
    req.params.id,
    {
      orderStatus,
      trackingNumber,
      ...(orderStatus === "delivered" && { actualDelivery: new Date() }),
    },
    { new: true, runValidators: true }
  );
  if (!order) {
    throw new AppError_1.AppError("No order found with that ID", 404);
  }
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});
const cancelOrderValidation = [
  (0, express_validator_1.body)("reason")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Cancellation reason must be less than 500 characters"),
];
const updateOrderStatusValidation = [
  (0, express_validator_1.body)("orderStatus")
    .isIn([
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ])
    .withMessage("Invalid order status"),
  (0, express_validator_1.body)("trackingNumber")
    .optional()
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage("Tracking number must be between 5 and 50 characters"),
];
exports.createOrder = (0, catchAsync_1.catchAsync)(async (req, res) => {
  const {
    items,
    customerInfo,
    shippingAddress,
    paymentMethod,
    paymentDetails,
  } = req.body;
  if (!items || !customerInfo || !shippingAddress || !paymentMethod) {
    throw new AppError_1.AppError("Missing required order information", 400);
  }
  const orderNumber = `CAO${Date.now()}${Math.random()
    .toString(36)
    .substr(2, 5)
    .toUpperCase()}`;
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.18;
  const shipping = subtotal >= 1000 ? 0 : 50;
  const total = subtotal + tax + shipping;
  const orderData = {
    orderNumber,
    items: items.map((item) => ({
      product: item.product,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      sku: item.id || item.product,
    })),
    customerInfo,
    shippingAddress,
    subtotal,
    tax,
    shipping,
    discount: 0,
    total,
    paymentMethod,
    paymentDetails: paymentDetails || {},
    orderStatus: "pending",
    paymentStatus: paymentMethod === "cod" ? "pending" : "completed",
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    user: req.user?.id || null,
  };
  const order = await Order_1.default.create(orderData);
  try {
    await (0, emailService_1.sendEmail)({
      email: customerInfo.email,
      subject: `Order Confirmation - ${orderNumber}`,
      template: "orderConfirmation",
      data: {
        customerName: customerInfo.name,
        orderNumber: orderNumber,
        items: items,
        total: total,
        paymentMethod: paymentMethod,
        estimatedDelivery: orderData.estimatedDelivery,
        shippingAddress: shippingAddress,
      },
    });
  } catch (emailError) {
    console.error("Failed to send order confirmation email:", emailError);
  }
  try {
    await (0, emailService_1.sendEmail)({
      email: "cafeatonce@gmail.com",
      subject: `New Order Received - ${orderNumber}`,
      template: "orderNotification",
      data: {
        orderNumber: orderNumber,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        items: items,
        total: total,
        paymentMethod: paymentMethod,
        orderStatus: orderData.orderStatus,
        shippingAddress: shippingAddress,
        orderDate: new Date(),
      },
    });
  } catch (emailError) {
    console.error(
      "Failed to send order notification email to admin:",
      emailError
    );
  }
  res.status(201).json({
    status: "success",
    data: {
      order,
    },
  });
});
router.post("/", exports.createOrder);
router.use(auth_1.protect);
router.get("/", exports.getUserOrders);
router.get("/track/:orderNumber", exports.trackOrder);
router.get("/:id", exports.getOrder);
router.patch("/:id/cancel", exports.cancelOrder);
router.use((0, auth_1.restrictTo)("admin"));
router.get("/admin/all", exports.getAllOrders);
router.patch("/admin/:id/status", exports.updateOrderStatus);
exports.default = router;
//# sourceMappingURL=orders.js.map
