import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { emailNotificationService } from '../services/emailNotificationService';
import { useDevice } from '../hooks/useDevice';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');
  const { isMobile } = useDevice();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSubscriptionMessage('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);
    setSubscriptionMessage('');

    try {
      // Check if already subscribed
      if (emailNotificationService.isEmailSubscribed(email.trim())) {
        setSubscriptionMessage('This email is already subscribed to our newsletter!');
        return;
      }

      // Send notification
      await emailNotificationService.sendNewsletterNotification(email.trim());
      setSubscriptionMessage('Successfully subscribed to newsletter! Check your email for confirmation.');
      setEmail('');
    } catch (error: any) {
      setSubscriptionMessage('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Desktop / Tablet layout */}
        {!isMobile && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Logo size="large" variant="white" />
              </div>
              <p className="text-gray-400 text-sm">
                Premium coffee concentrates for the modern professional. Coffee in
                5 seconds, whenever you need it.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="h-5 w-5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
                </a>
                <a 
                  href="https://www.instagram.com/cafeatonce/?hl=en" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-5 w-5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
                </a>
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="h-5 w-5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  to="/products"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Products
                </Link>
                <Link
                  to="/insights"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Coffee Insights
                </Link>
                <Link
                  to="/about"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Customer Service */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Service</h3>
              <div className="space-y-2">
                <Link
                  to="/track"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Track Your Order
                </Link>
                <Link
                  to="/customer-service"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Customer Service
                </Link>
                <Link
                  to="/shipping-policy"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Shipping Policy
                </Link>
                <Link
                  to="/return-policy"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Return Policy
                </Link>
                <Link
                  to="/terms-conditions"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
                <Link
                  to="/privacy-policy"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-gray-400">cafeatonce@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-gray-400">+91 7979837079</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-gray-400">Mumbai, MH</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile layout */}
        {isMobile && (
          <div className="space-y-8">
            {/* Brand (compact, without social icons) */}
            <div className="space-y-3">
              <div className="flex items-center">
                <Logo size="medium" variant="white" />
              </div>
              <p className="text-gray-400 text-sm">
                Premium coffee concentrates for the modern professional.
              </p>
            </div>

            {/* Accordions for Quick Links and Customer Service */}
            <div className="divide-y divide-gray-800 rounded-lg overflow-hidden border border-gray-800">
              {/* Quick Links Accordion */}
              <details className="group">
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer select-none">
                  <span className="text-base font-semibold">Quick Links</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="px-4 pb-3 space-y-2 text-sm">
                  <Link to="/products" className="block text-gray-400">Products</Link>
                  <Link to="/insights" className="block text-gray-400">Coffee Insights</Link>
                  <Link to="/about" className="block text-gray-400">About Us</Link>
                  <Link to="/contact" className="block text-gray-400">Contact</Link>
                </div>
              </details>

              {/* Customer Service Accordion */}
              <details className="group">
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer select-none">
                  <span className="text-base font-semibold">Customer Service</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="px-4 pb-3 space-y-2 text-sm">
                  <Link to="/customer-service" className="block text-gray-400">Customer Service</Link>
                  <Link to="/shipping-policy" className="block text-gray-400">Shipping Policy</Link>
                  <Link to="/return-policy" className="block text-gray-400">Return Policy</Link>
                  <Link to="/terms-conditions" className="block text-gray-400">Terms & Conditions</Link>
                  <Link to="/privacy-policy" className="block text-gray-400">Privacy Policy</Link>
                </div>
              </details>
            </div>

            {/* Contact Info (compact) */}
            <div className="space-y-2 text-sm">
              <h3 className="text-base font-semibold">Contact Us</h3>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-gray-400">cafeatonce@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-gray-400">+91 7979837079</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-gray-400">Mumbai, MH</span>
              </div>
            </div>
          </div>
        )}

        {/* Newsletter (compact on mobile) */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Get updates on new products and exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex rounded-lg overflow-hidden">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
                  disabled={isSubscribing}
                />
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-primary hover:bg-primary-dark px-4 py-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubscribing ? '...' : 'Subscribe'}
                </button>
              </div>
              {subscriptionMessage && (
                <p className={`text-sm ${subscriptionMessage.includes('Successfully') ? 'text-green-400' : 'text-red-400'}`}>
                  {subscriptionMessage}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Cafe at Once. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;