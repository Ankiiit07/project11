// Payment helper utilities

export class PaymentHelpers {
  /**
   * Format amount for display
   */
  static formatAmount(amount: number, currency: string = 'INR'): string {
    if (currency === 'INR') {
      return `₹${amount.toFixed(2)}`;
    }
    return `${amount.toFixed(2)} ${currency}`;
  }

  /**
   * Convert amount to paise (for Razorpay)
   */
  static toPaise(amount: number): number {
    return Math.round(amount * 100);
  }

  /**
   * Convert paise to rupees
   */
  static toRupees(paise: number): number {
    return paise / 100;
  }

  /**
   * Generate receipt ID
   */
  static generateReceiptId(prefix: string = 'receipt'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Sanitize customer data
   */
  static sanitizeCustomerInfo(customerInfo: {
    name: string;
    email: string;
    phone?: string;
  }) {
    return {
      name: customerInfo.name.trim(),
      email: customerInfo.email.trim().toLowerCase(),
      phone: customerInfo.phone?.replace(/\D/g, ''), // Remove non-digits
    };
  }

  /**
   * Get payment method display name
   */
  static getPaymentMethodName(method: string): string {
    const methods: Record<string, string> = {
      'card': 'Credit/Debit Card',
      'netbanking': 'Net Banking',
      'wallet': 'Digital Wallet',
      'upi': 'UPI',
      'emi': 'EMI',
      'paylater': 'Pay Later',
      'cardless_emi': 'Cardless EMI',
    };
    
    return methods[method] || method;
  }

  /**
   * Calculate GST
   */
  static calculateGST(amount: number, rate: number = 18): number {
    return (amount * rate) / 100;
  }

  /**
   * Calculate total with GST
   */
  static calculateTotalWithGST(amount: number, gstRate: number = 18): {
    subtotal: number;
    gst: number;
    total: number;
  } {
    const gst = this.calculateGST(amount, gstRate);
    return {
      subtotal: amount,
      gst,
      total: amount + gst,
    };
  }

  /**
   * Validate payment response
   */
  static validatePaymentResponse(response: any): boolean {
    return !!(
      response &&
      response.razorpay_payment_id &&
      response.razorpay_order_id &&
      response.razorpay_signature
    );
  }

  /**
   * Get error message for payment failure
   */
  static getPaymentErrorMessage(error: any): string {
    if (error?.error?.description) {
      return error.error.description;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    // Common error codes
    const errorMessages: Record<string, string> = {
      'PAYMENT_CANCELLED': 'Payment was cancelled by user',
      'PAYMENT_FAILED': 'Payment failed. Please try again.',
      'NETWORK_ERROR': 'Network error. Please check your connection.',
      'INVALID_CARD': 'Invalid card details. Please check and try again.',
      'INSUFFICIENT_FUNDS': 'Insufficient funds in your account.',
      'CARD_DECLINED': 'Your card was declined. Please try another card.',
      'EXPIRED_CARD': 'Your card has expired. Please use a different card.',
    };
    
    return errorMessages[error?.code] || 'Payment failed. Please try again.';
  }

  /**
   * Log payment event for analytics
   */
  static logPaymentEvent(event: string, data: any) {
    console.log(`Payment Event: ${event}`, data);
    
    // In production, send to analytics service
    // Example: analytics.track(event, data);
  }

  /**
   * Check if payment method is available
   */
  static isPaymentMethodAvailable(method: string): boolean {
    // In production, check with backend or Razorpay API
    const availableMethods = ['card', 'netbanking', 'wallet', 'upi'];
    return availableMethods.includes(method);
  }

  /**
   * Get recommended payment methods based on amount
   */
  static getRecommendedPaymentMethods(amount: number): string[] {
    if (amount < 100) {
      return ['upi', 'wallet'];
    } else if (amount < 1000) {
      return ['upi', 'card', 'wallet'];
    } else {
      return ['card', 'netbanking', 'upi'];
    }
  }
}

export default PaymentHelpers;