import React from 'react';
import { CreditCard, Clock } from 'lucide-react';
import PaymentButton from './PaymentButton';
import { RazorpayResponse } from '../types/razorpay';

interface PaymentOptionsProps {
  amount: number;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  orderDetails: {
    description: string;
    receipt?: string;
  };
  onPaymentSuccess: (response: RazorpayResponse) => void;
  onPaymentError?: (error: Error) => void;
  disabled?: boolean;
  className?: string;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  amount,
  customerInfo,
  orderDetails,
  onPaymentSuccess,
  onPaymentError,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Payment Method Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Secure Payment</h3>
        
        <div className="border-2 border-primary bg-primary-light/10 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-4">
            <CreditCard className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <span className="font-medium text-gray-900">Pay Online</span>
              <p className="text-sm text-gray-600 mt-1">
                Credit/Debit Card, UPI, Net Banking
              </p>
              <p className="text-xs text-green-600 mt-1">
                ✅ Instant confirmation & order processing
              </p>
            </div>
          </div>
          
          <PaymentButton
            amount={amount}
            customerInfo={customerInfo}
            orderDetails={orderDetails}
            onSuccess={onPaymentSuccess}
            onError={onPaymentError}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Delivery Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Delivery Information</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Standard Delivery:</strong> 3-5 business days</p>
              <p><strong>Express Delivery:</strong> 1-2 business days (₹50 extra)</p>
              <p><strong>Free Delivery:</strong> On orders above ₹1000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Security Notice */}
      <div className="text-center text-xs text-gray-500">
        <p>🔒 Your payment and personal information are always secure</p>
      </div>
    </div>
  );
};

export default PaymentOptions;
