import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  User, 
  Eye, 
  Lock, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Coffee,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Database
} from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  const sections = [
    {
      title: "Information We Collect",
      content: `We collect information you provide directly to us, such as when you create an account, place an order, or contact us. This may include your name, email address, phone number, shipping address, payment information, and order history. We also collect information automatically when you visit our website, including your IP address, browser type, device information, and usage patterns.`,
      icon: Database
    },
    {
      title: "How We Use Your Information",
      content: `We use the information we collect to process your orders, communicate with you about your orders, provide customer support, improve our products and services, send you marketing communications (with your consent), prevent fraud, and comply with legal obligations. We may also use your information for analytics and research purposes to enhance your experience.`,
      icon: Eye
    },
    {
      title: "Information Sharing",
      content: `We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy. We may share your information with payment processors, shipping partners, and service providers who assist us in operating our website and providing services. We may also share information if required by law or to protect our rights and safety.`,
      icon: Shield
    },
    {
      title: "Data Security",
      content: `We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security assessments. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
      icon: Lock
    },
    {
      title: "Cookies and Tracking",
      content: `We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie settings through your browser preferences. Some features may not function properly if cookies are disabled.`,
      icon: Coffee
    },
    {
      title: "Third-Party Services",
      content: `Our website may contain links to third-party websites or integrate with third-party services (such as payment processors and social media platforms). We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.`,
      icon: Info
    },
    {
      title: "Your Rights and Choices",
      content: `You have the right to access, update, or delete your personal information. You can also opt out of marketing communications at any time. To exercise these rights, please contact us using the information provided below. We will respond to your request within 30 days.`,
      icon: User
    },
    {
      title: "Data Retention",
      content: `We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When we no longer need your information, we will securely delete or anonymize it.`,
      icon: Calendar
    },
    {
      title: "Children's Privacy",
      content: `Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.`,
      icon: Shield
    },
    {
      title: "International Transfers",
      content: `Your personal information may be transferred to and processed in countries other than India. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.`,
      icon: MapPin
    },
    {
      title: "Changes to This Policy",
      content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last Updated" date. Your continued use of our services after changes become effective constitutes acceptance of the updated policy.`,
      icon: AlertCircle
    }
  ];

  const dataTypes = [
    {
      category: "Personal Information",
      examples: ["Name", "Email address", "Phone number", "Shipping address", "Date of birth"]
    },
    {
      category: "Payment Information",
      examples: ["Credit/debit card details", "UPI information", "Bank account details", "Payment history"]
    },
    {
      category: "Order Information",
      examples: ["Order history", "Product preferences", "Delivery details", "Return information"]
    },
    {
      category: "Technical Information",
      examples: ["IP address", "Browser type", "Device information", "Usage patterns", "Cookies"]
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
            <Shield className="h-10 w-10 text-primary" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            At Cafe at Once, we are committed to protecting your privacy and ensuring 
            the security of your personal information.
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
            This Privacy Policy describes how we collect, use, and protect your personal information.
          </p>
        </motion.div>

        {/* Data Types We Collect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Types of Data We Collect</h2>
            <p className="text-gray-600">We collect various types of information to provide you with the best service</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataTypes.map((type, index) => (
              <motion.div
                key={type.category}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-3">{type.category}</h3>
                <ul className="space-y-2">
                  {type.examples.map((example, exampleIndex) => (
                    <li key={exampleIndex} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{example}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Privacy Sections */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-8"
        >
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
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

        {/* Your Rights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-r from-primary/10 to-amber-100 rounded-2xl p-8 mt-12"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Rights</h3>
            <p className="text-gray-700">You have the following rights regarding your personal information:</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <Eye className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Right to Access</h4>
              <p className="text-sm text-gray-600">Request a copy of your personal data</p>
            </div>
            <div className="text-center">
              <User className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Right to Rectify</h4>
              <p className="text-sm text-gray-600">Correct inaccurate personal data</p>
            </div>
            <div className="text-center">
              <Database className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Right to Erase</h4>
              <p className="text-sm text-gray-600">Request deletion of your data</p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Right to Object</h4>
              <p className="text-sm text-gray-600">Object to processing of your data</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mt-8"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h3>
            <p className="text-gray-700 mb-6">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
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
          transition={{ delay: 1.1 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mt-8"
        >
          <div className="flex items-center mb-4">
            <AlertCircle className="h-8 w-8 text-amber-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Important Notice</h3>
          </div>
          <div className="space-y-3 text-gray-700">
            <p>• By using our website and services, you consent to the collection and use of your information as described in this Privacy Policy.</p>
            <p>• We are committed to protecting your privacy and will never sell your personal information to third parties.</p>
            <p>• You can update your privacy preferences and opt out of marketing communications at any time.</p>
            <p>• This policy complies with applicable Indian data protection laws and regulations.</p>
            <p>• We regularly review and update our privacy practices to ensure the highest level of protection for your data.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 