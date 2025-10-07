const { Resend } = require('resend');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { orderDetails, customerInfo } = JSON.parse(event.body || '{}');

    if (!orderDetails || !customerInfo) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing order or customer information' })
      };
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #8B4513, #A0522D); color: white; padding: 30px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
          .header p { margin: 8px 0 0; opacity: 0.9; }
          .content { padding: 30px 25px; }
          .order-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .order-item { display: flex; justify-content: between; align-items: center; padding: 15px 0; border-bottom: 1px solid #eee; }
          .order-item:last-child { border-bottom: none; }
          .item-details { flex: 1; }
          .item-name { font-weight: 600; color: #333; margin-bottom: 4px; }
          .item-quantity { color: #666; font-size: 14px; }
          .item-price { font-weight: 600; color: #8B4513; }
          .total-row { background: #8B4513; color: white; padding: 20px; text-align: center; font-size: 20px; font-weight: bold; }
          .address-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #8B4513; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; }
          .footer a { color: #ffa500; text-decoration: none; }
          .emoji { font-size: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmed!</h1>
            <p>Thank you for choosing @once Coffee</p>
          </div>
          
          <div class="content">
            <h2 style="color: #333; margin-top: 0;">Hello ${customerInfo.firstName} ${customerInfo.lastName}! 👋</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
              Great news! Your coffee order has been confirmed and will be freshly prepared and shipped to you soon.
            </p>
            
            <div class="order-details">
              <h3 style="margin-top: 0; color: #8B4513;">📋 Order Details</h3>
              <p><strong>Order ID:</strong> #${orderDetails.id}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Payment:</strong> ${orderDetails.paymentMethod === 'online' ? 'Online Payment ✅' : 'Cash on Delivery 💰'}</p>
            </div>
            
            <h3 style="color: #8B4513;">☕ Your Coffee Order</h3>
            ${orderDetails.items ? orderDetails.items.map(item => `
              <div class="order-item">
                <div class="item-details">
                  <div class="item-name">${item.name}</div>
                  <div class="item-quantity">Quantity: ${item.quantity}</div>
                </div>
                <div class="item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            `).join('') : '<p>No items found</p>'}
            
            <div class="total-row">
              Total: ₹${orderDetails.total ? orderDetails.total.toFixed(2) : '0.00'}
            </div>
            
            <h3 style="color: #8B4513; margin-top: 30px;">🚚 Delivery Address</h3>
            <div class="address-box">
              <strong>${customerInfo.firstName} ${customerInfo.lastName}</strong><br>
              ${customerInfo.address}<br>
              ${customerInfo.city}, ${customerInfo.state} ${customerInfo.zipCode}<br>
              ${customerInfo.country}<br>
              <br>
              📱 ${customerInfo.phone}
            </div>
            
            <p style="margin-top: 30px; padding: 15px; background: #e8f5e8; border-radius: 8px; color: #2d5016;">
              <strong>📧 What's Next?</strong><br>
              We'll send you a tracking email once your order ships. Expected delivery: 2-5 business days.
            </p>
          </div>
          
          <div class="footer">
            <p style="margin: 0 0 10px;">© 2024 @once Coffee. All rights reserved.</p>
            <p style="margin: 0;">Questions? Email us at <a href="mailto:orders@cafeatonce.com">orders@cafeatonce.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResult = await resend.emails.send({
      from: 'orders@cafeatonce.com', // You'll need to verify a domain OR use onboarding@resend.dev
      to: customerInfo.email,
      subject: `Order Confirmed- Once Coffee`,
      html: emailHtml,
    });

    console.log('✅ Email sent successfully via Resend');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Order confirmation email sent successfully',
        emailId: emailResult.data?.id
      })
    };

  } catch (error) {
    console.error('❌ Resend email error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message 
      })
    };
  }
};
