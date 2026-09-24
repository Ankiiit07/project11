// Payment validation utilities

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class PaymentValidator {
  static validateAmount(amount: number): ValidationResult {
    const errors: string[] = [];
    
    if (!amount || isNaN(amount)) {
      errors.push('Amount is required');
    } else if (amount <= 0) {
      errors.push('Amount must be greater than 0');
    } else if (amount < 1) {
      errors.push('Minimum amount is ₹1');
    } else if (amount > 500000) {
      errors.push('Maximum amount is ₹5,00,000');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateCustomerInfo(customerInfo: {
    name: string;
    email: string;
    phone?: string;
  }): ValidationResult {
    const errors: string[] = [];
    
    // Validate name
    if (!customerInfo.name || customerInfo.name.trim().length === 0) {
      errors.push('Customer name is required');
    } else if (customerInfo.name.trim().length < 2) {
      errors.push('Customer name must be at least 2 characters');
    } else if (customerInfo.name.trim().length > 100) {
      errors.push('Customer name must be less than 100 characters');
    }
    
    // Validate email
    if (!customerInfo.email || customerInfo.email.trim().length === 0) {
      errors.push('Email address is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerInfo.email)) {
        errors.push('Please provide a valid email address');
      }
    }
    
    // Validate phone (optional)
    if (customerInfo.phone && customerInfo.phone.trim().length > 0) {
      const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
      if (!phoneRegex.test(customerInfo.phone)) {
        errors.push('Please provide a valid phone number');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateOrderDetails(orderDetails: {
    description: string;
    receipt?: string;
  }): ValidationResult {
    const errors: string[] = [];
    
    if (!orderDetails.description || orderDetails.description.trim().length === 0) {
      errors.push('Order description is required');
    } else if (orderDetails.description.trim().length > 255) {
      errors.push('Order description must be less than 255 characters');
    }
    
    if (orderDetails.receipt && orderDetails.receipt.length > 40) {
      errors.push('Receipt ID must be less than 40 characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validatePaymentData(
    amount: number,
    customerInfo: {
      name: string;
      email: string;
      phone?: string;
    },
    orderDetails: {
      description: string;
      receipt?: string;
    }
  ): ValidationResult {
    const amountValidation = this.validateAmount(amount);
    const customerValidation = this.validateCustomerInfo(customerInfo);
    const orderValidation = this.validateOrderDetails(orderDetails);
    
    const allErrors = [
      ...amountValidation.errors,
      ...customerValidation.errors,
      ...orderValidation.errors,
    ];
    
    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
    };
  }
}

export default PaymentValidator;