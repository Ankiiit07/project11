const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  console.log('Function started');
  
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('Parsing request body');
    const { orderDetails, customerInfo } = JSON.parse(event.body || '{}');

    // Validate required data
    if (!orderDetails || !customerInfo) {
      console.log('Missing orderDetails or customerInfo');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing order or customer information' })
      };
    }

    console.log('Creating email transporter');
    // Create transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log('Email user:', process.env.EMAIL_USER ? 'Set' : 'Not set');
    console.log('Email pass:', process.env.EMAIL_PASS ? 'Set' : 'Not set');

    // Email template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - @once Coffee</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #8B4513; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-item { border-bottom: 1px solid #ddd; padding: 10px 0; }
          .total { font-weight: bold; font-size: 18px; color: #8B4513; }
          .footer { background: #333; color: white; padding: 15px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
            <p>Thank you for your order!</p>
          </div>
          
          <div class="content">
            <h2>Hello ${customerInfo.firstName} ${customerInfo.lastName},</h2>
            <p>Your order has been confirmed and will be processed shortly.</p>
            
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> ${orderDetails.id}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}</p>
            
            <h3>Items Ordered:</h3>
            ${orderDetails.items ? orderDetails.items.map(item => `
              <div class="order-item">
                <strong>${item.name}</strong><br>
                Quantity: ${item.quantity}<br>
                Price: ₹${(item.price * item.quantity).toFixed(2)}
              </div>
            `).join('') : 'No items found'}
            
            <div class="total">
              <p>Total Amount: ₹${orderDetails.total ? orderDetails.total.toFixed(2) : '0.00'}</p>
            </div>
            
            <h3>Shipping Address:</h3>
            <p>
              ${customerInfo.address}<br>
              ${customerInfo.city}, ${customerInfo.state} ${customerInfo.zipCode}<br>
              ${customerInfo.country}
            </p>
            
            <p>We'll send you another email when your order ships!</p>
          </div>
          
          <div class="footer">
            <p>&copy; 2024 @once Coffee. All rights reserved.</p>
            <p>Need help? Contact us at support@onceoffee.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerInfo.email,
      subject: `Order Confirmation - Order #${orderDetails.id}`,
      html: emailHtml
    };

    console.log('Sending email to:', customerInfo.email);
    await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Order confirmation email sent successfully' 
      })
    };

  } catch (error) {
    console.error('Email sending error:', error);
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
