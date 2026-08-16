import React, { useState } from 'react';
import { CreditCard, Truck, Shield, CheckCircle, Banknote, Clock, Loader2 } from 'lucide-react';
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
  onPaymentSuccess: (response: RazorpayResponse | { payment_method: 'cod'; order_id: string }) => void;
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'online' | 'cod'>('online');
  const [isProcessingCOD, setIsProcessingCOD] = useState(false);

  const handleCODOrder = async () => {
    if (!customerInfo.name || !customerInfo.email) {
      onPaymentError?.(new Error('Please fill in all required customer information'));
      return;
    }

    setIsProcessingCOD(true);
    
    try {
      // Simulate order processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock order ID for COD
      const orderId = `cod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      onPaymentSuccess({
        payment_method: 'cod',
        order_id: orderId,
      });
    } catch (error) {
      onPaymentError?.(error instanceof Error ? error : new Error('COD order failed'));
    } finally {
      setIsProcessingCOD(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Payment Method Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Choose Payment Method</h3>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Online Payment Option */}
          <div
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 ${
              selectedPaymentMethod === 'online'
                ? 'border-primary bg-primary-light/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedPaymentMethod('online')}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedPaymentMethod === 'online'
                  ? 'border-primary bg-primary'
                  : 'border-gray-300'
              }`}>
                {selectedPaymentMethod === 'online' && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span className="font-medium text-gray-900">Pay Online</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Credit/Debit Card, UPI, Net Banking
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ✅ Instant WhatsApp notification to merchant
                </p>
              </div>
            </div>
          </div>

          {/* COD Option */}
          <div
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 ${
              selectedPaymentMethod === 'cod'
                ? 'border-primary bg-primary-light/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedPaymentMethod('cod')}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedPaymentMethod === 'cod'
                  ? 'border-primary bg-primary'
                  : 'border-gray-300'
              }`}>
                {selectedPaymentMethod === 'cod' && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Banknote className="h-5 w-5 text-primary" />
                  <span className="font-medium text-gray-900">Cash on Delivery</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Pay when your order arrives (₹25 extra charges)
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ✅ Instant WhatsApp notification to merchant
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Details */}
      <div className="space-y-4">
        {selectedPaymentMethod === 'online' ? (
          <PaymentButton
            amount={amount}
            customerInfo={customerInfo}
            orderDetails={orderDetails}
            onSuccess={onPaymentSuccess}
            onError={onPaymentError}
            disabled={disabled}
          />
        ) : (
          <button
            onClick={handleCODOrder}
            disabled={disabled || isProcessingCOD}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
          >
            {isProcessingCOD ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing COD Order...
              </>
            ) : (
              <>
                <Truck className="h-5 w-5 mr-2" />
                Place COD Order (₹{(amount + 25).toFixed(2)})
              </>
            )}
          </button>
        )}
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
      
      {/* WhatsApp Order Option */}
      <div className="border-t pt-6">
        <div className="text-center mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Prefer to order via WhatsApp?</h4>
          <p className="text-sm text-gray-600">Get personalized assistance and place your order directly through WhatsApp</p>
        </div>
        {/* WhatsAppButton component was removed, so this section is now empty */}
      </div>
    </div>
  );
};

export default PaymentOptions;