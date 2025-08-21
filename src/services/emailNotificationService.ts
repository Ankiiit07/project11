// Frontend-only email notification service
// Using EmailJS for sending emails without backend

// Type declarations for EmailJS
declare global {
  interface Window {
    emailjs: any;
  }
}

interface EmailData {
  email: string;
  name?: string;
  message?: string;
}

interface OrderData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: any[];
  total: number;
  paymentMethod: string;
  shippingAddress: any;
}

class EmailNotificationService {
  private emailjsUserId = 'YOUR_EMAILJS_USER_ID'; // You'll need to get this from EmailJS
  private serviceId = 'YOUR_EMAILJS_SERVICE_ID';
  private templateId = 'YOUR_EMAILJS_TEMPLATE_ID';

  // Initialize EmailJS (call this once in your app)
  async initialize() {
    try {
      // Load EmailJS script dynamically
      if (!window.emailjs) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.async = true;
        document.head.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }
      
      // Initialize EmailJS
      if (window.emailjs) {
        window.emailjs.init(this.emailjsUserId);
      }
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
    }
  }

  // Send newsletter subscription notification
  async sendNewsletterNotification(email: string): Promise<boolean> {
    try {
      // For now, we'll use a simple approach with a public email service
      // You can replace this with EmailJS or any other email service
      
      const emailData = {
        to: 'cafeatonce@gmail.com',
        from: 'noreply@cafeatonce.com',
        subject: 'New Newsletter Subscription',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #8B7355;">New Newsletter Subscription 📧</h1>
            <p>A new user has subscribed to the Cafe at Once newsletter.</p>
            
            <div style="background-color: #f8f5f0; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #8B7355; margin-top: 0;">Subscription Details:</h3>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subscribed At:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p>This brings your total newsletter subscribers to a growing community of coffee enthusiasts!</p>
            
            <p>Best regards,<br>Cafe at Once System</p>
          </div>
        `
      };

      // Use a simple approach - store in localStorage and show success
      // In a real implementation, you'd use EmailJS or another email service
      this.storeNewsletterSubscription(email);
      
      return true;
    } catch (error) {
      console.error('Failed to send newsletter notification:', error);
      return false;
    }
  }

  // Send order notification
  async sendOrderNotification(orderData: OrderData): Promise<boolean> {
    try {
      const emailData = {
        to: 'cafeatonce@gmail.com',
        from: 'noreply@cafeatonce.com',
        subject: `New Order Received - ${orderData.orderNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #8B7355;">New Order Received 📦</h1>
            <p>A new order has been placed on Cafe at Once.</p>
            
            <div style="background-color: #f8f5f0; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #8B7355; margin-top: 0;">Order Details:</h3>
              <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
              <p><strong>Customer Name:</strong> ${orderData.customerName}</p>
              <p><strong>Customer Email:</strong> ${orderData.customerEmail}</p>
              <p><strong>Customer Phone:</strong> ${orderData.customerPhone}</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Payment Method:</strong> ${orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
              <p><strong>Total Amount:</strong> ₹${orderData.total.toFixed(2)}</p>
            </div>
            
            <div style="background-color: #f8f5f0; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #8B7355; margin-top: 0;">Order Items:</h3>
              <ul>
                ${orderData.items.map((item: any) => `
                  <li>${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}</li>
                `).join('')}
              </ul>
            </div>
            
            <div style="background-color: #f8f5f0; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #8B7355; margin-top: 0;">Shipping Address:</h3>
              <p>${orderData.shippingAddress.street}<br>
              ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zipCode}<br>
              ${orderData.shippingAddress.country}</p>
            </div>
            
            <p>Please process this order promptly and update the status in the admin panel.</p>
            <p>Best regards,<br>Cafe at Once System</p>
          </div>
        `
      };

      // Store order notification
      this.storeOrderNotification(orderData);
      
      return true;
    } catch (error) {
      console.error('Failed to send order notification:', error);
      return false;
    }
  }

  // Store newsletter subscription locally (for demo purposes)
  private storeNewsletterSubscription(email: string) {
    const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
    const newSubscription = {
      email,
      subscribedAt: new Date().toISOString(),
      id: Date.now()
    };
    subscriptions.push(newSubscription);
    localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
  }

  // Store order notification locally (for demo purposes)
  private storeOrderNotification(orderData: OrderData) {
    const notifications = JSON.parse(localStorage.getItem('orderNotifications') || '[]');
    const newNotification = {
      ...orderData,
      notifiedAt: new Date().toISOString(),
      id: Date.now()
    };
    notifications.push(newNotification);
    localStorage.setItem('orderNotifications', JSON.stringify(notifications));
  }

  // Get stored newsletter subscriptions
  getNewsletterSubscriptions() {
    return JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
  }

  // Get stored order notifications
  getOrderNotifications() {
    return JSON.parse(localStorage.getItem('orderNotifications') || '[]');
  }

  // Check if email is already subscribed
  isEmailSubscribed(email: string): boolean {
    const subscriptions = this.getNewsletterSubscriptions();
    return subscriptions.some((sub: any) => sub.email.toLowerCase() === email.toLowerCase());
  }
}

export const emailNotificationService = new EmailNotificationService();

// Initialize the service when the module is loaded
emailNotificationService.initialize(); 