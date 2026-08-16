import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import PaymentButton from '../components/PaymentButton';
import { RazorpayResponse } from '../types/razorpay';
import { razorpayService } from '../services/razorpay';

const RazorpayTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleTestPaymentSuccess = (response: RazorpayResponse) => {
    addTestResult(`✅ Payment successful! Payment ID: ${response.razorpay_payment_id}`);
    addTestResult(`✅ Order ID: ${response.razorpay_order_id}`);
    addTestResult(`✅ Signature: ${response.razorpay_signature}`);
  };

  const handleTestPaymentError = (error: Error) => {
    addTestResult(`❌ Payment failed: ${error.message}`);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-primary hover:text-primary-dark transition-colors mb-4 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">🧪 Razorpay Integration Test</h1>
          <p className="text-gray-600 mt-2">Test the Razorpay payment integration with your configuration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Configuration */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuration Details</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">✅ Razorpay Key</h3>
                <p className="text-sm text-green-700 font-mono">rzp_test_Glauu4hA3vRcyV</p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">🌐 Callback URL</h3>
                <p className="text-sm text-blue-700 font-mono">https://eneqd3r9zrjok.x.pipedream.net/</p>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">🎨 Theme Color</h3>
                <p className="text-sm text-purple-700">#8B7355 (Coffee Brown)</p>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">🔔 Alerts</h3>
                <div className="text-sm text-orange-700 space-y-1">
                  <p>• Payment ID alert</p>
                  <p>• Order ID alert</p>
                  <p>• Signature alert</p>
                  <p>• Error details alert</p>
                </div>
              </div>
            </div>
          </div>

          {/* Test Payment */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Payment</h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Test Mode</h3>
                <p className="text-sm text-yellow-700">
                  This is using Razorpay test mode. No real money will be charged.
                </p>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">🔧 Backend Note</h3>
                <p className="text-sm text-red-700">
                  Backend server is not running (CORS error). Using direct Razorpay integration for testing.
                </p>
              </div>

              <button
                onClick={async () => {
                  try {
                    addTestResult('🚀 Starting Razorpay test without order...');
                    
                    // Load Razorpay script
                    const scriptLoaded = await razorpayService.loadRazorpayScript();
                    if (!scriptLoaded || !window.Razorpay) {
                      throw new Error('Razorpay SDK not loaded');
                    }

                    // Create payment options WITHOUT order_id (Razorpay will create order)
                    const options = {
                      key: 'rzp_test_Glauu4hA3vRcyV',
                      amount: 10000, // ₹100 in paise
                      currency: 'INR',
                      name: 'Cafe at Once',
                      description: 'Test Payment - Direct Integration',
                      image: '/coffee-icon.svg',
                      // Remove order_id - let Razorpay handle order creation
                      callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
                      handler: function(response: any) {
                        addTestResult(`✅ Payment successful! Payment ID: ${response.razorpay_payment_id}`);
                        addTestResult(`✅ Order ID: ${response.razorpay_order_id}`);
                        addTestResult(`✅ Signature: ${response.razorpay_signature}`);
                        alert(`Payment ID: ${response.razorpay_payment_id}`);
                        alert(`Order ID: ${response.razorpay_order_id}`);
                        alert(`Signature: ${response.razorpay_signature}`);
                      },
                      prefill: {
                        name: 'Test User',
                        email: 'test@razorpay.com',
                        contact: '9876543210'
                      },
                      notes: {
                        address: 'Test Address'
                      },
                      theme: {
                        color: '#8B7355'
                      }
                    };

                    const rzp = new window.Razorpay(options);
                    
                    rzp.on('payment.failed', function(response: any) {
                      addTestResult(`❌ Payment failed: ${response.error.description}`);
                      alert(`Payment failed: ${response.error.description}`);
                    });

                    rzp.open();
                    addTestResult('🔗 Razorpay modal opened');
                  } catch (error) {
                    addTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
              >
                🚀 Razorpay Test ₹100 (No Order ID)
              </button>

              <button
                onClick={async () => {
                  try {
                    addTestResult('🚀 Starting simple Razorpay test...');
                    
                    // Simple Razorpay integration without order_id
                    const script = document.createElement('script');
                    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                    script.onload = () => {
                      const options = {
                        key: 'rzp_test_Glauu4hA3vRcyV',
                        amount: 50000, // ₹500 in paise
                        currency: 'INR',
                        name: 'Cafe at Once',
                        description: 'Simple Test Payment',
                        image: '/coffee-icon.svg',
                        // Remove order_id - let Razorpay create order automatically
                        callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
                        handler: function(response: any) {
                          addTestResult(`✅ Simple payment successful! Payment ID: ${response.razorpay_payment_id}`);
                          alert(`Payment ID: ${response.razorpay_payment_id}`);
                          alert(`Order ID: ${response.razorpay_order_id}`);
                          alert(`Signature: ${response.razorpay_signature}`);
                        },
                        prefill: {
                          name: 'Test Customer',
                          email: 'customer@test.com',
                          contact: '9876543211'
                        },
                        notes: {
                          address: 'Test Address'
                        },
                        theme: {
                          color: '#8B7355'
                        }
                      };

                      const rzp = new (window as any).Razorpay(options);
                      rzp.on('payment.failed', function(response: any) {
                        addTestResult(`❌ Simple payment failed: ${response.error.description}`);
                        alert(`Payment failed: ${response.error.description}`);
                      });
                      rzp.open();
                      addTestResult('🔗 Simple Razorpay modal opened');
                    };
                    document.head.appendChild(script);
                  } catch (error) {
                    addTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                  }
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
              >
                🎯 Simple Razorpay Test ₹500
              </button>

              <button
                onClick={() => {
                  addTestResult('🚀 Starting basic Razorpay test...');
                  
                  // Most basic Razorpay integration
                  const script = document.createElement('script');
                  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                  script.onload = () => {
                    const options = {
                      key: 'rzp_test_Glauu4hA3vRcyV',
                      amount: 20000, // ₹200 in paise
                      currency: 'INR',
                      name: 'Cafe at Once',
                      description: 'Basic Test Payment',
                      handler: function(response: any) {
                        addTestResult(`✅ Basic payment successful! Payment ID: ${response.razorpay_payment_id}`);
                        alert(`Payment ID: ${response.razorpay_payment_id}`);
                        alert(`Order ID: ${response.razorpay_order_id}`);
                        alert(`Signature: ${response.razorpay_signature}`);
                      },
                      prefill: {
                        name: 'Basic Test',
                        email: 'basic@test.com'
                      },
                      theme: {
                        color: '#8B7355'
                      }
                    };

                    const rzp = new (window as any).Razorpay(options);
                    rzp.on('payment.failed', function(response: any) {
                      addTestResult(`❌ Basic payment failed: ${response.error.description}`);
                      alert(`Payment failed: ${response.error.description}`);
                    });
                    rzp.open();
                    addTestResult('🔗 Basic Razorpay modal opened');
                  };
                  document.head.appendChild(script);
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
              >
                🎯 Basic Razorpay Test ₹200
              </button>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
            <button
              onClick={clearResults}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear Results
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500 text-center">No test results yet. Try making a test payment above.</p>
            ) : (
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Test</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">✅ Success Test</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Use test card: 4111 1111 1111 1111</p>
                <p>• Any future expiry date</p>
                <p>• Any 3-digit CVV</p>
                <p>• Any name and address</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">❌ Failure Test</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Use test card: 4000 0000 0000 0002</p>
                <p>• This will trigger payment failure</p>
                <p>• Check error handling alerts</p>
                <p>• Verify callback URL receives data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RazorpayTestPage; 