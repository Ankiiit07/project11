// netlify/functions/verify-payment.ts
import crypto from 'crypto';

exports.handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = 
      JSON.parse(event.body);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing verification parameters' })
      };
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET!)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        status: 'success',
        data: { isAuthentic }
      })
    };
  } catch (error: any) {
    console.error('Verification error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Verification failed',
        message: error.message
      })
    };
  }
};
