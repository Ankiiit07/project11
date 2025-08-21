import React, { useState } from 'react';
import { emailNotificationService } from '../services/emailNotificationService';
import { ChevronUp, ChevronDown, X } from 'lucide-react';

const EmailNotificationDemo: React.FC = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [demoMessage, setDemoMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const showNewsletterDemo = () => {
    setDemoMessage(`
      📧 Newsletter Subscription Notification Sent!
      
      To: cafeatonce@gmail.com
      Subject: New Newsletter Subscription
      
      A new user has subscribed to the Cafe at Once newsletter.
      
      Subscription Details:
      - Email: demo@example.com
      - Subscribed At: ${new Date().toLocaleString()}
      
      This brings your total newsletter subscribers to a growing community of coffee enthusiasts!
      
      Best regards,
      Cafe at Once System
    `);
    setShowDemo(true);
  };

  const showOrderDemo = () => {
    setDemoMessage(`
      📦 Order Notification Sent!
      
      To: cafeatonce@gmail.com
      Subject: New Order Received - order_123456789
      
      A new order has been placed on Cafe at Once.
      
      Order Details:
      - Order Number: order_123456789
      - Customer Name: John Doe
      - Customer Email: john@example.com
      - Customer Phone: +91-9876543210
      - Payment Method: Online Payment
      - Total Amount: ₹1,250.00
      
      Order Items:
      - Premium Coffee Concentrate x 2 - ₹800.00
      - Coffee Mug x 1 - ₹450.00
      
      Shipping Address:
      123 Coffee Street, Mumbai, Maharashtra 400001, India
      
      Please process this order promptly and update the status in the admin panel.
      
      Best regards,
      Cafe at Once System
    `);
    setShowDemo(true);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-sm transition-all duration-300 ease-in-out">
        {/* Header with minimize/maximize controls */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <h3 className="text-lg font-semibold text-gray-900">
            Email Notification Demo
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronUp className="h-4 w-4 text-gray-600" />
              )}
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Close"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Minimized indicator */}
        {isMinimized && (
          <div className="p-2 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-600 font-medium">
                Demo minimized - Click to expand
              </span>
              <button
                onClick={() => setIsMinimized(false)}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Show
              </button>
            </div>
          </div>
        )}
        
        {/* Collapsible content */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isMinimized ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'
        }`}>
          <div className="p-4">
            <div className="space-y-2 mb-4">
              <button
                onClick={showNewsletterDemo}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                📧 Test Newsletter Notification
              </button>
              
              <button
                onClick={showOrderDemo}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                📦 Test Order Notification
              </button>
            </div>

            <div className="text-xs text-gray-500">
              <p>• Notifications are stored locally</p>
              <p>• View all data at <a href="/admin" className="text-blue-600 hover:underline">/admin</a></p>
              <p>• In production, these would be real emails</p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl max-h-96 overflow-y-auto mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Email Notification Preview</h3>
              <button
                onClick={() => setShowDemo(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                {demoMessage}
              </pre>
            </div>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowDemo(false)}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailNotificationDemo; 