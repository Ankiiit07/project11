import React from 'react';
import { motion } from 'framer-motion';
import { 
  RefreshCw, 
  Clock, 
  Package, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Info,
  Coffee,
  Shield,
  Truck
} from 'lucide-react';

const ReturnPolicyPage: React.FC = () => {
  const returnConditions = [
    {
      icon: CheckCircle,
      title: "Eligible for Return",
      items: [
        "Unopened and sealed coffee products",
        "Products with manufacturing defects",
        "Wrong products delivered",
        "Damaged packaging (if product is intact)",
        "Products within 7 days of delivery"
      ],
      color: "text-green-600"
    },
    {
      icon: XCircle,
      title: "Not Eligible for Return",
      items: [
        "Opened or partially used products",
        "Products damaged due to customer handling",
        "Products beyond 7 days of delivery",
        "Personal hygiene items",
        "Products purchased during clearance sales"
      ],
      color: "text-red-600"
    }
  ];

  const returnProcess = [
    {
      step: 1,
      title: "Contact Customer Service",
      description: "Reach out to us within 7 days of delivery via phone, email, or WhatsApp",
      icon: Coffee
    },
    {
      step: 2,
      title: "Get Return Authorization",
      description: "We'll provide you with a Return Authorization Number (RAN) and return instructions",
      icon: Package
    },
    {
      step: 3,
      title: "Package & Ship",
      description: "Securely package the product and ship it back using our prepaid shipping label",
      icon: Truck
    },
    {
      step: 4,
      title: "Refund Processing",
      description: "Once we receive and inspect the product, we'll process your refund within 3-5 business days",
      icon: RefreshCw
    }
  ];

  return (
    <div className="min-h-screen bg-cream pt-20 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <RefreshCw className="h-10 w-10 text-primary" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Return Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We want you to be completely satisfied with your Cafe at Once coffee. 
            If you're not happy, we're here to help make it right.
          </p>
        </motion.div>

        {/* Return Policy Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-primary/10 to-amber-100 rounded-2xl p-8 mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Clock className="h-12 w-12 text-primary mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">7-Day Return Window</h3>
              <p className="text-gray-600">Return eligible products within 7 days of delivery</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 text-primary mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-gray-600">Simple return process with prepaid shipping labels</p>
            </div>
            <div className="flex flex-col items-center">
              <RefreshCw className="h-12 w-12 text-primary mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Quick Refunds</h3>
              <p className="text-gray-600">Refunds processed within 3-5 business days</p>
            </div>
          </div>
        </motion.div>

        {/* Return Conditions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Return Conditions</h2>
            <p className="text-gray-600">Understand what can and cannot be returned</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {returnConditions.map((condition, index) => (
              <motion.div
                key={condition.title}
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center mb-4">
                  <condition.icon className={`h-8 w-8 mr-3 ${condition.color}`} />
                  <h3 className="text-xl font-bold text-gray-900">{condition.title}</h3>
                </div>
                <ul className="space-y-2">
                  {condition.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${condition.color.replace('text-', 'bg-')}`}></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Return Process */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Return</h2>
            <p className="text-gray-600">Follow these simple steps to return your product</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {returnProcess.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 text-center relative"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {step.step}
                </div>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Refund Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          {/* Refund Methods */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <RefreshCw className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Refund Methods</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Online payments: Refunded to original payment method within 3-5 business days</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>COD orders: Refunded via bank transfer or UPI within 5-7 business days</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Store credit: Available immediately for future purchases</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Shipping charges: Refunded for defective or wrong products</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <Info className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Need Help?</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Contact Customer Service</h4>
                <p className="text-gray-600">Phone: +91 7979837079</p>
                <p className="text-gray-600">Email: cafeatonce@gmail.com</p>
                <p className="text-gray-600">WhatsApp: +91 7979837079</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Business Hours</h4>
                <p className="text-gray-600">Monday - Saturday: 9 AM - 7 PM IST</p>
                <p className="text-gray-600">Sunday: 10 AM - 4 PM IST</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-8"
        >
          <div className="flex items-center mb-4">
            <AlertCircle className="h-8 w-8 text-amber-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Important Notes</h3>
          </div>
          <div className="space-y-3 text-gray-700">
            <p>• Returns must be initiated within 7 days of delivery</p>
            <p>• Products must be in original, unopened condition</p>
            <p>• Return shipping is free for defective or wrong products</p>
            <p>• Customer is responsible for return shipping for change of mind</p>
            <p>• Refunds exclude original shipping charges for change of mind returns</p>
            <p>• Bulk orders (above ₹5000) may have different return terms</p>
            <p>• This policy is subject to change without prior notice</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReturnPolicyPage; 