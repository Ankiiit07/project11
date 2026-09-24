// WhatsApp service utilities
export interface OrderDetails {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  totalAmount: number;
  orderType: 'single' | 'subscription';
  paymentMethod: string;
  shippingAddress?: string;
}

export class WhatsAppService {
  private static readonly WHATSAPP_BASE_URL = 'https://wa.me';
  private static readonly BUSINESS_NUMBER = '917979837079';
  private static readonly BUSINESS_EMAIL = 'cafeatonce@gmail.com';

  static getBusinessNumber(): string {
    return this.BUSINESS_NUMBER;
  }

  static getBusinessEmail(): string {
    return this.BUSINESS_EMAIL;
  }

  static generateWhatsAppURL(message: string, phoneNumber?: string): string {
    const targetNumber = phoneNumber || this.BUSINESS_NUMBER;
    const encodedMessage = encodeURIComponent(message);
    return `${this.WHATSAPP_BASE_URL}/${targetNumber}?text=${encodedMessage}`;
  }

  static generateContactFormMessage(formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    category: string;
    phone?: string;
    address?: string;
  }): string {
    let message = `🔔 *New Contact Form Submission*\n\n`;
    message += `👤 Name: ${formData.name}\n`;
    message += `📧 Email: ${formData.email}\n`;
    if (formData.phone) message += `📱 Phone: ${formData.phone}\n`;
    if (formData.address) message += `📍 Address: ${formData.address}\n`;
    message += `📂 Category: ${formData.category}\n`;
    message += `📝 Subject: ${formData.subject}\n\n`;
    message += `💬 *Message:*\n${formData.message}\n\n`;
    message += `Please respond at your earliest convenience. Thank you!`;
    return message;
  }

  static generateOrderMessage(productName: string, productPrice: number, customerInfo?: any): string {
    let message = `Hi! I'm interested in ordering:\n\n`;
    message += `📦 Product: ${productName}\n`;
    message += `💰 Price: ₹${productPrice.toFixed(2)}\n\n`;
    
    if (customerInfo) {
      message += `Customer Details:\n`;
      if (customerInfo.name) message += `👤 Name: ${customerInfo.name}\n`;
      if (customerInfo.email) message += `📧 Email: ${customerInfo.email}\n`;
      if (customerInfo.phone) message += `📱 Phone: ${customerInfo.phone}\n`;
      message += `\n`;
    }
    
    message += `Please confirm the order and provide delivery details. Thank you!`;
    return message;
  }

  static generateSupportMessage(): string {
    return `Hi! I need help with my order. Could you please assist me? Thank you!`;
  }

  static generateInquiryMessage(productName?: string): string {
    if (productName) {
      return `Hi! I have a question about ${productName}. Could you provide more details? Thank you!`;
    }
    return `Hi! I have a general inquiry about your products. Could you help me? Thank you!`;
  }

  static sendContactForm(formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    category: string;
    phone?: string;
    address?: string;
  }): void {
    const message = this.generateContactFormMessage(formData);
    const url = this.generateWhatsAppURL(message);
    window.open(url, '_blank');
  }

  static sendProductInquiry(productName: string, productPrice: number, productImage?: string): void {
    const message = this.generateOrderMessage(productName, productPrice);
    const url = this.generateWhatsAppURL(message);
    window.open(url, '_blank');
  }

  static sendGeneralInquiry(): void {
    const message = this.generateSupportMessage();
    const url = this.generateWhatsAppURL(message);
    window.open(url, '_blank');
  }

  static sendOrder(orderDetails: OrderDetails): void {
    let message = `🛒 *New Order Request*\n\n`;
    message += `👤 Customer: ${orderDetails.customerName}\n`;
    message += `📧 Email: ${orderDetails.customerEmail}\n`;
    if (orderDetails.customerPhone) {
      message += `📱 Phone: ${orderDetails.customerPhone}\n`;
    }
    message += `\n📦 *Order Details:*\n`;
    
    orderDetails.items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: ₹${item.price.toFixed(2)}\n\n`;
    });
    
    message += `💰 *Total Amount: ₹${orderDetails.totalAmount.toFixed(2)}*\n`;
    message += `📋 Order Type: ${orderDetails.orderType}\n`;
    message += `💳 Payment Method: ${orderDetails.paymentMethod}\n`;
    
    if (orderDetails.shippingAddress) {
      message += `🏠 Shipping Address: ${orderDetails.shippingAddress}\n`;
    }
    
    message += `\nPlease confirm this order and provide further instructions. Thank you!`;
    
    const url = this.generateWhatsAppURL(message);
    window.open(url, '_blank');
  }

  /**
   * Send instant payment success notification
   */
  static sendPaymentNotification(paymentData: {
    amount: number;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    paymentId: string;
    orderId: string;
    description: string;
  }): void {
    const message = `🎉 *PAYMENT RECEIVED!* 🎉\n\n` +
      `💰 Amount: ₹${paymentData.amount.toFixed(2)}\n` +
      `👤 Customer: ${paymentData.customerName}\n` +
      `📧 Email: ${paymentData.customerEmail}\n` +
      `📱 Phone: ${paymentData.customerPhone || 'Not provided'}\n` +
      `🆔 Payment ID: ${paymentData.paymentId}\n` +
      `🆔 Order ID: ${paymentData.orderId}\n` +
      `📝 Description: ${paymentData.description}\n\n` +
      `✅ Status: PAYMENT SUCCESSFUL\n` +
      `⏰ Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n\n` +
      `🚀 Please process this order immediately!`;
    
    const url = this.generateWhatsAppURL(message);
    window.open(url, '_blank');
  }

  /**
   * Send order completion notification
   */
  static sendOrderCompletionNotification(orderData: {
    orderNumber: string;
    customerName: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    totalAmount: number;
    paymentMethod: string;
    shippingAddress: string;
  }): void {
    let message = `📋 *ORDER COMPLETED!* 📋\n\n`;
    message += `🔢 Order #: ${orderData.orderNumber}\n`;
    message += `👤 Customer: ${orderData.customerName}\n`;
    message += `💳 Payment: ${orderData.paymentMethod}\n\n`;
    message += `📦 *Items:*\n`;
    
    orderData.items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n💰 *Total: ₹${orderData.totalAmount.toFixed(2)}*\n`;
    message += `🏠 Address: ${orderData.shippingAddress}\n\n`;
    message += `📦 Ready for fulfillment!`;
    
    const url = this.generateWhatsAppURL(message);
    window.open(url, '_blank');
  }
}

export default WhatsAppService;
export const whatsappService = WhatsAppService;