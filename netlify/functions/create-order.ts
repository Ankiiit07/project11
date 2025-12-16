// netlify/functions/create-order.ts
import Razorpay from 'razorpay';

exports.handler = async (event: any) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { amount, currency, receipt, notes } = JSON.parse(event.body);

    // Validate
    if (!amount || amount <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid amount' })
      };
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_SECRET!,
    });

    // Create order
    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    });

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        status: 'success',
        data: { order }
      })
    };
  } catch (error: any) {
    console.error('Error creating order:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to create order',
        message: error.message
      })
    };
  }
};
