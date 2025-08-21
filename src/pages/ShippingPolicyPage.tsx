import React from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Clock, 
  MapPin, 
  Package, 
  Shield, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Coffee,
  Star
} from 'lucide-react';

const ShippingPolicyPage: React.FC = () => {
  const shippingZones = [
    {
      zone: "Metro Cities",
      cities: "Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad",
      deliveryTime: "1-2 business days",
      cost: "₹50",
      expressAvailable: true
    },
    {
      zone: "Tier 1 Cities",
      cities: "Jaipur, Lucknow, Chandigarh, Indore, Bhopal, Nagpur, Vadodara",
      deliveryTime: "2-3 business days",
      cost: "₹75",
      expressAvailable: true
    },
    {
      zone: "Tier 2 Cities",
      cities: "All other major cities and state capitals",
      deliveryTime: "3-4 business days",
      cost: "₹100",
      expressAvailable: false
    },
    {
      zone: "Rest of India",
      cities: "All other locations including rural areas",
      deliveryTime: "4-5 business days",
      cost: "₹150",
      expressAvailable: false
    }
  ];

  const shippingFeatures = [
    {
      icon: Shield,
      title: "Secure Packaging",
      description: "All coffee products are carefully packaged in tamper-proof containers to ensure freshness and safety during transit."
    },
    {
      icon: Clock,
      title: "Fast Processing",
      description: "Orders are processed within 24 hours of confirmation. Weekend orders are processed on the next business day."
    },
    {
      icon: MapPin,
      title: "Real-time Tracking",
      description: "Track your order in real-time with SMS and email updates at every stage of the delivery process."
    },
    {
      icon: Package,
      title: "Careful Handling",
      description: "Our delivery partners are trained to handle coffee products with care to maintain quality and freshness."
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
            <Truck className="h-10 w-10 text-primary" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shipping Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We ensure your Cafe at Once coffee reaches you fresh and on time, 
            no matter where you are in India.
          </p>
        </motion.div>

        {/* Free Shipping Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-8 mb-12 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <Star className="h-8 w-8 mr-3" />
            <h2 className="text-2xl font-bold">Free Shipping on Orders Above ₹1000</h2>
          </div>
          <p className="text-lg opacity-90">
            Enjoy complimentary standard shipping when you order coffee worth ₹1000 or more
          </p>
        </motion.div>

        {/* Shipping Zones */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shipping Zones & Delivery Times</h2>
            <p className="text-gray-600">Find delivery times and costs for your location</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {shippingZones.map((zone, index) => (
              <motion.div
                key={zone.zone}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{zone.zone}</h3>
                  {zone.expressAvailable && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      Express Available
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm text-gray-600">{zone.cities}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm font-medium">{zone.deliveryTime}</span>
                  </div>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm font-medium">Shipping Cost: {zone.cost}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Shipping Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Shipping?</h2>
            <p className="text-gray-600">We go the extra mile to ensure your coffee arrives in perfect condition</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {shippingFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Important Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          {/* Order Processing */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <Clock className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Order Processing</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Orders placed before 2 PM are processed the same day</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Orders placed after 2 PM are processed the next business day</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Weekend orders are processed on Monday</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>You'll receive tracking information within 24 hours</span>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <Truck className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Delivery Information</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <Info className="h-5 w-5 text-blue-500 mr-3" />
                <span>Delivery attempts are made between 9 AM - 8 PM</span>
              </div>
              <div className="flex items-center">
                <Info className="h-5 w-5 text-blue-500 mr-3" />
                <span>Signature may be required for orders above ₹2000</span>
              </div>
              <div className="flex items-center">
                <Info className="h-5 w-5 text-blue-500 mr-3" />
                <span>COD orders have an additional ₹25 charge</span>
              </div>
              <div className="flex items-center">
                <Info className="h-5 w-5 text-blue-500 mr-3" />
                <span>Express delivery available in select cities</span>
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
            <p>• Delivery times may be extended during festivals, holidays, or adverse weather conditions</p>
            <p>• Remote locations may take 1-2 additional days for delivery</p>
            <p>• We don't ship to international locations at this time</p>
            <p>• For bulk orders (above ₹5000), please contact our customer service for special arrangements</p>
            <p>• All delivery charges are inclusive of GST as applicable</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ShippingPolicyPage; 