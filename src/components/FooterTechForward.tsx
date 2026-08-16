import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  ArrowRight,
  Coffee,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { emailNotificationService } from '../services/emailNotificationService';

const FooterTechForward: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSubscriptionMessage('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);
    setSubscriptionMessage('');

    try {
      if (emailNotificationService.isEmailSubscribed(email.trim())) {
        setSubscriptionMessage('This email is already subscribed to our newsletter!');
        return;
      }

      await emailNotificationService.sendNewsletterNotification(email.trim());
      setSubscriptionMessage('Successfully subscribed! Check your email for confirmation.');
      setEmail('');
    } catch (error: any) {
      setSubscriptionMessage('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const quickLinks = [
    { to: '/products', label: 'Shop Cafe at Once' },
    { to: '/faq', label: 'FAQ' },
    { to: '/insights', label: 'Coffee Insights' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
    { to: '/testimonials', label: 'Reviews' },
  ];

  const blogLinks = [
    { to: '/blog/what-is-nitrogen-preserved-coffee', label: 'What Is Nitrogen-Preserved Coffee?' },
    { to: '/blog/best-portable-coffee-travellers-india', label: 'Best Portable Coffee for Travellers' },
    { to: '/blog/how-to-make-coffee-without-machine', label: 'Coffee Without a Machine' },
  ];

  const customerService = [
    { to: '/track', label: 'Track Your Order' },
    { to: '/customer-service', label: 'Customer Service' },
    { to: '/shipping-policy', label: 'Shipping Policy' },
    { to: '/return-policy', label: 'Return Policy' },
    { to: '/terms-conditions', label: 'Terms & Conditions' },
    { to: '/privacy-policy', label: 'Privacy Policy' },
  ];

  return (
    <footer className="bg-foreground text-white">
      {/* Newsletter Section - Prominent CTA */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
              <Coffee className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              Stay <span className="text-primary">Caffeinated</span>
            </h3>
            <p className="text-white/70 text-lg mb-8">
              Get updates on new products, exclusive offers, and coffee insights delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-14 px-6 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  disabled={isSubscribing}
                  data-testid="newsletter-email-input"
                />
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-hover hover:-translate-y-0.5"
                  data-testid="newsletter-subscribe-button"
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                  {!isSubscribing && <ArrowRight className="h-5 w-5" />}
                </button>
              </div>
              {subscriptionMessage && (
                <p 
                  className={`text-sm mt-3 ${subscriptionMessage.includes('Successfully') ? 'text-green-400' : 'text-red-400'}`}
                  data-testid="newsletter-message"
                >
                  {subscriptionMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center">
              <Logo size="large" variant="white" />
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Premium coffee concentrates engineered for the modern professional. 
              Barista-quality coffee in 5 seconds, wherever life takes you.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-primary transition-all duration-300"
                aria-label="Follow us on Facebook"
                data-testid="social-facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/cafeatonce/?hl=en" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-primary transition-all duration-300"
                aria-label="Follow us on Instagram"
                data-testid="social-instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-primary transition-all duration-300"
                aria-label="Follow us on Twitter"
                data-testid="social-twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-heading text-lg font-bold">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/70 hover:text-primary transition-colors duration-300 text-sm inline-flex items-center group"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-6">
            <h4 className="font-heading text-lg font-bold">Customer Service</h4>
            <ul className="space-y-3">
              {customerService.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/70 hover:text-primary transition-colors duration-300 text-sm inline-flex items-center group"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Blog Links */}
            <h4 className="font-heading text-lg font-bold pt-4">From the Blog</h4>
            <ul className="space-y-3">
              {blogLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/70 hover:text-primary transition-colors duration-300 text-sm inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="font-heading text-lg font-bold">Get in Touch</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="mailto:cafeatonce@gmail.com" 
                  className="flex items-start space-x-3 text-white/70 hover:text-primary transition-colors duration-300 group"
                  data-testid="footer-email"
                >
                  <Mail className="h-5 w-5 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">cafeatonce@gmail.com</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+917979837079" 
                  className="flex items-start space-x-3 text-white/70 hover:text-primary transition-colors duration-300 group"
                  data-testid="footer-phone"
                >
                  <Phone className="h-5 w-5 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">+91 7979837079</span>
                </a>
              </li>
              <li>
                <div className="flex items-start space-x-3 text-white/70">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Mumbai, MH</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm">
              &copy; 2025 Cafe at Once. All rights reserved.
            </p>
            <p className="text-white/40 text-xs">
              Engineered with <span className="text-primary">♥</span> for coffee lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterTechForward;
