import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 5001;

// Basic middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
    'http://localhost:5178'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Payment routes
app.post('/api/v1/payments/create-order', (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;
    
    // Mock order creation
    const order = {
      id: `order_${Date.now()}`,
      amount: amount * 100, // Convert to paise
      currency,
      receipt: `receipt_${Date.now()}`,
      status: 'created'
    };
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
});

app.post('/api/v1/payments/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Mock payment verification
    res.json({
      success: true,
      data: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        status: 'verified'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Payment verification failed'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
  console.log(`🏥 Health check at http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint at http://localhost:${PORT}/test`);
});

export default app; 