import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from './icons';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { sendContact } from '../services/contactApi';
import { analytics } from '../utils/analytics';

const Footer: React.FC = () => {
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
      const result = await sendContact({ type: 'newsletter', email: email.trim() });
      if (!result.alreadySubscribed) analytics.newsletterSignup();
      setSubscriptionMessage(
        result.alreadySubscribed ? "You're already subscribed. Thank you!" : "You're subscribed! We'll be in touch with new coffee and offers."
      );
      setEmail('');
    } catch (error) {
      setSubscriptionMessage(error instanceof Error ? error.message : 'Failed to subscribe. Please try again.');
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
    { to: '/cold-brew-coffee', label: 'Cold Brew Coffee' },
    { to: '/cold-brew-coffee-price', label: 'Cold Brew Coffee Price in India' },
    { to: '/ready-to-drink-coffee', label: 'Ready-to-Drink Coffee' },
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
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/60 mb-3">Newsletter</p>
            <h3 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase leading-[0.95] mb-4">
              New coffee, <span className="text-primary">first.</span>
            </h3>
            <p className="text-white/70 text-lg mb-8">
              One email when there is a new flavour or a sale. Nothing else.
            </p>
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-14 px-6 bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isSubscribing}
                  data-testid="newsletter-email-input"
                />
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="h-14 px-8 bg-primary hover:bg-white hover:text-foreground text-white font-heading font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  data-testid="newsletter-subscribe-button"
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                  {!isSubscribing && <ArrowRight className="h-5 w-5" />}
                </button>
              </div>
              {subscriptionMessage && (
                <p 
                  className={`text-sm mt-3 ${/subscribed/i.test(subscriptionMessage) ? 'text-white/80' : 'text-red-300'}`}
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1 space-y-6">
            <div className="flex items-center">
              <Logo size="large" variant="white" />
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Brewed Arabica coffee, sealed with nitrogen in a press tube. Made in Mumbai.
            </p>
            <a
              href="https://www.instagram.com/cafeatonce/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-xs uppercase tracking-[0.14em] text-white underline underline-offset-4 hover:text-primary"
              data-testid="social-instagram"
            >
              Instagram @cafeatonce
            </a>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-mono text-xs uppercase tracking-[0.16em] text-white/60">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/70 hover:text-primary text-sm inline-flex items-center group"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <span className="">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-6">
            <h4 className="font-mono text-xs uppercase tracking-[0.16em] text-white/60">Customer Service</h4>
            <ul className="space-y-3">
              {customerService.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/70 hover:text-primary text-sm inline-flex items-center group"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <span className="">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Blog Links */}
            <h4 className="font-mono text-xs uppercase tracking-[0.16em] text-white/60 pt-4">Guides</h4>
            <ul className="space-y-3">
              {blogLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/70 hover:text-primary text-sm inline-flex items-center group"
                  >
                    <span className="">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 lg:col-span-1 space-y-6">
            <h4 className="font-mono text-xs uppercase tracking-[0.16em] text-white/60">Get in Touch</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="mailto:cafeatonce@gmail.com" 
                  className="flex items-start space-x-3 text-white/70 hover:text-primary group"
                  data-testid="footer-email"
                >
                  <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">cafeatonce@gmail.com</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+917979837079" 
                  className="flex items-start space-x-3 text-white/70 hover:text-primary group"
                  data-testid="footer-phone"
                >
                  <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
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
              &copy; {new Date().getFullYear()} Cafe at Once. All rights reserved.
            </p>
            <p className="text-white/40 text-xs">
              Made in Mumbai
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
