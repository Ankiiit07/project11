import React from 'react';
import { motion } from 'framer-motion';
import { 
  Headphones, 
  Mail, 
  Phone, 
  Clock, 
  MessageCircle, 
  HelpCircle, 
  Package, 
  CreditCard, 
  Truck, 
  Coffee,
  MapPin,
  Star
} from 'lucide-react';

const CustomerServicePage: React.FC = () => {
  const faqs = [
    {
      question: "How do I track my order?",
      answer: "You can track your order by logging into your account and visiting the 'My Orders' section. You'll receive SMS and email updates at every stage of your delivery."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods including UPI, Credit/Debit cards, Net Banking, and Cash on Delivery (COD) with a nominal ₹25 charge."
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery takes 3-5 business days across India. Express delivery (1-2 days) is available in select cities for an additional charge."
    },
    {
      question: "Is your coffee suitable for diabetics?",
      answer: "Yes! All our coffee concentrates are 100% sugar-free and suitable for diabetics. They contain no artificial sweeteners or additives."
    },
    {
      question: "Can I return or exchange my order?",
      answer: "We offer a 7-day return policy for unopened products. If you're not satisfied with your purchase, contact our customer service team."
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we ship within India only. We're working on expanding our international shipping services."
    }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      details: "+91 7979837079",
      description: "Available Monday to Saturday, 9 AM - 7 PM IST",
      action: "Call Now"
    },
    {
      icon: Mail,
      title: "Email Support",
      details: "cafeatonce@gmail.com",
      description: "We respond within 2-4 hours during business hours",
      action: "Send Email"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Support",
      details: "+91 7979837079",
      description: "Quick responses for urgent queries",
      action: "Chat on WhatsApp"
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
            <Headphones className="h-10 w-10 text-primary" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Customer Service
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're here to help you enjoy the perfect cup of Cafe at Once coffee. 
            Our dedicated team is ready to assist you with any questions or concerns.
          </p>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <method.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
              <p className="text-lg font-semibold text-primary mb-2">{method.details}</p>
              <p className="text-gray-600 mb-4">{method.description}</p>
              <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors">
                {method.action}
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Business Hours */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-16"
        >
          <div className="flex items-center mb-6">
            <Clock className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Business Hours</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Support</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 7:00 PM IST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM IST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM IST</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Processing</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Processing</span>
                  <span className="font-medium">24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Standard Delivery</span>
                  <span className="font-medium">3-5 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Express Delivery</span>
                  <span className="font-medium">1-2 business days</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <HelpCircle className="h-8 w-8 text-primary mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            <p className="text-gray-600">Find quick answers to common questions about our products and services</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start">
                  <Coffee className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Customer Satisfaction */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-primary/10 to-amber-100 rounded-2xl p-8 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-amber-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Customer Satisfaction Guarantee</h2>
          </div>
          <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
            At Cafe at Once, we're committed to your satisfaction. If you're not completely happy with your purchase, 
            we'll work with you to make it right. Your coffee experience matters to us!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center">
              <Package className="h-6 w-6 text-primary mr-2" />
              <span className="font-medium">7-Day Return Policy</span>
            </div>
            <div className="flex items-center justify-center">
              <Truck className="h-6 w-6 text-primary mr-2" />
              <span className="font-medium">Free Shipping on Orders Above ₹1000</span>
            </div>
            <div className="flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-primary mr-2" />
              <span className="font-medium">Secure Payment Options</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerServicePage; 