import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Shield, 
  User, 
  CreditCard, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Coffee,
  Calendar,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

const TermsConditionsPage: React.FC = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: `By accessing and using the Cafe at Once website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`,
      icon: CheckCircle
    },
    {
      title: "Use License",
      content: `Permission is granted to temporarily download one copy of the materials (information or software) on Cafe at Once's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose or for any public display; attempt to reverse engineer any software contained on Cafe at Once's website; remove any copyright or other proprietary notations from the materials; or transfer the materials to another person or "mirror" the materials on any other server.`,
      icon: Shield
    },
    {
      title: "User Account",
      content: `To access certain features of our website, you must create an account. You are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account. You must be at least 18 years old to create an account and purchase our products.`,
      icon: User
    },
    {
      title: "Product Information",
      content: `We strive to provide accurate product descriptions, pricing, and availability information. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free. If a product offered by Cafe at Once is not as described, your sole remedy is to return it in unused condition.`,
      icon: Coffee
    },
    {
      title: "Pricing and Payment",
      content: `All prices are in Indian Rupees (INR) and are inclusive of applicable taxes. We reserve the right to modify prices at any time. Payment must be made at the time of ordering. We accept various payment methods including credit/debit cards, UPI, net banking, and cash on delivery. All payments are processed securely through our payment partners.`,
      icon: CreditCard
    },
    {
      title: "Shipping and Delivery",
      content: `Delivery times are estimates only. We are not responsible for delays beyond our control. Risk of loss and title for items purchased pass to you upon delivery of the items to the carrier. We reserve the right to refuse service to anyone for any reason at any time.`,
      icon: MapPin
    },
    {
      title: "Returns and Refunds",
      content: `Our return policy allows returns within 7 days of delivery for unopened products. Refunds will be processed within 3-5 business days. Shipping charges are non-refundable unless the product is defective or wrong item delivered. Please refer to our detailed Return Policy for complete information.`,
      icon: Calendar
    },
    {
      title: "Privacy Policy",
      content: `Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the website, to understand our practices regarding the collection and use of your personal information.`,
      icon: Shield
    },
    {
      title: "Intellectual Property",
      content: `The content on this website, including but not limited to text, graphics, images, logos, and software, is the property of Cafe at Once and is protected by copyright laws. You may not reproduce, distribute, or create derivative works from this content without our express written consent.`,
      icon: FileText
    },
    {
      title: "Limitation of Liability",
      content: `In no event shall Cafe at Once or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Cafe at Once's website, even if Cafe at Once or a Cafe at Once authorized representative has been notified orally or in writing of the possibility of such damage.`,
      icon: AlertCircle
    },
    {
      title: "Governing Law",
      content: `These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes arising from these terms or your use of our website shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.`,
      icon: MapPin
    },
    {
      title: "Changes to Terms",
      content: `We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on the website. Your continued use of the website after changes are posted constitutes acceptance of the modified terms.`,
      icon: Info
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
            <FileText className="h-10 w-10 text-primary" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Please read these terms and conditions carefully before using our website 
            and purchasing Cafe at Once products.
          </p>
        </motion.div>

        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-12 text-center"
        >
          <div className="flex items-center justify-center mb-2">
            <Calendar className="h-6 w-6 text-blue-600 mr-2" />
            <span className="font-semibold text-blue-900">Last Updated: July 28, 2025</span>
          </div>
          <p className="text-blue-700">
            These terms and conditions govern your use of the Cafe at Once website and services.
          </p>
        </motion.div>

        {/* Terms Sections */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-8"
        >
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <section.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-r from-primary/10 to-amber-100 rounded-2xl p-8 mt-12"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Questions About These Terms?</h3>
            <p className="text-gray-700 mb-6">
              If you have any questions about these Terms & Conditions, please contact us:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <Phone className="h-8 w-8 text-primary mb-2" />
                <span className="font-semibold text-gray-900">Phone</span>
                <span className="text-gray-600">+91 7979837079</span>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="h-8 w-8 text-primary mb-2" />
                <span className="font-semibold text-gray-900">Email</span>
                <span className="text-gray-600">cafeatonce@gmail.com</span>
              </div>
              <div className="flex flex-col items-center">
                <MapPin className="h-8 w-8 text-primary mb-2" />
                <span className="font-semibold text-gray-900">Address</span>
                <span className="text-gray-600">Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mt-8"
        >
          <div className="flex items-center mb-4">
            <AlertCircle className="h-8 w-8 text-amber-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Important Notice</h3>
          </div>
          <div className="space-y-3 text-gray-700">
            <p>• By using our website and services, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.</p>
            <p>• These terms constitute a legally binding agreement between you and Cafe at Once.</p>
            <p>• We reserve the right to modify these terms at any time, and such modifications will be effective immediately upon posting.</p>
            <p>• Your continued use of our services after any changes indicates your acceptance of the modified terms.</p>
            <p>• If you do not agree with any of these terms, please do not use our website or services.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsConditionsPage; 